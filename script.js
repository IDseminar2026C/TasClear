/*
  script.js … ページを「動かす」ためのファイルです。
*/

console.log("script.js が読み込まれました");

// --- HTML の部品を探して覚えておく ---

// クエストの入力フォーム
const questForm = document.getElementById("quest-form");

// クエスト名の入力欄
const questInput = document.getElementById("quest-input");

// 「他のタスク」の一覧を表示する場所
const questList = document.getElementById("quest-list");

// 「本日のタスク」を表示する場所
const todayQuest = document.getElementById("today-quest");

// 「他のタスク ▽」のボタン
const otherToggle = document.getElementById("other-toggle");

// 「撃破済みをまとめて削除」のボタン
const clearDoneButton = document.getElementById("clear-done-button");

// 「レベルをリセット」のボタン
const resetLevelButton = document.getElementById("reset-level-button");

// 勇者のドット絵を描く場所
const heroCanvas = document.getElementById("hero-canvas");

// モンスターのドット絵を描く場所
const monsterCanvas = document.getElementById("monster-canvas");

// ステータス表示の部品（アイコン・称号・レベル・経験値バー・経験値の数字）
const statusIcon = document.getElementById("status-icon");
const statusName = document.getElementById("status-name");
const statusLevel = document.getElementById("status-level");
const expBarFill = document.getElementById("exp-bar-fill");
const expText = document.getElementById("exp-text");

// 今日の撃破数を表示する場所
const todayCountText = document.getElementById("today-count");

// ランクの星を表示する場所
const rankStars = document.getElementById("rank-stars");

// 演出用の部品（画面全体にかぶさる板・演出の文字・揺らすアプリの画面）
const effectOverlay = document.getElementById("effect-overlay");
const effectText = document.getElementById("effect-text");
const container = document.querySelector(".container");

// --- データ ---

// 登録されたクエストをすべて入れておく配列
// 1つのクエストは { name: タスク名, exp: 獲得EXP, done: 完了したか } の形
let quests = [];

// localStorage にクエスト一覧をしまうときの名前
const QUESTS_KEY = "tasclear-tasks";

// これまでに貯めた経験値の合計（累計EXP）
let totalExp = 0;

// 今日撃破したクエストの数と、それが何日の数なのか（「2026-09-29」のような文字）
let todayCount = 0;
let todayDate = "";

// localStorage にプレイヤーの状態をしまうときの名前
const PLAYER_KEY = "tasclear-player";

// Lv1 から Lv2 に上がるのに必要なEXP
const FIRST_LEVEL_EXP = 100;

// 1レベル上がるごとに、必要なEXPを何倍にするか
const EXP_GROWTH = 1.1;


// 演出の順番待ちの列（前の演出が終わってから、次の演出を出す）
// 1つの演出は { play: 演出を出す関数, duration: 演出の長さ（ミリ秒） } の形
let effectQueue = [];

// 今、演出が出ているかどうか
let isEffectPlaying = false;

// 演出の長さ（ミリ秒。1000 で 1秒）
const DEFEAT_EFFECT_TIME = 500; // 撃破（style.css の撃破のアニメーションの長さと合わせる）
const LEVELUP_EFFECT_TIME = 1500; // レベルアップ
const CELEBRATE_EFFECT_TIME = 1500; // お祝い

// 何体撃破するごとにお祝いを出すか
const CELEBRATE_EVERY = 5;

// 今、撃破ボタンを隠しているかどうか（レベルアップの演出が終わるまで隠す）
let isDefeatLocked = false;

// 今、モンスターが点滅して消えている途中かどうか
let isMonsterDying = false;

// モンスターが消え終わるまでの待ち時間の番号（連打したとき、やり直すために使う）
let monsterDyingTimer = null;

// モンスターが点滅して消えるまでの長さ（ミリ秒。style.css の monster-blink の長さと合わせる）
const MONSTER_DYING_TIME = 500;

// 音を作るための道具（最初に撃破したときに1回だけ用意する）
let audioContext = null;

// ドレミファソラシドの音の高さ（周波数。数字が大きいほど高い音）
const SCALE_NOTES = [
  523.25, // ド
  587.33, // レ
  659.25, // ミ
  698.46, // ファ
  783.99, // ソ
  880.0, // ラ
  987.77, // シ
  1046.5, // 高いド
];

// ドレミの1音ずつの間（秒）。小さくするほど速く「なでる」感じになる
const NOTE_GAP = 0.06;

// お祝いのファンファーレ「タ・タ・タ・ジャーン♪」の表
// frequencies は同時に鳴らす音の高さ、start は鳴らし始める時刻（秒）、length は長さ（秒）
const FANFARE_NOTES = [
  { frequencies: [392.0], start: 0.0, length: 0.1 }, // タ（ソ）
  { frequencies: [392.0], start: 0.13, length: 0.1 }, // タ（ソ）
  { frequencies: [392.0], start: 0.26, length: 0.1 }, // タ（ソ）
  { frequencies: [523.25, 659.25, 783.99], start: 0.4, length: 0.8 }, // ジャーン（ド・ミ・ソ）
];

// 設計図の文字と、塗る色の対応表
const HERO_COLORS = {
  K: "#222222", // ふちどり（黒）
  H: "#8b4513", // 髪（茶色）
  S: "#f5c89a", // はだ
  E: "#222222", // 目
  M: "#c0392b", // 口（赤）
  B: "#2e6bd6", // よろい（青）
  Y: "#d4a017", // 金色
  G: "#8b5a2b", // 剣の持ち手・木の棒（茶色）
  W: "#d0d8e0", // 剣の刃（銀色）
  N: "#e8c35a", // 麦わら帽子
  C: "#a0703c", // 服・革（明るい茶色）
  L: "#6b4423", // 革・ベルト（こげ茶色）
  P: "#b8c0c8", // 銀のよろい
  D: "#7a8490", // 銀のよろいの影（こい灰色）
  R: "#c0392b", // 赤いよろい・マント
  Q: "#8e1f16", // 赤いよろいの影（こい赤）
  O: "#e8eef5", // 白いよろい・白い飾り
  V: "#ffe066", // 光（光の輪・光る剣）
  Z: "#3d8ef0", // スライムの体（青）
  I: "#bfe3ff", // スライムのつや（明るい水色）
  F: "#6aa84f", // ゴブリンの肌（緑）
  U: "#f4c06a", // ドラゴンのおなか（うすいオレンジ）
  X: "#6b2150", // ドラゴンのつばさ（こい赤紫）
};

