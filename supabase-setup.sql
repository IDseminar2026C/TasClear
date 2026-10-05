-- =====================================================================
-- タスクリア：フレンド・ギルド機能のための Supabase の準備
-- =====================================================================
--
-- 【手順】
-- 1. https://supabase.com で無料アカウントを作り、「New project」でプロジェクトを作る
-- 2. 「Authentication」→「Sign In / Providers」で「Allow anonymous sign-ins」をオンにして保存する
-- 3. 「SQL Editor」を開き、このファイルの中身を全部はりつけて「Run」を押す
--    （機能が増えたときも、全部はりつけてもう一度「Run」して大丈夫。前のデータは消えません）
-- 4. 「Project Settings」→「API Keys」の Project URL と Publishable key を、
--    script.js の SUPABASE_URL と SUPABASE_KEY にはりつける
--    ※ 「secret」「service_role」と書かれたキーは、ぜったいにはりつけないでください
-- =====================================================================

-- ===== フレンド =====

-- フレンドに見せる、1人1行のプロフィール
create table if not exists public.profiles (
  id uuid primary key default auth.uid() references auth.users on delete cascade,
  friend_code text not null unique check (friend_code ~ '^[A-Z0-9]{6}$'),
  nickname text not null default 'ぼうけんしゃ' check (char_length(nickname) between 1 and 12),
  icon text not null default '🧑‍🌾' check (char_length(icon) <= 8),
  message text not null default '' check (char_length(message) <= 30),
  level int not null default 1 check (level >= 1),
  title text not null default '' check (char_length(title) <= 30),
  today_focus int not null default 0 check (today_focus >= 0),
  today_defeats int not null default 0 check (today_defeats >= 0),
  stats_date text not null default '',
  updated_at timestamptz not null default now()
);

-- 決まり（RLS）：見るのはだれでもできる。作る・変えるのは、自分の行だけ
alter table public.profiles enable row level security;
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles for select using (true);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert to authenticated with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- ===== ギルド =====

-- ギルド（名前・ギルドコード・今のボスのレベルと HP）
create table if not exists public.guilds (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null check (char_length(name) between 1 and 16),
  boss_level int not null default 1,
  boss_hp int not null,
  boss_max_hp int not null,
  created_at timestamptz not null default now()
);

-- ギルドのメンバー（1人1つのギルドだけ。HP・あたえたダメージの合計・ごほうびを受け取ったボスのレベル・先延ばしを確かめた日）
create table if not exists public.guild_members (
  user_id uuid primary key default auth.uid() references auth.users on delete cascade,
  guild_id uuid not null references public.guilds on delete cascade,
  hp int not null default 100,
  total_damage int not null default 0,
  claimed_level int not null default 1,
  last_penalty_date date,
  joined_at timestamptz not null default now()
);

-- ギルドのお知らせ（「ゆう が 20 ダメージ！」など）
create table if not exists public.guild_logs (
  id bigint generated always as identity primary key,
  guild_id uuid not null references public.guilds on delete cascade,
  message text not null,
  created_at timestamptz not null default now()
);
create index if not exists guild_logs_guild_id_idx on public.guild_logs (guild_id, id desc);

-- 決まり（RLS）：見るのは、ログインなしの「自分」を作った人ならだれでも
-- 作る・変えるのは、下の関数からだけ（ダメージや HP で、ずるができないように）
alter table public.guilds enable row level security;
alter table public.guild_members enable row level security;
alter table public.guild_logs enable row level security;
drop policy if exists "guilds_select" on public.guilds;
create policy "guilds_select" on public.guilds for select to authenticated using (true);
drop policy if exists "guild_members_select" on public.guild_members;
create policy "guild_members_select" on public.guild_members for select to authenticated using (true);
drop policy if exists "guild_logs_select" on public.guild_logs;
create policy "guild_logs_select" on public.guild_logs for select to authenticated using (true);

-- ボスの HP（レベルが上がるほど、メンバーが多いほど多い）
create or replace function public.guild_boss_max_hp(boss_level int, member_count int)
returns int language sql immutable as $$
  select (300 + 150 * (boss_level - 1)) * greatest(member_count, 1)
$$;

-- 自分のニックネーム（お知らせに使う）
create or replace function public.guild_my_name()
returns text language sql stable security definer set search_path = public as $$
  select coalesce((select nickname from profiles where id = auth.uid()), 'だれか')
$$;

-- 6文字のギルドコードを作る（まぎらわしい O・0・I・1 は使わない）
create or replace function public.guild_make_code()
returns text language plpgsql volatile as $$
declare
  chars text := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result text := '';