// 見習い冒険者のドット絵の設計図（16×16マス）
// 1文字が1マスで、文字によって塗る色が決まります（「.」は塗らない）
// 麦わら帽子・茶色の服・木の棒
const PIXELS_NOVICE = [
  "................",
  "....KKKKK.......",
  "...KNNNNNK......",
  ".KKNNNNNNNKK.G..",
  "..KHSSSSSHK..G..",
  "..KSESSSESK..G..",
  "..KSSSSSSSK..G..",
  "...KSSMSSK...G..",
  "..KKCCCCCKK..G..",
  ".KSCCCCCCCSSSG..",
  ".KSCCCCCCCK..G..",
  "..KCCCCCCCK..G..",
  "..KLLLLLLLK..G..",
  "...KCCKCCK...G..",
  "...KCCKCCK......",
  "..KKKK.KKKK.....",
];

// 戦士：茶色い髪・革のよろい・短い剣
const PIXELS_WARRIOR = [
  "................",
  "....KKKKK.......",
  "...KHHHHHK......",
  "..KHHHHHHHK..W..",
  "..KHSSSSSHK..W..",
  "..KSESSSESK..W..",
  "..KSSSSSSSK..W..",
  "...KSSMSSK..YYY.",
  "..KKLLLLLKK..G..",
  ".KSLLCCCLLSSSG..",
  ".KSLLLCLLLK..G..",
  "..KLLLLLLLK.....",
  "..KCCCCCCCK.....",
  "...KLLKLLK......",
  "...KLLKLLK......",
  "..KKKK.KKKK.....",
];

// 勇者：青いよろい・剣・小さな王冠
const PIXELS_HERO = [
  "....Y.Y.Y....W..",
  "....YYYYY....W..",
  "...KHHHHHK...W..",
  "..KHHHHHHHK..W..",
  "..KHSSSSSHK..W..",
  "..KSESSSESK..W..",
  "..KSSSSSSSK..W..",
  "...KSSMSSK..YYY.",
  "..KKBBBBBKK..G..",
  ".KSBBYYYBBSSSG..",
  ".KSBBBYBBBK..G..",
  "..KBBBBBBBK.....",
  "..KYYYYYYYK.....",
  "...KBBKBBK......",
  "...KBBKBBK......",
  "..KKKK.KKKK.....",
];

// 聖騎士：銀のかぶと・銀のよろい・盾（左）・剣（右）
const PIXELS_PALADIN = [
  "................",
  "....KKKKK.......",
  "...KPPPPPK......",
  "..KPPPPPPPK..W..",
  "..KPDDDDDPK..W..",
  "..KPSESESPK..W..",
  "..KPSSSSSPK..W..",
  "...KPSMSPK..YYY.",
  "KKKKPPPPPKK..G..",
  "KBYBKPPPPPSSSG..",
  "KYYYKPPPPPK..G..",
  "KBYBKPPPPPK.....",
  "KBYBKDDDDDK.....",
  ".KKKPPKPPK......",
  "...KPPKPPK......",
  "..KKKK.KKKK.....",
];

// 竜殺しの勇者：角の付いたかぶと・赤いよろい・大きな剣
const PIXELS_DRAGON_SLAYER = [
  "..Y.....Y...WW..",
  "..YKKKKKY...WW..",
  "...KDDDDDK..WW..",
  "..KDDDDDDDK.WW..",
  "..KDSSSSSDK.WW..",
  "..KSESSSESK.WW..",
  "..KSSSSSSSK.WW..",
  "...KSSMSSK.YYYY.",
  "..KKRRRRRKK.GG..",
  ".KSRRQQQRRSSGG..",
  ".KSRRRQRRRK.GG..",
  "..KRRRRRRRK.....",
  "..KQQQQQQQK.....",
  "...KRRKRRK......",
  "...KRRKRRK......",
  "..KKKK.KKKK.....",
];

// 伝説の英雄：金のよろい・赤いマント・剣
const PIXELS_LEGEND = [
  ".............W..",
  "....KKKKK....W..",
  "...KHHHHHK...W..",
  "..KHHHHHHHK..W..",
  "..KHSSSSSHK..W..",
  "..KSESSSESK..W..",
  "..KSSSSSSSK..W..",
  "...KSSMSSK..YYY.",
  ".RKKYYYYYKKR.G..",
  "RKSYYOOOYYSSSG..",
  "RKSYYYOYYYKR.G..",
  "RRKYYYYYYYKRR...",
  "RRKLLLLLLLKRR...",
  "RR.KYYKYYK.RR...",
  ".R.KYYKYYK.R....",
  "..KKKK.KKKK.....",
];

// 神話の勇者：頭の上に光の輪・金色の髪・白と金のよろい・光る剣
const PIXELS_MYTH = [
  "...VVVVVVV...V..",
  "....KKKKK....V..",
  "...KYYYYYK...V..",
  "..KYYYYYYYK..V..",
  "..KYSSSSSYK..V..",
  "..KSESSSESK..V..",
  "..KSSSSSSSK..V..",
  "...KSSMSSK..YYY.",
  "..KKOOOOOKK..G..",
  ".KSOOYYYOOSSSG..",
  ".KSOOOYOOOK..G..",
  "..KOOOOOOOK.....",
  "..KYYYYYYYK.....",
  "...KOOKOOK......",
  "...KOOKOOK......",
  "..KKKK.KKKK.....",
];

// 称号（二つ名）の表。minLevel は「何レベルから」、pixels はキャラクターの設計図
// 高いレベルから順に書きます。1行足すと、称号を増やせます
const TITLES = [
  { minLevel: 20, icon: "✨", name: "神話の勇者", pixels: PIXELS_MYTH },
  { minLevel: 15, icon: "🌟", name: "伝説の英雄", pixels: PIXELS_LEGEND },
  { minLevel: 10, icon: "🐉", name: "竜殺しの勇者", pixels: PIXELS_DRAGON_SLAYER },
  { minLevel: 7, icon: "🛡️", name: "聖騎士", pixels: PIXELS_PALADIN },
  { minLevel: 5, icon: "👑", name: "勇者", pixels: PIXELS_HERO },
  { minLevel: 3, icon: "⚔️", name: "戦士", pixels: PIXELS_WARRIOR },
  { minLevel: 1, icon: "🧑‍🌾", name: "見習い冒険者", pixels: PIXELS_NOVICE },
];

// スライムのドット絵の設計図（左にいるキャラの方を向いている）
const PIXELS_SLIME = [
  "................",
  "................",
  "................",
  "................",
  "................",
  ".......KK.......",
  "......KZZK......",
  ".....KZIZZK.....",
  "....KZIZZZZK....",
  "...KZZZZZZZZK...",
  "..KZEZZZEZZZZK..",
  "..KZZZZZZZZZZK..",
  "..KZZZMMZZZZZK..",
  "..KZZZZZZZZZZK..",
  "...KZZZZZZZZK...",
  "....KKKKKKKK....",
];

// ゴブリン：緑の肌・とがった耳・こん棒
const PIXELS_GOBLIN = [
  "................",
  "....KKKKK...GG..",
  "KK.KFFFFFK.KGGG.",
  "KFKFFFFFFFKFGGG.",
  "..KFEFFEFFK.GG..",
  "..KFFFFFFFK.GG..",
  "..KFMOMOMFK.GG..",
  "...KFFFFFK..GG..",
  "..KKCCCCCKK.FF..",
  ".KFCCCCCCCFFFK..",
  ".KFCCCCCCCK.....",
  "..KCCCCCCCK.....",
  "..KLLLLLLLK.....",
  "...KFFKFFK......",
  "...KFFKFFK......",
  "..KKKK.KKKK.....",
];

// ドラゴン：とがった角・光る黄色い目・キバの見える大きな口・大きなつばさ・ツメ
// マスをいっぱいに使って、ボスらしく強そうにしています
const PIXELS_DRAGON = [
  ".K..K.....KK....",
  ".KK.KK...KXXK...",
  "..KKRKK.KXXXXK..",
  ".KRRRRRKXXXXXXK.",
  "KRVKRRRKXXQXXXXK",
  "KRRRRRRRKXXQXXXK",
  "KOROROQRRKXXQXXK",
  "KMMMMMKQRRKXXQXK",
  "KOROROKRRRRKXXK.",
  ".KKKKKRRUURRKK..",
  "....KQRUUURRRK..",
  "...KQRRUUURRRRK.",
  "...KQRRUURRKRRRK",
  "...KQRRRRRK.KRRK",
  "..KQQKKQQK...KK.",
  ".KOKOK.KOKOK....",
];

// モンスターの表。minExp は「本日のタスクのEXPが何から」、isBoss は少し大きく表示するか
// EXP が多い（大変な）クエストほど、強そうなモンスターになります。高いEXPから順に書きます
const MONSTERS = [
  { minExp: 28, name: "ドラゴン", pixels: PIXELS_DRAGON, isBoss: true },
  { minExp: 24, name: "ゴブリン", pixels: PIXELS_GOBLIN, isBoss: false },
  { minExp: 0, name: "スライム", pixels: PIXELS_SLIME, isBoss: false },
];

// --- 関数 ---

// 本日のタスクのEXPから、出すモンスターを決めて返す
function getMonster(exp) {
  for (let i = 0; i < MONSTERS.length; i++) {
    if (exp >= MONSTERS[i].minExp) {
      return MONSTERS[i];
    }
  }
  return MONSTERS[MONSTERS.length - 1]; // 念のため（表の一番下＝スライム）
}

// 本日のタスクのモンスターを描く（本日のタスクがないときは隠す）
// index は、本日のタスクが quests 配列の何番目か（ないときは -1）
function renderMonster(index) {
  // 点滅して消えている途中は、描き直さずに待つ（消え終わったら描き直す）
  if (isMonsterDying) {
    return;
  }

  if (index === -1) {
    monsterCanvas.hidden = true;
    return;
  }
  const monster = getMonster(quests[index].exp);
  monsterCanvas.hidden = false;

  // ボスのモンスターだけ、少し大きく表示する目印を付ける（ボスでなければ外す）
  if (monster.isBoss) {
    monsterCanvas.classList.add("is-boss");
  } else {
    monsterCanvas.classList.remove("is-boss");
  }
  drawPixels(monsterCanvas, monster.pixels);
}

// 撃破されたモンスターを、点滅させて消す
// 消え終わったら、次の本日のタスクのモンスターを描く
function defeatMonster() {
  isMonsterDying = true;
  restartAnimation(monsterCanvas, "is-dying");

  // 連打したときは、待ち時間を最初からやり直す
  clearTimeout(monsterDyingTimer);
  monsterDyingTimer = setTimeout(finishMonsterDefeat, MONSTER_DYING_TIME);
}

// モンスターが消え終わったら、次の本日のタスクのモンスターを描く
function finishMonsterDefeat() {
  isMonsterDying = false;
  monsterCanvas.classList.remove("is-dying");
  renderMonster(findTodayIndex());
}

// 今の称号に合ったキャラクターのドット絵を描く
function drawHero() {
  drawPixels(heroCanvas, getTitle(getLevel()).pixels);
}

// 設計図（pixels）どおりに、canvas にドット絵を描く
function drawPixels(canvas, pixels) {
  const pen = canvas.getContext("2d"); // 絵を描くための道具

  // 前に描いた絵を消す
  pen.clearRect(0, 0, canvas.width, canvas.height);

  // 上から1行ずつ、左から1マスずつ見ていく（y は何行目、x は何マス目）
  for (let y = 0; y < pixels.length; y++) {
    for (let x = 0; x < pixels[y].length; x++) {
      const color = HERO_COLORS[pixels[y][x]];

      // 色が決まっているマスだけ、1マス分の四角を塗る
      if (color) {
        pen.fillStyle = color;
        pen.fillRect(x, y, 1, 1);
      }
    }
  }
}

// 今日の日付を「2026-09-29」のような文字にして返す（スマホやパソコンの時計を使う）
function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // 月は 0 から数えるので +1
  const day = String(now.getDate()).padStart(2, "0");
  return year + "-" + month + "-" + day;
}