begin
  for i in 1..6 loop
    result := result || substr(chars, 1 + floor(random() * 32)::int, 1);
  end loop;
  return result;
end $$;

-- ギルドを作る（作った人がメンバーになる）。ギルドコードを返す
create or replace function public.create_guild(guild_name text)
returns text language plpgsql security definer set search_path = public as $$
declare
  new_code text;
  new_id uuid;
  clean_name text := left(trim(coalesce(guild_name, '')), 16);
begin
  if auth.uid() is null then raise exception 'ログインしていません'; end if;
  if clean_name = '' then raise exception 'ギルドの名前を入れてください'; end if;
  if exists (select 1 from guild_members where user_id = auth.uid()) then raise exception 'もうギルドに入っています'; end if;
  loop
    new_code := guild_make_code();
    exit when not exists (select 1 from guilds where code = new_code);
  end loop;
  insert into guilds (code, name, boss_hp, boss_max_hp)
    values (new_code, clean_name, guild_boss_max_hp(1, 1), guild_boss_max_hp(1, 1))
    returning id into new_id;
  insert into guild_members (user_id, guild_id) values (auth.uid(), new_id);
  insert into guild_logs (guild_id, message) values (new_id, guild_my_name() || ' がギルド「' || clean_name || '」を作った！');
  return new_code;
end $$;

-- ギルドコードでギルドに入る（10人まで）。ギルドの名前を返す
create or replace function public.join_guild(guild_code text)
returns text language plpgsql security definer set search_path = public as $$
declare
  g guilds;
begin
  if auth.uid() is null then raise exception 'ログインしていません'; end if;
  if exists (select 1 from guild_members where user_id = auth.uid()) then raise exception 'もうギルドに入っています'; end if;
  select * into g from guilds where code = upper(trim(guild_code));
  if not found then raise exception 'そのコードのギルドは見つかりませんでした'; end if;
  if (select count(*) from guild_members where guild_id = g.id) >= 10 then raise exception 'このギルドはいっぱいです（10人まで）'; end if;
  insert into guild_members (user_id, guild_id, claimed_level) values (auth.uid(), g.id, g.boss_level);
  insert into guild_logs (guild_id, message) values (g.id, guild_my_name() || ' がギルドに入った！');
  return g.name;
end $$;

-- ギルドを抜ける（だれもいなくなったら、ギルドを消す）
create or replace function public.leave_guild()
returns void language plpgsql security definer set search_path = public as $$
declare
  gid uuid;
begin
  select guild_id into gid from guild_members where user_id = auth.uid();
  if not found then return; end if;
  delete from guild_members where user_id = auth.uid();
  if exists (select 1 from guild_members where guild_id = gid) then
    insert into guild_logs (guild_id, message) values (gid, guild_my_name() || ' がギルドを抜けた');
  else
    delete from guilds where id = gid;
  end if;
end $$;

-- ボスにダメージをあたえる（1回 300 まで）。気絶中（HP 0）は半分。攻撃すると自分の HP が 5 回復する
-- ボスの HP が 0 になったら、次のレベルのボスが出る。あたえたダメージを返す
create or replace function public.attack_guild_boss(damage int)
returns int language plpgsql security definer set search_path = public as $$
declare
  m guild_members;
  g guilds;
  dmg int := least(greatest(coalesce(damage, 0), 0), 300);
  member_count int;
begin
  select * into m from guild_members where user_id = auth.uid() for update;
  if not found or dmg = 0 then return 0; end if;
  if m.hp = 0 then dmg := dmg / 2; end if;
  select * into g from guilds where id = m.guild_id for update;
  update guild_members set total_damage = total_damage + dmg, hp = least(100, hp + 5) where user_id = auth.uid();
  if dmg >= g.boss_hp then
    select count(*) into member_count from guild_members where guild_id = g.id;
    update guilds set boss_level = boss_level + 1,
      boss_max_hp = guild_boss_max_hp(boss_level + 1, member_count),
      boss_hp = guild_boss_max_hp(boss_level + 1, member_count)
      where id = g.id;
    insert into guild_logs (guild_id, message) values (g.id, guild_my_name() || ' のとどめの一撃！ Lv' || g.boss_level || ' のボスを撃破！');
  else
    update guilds set boss_hp = boss_hp - dmg where id = g.id;
    insert into guild_logs (guild_id, message) values (g.id, guild_my_name() || ' が ' || dmg || ' ダメージ！');
  end if;
  return dmg;
end $$;

-- 先延ばしのダメージ（1日1回だけ）。締切・やる日をすぎたクエストの数 × 5（20 まで）を、自分以外のメンバーが受ける
-- 仲間が受けたダメージを返す（今日もう確かめていたら 0）
create or replace function public.punish_procrastination(overdue_count int)
returns int language plpgsql security definer set search_path = public as $$
declare
  m guild_members;
  today date := (now() at time zone 'Asia/Tokyo')::date;
  dmg int := least(greatest(coalesce(overdue_count, 0), 0), 4) * 5;
begin
  select * into m from guild_members where user_id = auth.uid() for update;
  if not found or m.last_penalty_date = today then return 0; end if;
  update guild_members set last_penalty_date = today where user_id = auth.uid();
  if dmg = 0 or not exists (select 1 from guild_members where guild_id = m.guild_id and user_id <> auth.uid()) then
    return 0;
  end if;
  update guild_members set hp = greatest(0, hp - dmg) where guild_id = m.guild_id and user_id <> auth.uid();
  insert into guild_logs (guild_id, message) values (m.guild_id, guild_my_name() || ' の先延ばし（' || overdue_count || 'こ）で、仲間が ' || dmg || ' ダメージ…');
  return dmg;
end $$;

-- 入ってから倒したボスの数を返して、受け取ったことにする（ごほうびのコインは、アプリでわたす）
create or replace function public.claim_guild_rewards()
returns int language plpgsql security definer set search_path = public as $$
declare
  m guild_members;
  level int;
begin
  select * into m from guild_members where user_id = auth.uid() for update;
  if not found then return 0; end if;
  select boss_level into level from guilds where id = m.guild_id;
  if level <= m.claimed_level then return 0; end if;
  update guild_members set claimed_level = level where user_id = auth.uid();
  return level - m.claimed_level;
end $$;

-- ログインなしの「自分」を作った人だけが、ギルドの関数を使える
revoke execute on function public.create_guild(text), public.join_guild(text), public.leave_guild(),
  public.attack_guild_boss(int), public.punish_procrastination(int), public.claim_guild_rewards() from public, anon;
grant execute on function public.create_guild(text), public.join_guild(text), public.leave_guild(),
  public.attack_guild_boss(int), public.punish_procrastination(int), public.claim_guild_rewards() to authenticated;

-- ===== リアルタイム（変化がすぐ画面に届くようにする） =====
do $$
begin
  alter publication supabase_realtime add table public.profiles;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.guilds;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.guild_members;
exception when duplicate_object then null;
end $$;
do $$
begin
  alter publication supabase_realtime add table public.guild_logs;
exception when duplicate_object then null;
end $$;

-- ===== 応援スタンプ =====

-- 送ったスタンプ（だれから・だれへ・どのスタンプ・いつ）
create table if not exists public.stamps (
  id bigint generated always as identity primary key,
  from_user uuid not null references auth.users on delete cascade,
  to_user uuid not null references auth.users on delete cascade,
  stamp text not null,
  created_at timestamptz not null default now()
);
create index if not exists stamps_to_user_idx on public.stamps (to_user, created_at desc);

-- 決まり（RLS）：見られるのは、自分が送ったスタンプと、自分にとどいたスタンプだけ。送るのは、下の関数からだけ
alter table public.stamps enable row level security;
drop policy if exists "stamps_select_own" on public.stamps;
create policy "stamps_select_own" on public.stamps for select to authenticated
  using (auth.uid() = from_user or auth.uid() = to_user);

-- スタンプを送る（決まったスタンプだけ。同じ人には1日5回まで）。今日あと何回送れるかを返す
create or replace function public.send_stamp(target uuid, stamp_text text)
returns int language plpgsql security definer set search_path = public as $$
declare
  today_start timestamptz := date_trunc('day', now() at time zone 'Asia/Tokyo') at time zone 'Asia/Tokyo';
  sent_today int;
begin
  if auth.uid() is null then raise exception 'ログインしていません'; end if;
  if target = auth.uid() then raise exception '自分には送れません'; end if;
  if stamp_text not in ('👍', '🔥', '💪', '🎉', '🍅', '👏') then raise exception 'そのスタンプは送れません'; end if;
  if not exists (select 1 from profiles where id = target) then raise exception '相手が見つかりませんでした'; end if;
  select count(*) into sent_today from stamps
    where from_user = auth.uid() and to_user = target and created_at >= today_start;
  if sent_today >= 5 then raise exception 'この人には、今日はもう 5回 送りました'; end if;
  insert into stamps (from_user, to_user, stamp) values (auth.uid(), target, stamp_text);
  return 4 - sent_today;
end $$;

revoke execute on function public.send_stamp(uuid, text) from public, anon;
grant execute on function public.send_stamp(uuid, text) to authenticated;

do $$
begin
  alter publication supabase_realtime add table public.stamps;
exception when duplicate_object then null;
end $$;