// 保存してある撃破数が今日のものでなければ、今日の分として 0 に戻す
function resetTodayCountIfNewDay() {
  const today = getTodayString();
  if (todayDate !== today) {
    todayDate = today;
    todayCount = 0;
  }
}

// 今日の撃破数を画面に表示し直す
function renderTodayCount() {
  todayCountText.textContent = "今日 " + todayCount + "体 撃破";
}

// プレイヤーの状態（累計EXP・今日の撃破数・その日付）を localStorage に保存する
function savePlayer() {
  const player = {
    totalExp: totalExp,
    todayCount: todayCount,
    todayDate: todayDate,
  };
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

// localStorage から、保存しておいたプレイヤーの状態を取り出す
function loadPlayer() {
  const saved = localStorage.getItem(PLAYER_KEY);

  // まだ何も保存されていなければ、0 のまま
  if (saved === null) {
    return;
  }

  // 保存されたデータが壊れていても止まらないように、try で囲みます
  try {
    const player = JSON.parse(saved);
    totalExp = player.totalExp || 0;
    todayCount = player.todayCount || 0; // 前の形の保存データには無いので、そのときは 0
    todayDate = player.todayDate || "";
    console.log("プレイヤーの状態を読み込みました", player);
  } catch (error) {
    console.log("プレイヤーの保存データが壊れていたので、0 から始めます");
    totalExp = 0;
    todayCount = 0;
    todayDate = "";
  }
}

// level から次のレベルに上がるのに必要なEXPを返す
// （Lv1 は 100、そこから1レベルごとに EXP_GROWTH 倍。小数は四捨五入する）
function getExpToNext(level) {
  return Math.round(FIRST_LEVEL_EXP * Math.pow(EXP_GROWTH, level - 1));
}

// 累計EXPから、今のレベルと、そのレベルの中で貯まっているEXPを計算して返す
function getLevelInfo() {
  let level = 1; // Lv1 から始まる
  let restExp = totalExp; // まだレベルアップに使っていないEXP

  // 次のレベルに必要なEXPが足りている間、レベルを1つずつ上げていく
  while (restExp >= getExpToNext(level)) {
    restExp = restExp - getExpToNext(level);
    level = level + 1;
  }
  return { level: level, currentExp: restExp };
}

// 累計EXPから、今のレベルを計算して返す
function getLevel() {
  return getLevelInfo().level;
}

// レベルから、称号とアイコンを決めて返す
// TITLES の表を上から見ていき、「何レベルから」を満たす最初の行を使う
function getTitle(level) {
  for (let i = 0; i < TITLES.length; i++) {
    if (level >= TITLES[i].minLevel) {
      return TITLES[i];
    }
  }
  return TITLES[TITLES.length - 1]; // 念のため（表の一番下＝Lv1 の称号）
}

// 今のレベルが、称号の表の何番目のランクかを数えて返す（見習い冒険者が 1、神話の勇者が 7）
// 「何レベルから」を満たしている称号の数が、そのままランクになります
function getRank(level) {
  let rank = 0;
  for (let i = 0; i < TITLES.length; i++) {
    if (level >= TITLES[i].minLevel) {
      rank = rank + 1;
    }
  }
  return rank;
}

// ランクの星を表示し直す（今のランクの数だけ金色の ★、残りはうすい ☆）
function renderRankStars(level) {
  const rank = getRank(level);

  // いったん空にしてから、星を1つずつ足す
  rankStars.innerHTML = "";
  for (let i = 0; i < TITLES.length; i++) {
    const star = document.createElement("span");
    if (i < rank) {
      star.textContent = "★";
      star.className = "rank-star-on";
    } else {
      star.textContent = "☆";
    }
    rankStars.appendChild(star);
  }
}

// ステータス（アイコン・称号・レベル・経験値バー）を画面に表示し直す
function renderStatus() {
  const info = getLevelInfo();
  const level = info.level;
  const title = getTitle(level);

  // 今のレベルの中で、どれだけ貯まっているか・次のレベルまでにいくつ必要か
  const currentExp = info.currentExp;
  const needExp = getExpToNext(level);

  statusIcon.textContent = title.icon;
  statusName.textContent = title.name;
  statusLevel.textContent = level; // 丸の中には数字だけを出す
  expBarFill.style.width = (currentExp / needExp) * 100 + "%";
  expText.textContent = currentExp + " / " + needExp + " EXP";

  // 今日の撃破数を表示し直す
  renderTodayCount();

  // ランクの星を表示し直す
  renderRankStars(level);

  // 今の称号に合ったキャラクターを描き直す
  drawHero();
}

// quests 配列を localStorage に保存する
// （localStorage には文字しか入らないので、JSON という形の文字に変えてしまいます）
function saveQuests() {
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
}

// localStorage から、保存しておいたクエスト一覧を取り出す
function loadQuests() {
  const saved = localStorage.getItem(QUESTS_KEY);

  // まだ何も保存されていなければ、空の一覧のまま
  if (saved === null) {
    return;
  }

  // 保存されたデータが壊れていても止まらないように、try で囲みます
  try {
    quests = JSON.parse(saved);
    console.log("保存されたクエストを読み込みました", quests);
  } catch (error) {
    console.log("保存データが壊れていたので、空の一覧から始めます");
    quests = [];
  }
}

// min 以上 max 以下の整数をランダムに1つ返す
function getRandomExp(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// クエスト1つ分の削除ボタンを作って返す
// index は、そのクエストが quests 配列の何番目か
function createDeleteButton(index) {
  const button = document.createElement("button");
  button.className = "delete-button";
  button.type = "button";
  button.textContent = "削除";

  // 押されたら、そのクエストを削除して表示し直す
  button.addEventListener("click", function () {
    deleteQuest(index);
    renderQuests();
  });
  return button;
}

// 要素に付けたアニメーション用のクラスを、最初から動かし直す
// （いったん外してから付け直さないと、2回目以降のアニメーションが動かないため）
function restartAnimation(element, className) {
  element.classList.remove(className);
  void element.offsetWidth; // ブラウザに「一度外した」ことを気づかせるおまじない
  element.classList.add(className);
}

// 音を作るための道具を返す（まだ無ければ、ここで用意する）
// （ブラウザの決まりで、ボタンを押したあとでないと音の道具は使えません）
function getAudioContext() {
  if (audioContext === null) {
    // 古い Safari では名前が違うので、どちらか使えるほうを使う
    const AudioTool = window.AudioContext || window.webkitAudioContext;
    audioContext = new AudioTool();
  }
  return audioContext;
}

// 「シュッ」という、風を切る音を鳴らす
// ザーッという音（ノイズ）を、高い音から低い音へ一瞬で変化させて作ります
function playSwooshSound(audio) {
  const now = audio.currentTime; // 今の時刻（秒）
  const duration = 0.2; // 音の長さ（秒）

  // ザーッという音のもとを作る（でたらめな数を並べると、ザーッという音になる）
  const noiseData = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const samples = noiseData.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }
  const noise = audio.createBufferSource();
  noise.buffer = noiseData;

  // 聞こえる音の高さをしぼる（高い音 → 低い音 へ動かす）
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(4000, now);
  filter.frequency.exponentialRampToValueAtTime(600, now + duration);

  // 音の大きさ（だんだん小さくして消す）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.6, now);
  volume.gain.exponentialRampToValueAtTime(0.01, now + duration);

  // 音のもと → しぼる → 大きさ → スピーカー の順につなぐ
  noise.connect(filter);
  filter.connect(volume);
  volume.connect(audio.destination);
  noise.start(now);
}

// 「キンッ」という、高い金属っぽい音を鳴らす
function playClangSound(audio) {
  const start = audio.currentTime + 0.05; // 「シュッ」の少しあとに鳴らす
  const duration = 0.25; // 音の長さ（秒）

  // 高い音を出すもと
  const tone = audio.createOscillator();
  tone.type = "triangle";
  tone.frequency.setValueAtTime(2400, start);

  // 音の大きさ（すぐに小さくして消す）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.25, start);
  volume.gain.exponentialRampToValueAtTime(0.01, start + duration);

  // 音のもと → 大きさ → スピーカー の順につなぐ
  tone.connect(volume);
  volume.connect(audio.destination);
  tone.start(start);
  tone.stop(start + duration);
}

// 剣で切る音（シュッ＋キンッ）を鳴らす
function playSlashSound() {
  // 音が鳴らせないブラウザでも、撃破そのものは止まらないように try で囲みます
  try {
    const audio = getAudioContext();
    playSwooshSound(audio);
    playClangSound(audio);
  } catch (error) {
    console.log("音を鳴らせませんでした", error);
  }
}

// 低くて重い「ズバッ」という、大きな剣で風を切る音を鳴らす（まとめて撃破したとき用）
// ふつうの「シュッ」より低い音から、さらに低く下げて、少し長めにしています
function playHeavySwooshSound(audio) {
  const now = audio.currentTime; // 今の時刻（秒）
  const duration = 0.35; // 音の長さ（秒）

  // ザーッという音のもとを作る
  const noiseData = audio.createBuffer(1, audio.sampleRate * duration, audio.sampleRate);
  const samples = noiseData.getChannelData(0);
  for (let i = 0; i < samples.length; i++) {
    samples[i] = Math.random() * 2 - 1;
  }
  const noise = audio.createBufferSource();
  noise.buffer = noiseData;

  // 聞こえる音の高さをしぼる（低い音 → もっと低い音 へ動かす）
  const filter = audio.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(1500, now);
  filter.frequency.exponentialRampToValueAtTime(200, now + duration);

  // 音の大きさ（だんだん小さくして消す）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.8, now);
  volume.gain.exponentialRampToValueAtTime(0.01, now + duration);

  // 音のもと → しぼる → 大きさ → スピーカー の順につなぐ
  noise.connect(filter);
  filter.connect(volume);
  volume.connect(audio.destination);
  noise.start(now);
}

// 「ゴォン」という、低くて重い金属の響きを鳴らす
// 高さが少しずれた2つの音を重ねると、金属らしい響きになります
function playHeavyClangSound(audio) {
  const start = audio.currentTime + 0.08; // 「ズバッ」の少しあとに鳴らす
  const duration = 0.6; // 響きが消えるまでの長さ（秒）
  const frequencies = [220, 331]; // 重ねる2つの音の高さ

  for (let i = 0; i < frequencies.length; i++) {
    const tone = audio.createOscillator();
    tone.type = "triangle";
    tone.frequency.setValueAtTime(frequencies[i], start);

    // 音の大きさ（鳴った瞬間がいちばん大きく、ゆっくり小さくなる）
    const volume = audio.createGain();
    volume.gain.setValueAtTime(0.2, start);
    volume.gain.exponentialRampToValueAtTime(0.01, start + duration);

    tone.connect(volume);
    volume.connect(audio.destination);
    tone.start(start);
    tone.stop(start + duration);
  }
}

// 「ドンッ」という、おなかに響く低い音を鳴らす（地面に振り下ろしたような感じ）
// 小さなスピーカーでも聞こえるように、150ヘルツから55ヘルツへ下げています
function playThudSound(audio) {
  const start = audio.currentTime + 0.05;
  const duration = 0.4; // 音の長さ（秒）

  // 低い音を出すもと（音の高さを、すばやく下げる）
  const tone = audio.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(150, start);
  tone.frequency.exponentialRampToValueAtTime(55, start + 0.3);

  // 音の大きさ（鳴った瞬間がいちばん大きく、すぐに小さくなる）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.9, start);
  volume.gain.exponentialRampToValueAtTime(0.01, start + duration);

  tone.connect(volume);
  volume.connect(audio.destination);
  tone.start(start);
  tone.stop(start + duration);
}

// ボスを倒したような、低くて重い剣の音（ズバッ＋ゴォン＋ドンッ）を鳴らす
function playHeavySlashSound() {
  // 音が鳴らせないブラウザでも、撃破そのものは止まらないように try で囲みます
  try {
    const audio = getAudioContext();
    playHeavySwooshSound(audio);
    playHeavyClangSound(audio);
    playThudSound(audio);
  } catch (error) {
    console.log("重い音を鳴らせませんでした", error);
  }
}

// ピアノっぽい音を1つ鳴らす
// frequency は音の高さ、start は鳴らし始める時刻（秒）
function playPianoNote(audio, frequency, start) {
  const duration = 0.8; // 余韻が消えるまでの長さ（秒）

  // 音を出すもと（やわらかい音の「sine」を使う）
  const tone = audio.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(frequency, start);

  // 音の大きさ（鳴った瞬間がいちばん大きく、余韻を残して小さくなる）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.01, start);
  volume.gain.exponentialRampToValueAtTime(0.25, start + 0.01);
  volume.gain.exponentialRampToValueAtTime(0.01, start + duration);

  // 音のもと → 大きさ → スピーカー の順につなぐ
  tone.connect(volume);
  volume.connect(audio.destination);
  tone.start(start);
  tone.stop(start + duration);
}

// ドレミファソラシドを、鍵盤をなでるように素早く順に鳴らす
function playLevelUpSound() {
  // 音が鳴らせないブラウザでも、レベルアップの演出は止まらないように try で囲みます
  try {
    const audio = getAudioContext();
    for (let i = 0; i < SCALE_NOTES.length; i++) {
      // i 番目の音は、NOTE_GAP 秒 × i だけ遅らせて鳴らす
      playPianoNote(audio, SCALE_NOTES[i], audio.currentTime + NOTE_GAP * i);
    }
  } catch (error) {
    console.log("レベルアップの音を鳴らせませんでした", error);
  }
}

// ラッパっぽい音を1つ鳴らす
// frequency は音の高さ、start は鳴らし始める時刻（秒）、length は長さ（秒）
function playBrassNote(audio, frequency, start, length) {
  // ラッパっぽい、少しとがった音（「sawtooth」＝のこぎりの歯の形の波）を使う
  const tone = audio.createOscillator();
  tone.type = "sawtooth";
  tone.frequency.setValueAtTime(frequency, start);

  // とがりすぎないように、高すぎる音をけずって、やわらかくする
  const filter = audio.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(2000, start);

  // 音の大きさ（耳に強すぎないよう小さめ。すぐに大きくなり、最後に小さくして消す）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.01, start);
  volume.gain.exponentialRampToValueAtTime(0.12, start + 0.02);
  volume.gain.setValueAtTime(0.12, start + length * 0.6);
  volume.gain.exponentialRampToValueAtTime(0.01, start + length);

  // 音のもと → けずる → 大きさ → スピーカー の順につなぐ
  tone.connect(filter);
  filter.connect(volume);
  volume.connect(audio.destination);
  tone.start(start);
  tone.stop(start + length);
}

// お祝いのファンファーレ「タ・タ・タ・ジャーン♪」を鳴らす
function playFanfareSound() {
  // 音が鳴らせないブラウザでも、お祝いの演出は止まらないように try で囲みます
  try {
    const audio = getAudioContext();
    const now = audio.currentTime;

    // 表の1行ずつ、同時に鳴らす音をすべて鳴らす
    for (let i = 0; i < FANFARE_NOTES.length; i++) {
      const note = FANFARE_NOTES[i];
      for (let j = 0; j < note.frequencies.length; j++) {
        playBrassNote(audio, note.frequencies[j], now + note.start, note.length);
      }
    }
  } catch (error) {
    console.log("お祝いの音を鳴らせませんでした", error);
  }
}

// 演出を順番待ちの列のいちばん後ろに並べる
// 何も出ていなければ、すぐに出す
function addEffect(play, duration) {
  pushEffect({ play: play, duration: duration });
}

// 演出（{ play, duration } の形）を列のいちばん後ろに並べる。何も出ていなければ、すぐに出す
function pushEffect(effect) {
  effectQueue.push(effect);
  if (!isEffectPlaying) {
    playNextEffect();
  }
}

// 撃破の演出を列に並べる
// 列のいちばん後ろが「まだ出ていない撃破の演出」なら、新しく並べずに、体数とEXPを足してまとめる
function addDefeatEffect(exp) {
  const last = effectQueue[effectQueue.length - 1]; // 列のいちばん後ろ（無ければ undefined）
  if (last && last.isDefeat) {
    last.defeatCount = last.defeatCount + 1;
    last.defeatExp = last.defeatExp + exp;
    return;
  }

  // まとめられないときは、新しい撃破の演出を並べる
  const effect = {
    isDefeat: true, // 撃破の演出かどうか（まとめるときの目印）
    defeatCount: 1, // まとめた体数
    defeatExp: exp, // まとめたEXPの合計
    duration: DEFEAT_EFFECT_TIME,
    play: function () {
      playDefeatEffect(effect.defeatCount, effect.defeatExp);
    },
  };
  pushEffect(effect);
}

// 列の先頭の演出を出して、その長さの分だけ待ってから、次の演出へ進む
function playNextEffect() {
  // 列が空なら、演出はおしまい
  if (effectQueue.length === 0) {
    isEffectPlaying = false;
    return;
  }

  isEffectPlaying = true;
  const effect = effectQueue.shift(); // 列の先頭を取り出す
  effect.play();
  setTimeout(playNextEffect, effect.duration);
}

// 演出用の板から、すべての演出の目印を外す（演出の見た目が混ざらないように）
function clearEffectClasses() {
  effectOverlay.classList.remove("is-playing");
  effectOverlay.classList.remove("is-levelup");
  effectOverlay.classList.remove("is-celebrate");
}

// 撃破の演出を出す（音が鳴り、光る・揺れる・「撃破！ +〇 EXP」の文字が出る）
// count はまとめた体数、exp はまとめたEXPの合計
function playDefeatEffect(count, exp) {
  clearEffectClasses();

  // 1体ならいつもの「シュキンッ」、まとめて撃破したときは重い「ズバァン」
  if (count >= 2) {
    playHeavySlashSound();
    effectText.textContent = "⚔️ " + count + "体 撃破！ +" + exp + " EXP";
  } else {
    playSlashSound();
    effectText.textContent = "⚔️ 撃破！ +" + exp + " EXP";
  }
  restartAnimation(effectOverlay, "is-playing");
  restartAnimation(container, "is-shaking");
}

// レベルアップの演出を出す（虹色にぴかぴか光って、レベルと称号が出る）
// level は、上がったあとのレベル（列に並べたときのレベルを使う）
function playLevelUpEffect(level) {
  const title = getTitle(level);

  clearEffectClasses();
  effectText.textContent =
    "🎉 レベルアップ！ Lv " + level + "\n" + title.icon + " " + title.name;
  restartAnimation(effectOverlay, "is-levelup");

  // ドレミファソラシドを鳴らす
  playLevelUpSound();
}

// お祝いの演出を出す（金色にふわっと光って、「🏆 今日 〇体 撃破！」が出る）
function playCelebrateEffect(count) {
  clearEffectClasses();
  effectText.textContent = "🏆 今日 " + count + "体 撃破！\nすばらしい！";
  restartAnimation(effectOverlay, "is-celebrate");

  // 「タ・タ・タ・ジャーン♪」を鳴らす
  playFanfareSound();
}

// 撃破ボタンを隠す（レベルアップの演出を見逃さないように）
function lockDefeat() {
  isDefeatLocked = true;
  renderQuests();
}

// 隠していた撃破ボタンを、また出す
function unlockDefeat() {
  isDefeatLocked = false;
  renderQuests();
}

// 撃破したときの演出を、撃破 → レベルアップ → お祝い の順に列に並べる
// exp は獲得EXP、isLevelUp はレベルが上がったか、level と count は撃破したあとのレベルと今日の撃破数
function addDefeatEffects(exp, isLevelUp, level, count) {
  addDefeatEffect(exp);

  if (isLevelUp) {
    // レベルアップの演出が終わるまで、撃破ボタンを隠す
    lockDefeat();
    addEffect(function () {
      playLevelUpEffect(level);
      setTimeout(unlockDefeat, LEVELUP_EFFECT_TIME); // 演出が終わったら、ボタンをまた出す
    }, LEVELUP_EFFECT_TIME);
  }

  // 今日の撃破数が5の倍数（5体・10体・15体…）なら、お祝いも並べる
  if (count % CELEBRATE_EVERY === 0) {
    addEffect(function () {
      playCelebrateEffect(count);
    }, CELEBRATE_EFFECT_TIME);
  }
}

// クエスト1つ分の撃破ボタンを作って返す
// index は、そのクエストが quests 配列の何番目か
// text はボタンに書く文字、className は見た目を決めるクラスの名前
function createDefeatButton(quest, index, text, className) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = className;
  button.textContent = text;

  // 押されたら、そのクエストを撃破済みにして表示し直す
  button.addEventListener("click", function () {
    // 撃破する前のレベルを覚えておく
    const levelBefore = getLevel();

    // 本日のタスクを撃破したときだけ、モンスターを点滅させて消す
    if (index === findTodayIndex()) {
      defeatMonster();
    }

    completeQuest(index);
    renderQuests();
    renderStatus();

    // 撃破・レベルアップ・お祝いの演出を、順番待ちの列に並べる
    const levelAfter = getLevel();
    addDefeatEffects(quest.exp, levelAfter > levelBefore, levelAfter, todayCount);
  });
  return button;
}

// 「撃破済み」の目印を作って返す
function createDoneLabel() {
  const label = document.createElement("span");
  label.className = "done-label";
  label.textContent = "撃破済み";
  return label;
}

// 押すと名前を直せるクエスト名を作って返す（名前のうしろに ✏️ を付ける）
// tagName は作る部品の種類（"span" や "p"）、className は見た目を決めるクラスの名前
function createQuestName(quest, index, tagName, className) {
  const name = document.createElement(tagName);
  name.className = className + " editable-name";

  // textContent を使うので、入力した文字はそのまま文字として表示されます
  name.textContent = quest.name;

  // 押せる場所だと分かるように、小さな ✏️ を付ける
  const pencil = document.createElement("span");
  pencil.className = "edit-icon";
  pencil.textContent = "✏️";
  name.appendChild(pencil);

  // 押されたら、名前を直す
  name.addEventListener("click", function () {
    renameQuest(index);
  });
  return name;
}

// index 番目のクエストの名前を直す（入力の画面を出して、新しい名前を聞く）
// 名前だけを変えて、EXP・撃破したかどうか・並び順は変えない
function renameQuest(index) {
  const input = prompt("新しいクエスト名を入力してください", quests[index].name);

  // 「キャンセル」が押されたら、何もしない
  if (input === null) {
    return;
  }

  // 前後の空白を取り除いて、空っぽなら何もしない（追加のときと同じ決まり）
  const newName = input.trim();
  if (newName === "") {
    return;
  }

  quests[index].name = newName;
  saveQuests();
  renderQuests();
  console.log("クエスト名を直しました", quests[index]);
}

// クエスト1つ分の行（li）を作って返す
function createQuestItem(quest, index) {
  const item = document.createElement("li");
  item.className = "quest-item";

  // 撃破済みなら、薄く表示するための目印（クラス）を付ける
  if (quest.done) {
    item.classList.add("is-done");
  }

  // タスク名（押すと名前を直せる）
  const name = createQuestName(quest, index, "span", "quest-name");

  // 獲得EXP
  const exp = document.createElement("span");
  exp.className = "quest-exp";
  exp.textContent = quest.exp + " EXP";

  // まだ撃破していなければ、左に小さな撃破ボタンを置く（隠しているときは置かない）
  if (!quest.done && !isDefeatLocked) {
    item.appendChild(createDefeatButton(quest, index, "撃破", "defeat-button"));
  }

  item.appendChild(name);

  // 撃破済みなら「撃破済み」の目印を出す（撃破ボタンは出さない）
  if (quest.done) {
    item.appendChild(createDoneLabel());
  }

  item.appendChild(exp);
  item.appendChild(createDeleteButton(index));
  return item;
}

// 「本日のタスク」にするクエストが、quests 配列の何番目かを返す
// （まだ撃破していない一番上のクエスト。1つも無いときは -1 を返す）
function findTodayIndex() {
  for (let i = 0; i < quests.length; i++) {
    if (!quests[i].done) {
      return i;
    }
  }
  return -1;
}

// 「本日のタスク」のカードの中身を作って表示する
function renderToday(index) {
  // いったん中身を空にする
  todayQuest.innerHTML = "";

  // 撃破していないクエストが無いときは、メッセージだけ出す
  if (index === -1) {
    const empty = document.createElement("p");
    empty.className = "today-empty";
    empty.textContent = "未撃破のクエストはありません";
    todayQuest.appendChild(empty);
    return;
  }

  const quest = quests[index];

  // クエスト名（大きく表示。押すと名前を直せる）
  const name = createQuestName(quest, index, "p", "today-name");

  // 「（〇 EXP get）」
  const exp = document.createElement("p");
  exp.className = "today-exp";
  exp.textContent = "（" + quest.exp + " EXP get）";

  // 撃破ボタンと削除ボタンを横に並べる箱
  const actions = document.createElement("div");
  actions.className = "today-actions";

  // 大きな「⚔️ 撃破する」ボタン（隠しているときは、代わりに「レベルアップ中…」を出す）
  if (isDefeatLocked) {
    const waiting = document.createElement("span");
    waiting.className = "today-waiting";
    waiting.textContent = "🎉 レベルアップ中…";
    actions.appendChild(waiting);
  } else {
    actions.appendChild(createDefeatButton(quest, index, "⚔️ 撃破する", "today-defeat-button"));
  }
  actions.appendChild(createDeleteButton(index));

  todayQuest.appendChild(name);
  todayQuest.appendChild(exp);
  todayQuest.appendChild(actions);
}

// 画面のクエスト表示（本日のタスクと、他のタスクの一覧）をすべて表示し直す
function renderQuests() {
  const todayIndex = findTodayIndex();
  renderToday(todayIndex);
  renderMonster(todayIndex);

  // 他のタスクの一覧を、いったん空にする
  questList.innerHTML = "";

  // 1回目：まだ撃破していないクエストを先に並べる（本日のタスクは除く）
  for (let i = 0; i < quests.length; i++) {
    if (i !== todayIndex && !quests[i].done) {
      questList.appendChild(createQuestItem(quests[i], i));
    }
  }

  // 2回目：撃破済みのクエストをあとに並べる
  for (let i = 0; i < quests.length; i++) {
    if (quests[i].done) {
      questList.appendChild(createQuestItem(quests[i], i));
    }
  }

  // 撃破済みが0件なら、まとめて削除のボタンを押せなくする
  clearDoneButton.disabled = countDoneQuests() === 0;
}

// 撃破済みのクエストが何件あるか数えて返す
function countDoneQuests() {
  let count = 0;
  for (let i = 0; i < quests.length; i++) {
    if (quests[i].done) {
      count = count + 1;
    }
  }
  return count;
}

// 撃破済みのクエストをまとめて削除する（確認してから）
// （決まりどおり、もらったEXPは減らしません）
function clearDoneQuests() {
  const count = countDoneQuests();
  if (count === 0) {
    return;
  }

  // 確認を出して、「キャンセル」が押されたら何もしない
  const ok = confirm("撃破済みのクエスト " + count + "件を削除しますか？");
  if (!ok) {
    return;
  }

  // まだ撃破していないクエストだけを残す
  quests = quests.filter(function (quest) {
    return !quest.done;
  });
  saveQuests();
  console.log("撃破済みのクエストをまとめて削除しました", count + "件");
}

// レベルを Lv1 に戻す（確認してから）
// 累計EXPだけを 0 にして、クエストの一覧と今日の撃破数はそのまま残す
function resetLevel() {
  const ok = confirm("レベルを Lv1 に戻しますか？ 貯めたEXPはすべて消えます。");
  if (!ok) {
    return;
  }

  totalExp = 0;
  savePlayer();
  renderStatus();
  console.log("レベルをリセットしました");
}

// 「他のタスク」の一覧を、開いていれば閉じ、閉じていれば開く
function toggleOtherQuests() {
  questList.hidden = !questList.hidden;

  // まとめて削除のボタンも、一覧と一緒に出したり消したりする
  clearDoneButton.hidden = questList.hidden;

  // 開いているときは △、閉じているときは ▽ にする
  if (questList.hidden) {
    otherToggle.textContent = "他のタスク ▽";
  } else {
    otherToggle.textContent = "他のタスク △";
  }
}

// 新しいクエストを追加する
function addQuest(questName) {
  const newQuest = {
    name: questName,
    exp: getRandomExp(20, 30), // 20〜30 のランダムな獲得EXP
    done: false,
  };
  quests.push(newQuest);
  saveQuests();
  console.log("クエストを追加しました", newQuest);
}

// index 番目のクエストを完了（撃破済み）にする
function completeQuest(index) {
  // すでに撃破済みなら何もしない（二重に完了させない）
  if (quests[index].done) {
    return;
  }
  quests[index].done = true;
  saveQuests();
  console.log("クエストを撃破しました", quests[index]);

  // そのクエストのEXPを累計EXPに足す
  totalExp = totalExp + quests[index].exp;

  // 今日の撃破数を 1 増やす（日付が変わっていたら、先に 0 に戻す）
  resetTodayCountIfNewDay();
  todayCount = todayCount + 1;

  savePlayer();
  console.log("累計EXP", totalExp, "今日の撃破数", todayCount);
}

// index 番目のクエストを削除する
// （完了済みでも、もらったEXPは減らさない決まりです）
function deleteQuest(index) {
  const removed = quests.splice(index, 1);
  saveQuests();
  console.log("クエストを削除しました", removed[0]);
}

// --- イベント ---

// 「追加」ボタンが押されたとき（入力欄で Enter を押したときも）
questForm.addEventListener("submit", function (event) {
  // ページが再読み込みされるのを止める
  event.preventDefault();

  // 前後の空白を取り除いたタスク名
  const questName = questInput.value.trim();

  // 空っぽなら何もしない
  if (questName === "") {
    return;
  }

  addQuest(questName);
  renderQuests();

  // 入力欄を空にして、続けて入力できるようにする
  questInput.value = "";
  questInput.focus();
});

// 「他のタスク ▽」のボタンが押されたとき
otherToggle.addEventListener("click", toggleOtherQuests);

// 「レベルをリセット」のボタンが押されたとき
resetLevelButton.addEventListener("click", resetLevel);

// 「撃破済みをまとめて削除」のボタンが押されたとき
clearDoneButton.addEventListener("click", function () {
  clearDoneQuests();
  renderQuests();
});

// --- ページを開いたときに最初に1回だけ行うこと ---

// 保存しておいたクエストを取り出して、一覧に表示する
loadQuests();
renderQuests();

// 保存しておいた累計EXPを取り出して、ステータスを表示する
loadPlayer();
resetTodayCountIfNewDay(); // 前に開いた日と違えば、今日の撃破数を 0 に戻す
renderStatus(); // この中で、キャラクターのドット絵も描きます
