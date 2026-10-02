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

// 「毎日の習慣」を表示する場所と、「🔁 毎日の習慣として追加」のチェックボックス
const habitList = document.getElementById("habit-list");
const habitCheckbox = document.getElementById("habit-checkbox");
const habitDaysBox = document.getElementById("habit-days"); // 日課をやる曜日をえらぶボタンの箱

// 締切の日付を選ぶ欄
const deadlineInput = document.getElementById("deadline-input");
const planInput = document.getElementById("plan-input"); // やる日（明日以降の、この日にやる予定）の欄
const categoryInput = document.getElementById("category-input"); // クエストのカテゴリをえらぶ箱

// 「他のタスク ▽」のボタン
const otherToggle = document.getElementById("other-toggle");
const categoryFilterBox = document.getElementById("category-filter"); // 他のタスクを、カテゴリでしぼりこむボタンの箱
const otherSwitch = document.getElementById("other-switch"); // 「他のタスク」「🗓️ 明日以降」の切りかえボタンの箱
const otherSwitchButtons = document.querySelectorAll(".other-switch-button"); // その切りかえボタン（2つ）
const futureList = document.getElementById("future-list"); // 明日以降の予定のクエストの一覧

// 他のタスクの所で、どちらの一覧を出しているか（"other"＝他のタスク、"future"＝明日以降）
let otherListView = "other";
// 他のタスクの所が開いているか（「他のタスク △」で開く・閉じる）
let isOtherOpen = true;

// 「撃破済みをまとめて削除」のボタン
const clearDoneButton = document.getElementById("clear-done-button");

// 「レベルをリセット」のボタン
const resetLevelButton = document.getElementById("reset-level-button");

// 「選んだ〇体をまとめて撃破」のボタン
const bulkDefeatButton = document.getElementById("bulk-defeat-button");

// 「本日のタスク」と「毎日の習慣」の切りかえボタンと、2つのカード
const bossDayBanner = document.getElementById("boss-day-banner"); // ボス戦の日のお知らせ
const switchTodayButton = document.getElementById("switch-today-button");
const switchHabitButton = document.getElementById("switch-habit-button");
const todayCard = document.getElementById("today-card");
const habitCard = document.getElementById("habit-card");

// 図鑑の中の切りかえボタン（アイテム・モンスターとペット・実績）と、3つのページ
// ガチャ画面の中の切りかえボタン（ガチャ・ショップ）と、2つのページ。ショップのコインの数と一覧
const gachaSwitchButtons = document.querySelectorAll(".gacha-switch-button");
const gachaSections = {
  gacha: document.getElementById("gacha-main"),
  shop: document.getElementById("gacha-shop"),
};
const shopCoins = document.getElementById("shop-coins");
const shopList = document.getElementById("shop-list");

const collectionSwitchButtons = document.querySelectorAll(".collection-switch-button");
const collectionSections = {
  items: document.getElementById("collection-items"),
  creatures: document.getElementById("collection-creatures"),
  achievements: document.getElementById("collection-achievements"),
};

// 効果音を消したり戻したりするボタン
const soundButton = document.getElementById("sound-button");

// ポモドーロタイマーの部品
const timerModeText = document.getElementById("timer-mode");
const timerTimeText = document.getElementById("timer-time");
const timerBarFill = document.getElementById("timer-bar-fill");
const timerWalkerBox = document.getElementById("timer-walker-box");
const timerWalker = document.getElementById("timer-walker");
const timerStartButton = document.getElementById("timer-start-button");
const timerPauseButton = document.getElementById("timer-pause-button");
const timerResetButton = document.getElementById("timer-reset-button");
// 設定画面を開く ⚙️ ボタンと、音の大きさのつまみ・今の大きさの文字
const settingsButton = document.getElementById("settings-button");
const effectVolumeSlider = document.getElementById("effect-volume-slider");
const effectVolumeText = document.getElementById("effect-volume-text");
const focusVolumeSlider = document.getElementById("focus-volume-slider");
const focusVolumeText = document.getElementById("focus-volume-text");

// 設定画面の、ボス戦の日の部品（えらぶ箱・今日の曜日・変えられるかの説明）
const bossDaySelect = document.getElementById("boss-day-select");
const bossDayToday = document.getElementById("boss-day-today");
const bossDayHelp = document.getElementById("boss-day-help");

// 設定画面の、データの書き出し・読みこみの部品
const exportButton = document.getElementById("export-button");
const copyButton = document.getElementById("copy-button");
const downloadButton = document.getElementById("download-button");
const dataText = document.getElementById("data-text");
const importButton = document.getElementById("import-button");
const importFileInput = document.getElementById("import-file");
const dataMessage = document.getElementById("data-message");
const deleteAllButton = document.getElementById("delete-all-button");

const timerFocusSelect = document.getElementById("timer-focus-select");
const timerBreakSelect = document.getElementById("timer-break-select");
const timerSoundSelect = document.getElementById("timer-sound-select");
const timerSound = document.getElementById("timer-sound");
const timerCountText = document.getElementById("timer-count");

// カレンダーの部品
const calendarTitle = document.getElementById("calendar-title");
const calendarGrid = document.getElementById("calendar-grid");
const calendarWeek = document.getElementById("calendar-week");
const calendarDetail = document.getElementById("calendar-detail");
const calendarPrevButton = document.getElementById("calendar-prev");
const calendarNextButton = document.getElementById("calendar-next");
const calendarThisMonthButton = document.getElementById("calendar-this-month");

// ペットの部品（メイン画面のペット、タイマーで歩くペット、ペットのカード）
// 1匹目・2匹目の順に並べて、配列にまとめています
const petCanvases = [document.getElementById("pet-canvas"), document.getElementById("pet-canvas-2")];
const timerPets = [document.getElementById("timer-pet"), document.getElementById("timer-pet-2")];
const petCrowns = [document.getElementById("pet-crown"), document.getElementById("pet-crown-2")]; // Lv5 のペットの王冠（メイン画面）
const timerPetCrowns = [document.getElementById("timer-pet-crown"), document.getElementById("timer-pet-crown-2")]; // Lv5 のペットの王冠（タイマー）
const petSettingText = document.getElementById("pet-setting");
const eggList = document.getElementById("egg-list");
const petList = document.getElementById("pet-list");

// 画面を切りかえるタブのボタン（3つ）と、画面の箱（3つ）
const pageTabs = document.querySelectorAll(".page-tab");
const pages = document.querySelectorAll(".page");

// コインの表示、ガチャのボタン、図鑑の部品
const coinText = document.getElementById("coin-text");
const gachaButton = document.getElementById("gacha-button");
const collectionCount = document.getElementById("collection-count");
const collectionList = document.getElementById("collection-list");

// 図鑑の「モンスターとペット」のページの部品（何種類か・一覧）
const creatureMonsterCount = document.getElementById("creature-monster-count");
const creatureMonsterList = document.getElementById("creature-monster-list");
const creaturePetCount = document.getElementById("creature-pet-count");
const creaturePetList = document.getElementById("creature-pet-list");

// 図鑑の「🏆 実績」のページの部品（いくつとったか・一覧）
const achievementCount = document.getElementById("achievement-count");
const achievementList = document.getElementById("achievement-list");
const equipSummary = document.getElementById("equip-summary");

// 10連ガチャのボタン、前回の結果、確率の表の部品
const gachaTenButton = document.getElementById("gacha-ten-button");
const gachaResultList = document.getElementById("gacha-result-list");
const gachaResultEmpty = document.getElementById("gacha-result-empty");
const gachaRateList = document.getElementById("gacha-rate-list");

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
const streakText = document.getElementById("streak-text"); // 連続記録（「🔥 3日連続」）

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

// 毎日の習慣をすべて入れておく配列
// 1つの習慣は { name: 習慣の名前, exp: 獲得EXP, doneDate: 最後に撃破した日（「2026-10-01」のような文字） } の形
let habits = [];

// localStorage に毎日の習慣をしまうときの名前
const HABITS_KEY = "tasclear-habits";

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

// チェックボックスで選んだクエスト（まとめて撃破するため。保存はしない）
let selectedQuests = [];

// 本日のタスクに並べるクエストの数（まだ撃破していないクエストを、上からこの数だけ）
const TODAY_MAX = 5;

// クエストを追加したときに、レアなクエストになる確率（1 / 50 = 50回に1回くらい）
const RARE_CHANCE = 1 / 50;

// レアなクエストの獲得EXP
const RARE_EXP = 100;

// ピン止めできるクエストの数の上限
const PIN_MAX = 5;

// 持っているコインの数
let coins = 0;

// 持っているアイテムと、その数（{ "wood-stick": 2, "iron-shield": 1 } のような形）
let items = {};

// 撃破したときにもらえるコイン（ふつうのクエスト・レアなクエスト）
const COIN_PER_DEFEAT = 10;
const COIN_PER_RARE_DEFEAT = 50;

// ボス戦の日にクエストを撃破したときの、コインの倍の数
const BOSS_COIN_MULTIPLIER = 3;

// ボス戦の日の曜日（0 が日曜日〜6 が土曜日。Date の getDay と同じ。-1 は「なし」）。はじめは日曜日。設定画面でえらびなおせる
const DEFAULT_BOSS_DAY = 0;
let bossDay = DEFAULT_BOSS_DAY;

// ボス戦の曜日を最後に変えた日（「2026-10-02」のような文字。1回も変えていなければ ""）と、次に変えられるまでの日数
let bossDayChangedDate = "";
const BOSS_CHANGE_DAYS = 7;

// ログインボーナス：続けて開いた日（1日目〜7日目）ごとにもらえるコイン。7日目のあとは、また1日目にもどる
const LOGIN_BONUS_COINS = [20, 30, 40, 50, 60, 70, 200];

// 最後にログインボーナスをもらった日（「2026-10-02」のような文字。まだなら ""）と、続けて開いた日数（1〜7）
let lastLoginDate = "";
let loginStreak = 0;

// ガチャ1回に使うコイン
const GACHA_COST = 50;

// 10連ガチャに使うコイン
const GACHA_TEN_COST = 500;

// 前回のガチャで出たアイテム（1回なら1つ、10連なら10個。保存はしない）
let lastGachaResults = [];

// 図鑑で、閉じているランク（{ 1: true } なら ★ ノーマルを閉じている。保存はしない）
let closedRanks = {};

// 効果音を消しているかどうか（true なら、どの効果音も鳴らさない）
let isMuted = false;

// ポモドーロタイマーの長さ（分）。はじめはこの長さで、タイマーのカードでえらびなおせる
const FOCUS_MINUTES = 25; // 集中
const BREAK_MINUTES = 5; // 休けい

// えらべる長さ（分）。タイマーのカードのえらぶ箱と同じ数にする
const FOCUS_MINUTE_CHOICES = [15, 25, 30, 45, 50, 60];
const BREAK_MINUTE_CHOICES = [3, 5, 10, 15];

// えらんでいる集中・休けいの長さ（分）
let focusMinutes = FOCUS_MINUTES;
let breakMinutes = BREAK_MINUTES;

// 今が集中（"focus"）か、休けい（"break"）か
let timerMode = "focus";

// 一時停止しているときの残り時間（ミリ秒。1000 で 1秒）
let timerRemaining = FOCUS_MINUTES * 60 * 1000;

// 今の集中・休けいの全体の長さ（ミリ秒。進み具合のバーに使う）
// 途中で長さをえらびなおしても、今の分はこの長さのまま続ける
let timerLength = FOCUS_MINUTES * 60 * 1000;

// 動いているときに、何時何分何秒に終わるか（動いていないときは null）
// ほかのタブを見ていて時間の計り方がゆっくりになっても、終わる時刻から残り時間を正しく計算するため
let timerEndTime = null;

// タイマーを動かすための、くり返しの番号（止めるときに使う）
let timerInterval = null;

// 集中タイムのあいだに流せる音の表。id は保存するときの名前、file は音のファイルの名前
const FOCUS_SOUNDS = [
  { id: "takibi", file: "たき火.mp3" },
  { id: "rain", file: "雨が降る2.mp3" },
  { id: "sea", file: "海岸4.mp3" },
  { id: "furin", file: "風鈴が鳴る家1.mp3" },
];

// 音の大きさ（0 から 100 の %。設定画面のつまみで変える）。はじめは効果音 100%、集中中の音 50%（効果音より小さめ）
const DEFAULT_EFFECT_VOLUME = 100;
const DEFAULT_FOCUS_VOLUME = 50;
let effectVolume = DEFAULT_EFFECT_VOLUME;
let focusVolume = DEFAULT_FOCUS_VOLUME;

// えらんでいる集中中の音の id（なしのときは ""）
let focusSound = "";

// 今日、集中タイムを何回終えたかと、それが何日の数なのか
let focusCount = 0;
let focusDate = "";

// 日付ごとの、撃破した数の記録（{ "2026-10-01": 5, "2026-10-02": 3 } のような形）
let defeatHistory = {};

// 日付ごとの、集中タイム（ポモドーロ）を終えた回数の記録（{ "2026-10-01": 3 } のような形）
let focusHistory = {};

// モンスターごとの、たおした数の記録（{ slime: 3, dragon: 1 } のような形。図鑑の「モンスターとペット」で使う）
let monsterDefeats = {};

// とった実績と、とった日（{ "first-defeat": "2026-10-01" } のような形）
let achievements = {};

// もうごほうびのコインをわたした実績（{ "first-defeat": true } のような形。同じ実績のコインを2回わたさないため）
let rewardedAchievements = {};

// カレンダーで見ている年と月（月は 0〜11。1月が 0）と、押して選んでいる日（「2026-10-05」のような文字）
let calendarYear = new Date().getFullYear();
let calendarMonth = new Date().getMonth();
let selectedDate = "";

// ガチャのランク。chance は出る確率（3つ足すと 1 になるようにする）
const GACHA_RANKS = [
  { rank: 1, stars: "★", name: "ノーマル", chance: 0.65 },
  { rank: 2, stars: "★★", name: "レア", chance: 0.3 },
  { rank: 3, stars: "★★★", name: "スーパーレア", chance: 0.05 },
];

// ガチャで出るアイテムの表。id は保存するときの名前、rank はランク（1〜3）
// slot は装備する部位（"head" 頭・"weapon" 武器・"shield" 盾・"feet" 足・"accessory" アクセサリー）
// slot が null のアイテムは道具なので、装備できない
const GACHA_ITEMS = [
  // ★ ノーマル（20種類）
  { id: "wood-stick", icon: "🪵", name: "木の棒", rank: 1, slot: "weapon" },
  { id: "cloth-hat", icon: "🧢", name: "布のぼうし", rank: 1, slot: "head" },
  { id: "travel-boots", icon: "👢", name: "旅人のブーツ", rank: 1, slot: "feet" },
  { id: "herb", icon: "🧪", name: "やくそう", rank: 1, slot: null },
  { id: "bread", icon: "🥖", name: "パン", rank: 1, slot: null },
  { id: "apple", icon: "🍎", name: "りんご", rank: 1, slot: null },
  { id: "rice-ball", icon: "🍙", name: "おにぎり", rank: 1, slot: null },
  { id: "cheese", icon: "🧀", name: "チーズ", rank: 1, slot: null },
  { id: "milk", icon: "🥛", name: "ミルク", rank: 1, slot: null },
  { id: "meat", icon: "🍖", name: "骨付き肉", rank: 1, slot: null },
  { id: "candle", icon: "🕯️", name: "ろうそく", rank: 1, slot: null },
  { id: "compass", icon: "🧭", name: "コンパス", rank: 1, slot: null },
  { id: "old-map", icon: "🗺️", name: "古い地図", rank: 1, slot: null },
  { id: "rusty-key", icon: "🔑", name: "さびた鍵", rank: 1, slot: null },
  { id: "copper-coin", icon: "🪙", name: "銅貨", rank: 1, slot: null },
  { id: "leather-gloves", icon: "🧤", name: "革の手袋", rank: 1, slot: "accessory" },
  { id: "scarf", icon: "🧣", name: "マフラー", rank: 1, slot: "accessory" },
  { id: "leather-boots", icon: "🥾", name: "革のブーツ", rank: 1, slot: "feet" },
  { id: "hand-axe", icon: "🪓", name: "手おの", rank: 1, slot: "weapon" },
  { id: "lantern", icon: "🏮", name: "ランタン", rank: 1, slot: null },

  // ★★ レア（16種類）
  { id: "steel-sword", icon: "🗡️", name: "鋼の剣", rank: 2, slot: "weapon" },
  { id: "iron-shield", icon: "🛡️", name: "鉄の盾", rank: 2, slot: "shield" },
  { id: "hunter-bow", icon: "🏹", name: "狩人の弓", rank: 2, slot: "weapon" },
  { id: "power-ring", icon: "💍", name: "力の指輪", rank: 2, slot: "accessory" },
  { id: "iron-helmet", icon: "🪖", name: "鉄のかぶと", rank: 2, slot: "head" },
  { id: "trident", icon: "🔱", name: "三つ又の槍", rank: 2, slot: "weapon" },
  { id: "boomerang", icon: "🪃", name: "ブーメラン", rank: 2, slot: null },
  { id: "magic-scroll", icon: "📜", name: "魔法の巻物", rank: 2, slot: null },
  { id: "charm", icon: "🧿", name: "守りのお守り", rank: 2, slot: "accessory" },
  { id: "blue-gem", icon: "💎", name: "青い宝石", rank: 2, slot: null },
  { id: "honey", icon: "🍯", name: "はちみつ", rank: 2, slot: null },
  { id: "adventure-bag", icon: "🎒", name: "冒険者のかばん", rank: 2, slot: null },
  { id: "magic-potion", icon: "⚗️", name: "魔法の薬", rank: 2, slot: null },
  { id: "magic-staff", icon: "🪄", name: "魔法の杖", rank: 2, slot: "weapon" },
  { id: "wizard-hat", icon: "🎩", name: "魔法使いの帽子", rank: 2, slot: "head" },
  { id: "swift-shoes", icon: "👞", name: "疾風のくつ", rank: 2, slot: "feet" },

  // ★★★ スーパーレア（12種類）
  { id: "legend-sword", icon: "⚔️", name: "伝説の剣", rank: 3, slot: "weapon" },
  { id: "king-crown", icon: "👑", name: "王者の冠", rank: 3, slot: "head" },
  { id: "sage-crystal", icon: "🔮", name: "賢者の水晶", rank: 3, slot: "accessory" },
  { id: "dragon-scale", icon: "🐉", name: "竜のうろこ", rank: 3, slot: null },
  { id: "unicorn-horn", icon: "🦄", name: "ユニコーンの角", rank: 3, slot: null },
  { id: "phoenix-feather", icon: "🪶", name: "不死鳥の羽", rank: 3, slot: null },
  { id: "star-fragment", icon: "🌟", name: "星のかけら", rank: 3, slot: null },
  { id: "moon-drop", icon: "🌙", name: "月のしずく", rank: 3, slot: null },
  { id: "sun-crest", icon: "☀️", name: "太陽の紋章", rank: 3, slot: null },
  { id: "ancient-pot", icon: "🏺", name: "古代のつぼ", rank: 3, slot: null },
  { id: "forbidden-book", icon: "📕", name: "禁断の書", rank: 3, slot: null },
  { id: "sky-orb", icon: "💠", name: "天空の宝珠", rank: 3, slot: null },
];

// ===== ショップ =====

// ショップでしか買えない装備（ガチャからは出ない）。price は値段（コイン）
// 1つずつしか買えない。図鑑では「🛒 ショップ限定」の見出しにならべる
const SHOP_ITEMS = [
  { id: "star-crown", icon: "🌟", name: "星のかんむり", rank: 4, slot: "head", price: 2000 },
  { id: "flame-sword", icon: "🔥", name: "炎の剣", rank: 4, slot: "weapon", price: 2000 },
  { id: "rainbow-shield", icon: "🌈", name: "虹の盾", rank: 4, slot: "shield", price: 2000 },
  { id: "angel-wings", icon: "🪽", name: "天使の羽", rank: 4, slot: "accessory", price: 2000 },
];

// 図鑑とショップで、ショップ限定のまとまりを、ガチャのランクと同じ形であつかうための行（rank 4 にする）
const SHOP_RANK = { rank: 4, stars: "🛒", name: "ショップ限定" };

// ショップで売る、ガチャのアイテムの値段（ランクごと）
const SHOP_ITEM_PRICES = { 1: 100, 2: 300, 3: 1000 };

// ショップで売る卵の値段（卵の種類ごと）
const SHOP_EGG_PRICES = { white: 250, blue: 500, gold: 1000 };

// ===== 卵とペット =====

// ガチャを1回引くごとに、卵が出る確率（卵が出たときは、アイテムは出ない）
const EGG_CHANCE = 0.1;

// 卵の種類の表。chance は「卵が出たときの中で」その卵になる確率、needed はかえるまでの集中の回数
// pets は、その卵からかえるペット（どれか1つがランダムでかえる）
const EGG_TYPES = [
  { type: "white", rank: 1, stars: "★", name: "白い卵", chance: 0.6, needed: 2, pets: ["chick", "cat", "dog", "hamster"] },
  { type: "blue", rank: 2, stars: "★★", name: "青い卵", chance: 0.3, needed: 3, pets: ["rabbit", "penguin", "fox", "owl"] },
  { type: "gold", rank: 3, stars: "★★★", name: "金の卵", chance: 0.1, needed: 4, pets: ["dragon", "unicorn"] },
];

// ペットのドット絵の設計図（新しい描き方・18×16マス。キャラより小さい。右にいるキャラの方を向いている）

// ちびスライム（最初からいるペット。卵からはかえらない）：青くて小さいスライム・にっこり笑った顔
const PIXELS_PET_SLIME = [
  "..................",
  "..................",
  "..................",
  "..................",
  "..................",
  ".......oooo.......",
  ".....oozzzzoo.....",
  "....ozIIzZZZZo....",
  "...ozIIZZZZZZZo...",
  "..ozIZZZZZTeZTeZo.",
  "..oZZZZZZZeeZeeZo.",
  ".oZZZZZZZcZZZZZcxo",
  ".oZZZZZZZZZeZZeZxo",
  ".oxZZZZZZZZZeeZxxo",
  "..oxxxZZZZZZZxxxo.",
  "...ooooooooooooo..",
];

// ひよこ：黄色・オレンジのくちばし
const PIXELS_PET_CHICK = [
  "........oooo......",
  ".......oJJAAo.....",
  "......oJAAAAAo....",
  "......oAAATeAoo...",
  "......oAAAeeAouuo.",
  "..oo..oAcAAAAAoo..",
  ".oJAooAAAAAAAYo...",
  "oJJAAAAAAAAAAYo...",
  "oJAAAAAAAAAAAYo...",
  "oAAJJAAAAAAAYYo...",
  ".oAAJJAAAAAYYo....",
  "..oYAAAAAAYYo.....",
  "...ooYYYYYoo......",
  ".....ou.ou........",
  "....ouu.ouu.......",
  "....ooo.ooo.......",
];

// ねこ：オレンジのしま模様・ピンクの耳
const PIXELS_PET_CAT = [
  "...........o...o..",
  "..........oco.oco.",
  "..........ouuouuuo",
  ".........ouUUUUUuo",
  ".........oUTeUTeuo",
  ".........oUeeUeeuo",
  ".........oUcUUUcuo",
  "..o.......oUUMUgo.",
  ".ogo.....oUUUUUUo.",
  ".ogo...ooUgUUUgUo.",
  "..og.oouUUUUUUUgo.",
  "..ogouuUUgUUgUUgo.",
  "...ouuuuUUUUUUUgo.",
  "...ouuguuUUoUUUgo.",
  "...ogguugUUoUUggo.",
  "....oooooooooooo..",
];

// うさぎ：白い毛・ピンクの長い耳
const PIXELS_PET_RABBIT = [
  "..........oo.oo...",
  ".........oOcooOco.",
  ".........oOcooOco.",
  ".........oOcooOco.",
  ".........oOOooOOo.",
  "........oOOOOOOOPo",
  "........oOTeOTeOPo",
  "........oOeeOeeOPo",
  "........oOcOMOcOPo",
  "...oo...ooOOOOOPo.",
  "..oTOooOOOOOOOOPo.",
  "..oOOOOOOOOOOOOPo.",
  "...ooOOOOOOOOOPPo.",
  "....oPOOOOOOOPPo..",
  "....oPPoPPPPoPPo..",
  ".....ooo.oooo.oo..",
];

// ペンギン：こい灰色の背中・白いおなか・黄色いくちばしと足
const PIXELS_PET_PENGUIN = [
  "......oooooo......",
  ".....o999999o.....",
  "....o99999999o....",
  "....o99OOTO9eo....",
  "....o9OOOTeOOoAAo.",
  "....o9OOOOOOOoAo..",
  "...o99OcOOOcOo....",
  "..o999OOOOOOO9o...",
  "..o99OOOOOOOOO9o..",
  "..o99OOOOOOOOO9o..",
  "..o99OOOOOOOOO9o..",
  "...o9OOOOOOOOO9o..",
  "...o99OOOOOOO99o..",
  "....o99OOOOO99o...",
  "....oAAoooooAAo...",
  "....ooooo.ooooo...",
];

// ちびドラゴン：緑のうろこ・小さなつばさ・白い角
const PIXELS_PET_DRAGON = [
  "...........o..o...",
  "..........oOooOo..",
  ".....oo...o8FFFFo.",
  "....o88o.o8FFTeFo.",
  "...o8FFFoo8FFeeFFo",
  "...o8FFFFoFFFFFFFo",
  "....oFFFoFFFFcFMFo",
  ".....ooFFFFFFFFoo.",
  "....o8FFFFUUUFFo..",
  "...o8FFFFUUuUUFo..",
  "...oFFFFFUuUUUFo..",
  ".ooiFFFFFUUUUFio..",
  "oFoiiFFFFFFFFiio..",
  ".ooiiiFFiiFFiio...",
  "....oOOio.oOOio...",
  "....ooooo.ooooo...",
];

// いぬ：茶色の毛・たれ耳・赤い首輪
const PIXELS_PET_DOG = [
  "..........oooooo..",
  ".........otttttCo.",
  "........oLtttttCLo",
  "........oLtTettTeo",
  "........oLteetteeo",
  ".........otttOOOOo",
  ".........ottOOOeOo",
  "..o.......otOcMOo.",
  ".oto.....oRRRYRRRo",
  ".otCo..ooCtttttCCo",
  "..oCCooCCtttttCCLo",
  "...oCCCCCttttttCLo",
  "...oCCCCCttttttCLo",
  "...oCLCCCCttCCCCLo",
  "...oLLCCLCttoCtLLo",
  "....oooooooooooooo",
];

// ハムスター：うすいオレンジの毛・白いおなか・ピンクのほっぺ
const PIXELS_PET_HAMSTER = [
  "..................",
  "..................",
  "..................",
  ".........oo...oo..",
  "........oUco.oUco.",
  "........oUUooUUUo.",
  ".......oUUUUUUUUUo",
  "......oUUUTeUUTeUo",
  "......oUUUeeUUeeUo",
  ".....oUUccUUUUccUo",
  ".....oUOOOOOMOOUUo",
  "....oUOOOOOOOOOOUo",
  "....oUUOOOOOOOOUUo",
  "....oNUUOOOOOOUUNo",
  ".....oNNoUUUUoNNo.",
  "......ooooooooooo.",
];

// きつね：オレンジの毛・白い口もととしっぽの先
const PIXELS_PET_FOX = [
  "..........o....o..",
  ".........ogo..ogo.",
  ".........ogdoogdo.",
  "........oguuuuuugo",
  "........ouuTeuuTeo",
  "........ouueeuueeo",
  "........oOOOuuOOOo",
  ".........oOOMOOOo.",
  "uo......oguuuuuo..",
  "uuo....oguuuuuuo..",
  "ouuo..oguuOOuuuo..",
  "oOuuooguuOOOuuuo..",
  ".oOuuuuuuOOOuugo..",
  "..oOuuguuuuuuggo..",
  "...oooggoggoggo...",
  "......ooooooooo...",
];

// ふくろう：茶色の羽・大きな黄色い目
const PIXELS_PET_OWL = [
  "..................",
  "....oo........oo..",
  "....oLo......oLo..",
  "....oCLoooooooLCo.",
  "....oCtttttttttCo.",
  "...oCttVVttttVVtCo",
  "...oCtVTeVttVTeVCo",
  "...oCtVeeVttVeeVCo",
  "...oCCtVVtAAtVVCCo",
  "...oCCCtttAAttCCCo",
  "..oLCCttttttttCCLo",
  "..oLCCttttttttCCLo",
  "..oLLCCttttttCCLLo",
  "...oLLCCCCCCCCLLo.",
  "....ooAAooooAAoo..",
  ".....oooo..oooo...",
];

// ちびユニコーン：白い体・金の角・紫と青のたてがみ
const PIXELS_PET_UNICORN = [
  "...............oo.",
  "..............oJo.",
  ".............oJAo.",
  "..........oo.oAo..",
  ".........op6ooOOo.",
  "........op6pOOOOOo",
  ".......op6zpOTeOOo",
  ".......o6zzpOeeOOo",
  ".......oazzzOOOcOo",
  "........oaazOOOOOo",
  "..oo.....oaOOOOOo.",
  ".op6oooooOOOOOPo..",
  ".oz6OOOOOOOOOOPo..",
  "..ooOOOOOOOOOPPo..",
  "....oPOoPPPPoPOo..",
  "....oAAoAAo.oAAo..",
];

// パンダ（ショップ限定）：白黒のちびパンダ
const PIXELS_PET_PANDA = [
  ".........oo...oo..",
  "........o99o.o99o.",
  "........oOOOOOOOo.",
  ".......oOO99OO99Oo",
  ".......oO9Te99Te9o",
  ".......oOO99OO99Oo",
  ".......oOOcOeOcOOo",
  "..oo....oOOOOOOOo.",
  ".o99ooo99OOOOOOO9o",
  "o9999o99OOOOOOOO9o",
  "o999999OOOOOOOOO9o",
  "o99999OOOOOOOOOP9o",
  ".o9999OOOOOOOOPP9o",
  "..o999oPPPPPPo99o.",
  "..o999o......o99o.",
  "...ooo........ooo.",
];

// ちびフェニックス（ショップ限定）：赤と金色の、燃える小鳥
const PIXELS_PET_PHOENIX = [
  "...........oVo....",
  "..........oVAVo...",
  ".........oaRRRRo..",
  ".........oRRTeRoAo",
  ".........oRRRRRoAo",
  "..........oRRRQo..",
  "oo......ooRRRRQo..",
  "oVoo..ooaRRRRRQo..",
  "oAVVooaaRRRRRRQo..",
  ".oAVVVaRRRAARRQo..",
  "..oAAaRRRAAARRQo..",
  "...ooaRRRRRRRQo...",
  ".....oQRRRRQQo....",
  "......ooQQQoo.....",
  ".......oA.oA......",
  "......oAA.oAA.....",
];

// ペットの表（なかまの一覧は、この順に並ぶ。卵のランク（rank）の順に書く）
const PETS = [
  { id: "slime", icon: "🫧", name: "ちびスライム", rank: 1, pixels: PIXELS_PET_SLIME }, // 最初からいるペット
  { id: "chick", icon: "🐤", name: "ひよこ", rank: 1, pixels: PIXELS_PET_CHICK },
  { id: "cat", icon: "🐱", name: "ねこ", rank: 1, pixels: PIXELS_PET_CAT },
  { id: "dog", icon: "🐶", name: "いぬ", rank: 1, pixels: PIXELS_PET_DOG },
  { id: "hamster", icon: "🐹", name: "ハムスター", rank: 1, pixels: PIXELS_PET_HAMSTER },
  { id: "rabbit", icon: "🐰", name: "うさぎ", rank: 2, pixels: PIXELS_PET_RABBIT },
  { id: "penguin", icon: "🐧", name: "ペンギン", rank: 2, pixels: PIXELS_PET_PENGUIN },
  { id: "fox", icon: "🦊", name: "きつね", rank: 2, pixels: PIXELS_PET_FOX },
  { id: "owl", icon: "🦉", name: "ふくろう", rank: 2, pixels: PIXELS_PET_OWL },
  { id: "dragon", icon: "🐲", name: "ちびドラゴン", rank: 3, pixels: PIXELS_PET_DRAGON },
  { id: "unicorn", icon: "🦄", name: "ちびユニコーン", rank: 3, pixels: PIXELS_PET_UNICORN },
  // ここから下は、ショップ限定のペット（卵からはかえらない。shop: true、price は値段）
  { id: "panda", icon: "🐼", name: "パンダ", rank: 4, pixels: PIXELS_PET_PANDA, shop: true, price: 1500 },
  { id: "phoenix", icon: "🐦‍🔥", name: "ちびフェニックス", rank: 4, pixels: PIXELS_PET_PHOENIX, shop: true, price: 3000 },
];

// 持っている卵の数（{ white: 2, gold: 1 } のような形）
let eggs = {};

// タイマーにセットしている卵（{ type: "blue", progress: 1 } のような形。セットしていないときは null）
// progress は、セットしてから集中タイムを終えた回数
let settingEgg = null;

// 仲間になったペットと、その数（{ cat: 1, chick: 2 } のような形）
let pets = {};

// 連れていけるペットの数
const MAX_ACTIVE_PETS = 2;

// 最初から仲間にいるペット（初めての人は、この2匹を連れていく状態で始まる）
const STARTER_PETS = ["slime", "cat"];

// ペットのレベル：Lv1〜Lv5 になるのに必要な「なかよし」（連れているあいだに撃破した数）
const PET_LEVEL_STEPS = [0, 5, 15, 30, 50];

// ペットが Lv5（いちばん上）になったときに、もらえるコイン
const PET_MAX_LEVEL_COINS = 100;

// Lv5 のペットの頭の上に出す、金の王冠のドット絵（7×5マス。まん中に赤い宝石）
const PIXELS_PET_CROWN = ["o..o..o", "jo.j.oj", "AjoAojA", "AAARAAA", "YmmmmmY"];

// 王冠を「はずしている」ペットの種類（{ cat: true } のような形。はじめは、どのペットもつけている）
let petCrownOff = {};

// ペットの種類ごとの「なかよし」の数（{ cat: 12, slime: 3 } のような形）
let petFriendship = {};

// レベルが上がったペットの演出を、撃破の演出のあとに出すために、ためておく（[{ petId, level }] の形）
let pendingPetLevelUps = [];

// 連れていくペットの id の配列（["hamster", "cat"] のような形。連れていかないときは []）
// 同じ id が2つ入っていたら、同じ種類を2匹連れている
let activePets = [];

// 装備する部位の表（図鑑の「そうび：…」に、この順で並べる）
const EQUIP_SLOTS = [
  { slot: "head", name: "頭" },
  { slot: "weapon", name: "武器" },
  { slot: "shield", name: "盾" },
  { slot: "feet", name: "足" },
  { slot: "accessory", name: "アクセ" },
];

// 今装備しているアイテム（{ head: "king-crown", weapon: "steel-sword" } のような形）
let equipped = {};

// 装備したときに、キャラのドット絵（24×30マス）に重ねて描く絵
// x・y は絵を置く場所（左上のマス）、rows は設計図（「.」は塗らない）
// 主人公7種類は、顔・手・足の場所が同じなので、どのキャラにも同じ場所に重ねられる
const EQUIP_SPRITES = {
  // ここから下は、頭の装備（頭の上半分＝上から8行をおおう）
  "cloth-hat": {
    x: 2,
    y: 0,
    rows: [
      "........oo..........",
      ".......oTTo.........",
      "......ooTToo........",
      "....oozzzzBBBoo.....",
      "...ozzBBBBBBBBBxo...",
      "..ozBBBBBBBBBBBBBxo.",
      "ozzzzzzzzzzzzzzzzzzo",
      "oxxxxxxxxxxxxxxxxxxo",
    ], // 白いポンポンの付いた青いぼうし
  },
  "iron-helmet": {
    x: 2,
    y: 0,
    rows: [
      "........oooo........",
      "......ooWWssoo......",
      "....ooWWWssssDoo....",
      "...oWWsssssssssDo...",
      "..oWsssssssssssDDo..",
      ".oWsssssssssssssDDo.",
      "oDDDDDDDDDDDDDDDDDDo",
      "oDsDsDDsDDDDsDDsDsDo",
    ], // 鋲（びょう）の並んだ銀のかぶと
  },
  "wizard-hat": {
    x: 0,
    y: 0,
    rows: [
      "...............ooo......",
      "............oo677o......",
      "...........o6p77o.......",
      "........oo6ppp77o.......",
      "......oo66ppppp77o......",
      "....oo6pppppppppp77o....",
      "...o66pppppppppppp77o...",
      ".o6oYYYYYYYjYYYYYYYYo6o.",
      "o6ppp77777777777777ppp6o",
      "op77o..............o77po",
      "oooo................oooo",
    ], // 金のふちの、紫のとんがり帽子（とんがりの下はしは18マスで、左右に少しつばが見える。つばは前髪の場所で、左右のはしがふんわり下にたれる）
  },
  "king-crown": {
    x: 2,
    y: 0,
    rows: [
      "oo.......oo.......oo",
      "oVo.....oVVo.....oVo",
      "oYjo...ojAAjo...ojYo",
      "oYAjoooYAAAAYooojAYo",
      "oYAAjAAAAAAAAAAjAAYo",
      "oYAAARRAABBAARRAAAYo",
      "oYYYYYYYYYYYYYYYYYYo",
      "ommmmmmmmmmmmmmmmmmo",
    ], // 赤と青の宝石の、大きな金の冠
  },

  // ここから下は、武器（右手に持つ。右はしの3列）
  "wood-stick": {
    x: 21,
    y: 9,
    rows: ["ooo", "oCo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "oGo", "ooo"], // 木の棒（こい茶色のふちどり付き）
  },
  "hand-axe": {
    x: 21,
    y: 9,
    rows: ["o.o", "sos", "sGW", "sGW", "sos", "o.o", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".o."], // 両側に刃のある手おの
  },
  "steel-sword": {
    x: 21,
    y: 4,
    rows: [".o.", "oWo", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "oWs", "YYY", ".G.", ".G.", ".Y."], // 銀の剣（左にふちどり）
  },
  "hunter-bow": {
    x: 21,
    y: 9,
    rows: ["L..", "WL.", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "W.L", "WL.", "L.."], // 弓（こげ茶色）と、白っぽい弦
  },
  "trident": {
    x: 19,
    y: 0,
    rows: [
      "s.s.s",
      "s.s.s",
      "W.s.W",
      "sssss",
      "..s..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..G..",
      "..s..",
    ], // 三つ又の槍
  },
  "magic-staff": {
    x: 21,
    y: 3,
    rows: [".6.", "6Tp", "6pp", "p77", ".7.", ".Y.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".o."], // 先に紫の玉が付いた杖
  },
  "legend-sword": {
    x: 21,
    y: 1,
    rows: [".o.", "oTo", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "oTl", "YjY", "YBY", ".G.", ".G.", ".B."], // 光る水色の長い剣（左にふちどり）
  },

  // ここから下は、盾（左手に持つ。聖騎士の盾と同じ場所）
  "iron-shield": {
    x: 0,
    y: 17,
    rows: ["ooooooo", "oWWssDo", "oWsDsDo", "oWDYDDo", "oWsDsDo", "oWsssDo", "oWsssDo", ".osDDo.", "..ooo.."], // 鉄の盾（まん中に金の飾り）
  },

  // ここから下は、足の装備（ブーツの上に重ねる）
  "travel-boots": { x: 5, y: 26, rows: ["..obCbo..obCbo", ".obCbbo..obbCbo", "oLbbbbo..obbbbLo"] }, // こげ茶色のブーツ
  "leather-boots": { x: 5, y: 26, rows: ["..oCtCo..oCtCo", ".oCtCCo..oCCtCo", "oLCCCCo..oCCCCLo"] }, // 明るい茶色のブーツ
  "swift-shoes": { x: 5, y: 26, rows: [".TofFfo..ofFfoT", "TofFffo..offFfoT", "oiffffo..offffio"] }, // 白い羽の付いた緑のくつ

  // ここから下は、アクセサリー
  "leather-gloves": { x: 4, y: 20, rows: ["CC............CC", "Lb............bL"] }, // 両手の茶色の手袋（手首まで）
  "scarf": { x: 7, y: 16, rows: ["oaaaRRRRRo", "oQQQQRaRQo", ".....oRQo.", "......oo.."] }, // 首の赤いマフラー
  "power-ring": { x: 4, y: 21, rows: ["Ar"] }, // 左手の金の指輪（赤い石）
  "charm": { x: 9, y: 17, rows: [".oo.", "ozBo", "oBxo", ".oo."] }, // 胸の青いお守り
  "sage-crystal": { x: 0, y: 1, rows: [".6.", "6Tp", "6pp", "p77", ".7."] }, // 頭の左横にうかぶ紫の水晶

  // ここから下は、ショップ限定の装備
  "star-crown": {
    x: 2,
    y: 0,
    rows: [
      "...o.....oo.....o...",
      "..oVo...oVVo...oVo..",
      ".oVjVo.oVjjVo.oVjVo.",
      "oooVoooooVVoooooVooo",
      "oYAAjAAAAAAAAAAjAAYo",
      "oYAVAAAAVVVVAAAAVAYo",
      "oYYYYYYYYYYYYYYYYYYo",
      "ommmmmmmmmmmmmmmmmmo",
    ], // 光る星がならんだ、金のかんむり
  },
  "flame-sword": {
    x: 21,
    y: 1,
    rows: [".o.", "oVo", "oVa", "oVa", "oVR", "oVa", "oVa", "oVR", "oVa", "oVa", "oVR", "oVa", "oVa", "oVR", "oVa", "oVa", "oVR", "QYQ", "YRY", ".G.", ".G.", ".R."], // 赤とオレンジに光る炎の剣
  },
  "rainbow-shield": {
    x: 0,
    y: 17,
    rows: ["ooooooo", "oRRRRRo", "ouuuuuo", "oAAAAAo", "oFFFFFo", "oBBBBBo", "opppppo", ".o666o.", "..ooo.."], // 虹色のしまもようの盾
  },
  "angel-wings": {
    x: 0,
    y: 11,
    behind: true, // キャラのうしろ（何も描いていないマスだけ）に描く
    rows: [
      "..oo................oo..",
      ".oTo................oTo.",
      "oTTo................oTTo",
      "oTOo................oOTo",
      "oTOo................oOTo",
      "oOTo................oTOo",
      "oTOo................oOTo",
      "oTOP................POTo",
      "oOPo................oPOo",
      ".oPo................oPo.",
      ".oTo................oTo.",
      "..oo................oo..",
    ], // 背中の左右の、白い羽
  },
};

// 今、モンスターが点滅して消えている途中かどうか
let isMonsterDying = false;

// モンスターが消え終わるまでの待ち時間の番号（連打したとき、やり直すために使う）
let monsterDyingTimer = null;

// モンスターが点滅して消えるまでの長さ（ミリ秒。style.css の monster-blink の長さと合わせる）
const MONSTER_DYING_TIME = 500;

// 音を作るための道具（最初に撃破したときに1回だけ用意する）
let audioContext = null;

// 効果音の大きさのつまみ（全部の効果音は、ここを通ってからスピーカーに行く。音の道具を用意したときに作る）
let effectVolumeNode = null;

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

// レアモンスターがあらわれたときの「キラキラリーン♪」の表
// frequency は音の高さ、start は鳴らし始める時刻（秒）、length は余韻が消えるまでの長さ（秒）
const SPARKLE_NOTES = [
  { frequency: 1046.5, start: 0.0, length: 0.35 }, // 高いド
  { frequency: 1318.51, start: 0.05, length: 0.35 }, // 高いミ
  { frequency: 1567.98, start: 0.1, length: 0.35 }, // 高いソ
  { frequency: 2093.0, start: 0.15, length: 0.35 }, // もっと高いド
  { frequency: 2637.02, start: 0.2, length: 0.35 }, // もっと高いミ
  { frequency: 3135.96, start: 0.25, length: 0.35 }, // もっと高いソ
  { frequency: 4186.01, start: 0.3, length: 0.6 }, // いちばん高いド（リーン♪と長めにのばす）
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
  A: "#f2c230", // ゴールデンスライムの体（金色）
  J: "#fff4b0", // ゴールデンスライムのつや（うすい黄色）
  T: "#ffffff", // キラキラ（白）
  s: "#aab4be", // 装備：鋼の剣・鉄の盾・弓の弦（銀色）
  l: "#8fe3ff", // 装備：伝説の剣の刃（光る水色）
  b: "#5a3a1e", // 装備：旅人のブーツ（こげ茶色）
  p: "#9b59b6", // 装備：賢者の水晶（紫）

  // ここから下は、新しい描き方（24×32マス）のキャラで使う色
  // 1つの色を、明るい・ふつう・影 の2〜3段階に分けて、立体的に見せます
  o: "#3b2314", // ふちどり（真っ黒ではなく、こい茶色）
  y: "#f7e08a", // 麦わら帽子（明るい）
  n: "#e2b84c", // 麦わら帽子（ふつう）
  m: "#a87b2a", // 麦わら帽子（影）
  h: "#c07a3e", // 髪（明るい）。ふつうは H、影は d
  d: "#5a2e12", // 髪（影）
  k: "#e0a87a", // はだ（影）。ふつうは S
  w: "#ffffff", // 白目
  e: "#2b1a10", // 黒目
  c: "#f4a6a6", // ほっぺ（ピンク）
  t: "#c69458", // 服（明るい）。ふつうは C、影は L
  q: "#4a5a78", // ズボン（ふつう）
  v: "#33415c", // ズボン（影）
  j: "#fff1a8", // 金色の髪（明るい）。ふつうは A、影は Y
  z: "#6fa3f0", // 青いよろい（明るい）。ふつうは B
  x: "#1d3f8a", // 青いよろい・青い目（影）
  a: "#e8604c", // 赤いよろい（明るい）。ふつうは R、影は Q
  r: "#a33a1f", // 赤茶色の目
  u: "#e08a5a", // 赤茶色の髪（明るい）
  g: "#b5502e", // 赤茶色の髪（ふつう）。影は d
  f: "#2e9e5b", // 緑の目（明るい）
  i: "#1d6b3c", // 緑の目（影）
  // アルファベットを全部使ったので、ここからは数字で色を決めます
  1: "#ece8f8", // 銀白色の髪（明るい）
  2: "#bdb6da", // 銀白色の髪（ふつう）
  3: "#7f78a8", // 銀白色の髪（影）
  4: "#e0a010", // 金色の目（明るい）
  5: "#8a5a00", // 金色の目（影）
  6: "#c08ad8", // 紫（明るい）。魔法使いの帽子・杖・水晶。ふつうは p
  7: "#5e2d7a", // 紫（影）
  8: "#a3d977", // 緑（明るい）。ゴブリンの肌。ふつうは F、影は i
  9: "#4b5260", // こい灰色。オオカミの毛の影
};

// 見習い冒険者のドット絵の設計図（16×16マス）
// 1文字が1マスで、文字によって塗る色が決まります（「.」は塗らない）
// 麦わら帽子・茶色の服・木の棒
// 見習い冒険者は、新しい描き方（24×30マスの縦長。足が短い約2頭身。大きな目、3段階の色の髪と帽子、こい茶色のふちどり）
// 麦わら帽子（赤いリボン）・茶色の髪・茶色のチュニック・青いズボン・ブーツ・木の棒
const PIXELS_NOVICE = [
  "........oooooooo........",
  "......oonyyyyyynoo......",
  ".....onyyyyyyyyyynno....",
  "....onyyyyyyyyyyyynmo...",
  "....onRRRRRRRRRRRRRmo...",
  "..oonnnnnnnnnnnnnnnnmoo.",
  ".ommmmmmmmmmmmmmmmmmmmo.",
  "..ooHHhHHHHHHHHHHhHHoo..",
  "..oHHHdHHSSSSSSHHdHHHo..",
  "..oHHdSddSSSSSSddSdHHo..",
  "..oHdSSoooSSSSoooSSdHo..",
  "..oHdSSTeeSSSSTeeSSdHo..",
  "..oHdSSeeeSSSSeeeSSdHo..",
  "..oHdSccSSSkkSSSccSdHo..",
  "...odSSSSSSMMSSSSSSdo...",
  "....okkSSSSSSSSSSkko....",
  "........ookSSkoo.....G..",
  "....oottCCCCCCCCttoo.G..",
  "...ottCCCCttCCCCCCLLoG..",
  "...otCCCCCCCCCCCCCCLoG..",
  "...otCLLLLLYYLLLLLCLoG..",
  "...oSkoCCCCCCCCCCokSoG..",
  "....ooCtCCCCCCCCtCoo.G..",
  ".....oCCCCCCCCCCCCo..G..",
  ".....oLCLCLCLCLCLCo..G..",
  ".......oqqqo..oqqqo..G..",
  ".......ovqqo..oqqvo..G..",
  "......oLbLLo..oLLbLo.G..",
  ".....oLLLLLo..oLLLLLoG..",
  ".....ooooooo..ooooooo...",
];

// 戦士は、新しい描き方（24×30マス。見習い冒険者と同じ体の形）
// ツンツンとがった茶色の髪・赤いはちまき・太めのまゆ・革のよろいと肩当て・ななめのベルト・短い剣
const PIXELS_WARRIOR = [
  "......o.....o.....o.....",
  ".....oho...oho...oho....",
  "....ohHHo.ohHHo.ohHHo...",
  "...ohHHHHohHHHHohHHHHo..",
  "..ohHHHHHHHHHHHHHHHHHo..",
  "..oHHhHHHHHHHHHHHHHdHo..",
  "..oRRRRRRRRRRRRRRRRRRoR.",
  "..oQQQQQQQQQQQQQQQQQQo.R",
  "..oHHHdHHSSSSSSHHdHHHo..",
  "..oHHdSdddSSSSdddSdHHo..",
  "..oHdSSoooSSSSoooSSdHo..",
  "..oHdSSTeeSSSSTeeSSdHo..",
  "..oHdSSeeeSSSSeeeSSdHo..",
  "..oHdSccSSSkkSSSccSdHo..",
  "...odSSSSSSMMSSSSSSdoW..",
  "....okkSSSSSSSSSSkko.Ws.",
  "........ookSSkoo.....Ws.",
  "....oLCLLLLLLLLLLCLo.Ws.",
  "...oLLLCLLbbLLLLLCLLoWs.",
  "...oCLLLLLLbbLLLLLLLoWs.",
  "...oCLbbbbbYYbbbbbLLoYYY",
  "...oSkoLLLLbbLLLLokSoG..",
  "....ooLCLLLLLLLLCLoo.G..",
  ".....oLLLLLLLLLLLLo.....",
  ".....oLtLtLtLtLtLto.....",
  ".......oCCCo..oCCCo.....",
  ".......otCCo..oCCto.....",
  "......oLbLLo..oLLbLo....",
  ".....oLLLLLo..oLLLLLo...",
  ".....ooooooo..ooooooo...",
];

// 勇者は、新しい描き方（24×30マス。見習い冒険者と同じ体の形）
// 金の王冠（赤い宝石）・金色の髪・青い目・青いよろい（胸に金の飾り）・赤いマント・白いズボン・青いブーツ・長めの剣
const PIXELS_HERO = [
  ".......Y...YY...Y.......",
  ".......YA..AA..AY.......",
  ".......YAAARRAAAY.......",
  "......oYYYYYYYYYYo......",
  "...oojjAAAAAAAAAAjjoo...",
  "..ojjAAAAAAAAAAAAAAjjo..",
  "..oAAjAAAAAAAAAAAAjAAo..",
  "..oAAAAAAAAAAAAAAAAAAo..",
  "..oAAAYAASSSSSSAAYAAAoW.",
  "..oAAYSYYYSSSSYYYSYAAoWs",
  "..oAYSSoooSSSSoooSSYAoWs",
  "..oAYSSTBBSSSSTBBSSYAoWs",
  "..oAYSSxxxSSSSxxxSSYAoWs",
  "..oAYSccSSSkkSSSccSYAoWs",
  "...oYSSSSSSMMSSSSSSYo.Ws",
  "....okkSSSSSSSSSSkko..Ws",
  "........ookSSkoo......Ws",
  "...RozBBBBBBBBBBBBzoR.Ws",
  "...RozzBBBBYYBBBBzzoR.Ws",
  "...RoBBBBYYYYBBBBxxoR.Ws",
  "...RoBYYYYYYYYYYYYBoRYYY",
  "..RoSkoBBBBBBBBBBokSoRG.",
  "...RooBzBBBBBBBBzBooR.G.",
  "....RoOOOOOOOOOOOOoR....",
  "....RoPOPOPOPOPOPOoR....",
  ".......oOOOo..oOOOo.....",
  ".......oPOOo..oOOPo.....",
  "......oYYYYo..oYYYYo....",
  ".....oBBBBBo..oBBBBBo...",
  ".....ooooooo..ooooooo...",
];

// 聖騎士は、新しい描き方（24×30マス。見習い冒険者と同じ体の形）
// 青い羽かざりの銀のかぶと・こげ茶の目・銀のよろい（胸に青い十字）・左手に青い盾（金の十字）・右手に剣・銀のすね当て
// 銀色は空の色に近いので、明るい銀（O）・銀（P）・こい灰色（D）の3段階と、こい茶色のふちどりで、見えやすくしています
const PIXELS_PALADIN = [
  "..........zzB...........",
  ".........zBBo...........",
  "......oooooooooooo......",
  "....ooOOOOOOOOOOOPoo....",
  "...oOOOOOOOOOOOOOOPPo...",
  "..oOOPPPPPPPPPPPPPPPDo..",
  "..oOPPPPPPPPPPPPPPPPDo..",
  "..oPPDDDDDDDDDDDDDDPDo..",
  "..oPDHHHdSSSSSSdHHHDPo..",
  "..oPDSSddSSSSSSddSSDPoW.",
  "..oPDSSoooSSSSoooSSDPoWs",
  "..oPDSSTeeSSSSTeeSSDPoWs",
  "..oPDSSeeeSSSSeeeSSDPoWs",
  "..oPDSccSSSkkSSSccSDPoWs",
  "...oDSSSSSSMMSSSSSSDo.Ws",
  "....oDkSSSSSSSSSSkDo..Ws",
  "........ooPPPPoo......Ws",
  "oooooooPPPPPPPPPPOOo..Ws",
  "oBBYBBoPPPPBBPPPPPDo..Ws",
  "oBBYBBoPPBBBBBBPPPDo..Ws",
  "oYYYYYoPPPPBBPPPPPDo.YYY",
  "oBBYBBoYYYYYYYYYYYDo..G.",
  "oBBYBBoPPPPPPPPPPokSo.G.",
  "oBBYBBoDPPPPPPPPDPoo..G.",
  ".oBYBo.PPPPPPPPPPPo.....",
  "..ooo..PDPDPDPDPDPo.....",
  ".......oPPPo..oPPPo.....",
  ".......oDPPo..oPPDo.....",
  "......oPOPPo..oPPOPo....",
  ".....ooooooo..ooooooo...",
];

// 竜殺しの勇者は、新しい描き方（24×30マス。見習い冒険者と同じ体の形）
// 左右に反った金の角のこい灰色のかぶと・黒っぽい髪・赤茶色の目・太いまゆ・
// 赤いよろい（竜のうろこ模様・とがった肩当て）・黒いズボン・金のふちのブーツ・太くて大きな剣
const PIXELS_DRAGON_SLAYER = [
  "o......................o",
  "oAo..................oAo",
  "oAAo....oooooooo....oAAo",
  ".oYAo.ooDDDDDDDDoo.oAYo.",
  "..oYAoDDDDDDDDDDDDoAYo..",
  "..ooYDPPDDDDDDDDPPDYooW.",
  "..oDDPPDDDDDDDDDDPPDDoWs",
  "..oDDDDDDDDDDDDDDDDDDoWs",
  "..oDeeeSSSSSSSSSSeeeDoWs",
  "..oDeSeeeSSSSSSeeeSeDoWs",
  "..oDeSSoooSSSSoooSSeDoWs",
  "..oDeSSTrrSSSSTrrSSeDoWs",
  "..oDeSSrrrSSSSrrrSSeDoWs",
  "..oDeSSSSSSkkSSSSSSeDoWs",
  "...oDSSSSSSMMSSSSSSDo.Ws",
  "....oDkSSSSSSSSSSkDo..Ws",
  "........ooQQQQoo......Ws",
  "..oaoaaRRRRRRRRRRaaoaoWs",
  "...oaRRRQRRRRRRQRRRQo.Ws",
  "...oaRRQRQRRRRQRQRRQo.Ws",
  "...oaKKKKKYYKKKKKKKQoYYY",
  "...oSkoRRRRRRRRRRokSo.G.",
  "....ooRaRRRRRRRRaRoo..G.",
  ".....oQQQQQQQQQQQQo.....",
  ".....oQRQRQRQRQRQRo.....",
  ".......oKKKo..oKKKo.....",
  ".......oKKKo..oKKKo.....",
  "......oQYQQo..oQQYQo....",
  ".....oQQQQQo..oQQQQQo...",
  ".....ooooooo..ooooooo...",
];

// 伝説の英雄は、新しい描き方（24×30マス。見習い冒険者と同じ体の形）
// 赤茶色の長めの髪・金のサークレット（青い宝石）・緑の目・金のよろい（胸に白い宝石・大きめの肩当て）・
// 足もとまでの長い赤いマント・茶色のズボン・金のブーツ・剣
const PIXELS_LEGEND = [
  "........oooooooo........",
  "......oouuguuguuoo......",
  ".....oguuuuuuuuuugo.....",
  "...ogggguuuuuuuuggggo...",
  "..oggYYYYYYBBYYYYYYggo..",
  "..oggggggggggggggggggo..",
  "..oguggggggggggggggugo..",
  "..oggggggggggggggggggo..",
  "..oggdgguSSSSSSuggdggo..",
  "..oggdSddSSSSSSddSdggoW.",
  "..oggSSoooSSSSoooSSggoWs",
  "..oggSSTffSSSSTffSSggoWs",
  "..oggSSiiiSSSSiiiSSggoWs",
  "..oggSccSSSkkSSSccSggoWs",
  "..ogdSSSSSSMMSSSSSSdgoWs",
  "..oggokkSSSSSSSSkkoggoWs",
  "..oggo..ookSSkoo..oggoWs",
  "..RojjAAAAAAAAAAAAjjoRWs",
  "..RojAAAAAATTAAAAAAYoRWs",
  "..RoAAAAAAAAAAAAAAAYoRWs",
  "..RoYYYYYYYBBYYYYYYYoYYY",
  "..RoSkoAAAAAAAAAAokSoRG.",
  "..R.ooAjAAAAAAAAjAoo.RG.",
  "..RRRoAAAAAAAAAAAAoRRR..",
  "..RQRoYAYAYAYAYAYAoRQR..",
  "..RQR..oCCCo..oCCCoRQR..",
  "..RQQ..oCCCo..oCCCoQQR..",
  ".RQQ..oYAYYo..oYYAYoQQR.",
  ".RQQ.oYYYYYo..oYYYYYoQQR",
  ".....ooooooo..ooooooo...",
];

// 神話の勇者は、新しい描き方（24×30マス）
// 頭の上に光の輪・銀白色の長い髪・金色の目・白と金のよろい・胸の光る飾り・金のブーツ・光る剣
const PIXELS_MYTH = [
  "......AVVVVVVVVVVA......",
  ".....A..oooooooo..A.....",
  "......oo11111112oo...T..",
  ".....o211111111222o.....",
  "....o22111111112223o....",
  "...o2YYYYYYVVYYYYYY3o...",
  "..o221111211111111223o.T",
  "..o222122222222221223o..",
  "..o222322SSSSSS223222oj.",
  "..o223S33SSSSSS33S322ojV",
  "..o23SSoooSSSSoooSS32ojV",
  "..o23SST44SSSST44SS32ojV",
  "..o23SS455SSSS455SS32ojV",
  "..o23SccSSSkkSSSccS32ojV",
  "..o23SSSSSSMMSSSSSS32ojV",
  "..o22okkSSSSSSSSkko32ojV",
  "..o23o..ookSSkoo..o32ojV",
  "....ooYjOOOOOOOOjYoo..jV",
  "...ojjOOOOVVOOOOOOPPo.jV",
  "...ojOOOOOVVOOOOOOOPo.jV",
  "...oOYYYYYVVYYYYYYOPoYYY",
  "...oSkoOOOOOOOOOOokSo.G.",
  "....ooOTOOOOOOOOTOoo..G.",
  ".....oOOOOOOOOOOOOo.....",
  ".....oYOYOYOYOYOYOo.....",
  ".......oPPPo..oPPPo.....",
  ".......oDPPo..oPPDo.....",
  "......oYjYYo..oYYjYo....",
  ".....oYYYYYo..oYYYYYo...",
  ".....ooooooo..ooooooo...",
];

// 天空の勇者（Lv25〜）：新しい描き方（24×30マス）。空色の長い髪、銀のサークレット（水色の宝石）、青い目
// 白と空色のよろい（胸に水色の宝石）、星がちらばった紺色のマント、銀のズボン、空色のブーツ、光る水色の剣
const PIXELS_SKY_HERO = [
  "........oooooooo........",
  "......ooIIzIIzIIoo......",
  ".....ozIIIIIIIIIIzo.....",
  "...ozzzzIIIIIIIIzzzzo...",
  "..ozzWWWWWWllWWWWWWzzo..",
  "..ozzzzzzzzzzzzzzzzzzo..",
  "..ozIzzzzzzzzzzzzzzIzo..",
  "..ozzzzzzzzzzzzzzzzzzo..",
  "..ozzBzzISSSSSSIzzBzzo..",
  "..ozzBSBBSSSSSSBBSBzzol.",
  "..ozzSSoooSSSSoooSSzzolT",
  "..ozzSSlzzSSSSlzzSSzzolT",
  "..ozzSSxxxSSSSxxxSSzzolT",
  "..ozzSccSSSkkSSSccSzzolT",
  "..ozBSSSSSSMMSSSSSSBzolT",
  "..ozzokkSSSSSSSSkkozzolT",
  "..ozzo..ookSSkoo..ozzolT",
  "..xoTTOOOOOOOOOOOOTToxlT",
  "..xoTOOOOOOllOOOOOOzoxlT",
  "..xoOOOOOOOOOOOOOOOzoxlT",
  "..xozzzzzzzllzzzzzzzozzz",
  "..xoSkoOOOOOOOOOOokSoxG.",
  "..x.ooOTOOOOOOOOTOoo.xG.",
  "..xVxoOOOOOOOOOOOOoxVx..",
  "..xKxozOzOzOzOzOzOoxKx..",
  "..VKx..oPPPo..oPPPoxKx..",
  "..xKK..oPPPo..oPPPoKKV..",
  ".xKT..ozOzzo..ozzOzoKKx.",
  ".xKK.ozzzzzo..ozzzzzoKKx",
  ".....ooooooo..ooooooo...",
];

// 勇者王（Lv30〜）：新しい描き方（24×30マス）。赤い宝石の大きな金の王冠、金色の長い髪、赤い目
// 黒と金のよろい（胸に赤い宝石）、赤いマント、黒いズボン、金のブーツ、金色に光る剣
const PIXELS_HERO_KING = [
  ".....oo....oo....oo.....",
  ".....oVo..oVVo..oVo.....",
  "....oYAYooYAAYooYAYo....",
  "...oYAARAAAYYAAARAAYo...",
  "..oAAYYYYYYRRYYYYYYAAo..",
  "..oAAAAAAAAAAAAAAAAAAo..",
  "..oAjAAAAAAAAAAAAAAjAo..",
  "..oAAAAAAAAAAAAAAAAAAo..",
  "..oAAYAAjSSSSSSjAAYAAo..",
  "..oAAYSYYSSSSSSYYSYAAoV.",
  "..oAASSoooSSSSoooSSAAoVj",
  "..oAASSRaaSSSSRaaSSAAoVj",
  "..oAASSRRRSSSSRRRSSAAoVj",
  "..oAASccSSSkkSSSccSAAoVj",
  "..oAYSSSSSSMMSSSSSSYAoVj",
  "..oAAokkSSSSSSSSkkoAAoVj",
  "..oAAo..ookSSkoo..oAAoVj",
  "..RoDD999999999999DDoRVj",
  "..RoD999999RR999999YoRVj",
  "..Ro999999999999999YoRVj",
  "..RoYYYYYYYRRYYYYYYYoYYY",
  "..RoSko9999999999okSoRG.",
  "..R.oo9D99999999D9oo.RG.",
  "..RRRo999999999999oRRR..",
  "..RQRoY9Y9Y9Y9Y9Y9oRQR..",
  "..RQR..oKKKo..oKKKoRQR..",
  "..RQQ..oKKKo..oKKKoQQR..",
  ".RQQ..oY9YYo..oYY9YoQQR.",
  ".RQQ.oYYYYYo..oYYYYYoQQR",
  ".....ooooooo..ooooooo...",
];

// 称号（二つ名）の表。minLevel は「何レベルから」、pixels はキャラクターの設計図
// 高いレベルから順に書きます。1行足すと、称号を増やせます
const TITLES = [
  { minLevel: 30, icon: "🏆", name: "勇者王", pixels: PIXELS_HERO_KING },
  { minLevel: 25, icon: "🌌", name: "天空の勇者", pixels: PIXELS_SKY_HERO },
  { minLevel: 20, icon: "✨", name: "神話の勇者", pixels: PIXELS_MYTH },
  { minLevel: 15, icon: "🌟", name: "伝説の英雄", pixels: PIXELS_LEGEND },
  { minLevel: 10, icon: "🐉", name: "竜殺しの勇者", pixels: PIXELS_DRAGON_SLAYER },
  { minLevel: 7, icon: "🛡️", name: "聖騎士", pixels: PIXELS_PALADIN },
  { minLevel: 5, icon: "👑", name: "勇者", pixels: PIXELS_HERO },
  { minLevel: 3, icon: "⚔️", name: "戦士", pixels: PIXELS_WARRIOR },
  { minLevel: 1, icon: "🧑‍🌾", name: "見習い冒険者", pixels: PIXELS_NOVICE },
];

// モンスターのドット絵の設計図（新しい描き方・24×24マス。ボスのドラゴンだけ30×30マス）
// みんな、左にいるキャラの方を向いています

// スライム：青くてぷるぷる
const PIXELS_SLIME = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "..........oooo..........",
  "........oozzzzoo........",
  ".......ozzIIzZZZo.......",
  "......ozIIzZZZZZZo......",
  ".....ozIzZZZZZZZZZo.....",
  "....ozZZZZZZZZZZZZxo....",
  "...ozZoooZZoooZZZZZxo...",
  "...oZZTeeZZTeeZZZZZxo...",
  "..ozZZeeeZZeeeZZZZZZxo..",
  "..oZZZZZZMMZZZZZZZZZxo..",
  "..oZZZZZZZZZZZZZZZZZxo..",
  "..oZZZZZZZZZZZZZZZZZxo..",
  "..oxZZZZZZZZZZZZZZZxxo..",
  "...oxxxxZZZZZZZZxxxxo...",
  "....oooooooooooooooo....",
];

// コウモリ：紫のつばさ・小さなキバ（空をとんでいる）
const PIXELS_BAT = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "oo....................oo",
  "o7o.......o..o.......o7o",
  "o77o.....o6oo6o.....o77o",
  "o7p7o...o666666o...o7p7o",
  "o7pp7o.o66666666o.o7pp7o",
  "o7ppp7oo6eV66eVpoo7ppp7o",
  "o7pppp7o6pMMppp7o7pppp7o",
  "o7pppppo6pTpTpp7oppppp7o",
  "o7p7op7o6pppppp7o7po7p7o",
  "oo...ooo7pppppp7ooo...oo",
  "........o7pppp7o........",
  ".........o7777o.........",
  ".........o.oo.o.........",
  "........................",
  "........................",
  "........................",
];

// おばけキノコ：赤いかさに白い水玉・怒った目
const PIXELS_MUSHROOM = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........oooooooo........",
  "......ooaaRRRRRRoo......",
  ".....oaaTTaRRRRRRRo.....",
  "....oaaTTTTaRRRTTRRo....",
  "...oaRRTTaRRRRRTTTTRo...",
  "..oaRRRRRRRRTTRRRRRRQo..",
  "..oRTTRRRRRRRRRRRTTRQo..",
  "..oQRRRRRRRRRRRRRRRQQo..",
  "...ooQQQQQQQQQQQQQQoo...",
  "......oOOOOOOOOOPo......",
  "......oOoOOOOoOPPo......",
  "......oOeoOOoeOPPo......",
  "......oOeeOOeeOPPo......",
  "......oOOOMMOOOPPo......",
  "......oOOOOOOOOPPo......",
  ".....oOOOOOOOOOOPPo.....",
  ".....oOOOOOOOOOOPPo.....",
  ".....oPOOOOOOOOPPDo.....",
  ".....oooooooooooooo.....",
];

// ゴブリン：緑の肌・とがった耳・こん棒
const PIXELS_GOBLIN = [
  "........................",
  "........................",
  "........................",
  "........oooooo..........",
  "......oo888FFFoo........",
  "oo...o88FFFFFFFio....oo.",
  "o8o.o8FFFFFFFFFFio..oFo.",
  ".o8oo8ooFFFooFFFiooFio..",
  "..o88FTVeFFTVeFFFFFio...",
  "...oFFVVeFFVVeFFFFio....",
  "....oFFFFFFFFFFFFFio....",
  "....oFFFMTMTMFFFFio.....",
  ".....ooFFFFFFFFiio......",
  "...GG..ooiFFFiioo.......",
  "..GGCo.oCCtCCCCLLo......",
  "..GCLooCCCCCCCCCLLo.....",
  "...GLo8oCCCCCCCCLoFo....",
  "...oo88oLLYLLLLLLoFo....",
  "....ooo.oCCCCCCCCooo....",
  "........oCLCLCLCLo......",
  ".........oFFo.oFFo......",
  ".........oiFo.oFio......",
  "........oLLLo.oLLLo.....",
  "........ooooo.ooooo.....",
];

// ガイコツ：白い骨・さびた剣
const PIXELS_SKELETON = [
  "........oooooooo........",
  ".......oTTOOOOOOo.......",
  "......oTOOOOOOOOPo......",
  "......oOOOOOOOOOPo......",
  "......oOeeOOOeeOPo......",
  "......oOerOOOerOPo......",
  "......oOOOOeOOOOPo......",
  ".......oOTOTOTOPo.......",
  ".......oPOPOPOPPo.......",
  "........oooooooo........",
  "..W......oOPPOo.........",
  "..sW...ooOOOOOOoo.......",
  "...sW.oOoOOOOOOoOo......",
  "....sWOooPOOOOPooOo.....",
  ".....GG.oOPOOPOo.oOo....",
  "....oGGo.oOOOOo...oOo...",
  ".....oo..oPOOPo...oo....",
  ".........oOOOOo.........",
  "..........oooo..........",
  "..........oO.Oo.........",
  ".........oOo.oOo........",
  ".........oOo.oOo........",
  "........oOOo.oOOo.......",
  "........ooooo.oooo......",
];

// オオカミ：灰色の毛・光る目・キバ
const PIXELS_WOLF = [
  "........................",
  "........................",
  "........................",
  "........................",
  "....o...o...............",
  "...oPo.oPo..............",
  "...oPDooPDo.............",
  "..oPDDDDDDDo..........o.",
  ".oPDDDDDDDDDo........oPo",
  ".oPDVVeDDDDD9o.......oDo",
  "oPDDDDDDDDDDD9o......oDo",
  "o9DDDDDDDDDDDD9oooooo9Do",
  "oMTTDDDDDDDDDDDDDDDDD9Do",
  ".oTMMTDDDDDDDDDDDDDDDD9o",
  "..ooooDDDDDDDDDDDDDDDD9o",
  ".....oPDDDDDDDDDDDDDDD9o",
  ".....oPPDDDDDDDDDDDDD99o",
  ".....oPPPDDDDDDDDDDD999o",
  "......oPPDDDDDDDDDD999o.",
  "......oPDo.......oDD9o..",
  "......oPDo.......oDD9o..",
  "......oPDo.......oD99o..",
  ".....oPPDo......oPDD9o..",
  ".....ooooo......oooooo..",
];

// ゴーレム：岩の体（こけが生えている）・光る目・太いうで
const PIXELS_GOLEM = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  ".......oooooooo.........",
  "......oWWWPPPPPDo.......",
  ".....oWPPPPPPPPPDo......",
  ".....oWPVVPPVVPPDo......",
  ".....oPPPPPPPPPPDo......",
  ".....oPPDDDDDDPPDo......",
  "..oooooPPPPPPPPDDoooo...",
  ".oWWPPofWPPPPPPPPDoPPDo.",
  "oWPPPPoWPPPPffPPPDDoPPDo",
  "oPPPPDoWPPPPPfPPPPDoPDDo",
  "oPPPDDoPPPPPPPPPPPDoDDDo",
  "oWPPDDoPPWPPPPPPPDDoPDDo",
  "oPPPDoooPPPPPPPPPDDooDDo",
  ".oooo..oPPPPDDPPPDo.ooo.",
  ".......oPPPDooPPDDo.....",
  "......oWPPDo..oPPDDo....",
  "......oPPPDo..oPPPDo....",
  ".....oWPPPDo..oPPPDDo...",
  ".....ooooooo..ooooooo...",
];

// ゴースト：白いおばけ・青白い炎
const PIXELS_GHOST = [
  "........................",
  "........................",
  "........................",
  "........................",
  "........................",
  "........oooooo......l...",
  ".l....ooTTOOOOoo...lzl..",
  "lzl..oTTOOOOOOOOo..zBz..",
  "zBz.oTOOOOOOOOOOIo..z...",
  ".z.oTOeeOOOeeOOOOIo.....",
  "...oOOeeOOOeeOOOOOIo....",
  "...oOOOOOeeeOOOOOOIo....",
  "..oOOOOOOOOOOOOOOOOIo...",
  ".oTOOOOOOOOOOOOOOOOOOIo.",
  "oOOooOOOOOOOOOOOOOOIIo..",
  ".oo.oOOOOOOOOOOOOOOIIo..",
  "....oOOOOOOOOOOOOOIIIo..",
  "....oIOOOOOOOOOOOIIIzo..",
  ".....oIIOOOOOOOIIIzzo...",
  "......oIIIOIIIIIzzzo....",
  ".......oIzo.oIIzo.ozo...",
  "........oo...ooo...o....",
  "........................",
  "........................",
];

// オーガ：赤い肌の大きな体・角・キバ・太いこん棒
const PIXELS_OGRE = [
  "........................",
  "........................",
  "........................",
  "........................",
  "....oo........oo........",
  "ooo.oPo......oPo........",
  "oCGo.oPooooooPo.........",
  "oCGoaaRRRRRRRRQo........",
  "oCGoaRooRRRooRRRQo......",
  "oGLoaRVeRRRVeRRRQo......",
  ".oGoRRRRRRRRRRRRQo......",
  ".oGoRTMMMMMTRRRRQo......",
  ".oGooRRRRRRRRRQQo.......",
  ".oGoooaRRRRRRRQoooo.....",
  ".oaRRoaRRRRRRRRRQoRRQo..",
  "oaRRRoRRRRRRRRRRQQoRRQo.",
  "oRRRQoRRRRRRRRRRRQoQRQo.",
  "oaRQQoQRRRRRRRRRQQoQQQo.",
  ".ooo.oLLCLLCLLCLLLo.ooo.",
  ".....oLCLLCLLCLLLLo.....",
  "......oRRRo..oRRQo......",
  "......oRRQo..oRRQo......",
  ".....oLLLLo..oLLLLo.....",
  ".....oooooo..oooooo.....",
];

// ドラゴン（ボス・30×30マス）：赤いうろこ・角・光る目・キバ・大きなつばさ・しっぽ
const PIXELS_DRAGON = [
  "...o.....o.........ooo........",
  "..oOo...oOo.......opppo.......",
  "...oPo...oPo.....op7pppoo.....",
  "....oPoooooPo...op7ppppppoo...",
  "...oaaRRRRRRRo.op7pppppppppoo.",
  "..oaRRooRRRRRRop7pppp7pppppppo",
  ".oaRRRVeRRRRRQop7pppp7pppp7ppo",
  "oaRRRRVVRRRRRQop7ppp7pppp7pppo",
  "oRRRRRRRRRRRRRQop7pp7pppp7ppo.",
  "oRRRRRRRRRRRRRQoop7p7ppp7ppo..",
  "oTRTRTRTQQQRRRRQo77pp7pp7po...",
  "oMMMMMMMMoQRRRRRQoo7pp7ppo....",
  "oTRTRTRTQoQRRaRRRQoo77ppo.....",
  ".oooooooooQRRUURRRQooppo......",
  ".........oQRUUUURRRRQooo......",
  "........oQRUuUUURRRRRQo.......",
  "........oQRUUuUURRRRRRQo......",
  ".......oQRRUUUuURRRRRRRQo.....",
  ".......oQRRUuUUURRRRRRRRQo....",
  "....oooQRRUUUuURRRRRRRRRQo....",
  "...oOOoQRRUUUUURRRRRRRRRQo....",
  "..oOoORoQRRUUURRRRRRRRRRQo..oo",
  "...o.ooQQRRRRRRRRRRRRRRQQo.oRo",
  ".......oQQRRRRRRRRRRRRQQoooaRo",
  ".......oQRRRRQQQQQRRRRRRRRRQo.",
  "......oQRRRRQo...oQRRRRRRQQo..",
  "......oQRRRQo....oQRRRQooo....",
  ".....oQRRRRQo...oQRRRRQo......",
  "....oOoOoOQo....oOoOoOQo......",
  "....ooooooo.....oooooooo......",
];

// ゴールデンスライム（レア）：金色のスライム。まわりにキラキラ
const PIXELS_GOLDEN_SLIME = [
  "........................",
  "........................",
  "........................",
  "........................",
  "...T..................T.",
  "..TTT................TTT",
  "...T..........T.......T.",
  ".............TTT........",
  "..............T.........",
  "..........oooo..........",
  "........ooJJJJoo........",
  ".......oJJTTJAAAo.......",
  "......oJTTJAAAAAAo......",
  ".....oJTJAAAAAAAAAo.....",
  "....oJAAAAAAAAAAAAYo....",
  "...oJAoooAAoooAAAAAYo...",
  "...oAATeeAATeeAAAAAYo...",
  "..oJAAeeeAAeeeAAAAAAYo..",
  "..oAAAAAAMMAAAAAAAAAYo..",
  "T.oAAAAAAAAAAAAAAAAAYo.T",
  "T.oAAAAAAAAAAAAAAAAAYo.T",
  "..oYAAAAAAAAAAAAAAAYYo..",
  "...oYYYYAAAAAAAAYYYYo...",
  "....oooooooooooooooo....",
];

// モンスターの表。id は「たおした記録」を保存するときの名前、minExp は「本日のタスクのEXPが何から」、isBoss は少し大きく表示するか
// EXP（10〜30）が多い（大変な）クエストほど、強そうなモンスターになります。高いEXPから順に書きます
const MONSTERS = [
  { id: "dragon", minExp: 28, name: "ドラゴン", pixels: PIXELS_DRAGON, isBoss: true }, // 28〜30
  { id: "ogre", minExp: 26, name: "オーガ", pixels: PIXELS_OGRE, isBoss: false }, // 26〜27
  { id: "ghost", minExp: 24, name: "ゴースト", pixels: PIXELS_GHOST, isBoss: false }, // 24〜25
  { id: "golem", minExp: 22, name: "ゴーレム", pixels: PIXELS_GOLEM, isBoss: false }, // 22〜23
  { id: "wolf", minExp: 20, name: "オオカミ", pixels: PIXELS_WOLF, isBoss: false }, // 20〜21
  { id: "skeleton", minExp: 18, name: "ガイコツ", pixels: PIXELS_SKELETON, isBoss: false }, // 18〜19
  { id: "goblin", minExp: 16, name: "ゴブリン", pixels: PIXELS_GOBLIN, isBoss: false }, // 16〜17
  { id: "mushroom", minExp: 14, name: "おばけキノコ", pixels: PIXELS_MUSHROOM, isBoss: false }, // 14〜15
  { id: "bat", minExp: 12, name: "コウモリ", pixels: PIXELS_BAT, isBoss: false }, // 12〜13
  { id: "slime", minExp: 0, name: "スライム", pixels: PIXELS_SLIME, isBoss: false }, // 10〜11
];

// レアなクエストのときに出すモンスター
const RARE_MONSTER = { id: "golden-slime", name: "ゴールデンスライム", pixels: PIXELS_GOLDEN_SLIME, isBoss: false };

// --- 関数 ---

// ===== ログインボーナス =====

// 今日まだログインボーナスをもらっていなければ、コインをわたして演出を出す
// 昨日ももらっていれば、続けて開いた日数を1つふやす（7日目のあとは1日目）。1日でもあいたら1日目にもどる
function checkLoginBonus() {
  const today = getTodayString();
  if (lastLoginDate === today) {
    return; // 今日はもうもらった
  }
  if (lastLoginDate === getPreviousDateText(today)) {
    loginStreak = (loginStreak % LOGIN_BONUS_COINS.length) + 1;
  } else {
    loginStreak = 1;
  }
  const bonus = LOGIN_BONUS_COINS[loginStreak - 1];
  coins = coins + bonus;
  lastLoginDate = today;
  savePlayer();
  renderGacha(); // コインの数の表示を新しくする
  addLoginBonusEffect(loginStreak, bonus);
  console.log("ログインボーナス", loginStreak + "日目", bonus);
}

// 「🎁 ログインボーナス！ 3日目 🪙 +40」の演出を、順番待ちの列に並べる（7日目は「大当たり」）
function addLoginBonusEffect(day, bonus) {
  const dayText = day + "日目" + (day === LOGIN_BONUS_COINS.length ? "（大当たり）" : "");
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🎁 ログインボーナス！\n" + dayText + "\n🪙 +" + bonus;
    restartAnimation(effectOverlay, "is-celebrate");
    playSparkleSound();
  }, CELEBRATE_EFFECT_TIME);
}

// 今日がボス戦の日（設定画面でえらんだ曜日。はじめは日曜日）かどうかを返す（「なし」なら、いつも false）
function isBossDay() {
  return bossDay >= 0 && new Date().getDay() === bossDay;
}

// 「2026-10-02」のような日付の、days 日あとの日付の文字を返す
function addDaysToDateText(dateText, days) {
  const parts = dateText.split("-");
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + days);
  return makeDateText(date.getFullYear(), date.getMonth(), date.getDate());
}

// 次にボス戦の曜日を変えられる日を返す（1回も変えていなければ ""）
function getNextBossChangeDate() {
  if (bossDayChangedDate === "") {
    return "";
  }
  return addDaysToDateText(bossDayChangedDate, BOSS_CHANGE_DAYS);
}

// 今、ボス戦の曜日を変えられるかを返す（変えてから7日たっていれば、変えられる）
function canChangeBossDay() {
  const next = getNextBossChangeDate();
  return next === "" || getTodayString() >= next;
}

// 設定画面の「👑 ボス戦の日」を表示し直す（えらんでいる曜日・今日の曜日・変えられるかどうか）
function renderBossDaySetting() {
  bossDaySelect.value = String(bossDay);
  bossDaySelect.disabled = !canChangeBossDay();
  bossDayToday.textContent = "今日は" + WEEKDAY_NAMES[new Date().getDay()] + "曜日です";
  if (canChangeBossDay()) {
    bossDayHelp.textContent = "今は変えられます（変えると、" + BOSS_CHANGE_DAYS + "日間は変えられません）";
  } else {
    bossDayHelp.textContent = "次に変えられるのは " + formatDeadline(getNextBossChangeDate()) + " から";
  }
}

// ボス戦の曜日をえらびなおしたとき：確認してから変えて、変えた日を保存する（キャンセルなら元にもどす）
function changeBossDay() {
  const newDay = Number(bossDaySelect.value);
  if (!canChangeBossDay() || newDay === bossDay) {
    renderBossDaySetting();
    return;
  }
  const dayName = newDay >= 0 ? WEEKDAY_NAMES[newDay] + "曜日" : "なし";
  const nextDate = formatDeadline(addDaysToDateText(getTodayString(), BOSS_CHANGE_DAYS));
  if (!confirm("ボス戦の日を「" + dayName + "」にしますか？\n変えると、" + nextDate + " まで変えられません")) {
    renderBossDaySetting(); // キャンセルなので、えらぶ箱を元にもどす
    return;
  }
  bossDay = newDay;
  bossDayChangedDate = getTodayString();
  savePlayer();
  renderBossDaySetting();
  renderQuests(); // ボス戦の日のお知らせとモンスターを、すぐ変える
}

// ボス戦の日だけ、メイン画面に「👑 今日はボス戦の日！」のお知らせを出す
function renderBossDayBanner() {
  bossDayBanner.hidden = !isBossDay();
}

// 本日のタスクのクエストから、出すモンスターを決めて返す
// レアなクエストならゴールデンスライム、ボス戦の日ならドラゴン、それ以外は EXP で決める
function getMonster(quest) {
  if (quest.rare) {
    return RARE_MONSTER;
  }
  // ボス戦の日は、EXP に関係なく、全部ボス（表のいちばん上＝ドラゴン）にする
  if (isBossDay()) {
    return MONSTERS[0];
  }
  const exp = quest.exp;
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
  const monster = getMonster(quests[index]);
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
// 絵は、次の3つの段階で描きます
//   1. 16×16マスの「色の表」を作る（設計図に、装備の絵を重ねる）
//   2. Scale2x という方法で、32×32マスに広げて、ななめのギザギザをなめらかにする
//   3. 32×32マスの色の表を、canvas に塗る

// 今の称号に合ったキャラクターのドット絵を、装備を重ねて描く
function drawHero() {
  const grid = smoothOldStyle(makeHeroGrid());
  paintGrid(heroCanvas, grid);
  paintGrid(timerWalker, grid); // タイマー画面のバーの上を歩くキャラも、同じ絵にする
}

// 設計図（pixels）のドット絵を、なめらかに広げて canvas に描く（モンスターに使う）
function drawPixels(canvas, pixels) {
  paintGrid(canvas, smoothOldStyle(makeColorGrid(pixels)));
}

// 今までの16×16マスの絵だけ、Scale2x でなめらかにして返す
// 新しい描き方の絵（はばが24マス）は、参考図のような四角いドットに見えるように、なめらかにしない
function smoothOldStyle(grid) {
  if (grid[0].length === 16) {
    return scale2x(grid);
  }
  return grid;
}

// キャラクターの色の表（24×30マス）を作り、装備しているアイテムの絵を重ねて返す
function makeHeroGrid() {
  const grid = makeColorGrid(getTitle(getLevel()).pixels);

  // 武器を装備しているときは、キャラがもともと持っている武器（右側）を先に消す
  if (equipped.weapon) {
    clearOldWeapon(grid);
  }

  // 頭の装備をしているときは、もともとの帽子・王冠・かぶと・角・光の輪がはみ出さないように、頭の上のほうを先に消す
  if (equipped.head) {
    clearGridArea(grid, 0, 0, 24, 5); // いちばん上の5行（角や光の輪のあたり）
    clearGridArea(grid, 0, 5, 22, 3); // その下の3行（右はしの剣は消さない）
  }

  // 部位ごとに、装備しているアイテムの絵を重ねる
  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const itemId = equipped[EQUIP_SLOTS[i].slot];
    if (itemId) {
      const sprite = EQUIP_SPRITES[itemId];
      overlayOnGrid(grid, sprite.rows, sprite.x, sprite.y, sprite.behind === true);
    }
  }
  return grid;
}

// キャラがもともと持っている武器を消す
// 右はしの3列（上から6行目より下）にある、武器の色（刃・つば・持ち手）のマスだけを消す
// （髪のふちどりや、マントは消さない）
function clearOldWeapon(grid) {
  const weaponColors = [HERO_COLORS.W, HERO_COLORS.s, HERO_COLORS.G, HERO_COLORS.Y, HERO_COLORS.j, HERO_COLORS.V];
  for (let row = 5; row < grid.length; row++) {
    for (let col = 21; col < 24; col++) {
      if (weaponColors.includes(grid[row][col])) {
        grid[row][col] = fillGap(grid, row, col);
      }
    }
  }
}

// 消したマスの上と下が同じ色なら、その色を返す（マントなどに穴があかないようにする）
// ちがう色なら null（塗らない）を返す
function fillGap(grid, row, col) {
  const above = grid[row - 1][col];
  const below = row + 1 < grid.length ? grid[row + 1][col] : null;
  if (above && above === below) {
    return above;
  }
  return null;
}

// 設計図（文字の表）から、色の表を作って返す
// 色の表は grid[y][x] で「上から y 行目・左から x マス目」の色。塗らないマスは null
function makeColorGrid(pixels) {
  const grid = [];
  for (let y = 0; y < pixels.length; y++) {
    const row = [];
    for (let x = 0; x < pixels[y].length; x++) {
      row.push(HERO_COLORS[pixels[y][x]] || null); // 「.」など、色の決まっていない文字は null
    }
    grid.push(row);
  }
  return grid;
}

// 色の表の、左から x・上から y の場所から、横 width・縦 height のマスを「塗らない」にする
function clearGridArea(grid, x, y, width, height) {
  for (let row = y; row < y + height; row++) {
    for (let col = x; col < x + width; col++) {
      grid[row][col] = null;
    }
  }
}

// 設計図（rows）の絵を、色の表の左から left・上から top の場所に重ねる
// （「.」のマスは重ねないので、下の絵がそのまま残る）
function overlayOnGrid(grid, rows, left, top, isBehind) {
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const color = HERO_COLORS[rows[y][x]];
      // isBehind が true（天使の羽など）のときは、キャラのうしろに見えるように、何も描いていないマスだけに塗る
      const canPaint = !isBehind || grid[top + y][left + x] === null;
      if (color && canPaint) {
        grid[top + y][left + x] = color;
      }
    }
  }
}

// 色の表の、左から x・上から y のマスの色を返す
// 表の外を聞かれたときは、いちばん近いはしのマスの色を返す（Scale2x で、はしを見るため）
function getGridColor(grid, x, y) {
  const safeY = Math.min(Math.max(y, 0), grid.length - 1);
  const safeX = Math.min(Math.max(x, 0), grid[safeY].length - 1);
  return grid[safeY][safeX];
}

// Scale2x：色の表を、たて・よこ2倍に広げて返す（ななめのギザギザをなめらかにする）
// 1マスを2×2の4マスにするとき、上下左右のマスの色を見て、角のマスの色を決めます
//   上と左が同じ色（で、右・下とはちがう）なら、左上の角をその色にする … のように、4つの角を決める
function scale2x(grid) {
  const result = [];
  for (let y = 0; y < grid.length; y++) {
    const topRow = []; // 広げたあとの、上の行
    const bottomRow = []; // 広げたあとの、下の行

    for (let x = 0; x < grid[y].length; x++) {
      const center = grid[y][x];
      const up = getGridColor(grid, x, y - 1);
      const down = getGridColor(grid, x, y + 1);
      const left = getGridColor(grid, x - 1, y);
      const right = getGridColor(grid, x + 1, y);

      // 4つの角の色を決める（条件に当てはまらなければ、もとのマスの色のまま）
      let topLeft = center;
      let topRight = center;
      let bottomLeft = center;
      let bottomRight = center;
      if (up !== down && left !== right) {
        if (left === up) {
          topLeft = left;
        }
        if (up === right) {
          topRight = right;
        }
        if (left === down) {
          bottomLeft = left;
        }
        if (down === right) {
          bottomRight = right;
        }
      }

      topRow.push(topLeft, topRight);
      bottomRow.push(bottomLeft, bottomRight);
    }
    result.push(topRow, bottomRow);
  }
  return result;
}

// 色の表を、canvas に塗る（前に描いた絵は消してから塗る）
function paintGrid(canvas, grid) {
  // canvas のマス目の数を、絵の大きさ（正方形の32×32、縦長の48×64 など）に合わせる
  if (canvas.width !== grid[0].length || canvas.height !== grid.length) {
    canvas.width = grid[0].length;
    canvas.height = grid.length;
  }

  const pen = canvas.getContext("2d"); // 絵を描くための道具
  pen.clearRect(0, 0, canvas.width, canvas.height);

  // 上から1行ずつ、左から1マスずつ見ていく（y は何行目、x は何マス目）
  for (let y = 0; y < grid.length; y++) {
    for (let x = 0; x < grid[y].length; x++) {
      // 色が決まっているマスだけ、1マス分の四角を塗る
      if (grid[y][x]) {
        pen.fillStyle = grid[y][x];
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

// 今日の撃破数を画面に表示し直す（連続記録も、いっしょに表示し直す）
function renderTodayCount() {
  todayCountText.textContent = "今日 " + todayCount + "体 撃破";
  renderStreak();
}

// 今、1体以上撃破した日が何日続いているかを数えて返す（カレンダーの撃破の記録を使う）
// 今日まだ撃破していなくても、昨日まで続いていれば、昨日までの日数を返す（今日のうちは切れない）
function countCurrentStreak() {
  let day = getTodayString();
  if (!(defeatHistory[day] > 0)) {
    day = getPreviousDateText(day); // 今日まだなら、昨日から数える
  }
  let count = 0;
  while (defeatHistory[day] > 0) {
    count = count + 1;
    day = getPreviousDateText(day);
  }
  return count;
}

// 「2026-10-01」のような日付の、前の日の日付の文字を返す
function getPreviousDateText(dateText) {
  const parts = dateText.split("-");
  const previous = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) - 1);
  return makeDateText(previous.getFullYear(), previous.getMonth(), previous.getDate());
}

// 連続記録（「🔥 3日連続」）を表示し直す。今日まだ撃破していなければ「（今日まだ）」を付ける。0日なら出さない
function renderStreak() {
  const streak = countCurrentStreak();
  streakText.hidden = streak === 0;
  const doneToday = defeatHistory[getTodayString()] > 0;
  streakText.textContent = "🔥 " + streak + "日連続";
  // 「（今日まだ）」は、せまくても変なところで折り返さないように、次の行に小さく出す
  if (!doneToday) {
    const notYet = document.createElement("span");
    notYet.className = "streak-not-yet";
    notYet.textContent = "（今日まだ）";
    streakText.appendChild(notYet);
  }
}

// プレイヤーの状態（累計EXP・今日の撃破数・その日付）を localStorage に保存する
function savePlayer() {
  const player = {
    totalExp: totalExp,
    todayCount: todayCount,
    todayDate: todayDate,
    coins: coins,
    items: items,
    equipped: equipped,
    muted: isMuted,
    focusSound: focusSound,
    effectVolume: effectVolume,
    bossDay: bossDay,
    bossDayChangedDate: bossDayChangedDate,
    lastLoginDate: lastLoginDate,
    loginStreak: loginStreak,
    focusVolume: focusVolume,
    focusMinutes: focusMinutes,
    breakMinutes: breakMinutes,
    focusCount: focusCount,
    focusDate: focusDate,
    eggs: eggs,
    settingEgg: settingEgg,
    pets: pets,
    activePets: activePets,
    defeatHistory: defeatHistory,
    focusHistory: focusHistory,
    monsterDefeats: monsterDefeats,
    achievements: achievements,
    rewardedAchievements: rewardedAchievements,
    petFriendship: petFriendship,
    petCrownOff: petCrownOff,
  };
  localStorage.setItem(PLAYER_KEY, JSON.stringify(player));
}

// localStorage から、保存しておいたプレイヤーの状態を取り出す
function loadPlayer() {
  const saved = localStorage.getItem(PLAYER_KEY);

  // まだ何も保存されていなければ、0 のまま（ペットだけは、最初からいる2匹を入れる）
  if (saved === null) {
    giveStarterPets(true); // 初めての人は、最初からいるペットを仲間にして、連れていく
    return;
  }

  // 保存されたデータが壊れていても止まらないように、try で囲みます
  try {
    const player = JSON.parse(saved);
    totalExp = player.totalExp || 0;
    todayCount = player.todayCount || 0; // 前の形の保存データには無いので、そのときは 0
    todayDate = player.todayDate || "";
    coins = player.coins || 0; // 前の形の保存データには無いので、そのときは 0
    items = player.items || {};
    equipped = player.equipped || {};
    isMuted = player.muted === true; // 前の形の保存データには無いので、そのときは「鳴らす」
    focusSound = getFocusSound(player.focusSound) ? player.focusSound : ""; // 表にない音は「なし」にする
    focusMinutes = FOCUS_MINUTE_CHOICES.includes(player.focusMinutes) ? player.focusMinutes : FOCUS_MINUTES; // えらべない長さなら、はじめの長さ
    breakMinutes = BREAK_MINUTE_CHOICES.includes(player.breakMinutes) ? player.breakMinutes : BREAK_MINUTES;
    effectVolume = getSavedVolume(player.effectVolume, DEFAULT_EFFECT_VOLUME); // 前の形の保存データには無いので、そのときは、はじめの大きさ
    focusVolume = getSavedVolume(player.focusVolume, DEFAULT_FOCUS_VOLUME);
    bossDay = Number.isInteger(player.bossDay) && player.bossDay >= -1 && player.bossDay <= 6 ? player.bossDay : DEFAULT_BOSS_DAY; // おかしい数なら日曜日
    bossDayChangedDate = typeof player.bossDayChangedDate === "string" ? player.bossDayChangedDate : "";
    lastLoginDate = typeof player.lastLoginDate === "string" ? player.lastLoginDate : ""; // 前の形の保存データには無いので、そのときは「まだもらっていない」
    loginStreak = Number.isInteger(player.loginStreak) && player.loginStreak >= 0 && player.loginStreak <= 7 ? player.loginStreak : 0;
    focusCount = player.focusCount || 0;
    focusDate = player.focusDate || "";
    eggs = player.eggs || {};
    settingEgg = player.settingEgg || null;
    pets = player.pets || {};
    activePets = loadActivePets(player);
    giveStarterPets(false); // 最初からいるペットを持っていなければ、仲間に入れる（連れていくペットは変えない）
    defeatHistory = player.defeatHistory || {};
    focusHistory = player.focusHistory || {}; // 前の形の保存データには無いので、そのときは空
    monsterDefeats = player.monsterDefeats || {}; // 前の形の保存データには無いので、そのときは空（だれもたおしていない）
    achievements = player.achievements || {}; // 前の形の保存データには無いので、そのときは空（まだ1つもとっていない）
    rewardedAchievements = player.rewardedAchievements || {}; // 前の形の保存データには無いので、そのときは空（まだ1つもコインをわたしていない）
    petFriendship = player.petFriendship || {}; // 前の形の保存データには無いので、そのときは空（どのペットも Lv1）
    petCrownOff = player.petCrownOff || {}; // 前の形の保存データには無いので、そのときは空（どのペットも王冠をつけている）
    console.log("プレイヤーの状態を読み込みました", player);
  } catch (error) {
    console.log("プレイヤーの保存データが壊れていたので、0 から始めます");
    totalExp = 0;
    todayCount = 0;
    todayDate = "";
    coins = 0;
    items = {};
    equipped = {};
    isMuted = false;
    focusSound = "";
    focusMinutes = FOCUS_MINUTES;
    breakMinutes = BREAK_MINUTES;
    effectVolume = DEFAULT_EFFECT_VOLUME;
    focusVolume = DEFAULT_FOCUS_VOLUME;
    bossDay = DEFAULT_BOSS_DAY;
    bossDayChangedDate = "";
    lastLoginDate = "";
    loginStreak = 0;
    focusCount = 0;
    focusDate = "";
    eggs = {};
    settingEgg = null;
    pets = {};
    activePets = [];
    defeatHistory = {};
    focusHistory = {};
    monsterDefeats = {};
    achievements = {};
    rewardedAchievements = {};
    petFriendship = {};
    petCrownOff = {};
    giveStarterPets(true); // データが壊れていたときも、初めての人と同じように、最初からいるペットを入れる
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

  // コインとガチャ（ボタン・図鑑）を表示し直す
  renderGacha();

  // ランクの星を表示し直す
  renderRankStars(level);

  // 今の称号に合ったキャラクターを描き直す
  drawHero();
}

// quests 配列を localStorage に保存する
// （localStorage には文字しか入らないので、JSON という形の文字に変えてしまいます）
// （保存する前に、締切が近い順に並べかえる）
function saveQuests() {
  sortQuests();
  localStorage.setItem(QUESTS_KEY, JSON.stringify(quests));
}

// クエストを並べかえる
//   1. まだ撃破していないクエストが先、撃破済みはあと
//   2. まだ撃破していない中では、📌 ピン止めしたクエストが先
//   3. 同じピン止めの状態の中では、やる日が今日（またはすぎた）のクエストが先、やる日がまだ先のクエストはあと
//   4. その中では、締切が近い順（締切のないクエストはいちばん下）
//   5. ここまでが同じなら、今の順番のまま（sort は、同じものどうしの順番を変えません）
function sortQuests() {
  quests.sort(function (a, b) {
    return getSortKey(a).localeCompare(getSortKey(b));
  });
}

// 並べかえに使う「くらべるための文字」を返す（この文字が小さいクエストほど上に来る）
// 例：まだ撃破していない・ピン止め・やる日なし・締切 10/5 → "0-0-1-2026-10-05"
function getSortKey(quest) {
  const doneKey = quest.done ? "1" : "0";
  const pinKey = isPinned(quest) && !quest.done ? "0" : "1";
  const planKey = getPlanSortKey(quest);
  const deadlineKey = quest.deadline || "9999-99-99"; // 締切なしは、いちばんあとの日付として扱う
  return doneKey + "-" + pinKey + "-" + planKey + "-" + deadlineKey;
}

// やる日の並べかえの目印を返す（"0" は今日やる予定・すぎた予定、"1" はやる日なし、"2" はやる日がまだ先）
// やる日がまだ先のクエストは、うしろにやる日を付けて、やる日が近い順にならぶようにする（例："2:2026-10-05"）
function getPlanSortKey(quest) {
  if (!quest.planDate) {
    return "1";
  }
  return isFuturePlan(quest) ? "2:" + quest.planDate : "0";
}

// やる日がまだ先（明日以降）のクエストかどうかを返す
function isFuturePlan(quest) {
  return Boolean(quest.planDate) && quest.planDate > getTodayString();
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

    // 効果音の大きさのつまみを作って、スピーカーにつないでおく
    effectVolumeNode = audioContext.createGain();
    effectVolumeNode.connect(audioContext.destination);
    applyEffectVolume();
  }
  // ボタンを押す前（ページを開いたときの演出など）に用意すると、音の道具は止まった状態になる
  // そのままだとずっと鳴らないので、止まっていたら動かし直す（ボタンを押したあとなら動く）
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
}

// 効果音のつながる先（大きさのつまみ）を返す
function getEffectOutput(audio) {
  getAudioContext(); // まだ音の道具がなければ、つまみと一緒に用意する
  return effectVolumeNode || audio.destination;
}

// 効果音の大きさのつまみを、設定の大きさにする（% を 0〜1 にする）
function applyEffectVolume() {
  if (effectVolumeNode) {
    effectVolumeNode.gain.value = effectVolume / 100;
  }
}

// 保存してあった音の大きさを確かめて返す（0〜100 の10きざみでなければ、はじめの大きさを返す）
function getSavedVolume(saved, defaultVolume) {
  if (Number.isInteger(saved) && saved >= 0 && saved <= 100 && saved % 10 === 0) {
    return saved;
  }
  return defaultVolume;
}

// 設定画面の、音の大きさのつまみと文字を、今の大きさに合わせる
function renderVolumeSettings() {
  effectVolumeSlider.value = effectVolume;
  effectVolumeText.textContent = effectVolume + "%";
  focusVolumeSlider.value = focusVolume;
  focusVolumeText.textContent = focusVolume + "%";
}

// 効果音のつまみを動かしているとき：大きさを変えて、文字を書きかえる
function changeEffectVolume() {
  effectVolume = Number(effectVolumeSlider.value);
  applyEffectVolume();
  renderVolumeSettings();
}

// 効果音のつまみをはなしたとき：保存して、確かめるための「シュキンッ」を1回鳴らす
function finishEffectVolume() {
  savePlayer();
  playSlashSound();
}

// 集中中の音のつまみを動かしているとき：大きさを変えて（流れていれば、その場で変わる）、文字を書きかえる
function changeFocusVolume() {
  focusVolume = Number(focusVolumeSlider.value);
  updateFocusSound();
  renderVolumeSettings();
}

// ===== データの書き出し・読みこみ =====

// 書き出したデータの目印（タスクリアのデータかどうかを、読みこむときに確かめる）
const DATA_FORMAT = "tasclear-data";

// 設定画面のお知らせを出す（isError が true なら赤い文字）
function showDataMessage(text, isError) {
  dataMessage.textContent = text;
  dataMessage.classList.toggle("is-error", isError);
}

// 今の保存データ（クエスト・習慣・プレイヤー）を、1つの文字にまとめて返す
function makeExportText() {
  savePlayer(); // 今の状態を、先に保存しておく
  const data = {
    format: DATA_FORMAT,
    version: 1,
    exportedDate: getTodayString(),
    tasks: JSON.parse(localStorage.getItem(QUESTS_KEY) || "[]"),
    habits: JSON.parse(localStorage.getItem(HABITS_KEY) || "[]"),
    player: JSON.parse(localStorage.getItem(PLAYER_KEY) || "{}"),
  };
  return JSON.stringify(data);
}

// 「📤 書き出す」：箱に、データの文字を出す
function exportData() {
  dataText.value = makeExportText();
  showDataMessage("書き出しました。「📋 コピー」か「💾 ファイルに保存」で取っておけます", false);
}

// 「📋 コピー」：箱の文字をコピーする（まだ書き出していなければ、先に書き出す）
function copyData() {
  if (dataText.value === "") {
    dataText.value = makeExportText();
  }
  // コピーの道具が使えないブラウザ（https でないページなど）では、自分でコピーしてもらう
  if (!navigator.clipboard) {
    showCopyHelp();
    return;
  }
  navigator.clipboard.writeText(dataText.value).then(function () {
    showDataMessage("コピーしました。メモ帳などに貼りつけて取っておけます", false);
  }).catch(showCopyHelp);
}

// コピーできなかったとき：箱の文字をえらんでおいて、自分でコピーする方法を出す
function showCopyHelp() {
  dataText.focus();
  dataText.select();
  showDataMessage("コピーできませんでした。箱の文字を長押し（パソコンは右クリック）して「コピー」してください", true);
}

// 「💾 ファイルに保存」：データを「tasclear-data-2026-10-02.json」というファイルでダウンロードする
function downloadData() {
  const text = makeExportText();
  dataText.value = text;
  const file = new Blob([text], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(file);
  link.download = "tasclear-data-" + getTodayString() + ".json";
  link.click(); // 見えないリンクを押して、ダウンロードを始める
  URL.revokeObjectURL(link.href);
  showDataMessage("ファイルに保存しました（ダウンロードのフォルダに入ります）", false);
}

// 文字がタスクリアのデータなら、中身（{ tasks, habits, player }）を返す。ちがう・こわれているときは null
function parseImportText(text) {
  try {
    const data = JSON.parse(text);
    const isPlayerObject = data.player !== null && typeof data.player === "object" && !Array.isArray(data.player);
    if (data.format === DATA_FORMAT && Array.isArray(data.tasks) && Array.isArray(data.habits) && isPlayerObject) {
      return data;
    }
    return null;
  } catch (error) {
    return null; // JSON の形になっていない（こわれている）
  }
}

// 文字からデータを読みこむ（確かめて、確認してから、今のデータと入れかえて、ページを読みこみ直す）
function importData(text) {
  const data = parseImportText(text.trim());
  if (data === null) {
    showDataMessage("このデータは読みこめません。タスクリアで書き出した文字か、ファイルをえらんでください", true);
    return;
  }
  const ok = confirm("今のデータは全部消えて、読みこんだデータ（" + (data.exportedDate || "日付なし") + " に書き出したもの）に入れかわります。よいですか？");
  if (!ok) {
    showDataMessage("読みこむのをやめました（今のデータはそのままです）", false);
    return;
  }
  localStorage.setItem(QUESTS_KEY, JSON.stringify(data.tasks));
  localStorage.setItem(HABITS_KEY, JSON.stringify(data.habits));
  localStorage.setItem(PLAYER_KEY, JSON.stringify(data.player));
  location.reload(); // 読みこんだデータで、画面を全部描き直す
}

// 「🗑️ データを全部消す」：2回確かめてから、タスクリアの3つのデータだけを消して、ページを読みこみ直す
// （localStorage.clear() は、同じ場所のほかのアプリのデータまで消してしまうので使わない）
function deleteAllData() {
  const ok = confirm("本当に全部消しますか？\n消したデータはもとにもどせません。\n先に「📤 書き出す」で取っておくと安心です。");
  if (!ok) {
    return;
  }
  const answer = prompt("消すときは「けす」と入力してください");
  if (answer === null || answer.trim() !== "けす") {
    alert("消すのをやめました（データはそのままです）");
    return;
  }
  localStorage.removeItem(QUESTS_KEY);
  localStorage.removeItem(HABITS_KEY);
  localStorage.removeItem(PLAYER_KEY);
  location.reload(); // 初めて開いたときと同じ状態で、画面を全部描き直す
}

// 「📂 ファイルから読みこむ」でファイルをえらんだとき：中身を箱に出して、読みこむ
function importFromFile() {
  const file = importFileInput.files[0];
  if (!file) {
    return;
  }
  const reader = new FileReader();
  reader.onload = function () {
    dataText.value = reader.result;
    importData(reader.result);
  };
  reader.readAsText(file);
  importFileInput.value = ""; // 同じファイルをもう一度えらんでも、読みこめるようにする
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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
  tone.start(start);
  tone.stop(start + duration);
}

// 剣で切る音（シュッ＋キンッ）を鳴らす
function playSlashSound() {
  // 効果音を消しているときは、鳴らさない
  if (isMuted) {
    return;
  }

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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
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
    volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
  tone.start(start);
  tone.stop(start + duration);
}

// ボスを倒したような、低くて重い剣の音（ズバッ＋ゴォン＋ドンッ）を鳴らす
function playHeavySlashSound() {
  // 効果音を消しているときは、鳴らさない
  if (isMuted) {
    return;
  }

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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
  tone.start(start);
  tone.stop(start + duration);
}

// ドレミファソラシドを、鍵盤をなでるように素早く順に鳴らす
function playLevelUpSound() {
  // 効果音を消しているときは、鳴らさない
  if (isMuted) {
    return;
  }

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
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
  tone.start(start);
  tone.stop(start + length);
}

// お祝いのファンファーレ「タ・タ・タ・ジャーン♪」を鳴らす
function playFanfareSound() {
  // 効果音を消しているときは、鳴らさない
  if (isMuted) {
    return;
  }

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

// 鈴のような、高くて澄んだ音を1つ鳴らす
// frequency は音の高さ、start は鳴らし始める時刻（秒）、length は余韻が消えるまでの長さ（秒）
function playBellNote(audio, frequency, start, length) {
  // 澄んだ音（「sine」）を使う
  const tone = audio.createOscillator();
  tone.type = "sine";
  tone.frequency.setValueAtTime(frequency, start);

  // 音の大きさ（耳にきつくないよう小さめ。鳴った瞬間がいちばん大きく、すぐ小さくなって余韻が残る）
  const volume = audio.createGain();
  volume.gain.setValueAtTime(0.01, start);
  volume.gain.exponentialRampToValueAtTime(0.1, start + 0.005);
  volume.gain.exponentialRampToValueAtTime(0.001, start + length);

  // 音のもと → 大きさ → スピーカー の順につなぐ
  tone.connect(volume);
  volume.connect(getEffectOutput(audio)); // 効果音の大きさのつまみを通して、スピーカーへ
  tone.start(start);
  tone.stop(start + length);
}

// レアモンスターがあらわれたときの「キラキラリーン♪」を鳴らす
function playSparkleSound() {
  // 効果音を消しているときは、鳴らさない
  if (isMuted) {
    return;
  }

  // 音が鳴らせないブラウザでも、演出は止まらないように try で囲みます
  try {
    const audio = getAudioContext();
    const now = audio.currentTime;
    for (let i = 0; i < SPARKLE_NOTES.length; i++) {
      const note = SPARKLE_NOTES[i];
      playBellNote(audio, note.frequency, now + note.start, note.length);
    }
  } catch (error) {
    console.log("キラキラの音を鳴らせませんでした", error);
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
// count は撃破した体数、exp はその合計EXP
// 列のいちばん後ろが「まだ出ていない撃破の演出」なら、新しく並べずに、体数とEXPを足してまとめる
function addDefeatEffect(count, exp) {
  const last = effectQueue[effectQueue.length - 1]; // 列のいちばん後ろ（無ければ undefined）
  if (last && last.isDefeat) {
    last.defeatCount = last.defeatCount + count;
    last.defeatExp = last.defeatExp + exp;
    return;
  }

  // まとめられないときは、新しい撃破の演出を並べる
  const effect = {
    isDefeat: true, // 撃破の演出かどうか（まとめるときの目印）
    defeatCount: count, // まとめた体数
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
// ただし、まだ出ていないレベルアップの演出が列に残っているときは、隠したままにする
function unlockDefeat() {
  for (let i = 0; i < effectQueue.length; i++) {
    if (effectQueue[i].isLevelUp) {
      return;
    }
  }
  isDefeatLocked = false;
  renderQuests();
}

// レベルアップの演出を列に並べる（演出が終わるまで、撃破ボタンを隠す）
// level は、上がったあとのレベル
function addLevelUpEffect(level) {
  lockDefeat();
  pushEffect({
    isLevelUp: true, // レベルアップの演出かどうか（ボタンを出してよいか調べるときの目印）
    duration: LEVELUP_EFFECT_TIME,
    play: function () {
      playLevelUpEffect(level);
      setTimeout(unlockDefeat, LEVELUP_EFFECT_TIME); // 演出が終わったら、ボタンをまた出す
    },
  });
}

// お祝いの演出を列に並べる（count は今日の撃破数）
function addCelebrateEffect(count) {
  addEffect(function () {
    playCelebrateEffect(count);
  }, CELEBRATE_EFFECT_TIME);
}

// 撃破したときの演出を、撃破 → レベルアップ → お祝い の順に列に並べる
// defeatCount は撃破した体数、exp はその合計EXP
// levelBefore・levelAfter は撃破する前と後のレベル、countBefore・countAfter は撃破する前と後の今日の撃破数
function addDefeatEffects(defeatCount, exp, levelBefore, levelAfter, countBefore, countAfter) {
  addDefeatEffect(defeatCount, exp);

  // 上がったレベルの数だけ、レベルアップの演出を1つずつ並べる（例：Lv2 → Lv3 → Lv4）
  for (let level = levelBefore + 1; level <= levelAfter; level++) {
    addLevelUpEffect(level);
  }

  // 今日の撃破数が 5の倍数（5体・10体・15体…）を通り過ぎた数だけ、お祝いを並べる
  for (let count = countBefore + 1; count <= countAfter; count++) {
    if (count % CELEBRATE_EVERY === 0) {
      addCelebrateEffect(count);
    }
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
    // 撃破する前のレベルと今日の撃破数を覚えておく（日付が変わっていたら、先に 0 に戻す）
    resetTodayCountIfNewDay();
    const levelBefore = getLevel();
    const countBefore = todayCount;

    // 本日のタスクを撃破したときだけ、モンスターを点滅させて消す
    if (index === findTodayIndex()) {
      defeatMonster();
    }

    completeQuest(index);
    renderQuests();
    renderStatus();

    // 撃破・レベルアップ・お祝いの演出を、順番待ちの列に並べる
    addDefeatEffects(1, quest.exp, levelBefore, getLevel(), countBefore, todayCount);
    addPendingPetLevelUpEffects(); // ペットのレベルが上がっていたら、撃破の演出のあとに出す
    checkAchievements(true); // 新しくとれた実績があれば、演出を出す（撃破の演出のあとに並ぶ）
  });
  return button;
}

// 「本日のタスク」と「毎日の習慣」のカードを切りかえる（showHabit が true なら習慣、false なら本日のタスクを出す）
function switchTodayView(showHabit) {
  habitCard.hidden = !showHabit;
  todayCard.hidden = showHabit;
  switchHabitButton.classList.toggle("is-active", showHabit);
  switchTodayButton.classList.toggle("is-active", !showHabit);
}

// 図鑑の中のページを切りかえる（name は "items"・"creatures"・"achievements" のどれか）
function switchCollectionPage(name) {
  Object.keys(collectionSections).forEach(function (key) {
    collectionSections[key].hidden = key !== name;
  });
  collectionSwitchButtons.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.collection === name);
  });
}

// 選んだクエストをまとめて撃破する
function defeatSelectedQuests() {
  const targets = selectedQuests.slice(); // 選んだクエストの写し
  if (targets.length === 0) {
    return;
  }

  // 撃破する前のレベルと今日の撃破数を覚えておく（日付が変わっていたら、先に 0 に戻す）
  resetTodayCountIfNewDay();
  const levelBefore = getLevel();
  const countBefore = todayCount;

  // 本日のタスクのいちばん上のクエストが入っていたら、モンスターを点滅させて消す
  if (targets.includes(quests[findTodayIndex()])) {
    defeatMonster();
  }

  // 選んだクエストを1つずつ撃破して、EXPの合計を数える
  let totalGain = 0;
  for (let i = 0; i < targets.length; i++) {
    completeQuest(quests.indexOf(targets[i]));
    totalGain = totalGain + targets[i].exp;
  }

  // 選んだ状態を空にして、表示し直す
  selectedQuests = [];
  renderQuests();
  renderStatus();

  // 撃破（まとめて1つ）→ 上がったレベルの数だけレベルアップ → お祝い の順に並べる
  addDefeatEffects(targets.length, totalGain, levelBefore, getLevel(), countBefore, todayCount);
  addPendingPetLevelUpEffects(); // ペットのレベルが上がっていたら、撃破の演出のあとに出す
  checkAchievements(true); // 新しくとれた実績があれば、演出を出す（撃破の演出のあとに並ぶ）
}

// クエスト1つ分の「選ぶ」チェックボックスを作って返す（まとめて撃破するクエストを選ぶため）
function createSelectCheckbox(quest) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "select-checkbox";
  checkbox.checked = selectedQuests.includes(quest);

  // チェックを付けたら選んだクエストに入れ、外したら取り除く
  checkbox.addEventListener("change", function () {
    if (checkbox.checked) {
      selectedQuests.push(quest);
    } else {
      selectedQuests = selectedQuests.filter(function (selected) {
        return selected !== quest;
      });
    }
    renderBulkDefeatButton();
  });
  return checkbox;
}

// 「選んだ〇体をまとめて撃破」ボタンの文字と、押せる・押せないを表示し直す
function renderBulkDefeatButton() {
  const count = selectedQuests.length;
  bulkDefeatButton.textContent = "⚔️ 選んだ " + count + "体 をまとめて撃破";

  // 1つも選んでいないとき・レベルアップ中は押せなくする
  bulkDefeatButton.disabled = count === 0 || isDefeatLocked;
}

// 「撃破済み」の目印を作って返す
function createDoneLabel() {
  const label = document.createElement("span");
  label.className = "done-label";
  label.textContent = "撃破済み";
  return label;
}

// ===== クエストのカテゴリ =====

// カテゴリの表。id は保存するときの名前（札の色は、style.css の「category-（id）」で決める）
const QUEST_CATEGORIES = [
  { id: "study", icon: "📚", name: "勉強" },
  { id: "work", icon: "💼", name: "しごと" },
  { id: "home", icon: "🏠", name: "家事" },
  { id: "sport", icon: "🏃", name: "運動" },
  { id: "hobby", icon: "🎨", name: "しゅみ" },
  { id: "other", icon: "✨", name: "その他" },
];

// カテゴリの id から、表の行を返す（なし・知らない id なら undefined）
function getCategory(id) {
  return QUEST_CATEGORIES.find(function (category) {
    return category.id === id;
  });
}

// カテゴリをえらぶ箱の中身（なし＋表の6つ）を作る。selectedId のカテゴリをえらんだ状態にする
function fillCategoryOptions(select, selectedId) {
  select.innerHTML = "";
  const none = document.createElement("option");
  none.value = "";
  none.textContent = "なし";
  select.appendChild(none);
  QUEST_CATEGORIES.forEach(function (category) {
    const option = document.createElement("option");
    option.value = category.id;
    option.textContent = category.icon + " " + category.name;
    select.appendChild(option);
  });
  select.value = getCategory(selectedId) ? selectedId : "";
}

// クエストのカテゴリの札を作って返す（札を出さないときは null）
// まだ撃破していないクエストは、押すとえらぶ箱が出て、えらびなおせる（カテゴリなしなら「🏷️ ＋」）
function createCategoryLabel(quest, index) {
  const category = getCategory(quest.category);
  if (quest.done && !category) {
    return null; // 撃破済みで、カテゴリもないなら何も出さない
  }
  const label = document.createElement(quest.done ? "span" : "button");
  label.className = "category-label";
  if (category) {
    label.classList.add("category-" + category.id);
    label.textContent = category.icon + " " + category.name;
  } else {
    label.classList.add("is-empty");
    label.textContent = "🏷️ ＋";
  }
  if (!quest.done) {
    label.type = "button";
    label.addEventListener("click", function () {
      openCategorySelect(label, index);
    });
  }
  return label;
}

// ===== カテゴリでしぼりこむ（他のタスクの一覧） =====

// 今えらんでいるしぼりこみ（"all" はすべて、"" はカテゴリなし、それ以外はカテゴリの id）。保存はしない
let categoryFilter = "all";

// クエストが、今のしぼりこみに合っているかを返す
function matchesCategoryFilter(quest) {
  if (categoryFilter === "all") {
    return true;
  }
  if (categoryFilter === "") {
    return !getCategory(quest.category); // カテゴリなし（前からあるクエストもふくむ）
  }
  return quest.category === categoryFilter;
}

// しぼりこみのボタン（すべて・カテゴリごと・なし）を作る。数は、他のタスクの一覧にあるクエストの数
function renderCategoryFilter(otherIndexes) {
  categoryFilterBox.innerHTML = "";
  categoryFilterBox.appendChild(createFilterButton("all", "すべて", otherIndexes.length, ""));
  QUEST_CATEGORIES.forEach(function (category) {
    const count = otherIndexes.filter(function (i) {
      return quests[i].category === category.id;
    }).length;
    categoryFilterBox.appendChild(createFilterButton(category.id, category.icon + " " + category.name, count, "category-" + category.id));
  });
  const noneCount = otherIndexes.filter(function (i) {
    return !getCategory(quests[i].category);
  }).length;
  categoryFilterBox.appendChild(createFilterButton("", "🏷️ なし", noneCount, "is-none"));
}

// しぼりこみのボタンを1つ作って返す（えらんでいるボタンは濃い色。0こなら、うすくする）
function createFilterButton(value, text, count, colorClass) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "category-filter-button " + colorClass;
  button.classList.toggle("is-active", categoryFilter === value);
  button.classList.toggle("is-zero", count === 0);
  button.textContent = text + " " + count;
  button.addEventListener("click", function () {
    categoryFilter = value;
    renderQuests();
  });
  return button;
}

// 札を押したとき：札の場所に、えらぶ箱を出す。えらんだら保存して、表示し直す
function openCategorySelect(label, index) {
  const select = document.createElement("select");
  select.className = "category-select";
  fillCategoryOptions(select, quests[index].category);
  select.addEventListener("change", function () {
    quests[index].category = select.value;
    saveQuests();
    renderQuests();
  });
  select.addEventListener("blur", renderQuests); // えらばずに外を押したら、札にもどす
  label.replaceWith(select);
  select.focus();
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

// ===== カレンダー =====

// 年・月（0〜11）・日から、「2026-10-05」のような日付の文字を作って返す
function makeDateText(year, month, day) {
  return year + "-" + String(month + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0");
}

// 今日の分の撃破数がまだ記録されていなければ、「今日 〇体 撃破」の数から入れておく
// （カレンダーの記録を始める前に撃破した、今日の分のため）
function fillTodayHistory() {
  const today = getTodayString();
  if (defeatHistory[today] === undefined && todayDate === today && todayCount > 0) {
    defeatHistory[today] = todayCount;
  }
  // 集中の回数も同じように、記録がまだなければ「今日の集中：〇回」の数から入れておく
  if (focusHistory[today] === undefined && focusDate === today && focusCount > 0) {
    focusHistory[today] = focusCount;
  }
}

// その日にやる予定（やる日がその日）のクエストを、まとめて返す（撃破済みもふくむ）
function getPlanQuests(dateText) {
  return quests.filter(function (quest) {
    return quest.planDate === dateText;
  });
}

// その日が締切のクエストを、まとめて返す
function getDeadlineQuests(dateText) {
  return quests.filter(function (quest) {
    return quest.deadline === dateText;
  });
}

// その日に「まだ撃破していない、締切のあるクエスト」を、まとめて返す（締切までの毎日に出すため）
//   ・始まりの日：追加した日（追加した日の記録がない、前からあるクエストは今日）
//   ・終わりの日：締切の日（締切をすぎていたら、今日まで）
function getActiveQuestsOn(dateText) {
  const today = getTodayString();
  return quests.filter(function (quest) {
    if (quest.done || !quest.deadline) {
      return false; // 撃破済みと、締切のないクエストは出さない
    }
    const start = quest.planDate || quest.createdDate || today; // やる日があれば、やる日から
    let end = quest.deadline;
    if (end < today) {
      end = today; // 締切をすぎていたら、今日まで出しつづける
    }
    return start <= dateText && dateText <= end;
  });
}

// その日にやるクエストの中に、その日の時点で締切をすぎているものがあるかを返す（あればマスの 📝 を赤くする）
// （締切より前の日のマスは、赤くしない）
function hasOverdueActiveOn(dateText) {
  return getActiveQuestsOn(dateText).some(function (quest) {
    return quest.deadline < dateText;
  });
}

// その日にクリアした習慣を、まとめて返す
function getHabitsDoneOn(dateText) {
  return habits.filter(function (habit) {
    return habit.doneDates.includes(dateText);
  });
}

// その日に、締切をすぎて、まだ撃破していないクエストがあるかを返す（あればマスの 📅 を赤くする）
function hasOverdueOn(dateText) {
  return getDeadlineQuests(dateText).some(function (quest) {
    return !quest.done && getDeadlineStatus(dateText) === "overdue";
  });
}

// マスの中の小さなしるし（「⚔️3」など）を1つ作って返す
function createCalendarMark(text, className) {
  const mark = document.createElement("span");
  mark.className = "calendar-mark " + className;
  mark.textContent = text;
  return mark;
}

// 日付のマスを1つ作って返す
function createCalendarDay(year, month, day) {
  const dateText = makeDateText(year, month, day);
  const cell = document.createElement("button");
  cell.type = "button";
  cell.className = "calendar-day";

  // 曜日（0 が日曜、6 が土曜）で、日付の数字の色を変える目印を付ける
  const weekday = new Date(year, month, day).getDay();
  if (weekday === 0) {
    cell.classList.add("is-sunday");
  }
  if (weekday === 6) {
    cell.classList.add("is-saturday");
  }
  if (dateText === getTodayString()) {
    cell.classList.add("is-today"); // 今日は金色の枠
  }
  if (dateText === selectedDate) {
    cell.classList.add("is-selected"); // 押して選んでいる日
  }

  // 日付の数字
  const number = document.createElement("span");
  number.className = "calendar-number";
  number.textContent = day;
  cell.appendChild(number);

  // 📝 やること（締切までのクエスト）・⚔️ 撃破した数・📅 締切のクエストの数・🔁 クリアした習慣の数・🍅 集中した回数（0 のときは出さない）
  const actives = getActiveQuestsOn(dateText).length;
  const defeats = defeatHistory[dateText] || 0;
  const deadlines = getDeadlineQuests(dateText).length;
  const habitsDone = getHabitsDoneOn(dateText).length;
  const focuses = focusHistory[dateText] || 0;
  const plans = getPlanQuests(dateText).length;
  if (actives > 0) {
    cell.appendChild(createCalendarMark("📝" + actives, hasOverdueActiveOn(dateText) ? "is-overdue" : "is-task"));
  }
  if (defeats > 0) {
    cell.appendChild(createCalendarMark("⚔️" + defeats, "is-defeat"));
  }
  if (deadlines > 0) {
    cell.appendChild(createCalendarMark("📅" + deadlines, hasOverdueOn(dateText) ? "is-overdue" : "is-deadline"));
  }
  if (habitsDone > 0) {
    cell.appendChild(createCalendarMark("🔁" + habitsDone, "is-habit"));
  }
  if (focuses > 0) {
    cell.appendChild(createCalendarMark("🍅" + focuses, "is-focus"));
  }
  if (plans > 0) {
    cell.appendChild(createCalendarMark("🗓️" + plans, "is-plan")); // その日にやる予定の数
  }

  // 押したら、その日を選んで、くわしい中身を出す
  cell.addEventListener("click", function () {
    selectedDate = dateText;
    renderCalendar();
  });
  return cell;
}

// カレンダー（月のマス目と、選んでいる日のくわしい中身）を表示し直す
function renderCalendar() {
  if (selectedDate === "") {
    selectedDate = getTodayString(); // 最初は今日を選んでおく
  }
  calendarTitle.textContent = calendarYear + "年" + (calendarMonth + 1) + "月";

  calendarGrid.innerHTML = "";

  // 1日が何曜日かを調べて、その前を空のマスでうめる（日曜はじまり）
  const firstWeekday = new Date(calendarYear, calendarMonth, 1).getDay();
  for (let i = 0; i < firstWeekday; i++) {
    const blank = document.createElement("span");
    blank.className = "calendar-blank";
    calendarGrid.appendChild(blank);
  }

  // その月の日数（次の月の「0日」は、その月の最後の日になる）
  const daysInMonth = new Date(calendarYear, calendarMonth + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    calendarGrid.appendChild(createCalendarDay(calendarYear, calendarMonth, day));
  }

  renderWeekSummary();
  renderCalendarDetail();
}

// ===== 週のふりかえり =====

// dateText（「2026-10-01」）がふくまれる週の、日曜〜土曜の7日分の日付の文字を、配列にして返す
// moveWeeks に -1 を入れると、1つ前の週になる
function getWeekDates(dateText, moveWeeks) {
  const parts = dateText.split("-");
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
  const sunday = date.getDate() - date.getDay() + moveWeeks * 7; // その週の日曜日（getDay は日曜が 0）
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const day = new Date(date.getFullYear(), date.getMonth(), sunday + i);
    dates.push(makeDateText(day.getFullYear(), day.getMonth(), day.getDate()));
  }
  return dates;
}

// 7日分の日付の、撃破・集中・習慣の数と、1体以上撃破した日の数を数えて返す
function countWeek(dates) {
  const result = { defeats: 0, focuses: 0, habits: 0, defeatDays: 0 };
  dates.forEach(function (dateText) {
    const defeats = defeatHistory[dateText] || 0;
    result.defeats = result.defeats + defeats;
    result.focuses = result.focuses + (focusHistory[dateText] || 0);
    result.habits = result.habits + getHabitsDoneOn(dateText).length;
    if (defeats > 0) {
      result.defeatDays = result.defeatDays + 1;
    }
  });
  return result;
}

// 先週とのちがいの文字（「+3」「−1」「±0」）を作って返す。ふえたら緑、へったら赤の目印を付ける
function createWeekDiff(now, before) {
  const diff = now - before;
  const text = document.createElement("span");
  text.className = "week-diff";
  if (diff > 0) {
    text.textContent = "（先週より +" + diff + "）";
    text.classList.add("is-up");
  } else if (diff < 0) {
    text.textContent = "（先週より −" + Math.abs(diff) + "）";
    text.classList.add("is-down");
  } else {
    text.textContent = "（先週より ±0）";
  }
  return text;
}

// ふりかえりの1行（「⚔️ 撃破　12体」と、先週とのちがい）を作って返す
function createWeekLine(label, valueText, diffElement) {
  const line = document.createElement("p");
  line.className = "week-line";
  line.textContent = label + "　" + valueText;
  if (diffElement) {
    line.appendChild(diffElement);
  }
  return line;
}

// 週のふりかえりを表示し直す（押して選んでいる日がふくまれる週と、その1つ前の週をくらべる）
function renderWeekSummary() {
  const dates = getWeekDates(selectedDate, 0);
  const now = countWeek(dates);
  const before = countWeek(getWeekDates(selectedDate, -1));

  calendarWeek.innerHTML = "";
  const title = document.createElement("h3");
  title.className = "week-title";
  title.textContent = "📊 週のふりかえり　" + formatDeadline(dates[0]) + " 〜 " + formatDeadline(dates[6]);
  calendarWeek.appendChild(title);

  calendarWeek.appendChild(createWeekLine("⚔️ 撃破", now.defeats + "体", createWeekDiff(now.defeats, before.defeats)));
  calendarWeek.appendChild(createWeekLine("🍅 集中", now.focuses + "回", createWeekDiff(now.focuses, before.focuses)));
  calendarWeek.appendChild(createWeekLine("🔁 日課", now.habits + "回", createWeekDiff(now.habits, before.habits)));
  calendarWeek.appendChild(createWeekLine("🔥 撃破した日", now.defeatDays + " / 7日", null));
}

// 選んでいる日の、くわしい中身を表示し直す
function renderCalendarDetail() {
  calendarDetail.innerHTML = "";

  // 「10月5日（月）」の見出し
  const parts = selectedDate.split("-");
  const heading = document.createElement("h3");
  heading.className = "calendar-detail-title";
  heading.textContent = Number(parts[1]) + "月" + Number(parts[2]) + "日" + formatDeadline(selectedDate).replace(/^[0-9]+\/[0-9]+/, "");
  calendarDetail.appendChild(heading);

  // 📝 この日にやること（まだ撃破していない、締切までのクエスト）
  const activeQuests = getActiveQuestsOn(selectedDate);
  if (activeQuests.length === 0) {
    addDetailLine("📝 この日にやること：なし");
  } else {
    addDetailLine("📝 この日にやること：");
    for (let i = 0; i < activeQuests.length; i++) {
      const quest = activeQuests[i];
      const mark = quest.deadline < selectedDate ? "⚠️ " : ""; // その日の時点で締切をすぎていたら ⚠️
      addDetailLine("　・" + mark + quest.name + "（" + formatDeadline(quest.deadline) + "まで）");
    }
  }

  // ⚔️ 撃破した数
  addDetailLine("⚔️ 撃破した数：" + (defeatHistory[selectedDate] || 0) + "体");

  // 📅 この日が締切のクエスト（撃破済み・期限切れ・今日まで・まだ）
  const deadlineQuests = getDeadlineQuests(selectedDate);
  if (deadlineQuests.length === 0) {
    addDetailLine("📅 この日が締切：なし");
  } else {
    addDetailLine("📅 この日が締切：");
    for (let i = 0; i < deadlineQuests.length; i++) {
      addDetailLine("　・" + deadlineQuests[i].name + "（" + getDeadlineState(deadlineQuests[i]) + "）");
    }
  }

  // 🔁 この日にクリアした習慣
  const habitsDone = getHabitsDoneOn(selectedDate);
  if (habitsDone.length === 0) {
    addDetailLine("🔁 クリアした日課：なし");
  } else {
    addDetailLine("🔁 クリアした日課：" + habitsDone.map(function (habit) {
      return habit.name;
    }).join("、"));
  }

  // 🍅 この日に集中タイム（ポモドーロ）を終えた回数
  addDetailLine("🍅 集中した回数：" + (focusHistory[selectedDate] || 0) + "回");

  // 🗓️ この日にやる予定（撃破済みには ✅ を付ける）
  const planQuests = getPlanQuests(selectedDate);
  if (planQuests.length === 0) {
    addDetailLine("🗓️ この日の予定：なし");
  } else {
    addDetailLine("🗓️ この日の予定：" + planQuests.map(function (quest) {
      return (quest.done ? "✅ " : "") + quest.name;
    }).join("、"));
  }
}

// くわしい中身に、1行を足す
function addDetailLine(text) {
  const line = document.createElement("p");
  line.className = "calendar-detail-line";
  line.textContent = text;
  calendarDetail.appendChild(line);
}

// 締切のクエストの状態を、短い文字で返す
function getDeadlineState(quest) {
  if (quest.done) {
    return "✅ 撃破済み";
  }
  const status = getDeadlineStatus(quest.deadline);
  if (status === "overdue") {
    return "⚠️ 期限切れ";
  }
  if (status === "today") {
    return "⏰ 今日まで";
  }
  return "まだ";
}

// カレンダーの月を、step（-1 なら前の月、1 なら次の月）だけ動かす
function moveCalendarMonth(step) {
  calendarMonth = calendarMonth + step;
  // 0 より小さくなったら前の年の12月、11 より大きくなったら次の年の1月にする
  if (calendarMonth < 0) {
    calendarMonth = 11;
    calendarYear = calendarYear - 1;
  }
  if (calendarMonth > 11) {
    calendarMonth = 0;
    calendarYear = calendarYear + 1;
  }
  renderCalendar();
}

// 「今月」：今日の月に戻して、今日を選ぶ
function showThisMonth() {
  const now = new Date();
  calendarYear = now.getFullYear();
  calendarMonth = now.getMonth();
  selectedDate = getTodayString();
  renderCalendar();
}

// ===== 締切 =====

// 「2026-10-05」のような日付の文字を、「10/5（月）」のような文字にして返す
function formatDeadline(dateText) {
  const parts = dateText.split("-"); // ["2026", "10", "05"] に分ける
  const date = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2])); // 月は 0 から数えるので -1
  const weekdays = ["日", "月", "火", "水", "木", "金", "土"];
  return (date.getMonth() + 1) + "/" + date.getDate() + "（" + weekdays[date.getDay()] + "）";
}

// 締切が「今日より前（期限切れ）」「今日」「まだ先」のどれかを返す
// （「2026-10-05」の形の文字は、そのまま大小をくらべると、日付の前後がわかります）
function getDeadlineStatus(dateText) {
  const today = getTodayString();
  if (dateText < today) {
    return "overdue";
  }
  if (dateText === today) {
    return "today";
  }
  return "future";
}

// 締切の表示の文字を返す（締切がないときは「締切なし」）
function getDeadlineText(quest) {
  if (!quest.deadline) {
    return "📅 締切なし";
  }
  const status = getDeadlineStatus(quest.deadline);
  if (quest.done || status === "future") {
    return "📅 " + formatDeadline(quest.deadline) + "まで";
  }
  if (status === "today") {
    return "⏰ 今日まで";
  }
  return "⚠️ " + formatDeadline(quest.deadline) + "まで 期限切れ";
}

// 締切の表示を作って返す
// まだ撃破していないクエストは、押すとカレンダーが出て、締切を変えられる
function createDeadlineLabel(quest, index) {
  // 撃破済みのクエストは、締切があるときだけ、ただの文字として出す（変えられない）
  if (quest.done) {
    const text = document.createElement("span");
    text.className = "deadline-label";
    text.textContent = quest.deadline ? getDeadlineText(quest) : "";
    return text;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "deadline-label deadline-button";
  button.textContent = getDeadlineText(quest) + " ✏️";

  // 今日まで・期限切れのときは、色を付ける目印を付ける
  if (quest.deadline) {
    button.classList.add("is-" + getDeadlineStatus(quest.deadline));
  }

  // カレンダーを出すための、見えない日付の欄（ボタンの中に入れておく）
  const picker = document.createElement("input");
  picker.type = "date";
  picker.className = "deadline-picker";
  picker.value = quest.deadline || "";
  picker.tabIndex = -1; // キーボードの Tab キーでは選ばないようにする
  picker.addEventListener("change", function () {
    changeDeadline(index, picker.value); // 日付を消したら、締切なしになる
  });
  button.appendChild(picker);

  // ボタンを押したら、カレンダーを出す
  button.addEventListener("click", function () {
    openDeadlinePicker(picker, index);
  });
  return button;
}

// 見えない日付の欄の、カレンダーを出す
// （カレンダーを出す仕組みがない古いブラウザでは、代わりに日付を文字で入力してもらう）
function openDeadlinePicker(picker, index) {
  try {
    picker.showPicker();
  } catch (error) {
    const input = prompt("締切の日付を「2026-10-05」の形で入力してください（空にすると締切なし）", picker.value);
    if (input !== null) {
      changeDeadline(index, input.trim());
    }
  }
}

// ===== やる日（この日にやる予定） =====

// やる日の文字を返す（まだ先：「🗓️ 10/5（日）にやる」、今日：「🗓️ 今日やる予定」、すぎた：「🗓️ 10/5（日）の予定（すぎています）」）
function getPlanText(quest) {
  const today = getTodayString();
  if (quest.planDate === today) {
    return "🗓️ 今日やる予定";
  }
  if (quest.planDate > today) {
    return "🗓️ " + formatDeadline(quest.planDate) + "にやる";
  }
  return "🗓️ " + formatDeadline(quest.planDate) + "の予定" + (quest.done ? "" : "（すぎています）");
}

// クエストのやる日の表示を作って返す（やる日がないときは null）
// まだ撃破していないクエストは、押すとカレンダーが出て、やる日を変えられる（消すと、すぐやるクエストにもどる）
function createPlanLabel(quest, index) {
  if (!quest.planDate) {
    return null;
  }
  if (quest.done) {
    const text = document.createElement("span");
    text.className = "deadline-label plan-label";
    text.textContent = getPlanText(quest);
    return text;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "deadline-label deadline-button plan-label";
  button.textContent = getPlanText(quest) + " ✏️";
  if (quest.planDate < getTodayString()) {
    button.classList.add("is-overdue"); // やる日をすぎていたら、赤くする（締切の期限切れと同じ色）
  }

  // カレンダーを出すための、見えない日付の欄（締切と同じしくみ）
  const picker = document.createElement("input");
  picker.type = "date";
  picker.className = "deadline-picker";
  picker.value = quest.planDate;
  picker.tabIndex = -1;
  picker.addEventListener("change", function () {
    changePlanDate(index, picker.value); // 日付を消したら、やる日なし
  });
  button.appendChild(picker);
  button.addEventListener("click", function () {
    openPlanPicker(picker, index);
  });
  return button;
}

// 見えない日付の欄の、カレンダーを出す（出せない古いブラウザでは、文字で入力してもらう）
function openPlanPicker(picker, index) {
  try {
    picker.showPicker();
  } catch (error) {
    const input = prompt("やる日を「2026-10-05」の形で入力してください（空にすると、やる日なし）", picker.value);
    if (input !== null) {
      changePlanDate(index, input.trim());
    }
  }
}

// index 番目のクエストのやる日を変えて保存する（空ならやる日なし。並び順と本日のタスクも変わる）
function changePlanDate(index, dateText) {
  quests[index].planDate = dateText;
  saveQuests();
  renderQuests();
  console.log("やる日を変えました", quests[index]);
}

// index 番目のクエストの締切を変えて保存する（空なら締切なし）
function changeDeadline(index, dateText) {
  quests[index].deadline = dateText;
  saveQuests();
  renderQuests();
  console.log("締切を変えました", quests[index]);
}

// index 番目から step の向き（-1 なら上、1 なら下）に見ていき、
// いちばん近い「まだ撃破していないクエスト」が何番目かを返す（無いときは -1）
// ただし、ピン止めしているかどうか・締切がちがうクエストとは入れ替えないので、そのときも -1 を返す
// （締切が近い順に自動で並べているので、同じピン止めの状態で同じ締切のクエストどうしだけ入れ替えられる）
function findUndoneNeighbor(index, step) {
  let i = index + step;
  while (i >= 0 && i < quests.length) {
    if (!quests[i].done) {
      if (getSortKey(quests[i]) === getSortKey(quests[index])) {
        return i;
      }
      return -1; // ピン止めや締切の境目なので、ここより先には動かせない
    }
    i = i + step;
  }
  return -1;
}

// クエストがピン止めされているかどうかを返す（前の保存データには pinned が無いので、そのときは false）
function isPinned(quest) {
  return quest.pinned === true;
}

// ピン止めしている、まだ撃破していないクエストの数を返す
function countPinned() {
  let count = 0;
  for (let i = 0; i < quests.length; i++) {
    if (isPinned(quests[i]) && !quests[i].done) {
      count = count + 1;
    }
  }
  return count;
}

// index 番目のクエストを、ピン止めする・ピン止めをやめる
// ピン止めしたら「ピン止めしたクエストのいちばん下」へ、やめたら「ピン止めしていないクエストのいちばん上」へ移す
function togglePin(index) {
  const quest = quests[index];

  // すでに上限まで（5つ）ピン止めしているときは、新しくピン止めしない
  if (!isPinned(quest) && countPinned() >= PIN_MAX) {
    return;
  }

  // いったん取り出して、ピン止めの印を切りかえる
  quests.splice(index, 1);
  quest.pinned = !isPinned(quest);

  // ピン止めしている未撃破のクエストのうち、いちばん下のもののすぐ後ろに入れる
  // （このあと保存するときに締切が近い順に並べかえるので、最後はピン止めの中の、締切の順の場所に入る）
  let position = 0;
  for (let i = 0; i < quests.length; i++) {
    if (isPinned(quests[i]) && !quests[i].done) {
      position = i + 1;
    }
  }
  quests.splice(position, 0, quest);

  saveQuests();
  renderQuests();
  console.log("ピン止めを切りかえました", quest);
}

// 📌ボタンを作って返す（押すとピン止めする・やめる）
function createPinButton(quest, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pin-button";
  button.textContent = "📌";

  // ピン止め中なら、ピンを濃く表示する目印を付ける
  if (isPinned(quest)) {
    button.classList.add("is-pinned");
  }

  // 上限まで（5つ）ピン止めしているときは、ピン止めしていないクエストのボタンを押せなくする
  button.disabled = !isPinned(quest) && countPinned() >= PIN_MAX;

  button.addEventListener("click", function () {
    togglePin(index);
  });
  return button;
}

// index 番目のクエストを、1つ上（step が -1）か1つ下（step が 1）の未撃破のクエストと入れ替えて保存する
function moveQuest(index, step) {
  const other = findUndoneNeighbor(index, step);
  if (other === -1) {
    return;
  }

  // 2つのクエストの場所を入れ替える
  const temp = quests[index];
  quests[index] = quests[other];
  quests[other] = temp;

  saveQuests();
  renderQuests();
}

// ▲▼ボタンを1つ作って返す（step が -1 なら ▲、1 なら ▼）
function createMoveButton(index, step) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "move-button";
  if (step === -1) {
    button.textContent = "▲";
  } else {
    button.textContent = "▼";
  }

  // 入れ替える相手がいない（いちばん上・いちばん下）ときは、押せなくする
  button.disabled = findUndoneNeighbor(index, step) === -1;

  button.addEventListener("click", function () {
    moveQuest(index, step);
  });
  return button;
}

// ▲▼ボタンを2つまとめた箱を作って返す
// isColumn が true なら縦に重ね、false なら横に並べる
function createMoveButtons(index, isColumn) {
  const box = document.createElement("span");
  box.className = "move-buttons";
  if (isColumn) {
    box.classList.add("is-column");
  }
  box.appendChild(createMoveButton(index, -1));
  box.appendChild(createMoveButton(index, 1));
  return box;
}

// クエスト1つ分の行（li）を作って返す
function createQuestItem(quest, index) {
  const item = document.createElement("li");
  item.className = "quest-item";

  // 撃破済みなら、薄く表示するための目印（クラス）を付ける
  if (quest.done) {
    item.classList.add("is-done");
  }

  // やる日がまだ先のクエストは、少し薄くする目印を付ける
  if (!quest.done && isFuturePlan(quest)) {
    item.classList.add("is-future-plan");
  }

  // ピン止め中なら、行を少し黄色くする目印を付ける
  if (isPinned(quest) && !quest.done) {
    item.classList.add("is-pinned");
  }

  // 1行を2段に分ける（上の段：名前とEXP、下の段：ボタン）
  // 締切は、名前が細かく折り返されないように、上の段と下の段のあいだに1行で出す
  // （撃破済みで締切がないクエストは、何も出さない）
  item.appendChild(createQuestItemTop(quest, index));
  if (!quest.done || quest.deadline) {
    item.appendChild(createDeadlineLabel(quest, index));
  }
  const planLabel = createPlanLabel(quest, index); // やる日（あるときだけ）
  if (planLabel) {
    item.appendChild(planLabel);
  }
  item.appendChild(createQuestItemBottom(quest, index));
  return item;
}

// 他のタスクの一覧の、上の段を作って返す（クエスト名・目印・獲得EXP）
function createQuestItemTop(quest, index) {
  const top = document.createElement("div");
  top.className = "quest-top";

  // カテゴリの札（押すとえらびなおせる）と、タスク名（押すと名前を直せる）
  const categoryLabel = createCategoryLabel(quest, index);
  if (categoryLabel) {
    top.appendChild(categoryLabel);
  }
  top.appendChild(createQuestName(quest, index, "span", "quest-name"));

  // 撃破済みなら「撃破済み」の目印を出す
  if (quest.done) {
    top.appendChild(createDoneLabel());
  }

  // 獲得EXP（レアなクエストなら、前に「✨」を付けて、金色の札のように見せる）
  const exp = document.createElement("span");
  exp.className = "quest-exp";
  exp.textContent = quest.exp + " EXP";
  if (quest.rare) {
    exp.textContent = "✨" + quest.exp + " EXP";
    exp.classList.add("is-rare-exp");
  }
  top.appendChild(exp);
  return top;
}

// 他のタスクの一覧の、下の段を作って返す（▲▼・📌・チェックボックス・撃破ボタン・削除ボタン）
function createQuestItemBottom(quest, index) {
  const bottom = document.createElement("div");
  bottom.className = "quest-bottom";

  // まだ撃破していなければ、▲▼ボタンと📌ボタンを置く
  if (!quest.done) {
    bottom.appendChild(createMoveButtons(index, false));
    bottom.appendChild(createPinButton(quest, index));
  }

  // まだ撃破していなければ、「選ぶ」チェックボックスと撃破ボタンを置く
  // （レベルアップの演出の間は、どちらも置かない）
  if (!quest.done && !isDefeatLocked) {
    bottom.appendChild(createSelectCheckbox(quest));
    bottom.appendChild(createDefeatButton(quest, index, "撃破", "defeat-button"));
  }

  // 削除ボタンは、いつも右はしに置く
  bottom.appendChild(createDeleteButton(index));
  return bottom;
}

// 本日のタスクの「いちばん上」のクエストが、quests 配列の何番目かを返す（モンスターを決めるのに使う）
// （まだ撃破していない一番上のクエスト。1つも無いときは -1 を返す）
function findTodayIndex() {
  for (let i = 0; i < quests.length; i++) {
    if (!quests[i].done && !isFuturePlan(quests[i])) { // やる日がまだ先のクエストは、本日のタスクにしない
      return i;
    }
  }
  return -1;
}

// 「本日のタスク」にするクエストが、quests 配列の何番目かを並べて返す
// （まだ撃破していないクエストを、上から最大 TODAY_MAX 個。1つも無いときは空の配列）
function findTodayIndexes() {
  const indexes = [];
  for (let i = 0; i < quests.length; i++) {
    if (!quests[i].done && !isFuturePlan(quests[i]) && indexes.length < TODAY_MAX) { // やる日がまだ先のクエストは、本日のタスクにしない
      indexes.push(i);
    }
  }
  return indexes;
}

// 「本日のタスク」のカードの中身を作って表示する
// indexes は、本日のタスクにするクエストが quests 配列の何番目か（最大5つ）
function renderToday(indexes) {
  // いったん中身を空にする
  todayQuest.innerHTML = "";

  // 撃破していないクエストが無いときは、メッセージだけ出す
  if (indexes.length === 0) {
    const empty = document.createElement("p");
    empty.className = "today-empty";
    empty.textContent = "未撃破のクエストはありません";
    todayQuest.appendChild(empty);
    return;
  }

  // クエストを1つずつ行にして並べる
  for (let i = 0; i < indexes.length; i++) {
    todayQuest.appendChild(createTodayItem(quests[indexes[i]], indexes[i]));
  }
}

// 本日のタスクのクエスト1つ分の行を作って返す
function createTodayItem(quest, index) {
  const item = document.createElement("div");
  item.className = "today-item";

  // 「選ぶ」チェックボックスとクエスト名を横に並べる行
  // （チェックボックスは、レベルアップの演出の間は置かない）
  const nameLine = document.createElement("div");
  nameLine.className = "today-name-line";
  if (!isDefeatLocked) {
    nameLine.appendChild(createSelectCheckbox(quest));
  }

  // レアなクエストなら、クエスト名の前に「✨レア」の目印を付ける
  if (quest.rare) {
    nameLine.appendChild(createRareLabel());
  }
  const categoryLabel = createCategoryLabel(quest, index); // カテゴリの札（押すとえらびなおせる）
  if (categoryLabel) {
    nameLine.appendChild(categoryLabel);
  }
  nameLine.appendChild(createQuestName(quest, index, "p", "today-name")); // 押すと名前を直せる
  nameLine.appendChild(createPinButton(quest, index)); // 📌ボタン
  nameLine.appendChild(createMoveButtons(index, false)); // 右はしに、横に並べた▲▼ボタン

  // ピン止め中なら、行を少し黄色くする目印を付ける
  if (isPinned(quest)) {
    item.classList.add("is-pinned");
  }
  item.appendChild(nameLine);

  // クエスト名の下に、締切（押すと変えられる）
  item.appendChild(createDeadlineLabel(quest, index));
  const planLabel = createPlanLabel(quest, index); // 締切の下に、やる日（あるときだけ）
  if (planLabel) {
    item.appendChild(planLabel);
  }

  // 「（〇 EXP get）」と、ボタンを横に並べる行
  const row = document.createElement("div");
  row.className = "today-row";

  const exp = document.createElement("p");
  exp.className = "today-exp";
  exp.textContent = "（" + quest.exp + " EXP get）";
  row.appendChild(exp);

  // 撃破ボタンと削除ボタンを横に並べる箱
  const actions = document.createElement("div");
  actions.className = "today-actions";

  // 「⚔️ 撃破する」ボタン（隠しているときは、代わりに「レベルアップ中…」を出す）
  if (isDefeatLocked) {
    const waiting = document.createElement("span");
    waiting.className = "today-waiting";
    waiting.textContent = "レベルアップ中…";
    actions.appendChild(waiting);
  } else {
    actions.appendChild(createDefeatButton(quest, index, "⚔️ 撃破する", "today-defeat-button"));
  }
  actions.appendChild(createDeleteButton(index));
  row.appendChild(actions);

  item.appendChild(row);
  return item;
}

// 画面のクエスト表示（本日のタスクと、他のタスクの一覧）をすべて表示し直す
function renderQuests() {
  renderBossDayBanner(); // ボス戦の日のお知らせ（日付が変わったときのため、描き直すたびに確かめる）
  const todayIndexes = findTodayIndexes(); // 本日のタスク（最大5つ）
  renderToday(todayIndexes);
  renderMonster(findTodayIndex()); // モンスターは、本日のタスクのいちばん上のクエストの分

  // 選んだクエストのうち、まだあって未撃破のものだけを残す
  // （削除したもの・撃破したものは、選んだ状態から外す）
  selectedQuests = selectedQuests.filter(function (quest) {
    return quests.includes(quest) && !quest.done;
  });

  // 他のタスクの一覧に入るクエストの番号（本日のタスクの分と、やる日がまだ先のクエストは除く）
  // やる日がまだ先のクエストは、明日以降の一覧に入れる
  const otherIndexes = [];
  const futureIndexes = [];
  for (let i = 0; i < quests.length; i++) {
    if (!quests[i].done && isFuturePlan(quests[i])) {
      futureIndexes.push(i);
    } else if (!todayIndexes.includes(i) || quests[i].done) {
      otherIndexes.push(i);
    }
  }

  // 切りかえボタンの数と、今出している一覧のしぼりこみのボタン
  renderOtherSwitch(otherIndexes.length, futureIndexes.length);
  renderCategoryFilter(otherListView === "future" ? futureIndexes : otherIndexes);

  renderOtherList(otherIndexes);
  renderFutureList(futureIndexes);

  // 撃破済みが0件なら、まとめて削除のボタンを押せなくする
  clearDoneButton.disabled = countDoneQuests() === 0;

  // まとめて撃破のボタンを表示し直す
  renderBulkDefeatButton();

  // 毎日の習慣のカードも表示し直す（レベルアップ中に撃破ボタンを隠すのも、ここで反映する）
  renderHabits();

  // カレンダーも表示し直す（締切や撃破の数が変わったときのため）
  renderCalendar();
}

// ===== 他のタスク・明日以降の一覧 =====

// 「他のタスク」の一覧を作る（まだ撃破していないクエストが先、撃破済みはあと。しぼりこみに合うものだけ）
function renderOtherList(otherIndexes) {
  questList.innerHTML = "";
  let shownCount = 0;
  [false, true].forEach(function (isDone) {
    otherIndexes.forEach(function (i) {
      if (quests[i].done === isDone && matchesCategoryFilter(quests[i])) {
        questList.appendChild(createQuestItem(quests[i], i));
        shownCount = shownCount + 1;
      }
    });
  });
  if (categoryFilter !== "all" && shownCount === 0) {
    questList.appendChild(createListMessage("このカテゴリのクエストはありません"));
  }
}

// 「🗓️ 明日以降」の一覧を作る（やる日ごとに「🗓️ 10/5（月）」の見出しを付けて、その下にならべる）
// futureIndexes は、やる日が近い順にならんでいる（並べかえのときに、そうしている）
function renderFutureList(futureIndexes) {
  futureList.innerHTML = "";
  const shown = futureIndexes.filter(function (i) {
    return matchesCategoryFilter(quests[i]);
  });
  let lastDate = "";
  shown.forEach(function (i) {
    if (quests[i].planDate !== lastDate) {
      lastDate = quests[i].planDate;
      const heading = document.createElement("li");
      heading.className = "future-date-heading";
      heading.textContent = "🗓️ " + formatDeadline(lastDate);
      futureList.appendChild(heading);
    }
    futureList.appendChild(createQuestItem(quests[i], i));
  });
  if (futureIndexes.length === 0) {
    futureList.appendChild(createListMessage("明日以降の予定はありません（「🗓️ やる日」をえらんで追加できます）"));
  } else if (shown.length === 0) {
    futureList.appendChild(createListMessage("このカテゴリのクエストはありません"));
  }
}

// 一覧の中の、説明の1行を作って返す（「〇〇はありません」など）
function createListMessage(text) {
  const message = document.createElement("li");
  message.className = "category-filter-empty";
  message.textContent = text;
  return message;
}

// 切りかえボタンの数（「他のタスク 4」「🗓️ 明日以降 3」）と、えらんでいるボタンを表示し直す
function renderOtherSwitch(otherCount, futureCount) {
  otherSwitchButtons.forEach(function (button) {
    const isFuture = button.dataset.list === "future";
    button.textContent = isFuture ? "🗓️ 明日以降 " + futureCount : "他のタスク " + otherCount;
    button.classList.toggle("is-active", button.dataset.list === otherListView);
  });
  applyOtherVisibility();
}

// 「他のタスク」の一覧が開いているか、どちらの一覧をえらんでいるかに合わせて、出したり隠したりする
function applyOtherVisibility() {
  questList.hidden = !isOtherOpen || otherListView !== "other";
  futureList.hidden = !isOtherOpen || otherListView !== "future";
  clearDoneButton.hidden = !isOtherOpen; // まとめて削除のボタンも、一覧と一緒に出したり消したりする
  categoryFilterBox.hidden = !isOtherOpen; // しぼりこみのボタンも
  otherSwitch.hidden = !isOtherOpen; // 切りかえボタンも
  otherToggle.textContent = isOtherOpen ? "他のタスク △" : "他のタスク ▽"; // 開いているときは △、閉じているときは ▽
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

// ガチャのランクを、確率どおりに1つ選んで返す
// （0 以上 1 未満のランダムな数を出し、確率を順に足していって、それをこえたところのランクにする）
function pickGachaRank() {
  const dice = Math.random();
  let total = 0;
  for (let i = 0; i < GACHA_RANKS.length; i++) {
    total = total + GACHA_RANKS[i].chance;
    if (dice < total) {
      return GACHA_RANKS[i];
    }
  }
  return GACHA_RANKS[0]; // 念のため（計算の誤差でどれにも入らなかったとき）
}

// ランクを決めてから、そのランクのアイテムの中から1つを同じ確率で選んで返す
function pickGachaItem() {
  const rank = pickGachaRank();
  const candidates = GACHA_ITEMS.filter(function (item) {
    return item.rank === rank.rank;
  });
  return candidates[Math.floor(Math.random() * candidates.length)];
}

// ランク（1〜3、ショップ限定は 4）の★を返す
function getRankStars(rank) {
  if (rank === SHOP_RANK.rank) {
    return SHOP_RANK.stars + " " + SHOP_RANK.name; // ショップ限定は「🛒 ショップ限定」
  }
  return GACHA_RANKS[rank - 1].stars;
}

// ガチャを1回引く（コインが足りないときは何もしない）
function drawGacha() {
  if (coins < GACHA_COST) {
    return;
  }

  // コインを使って、アイテムを1つ出す
  coins = coins - GACHA_COST;
  const item = drawOneItem();
  savePlayer();

  // 前回の結果に出して、演出で知らせる（順番待ちの列に並べる）
  lastGachaResults = [item];
  renderGacha();
  console.log("ガチャを引きました", item);
  addGachaEffect(item);
  checkAchievements(true); // 新しくとれた実績があれば、演出を出す
}

// アイテムを1つ出して、持っている数を1つ増やし、出たアイテムを返す（1回引く・10連で使う）
// 10%の確率で、アイテムの代わりに卵が出る（卵のときは、卵の数を1つ増やす）
function drawOneItem() {
  if (Math.random() < EGG_CHANCE) {
    const egg = pickEggType();
    eggs[egg.type] = (eggs[egg.type] || 0) + 1;

    // 前回の結果や演出で、アイテムと同じように表示できる形にして返す
    return { isEgg: true, icon: "🥚", name: egg.name, rank: egg.rank };
  }

  const item = pickGachaItem();
  items[item.id] = (items[item.id] || 0) + 1;
  return item;
}

// 卵の種類を、確率どおりに1つ選んで返す（白 60%・青 30%・金 10%）
function pickEggType() {
  const dice = Math.random();
  let total = 0;
  for (let i = 0; i < EGG_TYPES.length; i++) {
    total = total + EGG_TYPES[i].chance;
    if (dice < total) {
      return EGG_TYPES[i];
    }
  }
  return EGG_TYPES[0]; // 念のため（計算の誤差でどれにも入らなかったとき）
}

// 10連ガチャを引く（コインが足りないときは何もしない）
function drawGachaTen() {
  if (coins < GACHA_TEN_COST) {
    return;
  }

  // コインを使って、アイテムを10個出す
  coins = coins - GACHA_TEN_COST;
  const results = [];
  for (let i = 0; i < 10; i++) {
    results.push(drawOneItem());
  }
  savePlayer();

  // 前回の結果に10個出して、まとめた演出で知らせる
  lastGachaResults = results;
  renderGacha();
  console.log("10連ガチャを引きました", results);
  addGachaTenEffect(results);
  checkAchievements(true); // 新しくとれた実績があれば、演出を出す
}

// 10連ガチャの演出を列に並べる（「🎰 10連ガチャ！ ★★★×1 ★★×3 ★×6」のように、ランクごとの数を出す）
function addGachaTenEffect(results) {
  // アイテムのランクごとに、いくつ出たか数える（counts[3] が ★★★ の数）。卵は別に数える
  const counts = { 1: 0, 2: 0, 3: 0 };
  let eggCount = 0;
  for (let i = 0; i < results.length; i++) {
    if (results[i].isEgg) {
      eggCount = eggCount + 1;
    } else {
      counts[results[i].rank] = counts[results[i].rank] + 1;
    }
  }

  // 卵が出ていたら、最後に「🥚×〇」も足す
  let text = "🎰 10連ガチャ！\n★★★×" + counts[3] + "  ★★×" + counts[2] + "  ★×" + counts[1];
  if (eggCount > 0) {
    text = text + "  🥚×" + eggCount;
  }

  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = text;
    restartAnimation(effectOverlay, "is-celebrate");

    // ★★★ が1つでもあればファンファーレ、なければキラキラの音
    if (counts[3] > 0) {
      playFanfareSound();
    } else {
      playSparkleSound();
    }
  }, CELEBRATE_EFFECT_TIME);
}

// 前回の結果に出す、アイテム1つ分を作って返す
function createResultItem(item) {
  const cell = document.createElement("li");
  cell.className = "collection-item rank-" + item.rank;

  const icon = document.createElement("span");
  icon.className = "collection-icon";
  icon.textContent = item.icon;

  const label = document.createElement("span");
  label.className = "collection-name";
  label.textContent = item.name + " " + getRankStars(item.rank);

  cell.appendChild(icon);
  cell.appendChild(label);
  return cell;
}

// 前回の結果を表示し直す（1回のときは大きく1つ、10連のときは5個ずつ2段）
function renderGachaResult() {
  gachaResultList.innerHTML = "";

  // まだ引いていないときは、説明だけ出す
  if (lastGachaResults.length === 0) {
    gachaResultList.className = "gacha-result-list";
    gachaResultEmpty.hidden = false;
    return;
  }
  gachaResultEmpty.hidden = true;

  // 1つだけのときは、大きく見せる目印を付ける
  if (lastGachaResults.length === 1) {
    gachaResultList.className = "gacha-result-list is-single";
  } else {
    gachaResultList.className = "gacha-result-list";
  }

  for (let i = 0; i < lastGachaResults.length; i++) {
    gachaResultList.appendChild(createResultItem(lastGachaResults[i]));
  }
}

// 確率の表を表示し直す（GACHA_RANKS と GACHA_ITEMS の表から計算する）
function renderGachaRates() {
  gachaRateList.innerHTML = "";
  for (let i = 0; i < GACHA_RANKS.length; i++) {
    const rank = GACHA_RANKS[i];

    // そのランクのアイテムが何種類あるか数えて、1つあたりの確率を出す
    // 卵が出る 10% の分だけ、アイテムの確率は少し下がる（ランクの確率 × 0.9）
    const kinds = GACHA_ITEMS.filter(function (item) {
      return item.rank === rank.rank;
    }).length;
    const chance = rank.chance * (1 - EGG_CHANCE) * 100;
    const each = chance / kinds;

    const row = document.createElement("li");
    row.className = "gacha-rate rank-" + rank.rank;
    row.textContent =
      rank.stars + " " + rank.name + "　" + Math.round(chance * 100) / 100 + "%" +
      "（" + kinds + "種類・1つあたり 約" + Math.round(each * 10) / 10 + "%）";
    gachaRateList.appendChild(row);
  }

  // 卵の行（卵が出たときの、白・青・金の割合も出す）
  const eggRow = document.createElement("li");
  eggRow.className = "gacha-rate is-egg";
  const eggParts = EGG_TYPES.map(function (egg) {
    return egg.name + " " + Math.round(egg.chance * 100) + "%";
  });
  eggRow.textContent = "🥚 卵　" + Math.round(EGG_CHANCE * 100) + "%（" + eggParts.join("・") + "）";
  gachaRateList.appendChild(eggRow);
}

// ガチャで出たアイテムの演出を列に並べる（金色にふわっと光って、「〇〇 をゲット！」が出る）
function addGachaEffect(item) {
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🎰 " + item.icon + " " + item.name + " をゲット！\n" + getRankStars(item.rank);
    restartAnimation(effectOverlay, "is-celebrate");

    // ★★★ はファンファーレ、それ以外はキラキラの音
    if (item.rank === 3) {
      playFanfareSound();
    } else {
      playSparkleSound();
    }
  }, CELEBRATE_EFFECT_TIME);
}

// 図鑑のアイテム1つ分を作って返す（持っていなければ ❓ にする）
function createCollectionItem(item) {
  const cell = document.createElement("li");
  cell.className = "collection-item rank-" + item.rank;
  const count = items[item.id] || 0;

  if (count === 0) {
    cell.classList.add("is-unknown");
    cell.textContent = "❓";
    cell.title = "まだ持っていません（" + getRankStars(item.rank) + "）";
    return cell;
  }

  // 絵文字と、その下に名前と数（2つ以上なら「×2」）
  const icon = document.createElement("span");
  icon.className = "collection-icon";
  icon.textContent = item.icon;

  const label = document.createElement("span");
  label.className = "collection-name";
  label.textContent = item.name + (count >= 2 ? " ×" + count : "");

  cell.appendChild(icon);
  cell.appendChild(label);
  cell.title = item.name + "（" + getRankStars(item.rank) + "）";

  // 装備できない道具なら、ここでおしまい
  if (item.slot === null) {
    cell.title = cell.title + " 装備できない道具です";
    return cell;
  }

  // 装備できるアイテムは、押すと装備する・はずす
  cell.classList.add("is-equippable");
  cell.addEventListener("click", function () {
    toggleEquip(item);
  });

  // 装備中なら、「装備中」の札と太い枠を付ける
  if (equipped[item.slot] === item.id) {
    cell.classList.add("is-equipped");
    const badge = document.createElement("span");
    badge.className = "equipped-badge";
    badge.textContent = "装備中";
    cell.appendChild(badge);
  }
  return cell;
}

// アイテムを装備する・はずす（同じ部位のアイテムを装備していたら、入れかえる）
function toggleEquip(item) {
  if (equipped[item.slot] === item.id) {
    delete equipped[item.slot]; // もう装備しているので、はずす
  } else {
    equipped[item.slot] = item.id; // 装備する（同じ部位の前のアイテムと入れかわる）
  }
  savePlayer();
  renderStatus(); // キャラの絵と図鑑を描き直す
  console.log("装備を変えました", equipped);
}

// アイテムの id から、ガチャのアイテムとショップ限定の装備の表の行を返す
function findItem(itemId) {
  return GACHA_ITEMS.concat(SHOP_ITEMS).find(function (item) {
    return item.id === itemId;
  });
}

// 「そうび：頭 👑 ／ 武器 🗡️ ／ …」の文字を作って返す
function getEquipSummary() {
  const parts = [];
  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const itemId = equipped[EQUIP_SLOTS[i].slot];
    let icon = "―"; // 何も装備していない部位は「―」
    if (itemId) {
      icon = findItem(itemId).icon;
    }
    parts.push(EQUIP_SLOTS[i].name + " " + icon);
  }
  return "そうび：" + parts.join(" ／ ");
}

// アイテムの一覧（list）のうち、持っているものが何種類あるか数えて返す
function countOwnedItems(list) {
  let owned = 0;
  for (let i = 0; i < list.length; i++) {
    if (items[list[i].id]) {
      owned = owned + 1;
    }
  }
  return owned;
}

// 図鑑の、1つのランク分のまとまりを作って返す（「★★ レア 3 / 16」の見出しと、アイテムの一覧）
// itemList はアイテムの表（ガチャのアイテム、またはショップ限定の装備）
function createCollectionGroup(rank, itemList) {
  const group = document.createElement("div");

  // そのランクのアイテムだけを取り出す
  const rankItems = itemList.filter(function (item) {
    return item.rank === rank.rank;
  });

  // 見出し（押すと、そのランクの一覧を開いたり閉じたりする）
  const isClosed = closedRanks[rank.rank] === true;
  const heading = document.createElement("button");
  heading.type = "button";
  heading.className = "collection-heading rank-" + rank.rank;

  const title = document.createElement("span");
  title.textContent = rank.stars + " " + rank.name + "　" + countOwnedItems(rankItems) + " / " + rankItems.length;

  // 右はしの △（開いている）／ ▽（閉じている）
  const arrow = document.createElement("span");
  arrow.textContent = isClosed ? "▽" : "△";

  heading.appendChild(title);
  heading.appendChild(arrow);
  heading.addEventListener("click", function () {
    closedRanks[rank.rank] = !isClosed;
    renderGacha(); // 図鑑を描き直す
  });
  group.appendChild(heading);

  // 閉じているときは、アイテムの一覧を出さない
  if (isClosed) {
    return group;
  }

  const list = document.createElement("ul");
  list.className = "collection-list";
  for (let i = 0; i < rankItems.length; i++) {
    list.appendChild(createCollectionItem(rankItems[i]));
  }
  group.appendChild(list);
  return group;
}

// コインの表示、ガチャのボタン、図鑑を表示し直す
function renderGacha() {
  coinText.textContent = "🪙 " + coins + " コイン";

  // コインが足りないときは、ガチャのボタンを押せなくする
  gachaButton.textContent = "🎰 1回引く（🪙" + GACHA_COST + "）";
  gachaButton.disabled = coins < GACHA_COST;
  gachaTenButton.textContent = "🎰 10連ガチャ（🪙" + GACHA_TEN_COST + "）";
  gachaTenButton.disabled = coins < GACHA_TEN_COST;

  // 前回の結果と、確率の表
  renderGachaResult();
  renderGachaRates();

  // 図鑑：ランクごとに見出しを付けて、アイテムの一覧を並べる
  collectionList.innerHTML = "";
  for (let i = 0; i < GACHA_RANKS.length; i++) {
    collectionList.appendChild(createCollectionGroup(GACHA_RANKS[i], GACHA_ITEMS));
  }
  collectionList.appendChild(createCollectionGroup(SHOP_RANK, SHOP_ITEMS)); // いちばん下に「🛒 ショップ限定」

  // 全部で何種類集めたか
  collectionCount.textContent = "図鑑 " + countOwnedItems(GACHA_ITEMS) + " / " + GACHA_ITEMS.length;

  // 今の装備
  equipSummary.textContent = getEquipSummary();

  // ショップのページも、コインの数に合わせて表示し直す
  renderShop();

  // ガチャで卵が出たときのために、ペットのカード（持っている卵）も表示し直す
  renderPets();
}

// ===== ショップの画面 =====

// ガチャ画面の中のページを切りかえる（name は "gacha" か "shop"）
function switchGachaPage(name) {
  gachaSections.gacha.hidden = name !== "gacha";
  gachaSections.shop.hidden = name !== "shop";
  gachaSwitchButtons.forEach(function (button) {
    button.classList.toggle("is-active", button.dataset.gacha === name);
  });
}

// ショップで売るもの（1つ）の形にして返す
// kind は "item"（アイテム）・"egg"（卵）・"pet"（ペット）、owned は持っている数、limited は1つしか買えないか
function makeShopThing(kind, id, icon, name, price, owned, limited) {
  return { kind: kind, id: id, icon: icon, name: name, price: price, owned: owned, limited: limited };
}

// ショップの売りものを、見出しごとのまとまりにして返す（{ title, things } の配列）
function getShopGroups() {
  const groups = [];

  // 🛒 ショップ限定（装備は1つずつ、ペットは何回でも）
  const limitedThings = SHOP_ITEMS.map(function (item) {
    return makeShopThing("item", item.id, item.icon, item.name, item.price, items[item.id] || 0, true);
  }).concat(PETS.filter(function (pet) {
    return pet.shop;
  }).map(function (pet) {
    return makeShopThing("pet", pet.id, pet.icon, pet.name + "（ペット）", pet.price, pets[pet.id] || 0, false);
  }));
  groups.push({ title: "🛒 ショップ限定", rank: SHOP_RANK.rank, things: limitedThings });

  // 🥚 卵
  groups.push({ title: "🥚 卵", rank: 0, things: EGG_TYPES.map(function (egg) {
    return makeShopThing("egg", egg.type, "🥚", egg.name + " " + egg.stars, SHOP_EGG_PRICES[egg.type], eggs[egg.type] || 0, false);
  }) });

  // ★・★★・★★★ のアイテム（ガチャで出るもの）
  GACHA_RANKS.forEach(function (rank) {
    const rankThings = GACHA_ITEMS.filter(function (item) {
      return item.rank === rank.rank;
    }).map(function (item) {
      return makeShopThing("item", item.id, item.icon, item.name, SHOP_ITEM_PRICES[rank.rank], items[item.id] || 0, false);
    });
    groups.push({ title: rank.stars + " " + rank.name, rank: rank.rank, things: rankThings });
  });
  return groups;
}

// ショップのページを表示し直す（コインの数と、見出しごとの売りもの）
function renderShop() {
  shopCoins.textContent = "🪙 " + coins.toLocaleString() + " コイン";
  shopList.innerHTML = "";
  getShopGroups().forEach(function (group) {
    const heading = document.createElement("h3");
    heading.className = "shop-heading rank-" + group.rank;
    heading.textContent = group.title;
    shopList.appendChild(heading);

    const list = document.createElement("ul");
    list.className = "shop-list";
    group.things.forEach(function (thing) {
      list.appendChild(createShopRow(thing, group.rank));
    });
    shopList.appendChild(list);
  });
}

// ショップの1行（絵文字・名前・持っている数・値段・「買う」ボタン）を作って返す
function createShopRow(thing, rank) {
  const row = document.createElement("li");
  row.className = "shop-row rank-" + rank;

  const name = document.createElement("span");
  name.className = "shop-name";
  name.textContent = thing.icon + " " + thing.name;
  if (thing.owned > 0) {
    const owned = document.createElement("span");
    owned.className = "shop-owned";
    owned.textContent = thing.limited ? "持っている" : "×" + thing.owned;
    name.appendChild(owned);
  }
  row.appendChild(name);

  const price = document.createElement("span");
  price.className = "shop-price";
  price.textContent = "🪙" + thing.price.toLocaleString();
  row.appendChild(price);

  // コインが足りないときと、もう持っている限定の装備は、押せなくする
  const button = document.createElement("button");
  button.type = "button";
  button.className = "shop-buy-button";
  const isSoldOut = thing.limited && thing.owned > 0;
  button.textContent = isSoldOut ? "買った" : "買う";
  button.disabled = isSoldOut || coins < thing.price;
  button.addEventListener("click", function () {
    buyShopThing(thing);
  });
  row.appendChild(button);
  return row;
}

// ショップで1つ買う（確認してから、コインをへらして、アイテム・卵・ペットを1つふやす）
function buyShopThing(thing) {
  if (coins < thing.price || (thing.limited && thing.owned > 0)) {
    return;
  }
  const ok = confirm(thing.icon + " " + thing.name + " を 🪙" + thing.price.toLocaleString() + " で買いますか？");
  if (!ok) {
    return;
  }
  coins = coins - thing.price;
  if (thing.kind === "egg") {
    eggs[thing.id] = (eggs[thing.id] || 0) + 1;
  } else if (thing.kind === "pet") {
    pets[thing.id] = (pets[thing.id] || 0) + 1;
    if (activePets.length === 0) {
      activePets.push(thing.id); // まだ誰も連れていなければ、買ったペットを連れていく（卵がかえったときと同じ）
    }
    drawPets();
  } else {
    items[thing.id] = (items[thing.id] || 0) + 1;
  }
  savePlayer();
  console.log("ショップで買いました", thing);
  renderGacha(); // コイン・ショップ・図鑑・ペットのカードを表示し直す
  addShopEffect(thing);
  checkAchievements(true); // 図鑑10種類などの実績がとれたら、演出を出す
}

// 「🛒 〇〇 を買った！」の演出を、順番待ちの列に並べる
function addShopEffect(thing) {
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🛒 " + thing.icon + " " + thing.name + "\nを買った！";
    restartAnimation(effectOverlay, "is-celebrate");
    playSparkleSound();
  }, CELEBRATE_EFFECT_TIME);
}

// ===== ポモドーロタイマー =====

// えらんでいる集中・休けいの長さ（ミリ秒）を返す
function getTimerLength(mode) {
  if (mode === "focus") {
    return focusMinutes * 60 * 1000;
  }
  return breakMinutes * 60 * 1000;
}

// 今の集中・休けいを、最初（えらんでいる長さ）から始められるように用意する
function setupTimer() {
  timerLength = getTimerLength(timerMode);
  timerRemaining = timerLength;
}

// 集中・休けいの長さをえらびなおしたとき：保存して、まだ始めていなければすぐに新しい長さにする
// （動いているときや、途中まで進んでいるときは、今の分はそのまま。次から新しい長さになる）
function changeTimerLength() {
  const isAtStart = !isTimerRunning() && timerRemaining === timerLength;
  focusMinutes = Number(timerFocusSelect.value);
  breakMinutes = Number(timerBreakSelect.value);
  savePlayer();
  if (isAtStart) {
    setupTimer();
  }
  renderTimer();
}

// タイマーが動いているかどうかを返す
function isTimerRunning() {
  return timerEndTime !== null;
}

// 今の残り時間（ミリ秒）を返す（動いているときは、終わる時刻から計算する）
function getTimerRemaining() {
  if (isTimerRunning()) {
    return Math.max(0, timerEndTime - Date.now());
  }
  return timerRemaining;
}

// 「▶ スタート」：タイマーを動かす（すでに動いていたら何もしない）
function startTimer() {
  if (isTimerRunning()) {
    return;
  }
  timerEndTime = Date.now() + timerRemaining;
  timerInterval = setInterval(tickTimer, 250); // 0.25秒ごとに、残り時間を確かめる
  renderTimer();
}

// 「⏸ 一時停止」：タイマーを止めて、残り時間を覚えておく
function pauseTimer() {
  if (!isTimerRunning()) {
    return;
  }
  timerRemaining = getTimerRemaining();
  stopTimerInterval();
  renderTimer();
}

// 右のボタン（集中中は「↺ リセット」、休けい中は「⏭ スキップ」）：タイマーを止めて、集中タイムの最初（25:00）に戻す
// 休けいは集中の回数に入らないので、回数・カレンダー・卵はそのまま。演出と音も出さない
function resetTimer() {
  stopTimerInterval();
  timerMode = "focus"; // 休けい中に押しても、集中タイムに戻す
  setupTimer();
  renderTimer();
}

// くり返しを止めて、「動いていない」にする
function stopTimerInterval() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerEndTime = null;
}

// 0.25秒ごとに呼ばれる：時間になったら終わらせ、まだなら表示し直す
function tickTimer() {
  if (getTimerRemaining() <= 0) {
    finishTimer();
  } else {
    renderTimer();
  }
}

// 集中・休けいが終わったとき：演出を出して、次（休けい・集中）に切りかえる
function finishTimer() {
  stopTimerInterval();

  if (timerMode === "focus") {
    // 今日の集中の回数を1増やして保存する（日付が変わっていたら、先に 0 に戻す）
    resetFocusCountIfNewDay();
    focusCount = focusCount + 1;

    // カレンダーのために、今日集中した回数を記録して、カレンダーを表示し直す
    focusHistory[focusDate] = (focusHistory[focusDate] || 0) + 1;
    renderCalendar();
    savePlayer();
    addTimerEffect("🍅 集中おわり！\n休けいしよう", true);
    timerMode = "break";

    // セットしている卵を育てる（決まった回数になったら、かえる）
    growEgg();
    checkAchievements(true); // 新しくとれた実績があれば、演出を出す（卵がかえったときも、ここで確かめる）
  } else {
    addTimerEffect("☕ 休けいおわり！\n次の集中をはじめよう", false);
    timerMode = "focus";
  }

  // 次の時間を用意する（スタートは自分で押す）
  setupTimer();
  renderTimer();
}

// ===== 卵とペット =====

// 卵の種類（"white" など）から、卵の表の行を返す
function getEggType(type) {
  return EGG_TYPES.find(function (egg) {
    return egg.type === type;
  });
}

// ペットの id から、ペットの表の行を返す
function getPet(id) {
  return PETS.find(function (pet) {
    return pet.id === id;
  });
}

// 卵をタイマーにセットする（持っている卵を1つ減らす。すでにセットしていたら何もしない）
function setEgg(type) {
  if (settingEgg !== null || !eggs[type]) {
    return;
  }
  eggs[type] = eggs[type] - 1;
  settingEgg = { type: type, progress: 0 };
  savePlayer();
  renderPets();
}

// セットしている卵を取り出す（持っている卵に戻す。育てた回数は 0 に戻る）
function cancelEgg() {
  if (settingEgg === null) {
    return;
  }
  eggs[settingEgg.type] = (eggs[settingEgg.type] || 0) + 1;
  settingEgg = null;
  savePlayer();
  renderPets();
}

// 集中タイムを終えたときに、セットしている卵を育てる（決まった回数になったら、かえす）
function growEgg() {
  if (settingEgg === null) {
    return;
  }
  settingEgg.progress = settingEgg.progress + 1;
  if (settingEgg.progress >= getEggType(settingEgg.type).needed) {
    hatchEgg();
  }
  savePlayer();
  renderPets();
}

// 卵をかえす（その卵のペットの中からランダムで1匹を仲間にして、演出を出す）
function hatchEgg() {
  const egg = getEggType(settingEgg.type);
  const petId = egg.pets[Math.floor(Math.random() * egg.pets.length)];
  const pet = getPet(petId);

  pets[petId] = (pets[petId] || 0) + 1;
  settingEgg = null;

  // まだ誰も連れていなければ、かえったペットを連れていく
  if (activePets.length === 0) {
    activePets.push(petId);
  }
  drawPets();
  console.log("卵がかえりました", pet);

  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🐣 卵がかえった！\n" + pet.icon + " " + pet.name + " が仲間になった！";
    restartAnimation(effectOverlay, "is-celebrate");
    playFanfareSound();
  }, CELEBRATE_EFFECT_TIME);
}

// ペットのボタンを押したとき
// 連れていないペット → 1匹連れていく
// 1匹連れていて、2匹以上持っているペット → 2匹目も連れていく
// それ以外（もう全部連れている） → そのペットを全部はずす
function toggleActivePet(petId) {
  const takingCount = countActivePet(petId);
  const ownedCount = pets[petId] || 0;
  if (takingCount === 0 || (takingCount === 1 && ownedCount >= 2)) {
    addActivePet(petId);
  } else {
    removeActivePet(petId);
  }
  savePlayer();
  drawPets();
  renderPets();
}

// そのペットを、今何匹連れているかを返す
function countActivePet(petId) {
  return activePets.filter(function (id) {
    return id === petId;
  }).length;
}

// ペットを1匹連れていく（もう2匹連れているときは、先に連れていたほうの1匹と入れかえる）
function addActivePet(petId) {
  if (activePets.length >= MAX_ACTIVE_PETS) {
    activePets.shift(); // 配列のいちばん前（先に連れていたペット）を取り出す
  }
  activePets.push(petId);
}

// そのペットを、全部はずす
function removeActivePet(petId) {
  activePets = activePets.filter(function (id) {
    return id !== petId;
  });
}

// 最初からいるペットを仲間に入れる（持っていないときだけ1匹入れる。持っていれば数は変えない）
// isNewPlayer が true（初めての人）のときは、そのペットたちを連れていく
function giveStarterPets(isNewPlayer) {
  STARTER_PETS.forEach(function (petId) {
    if (!pets[petId]) {
      pets[petId] = 1;
    }
  });
  if (isNewPlayer) {
    activePets = STARTER_PETS.slice(0, MAX_ACTIVE_PETS); // slice で、表のコピーを作って入れる
  }
}

// 保存データから、連れていくペットの配列を作って返す
// 前の保存データ（1匹だけの activePet）も、1匹目として読み込む
// 持っていないペットや、持っている数より多いぶんは入れない
function loadActivePets(player) {
  let savedIds = [];
  if (Array.isArray(player.activePets)) {
    savedIds = player.activePets;
  } else if (player.activePet) {
    savedIds = [player.activePet];
  }
  const result = [];
  for (let i = 0; i < savedIds.length && result.length < MAX_ACTIVE_PETS; i++) {
    const id = savedIds[i];
    const takingCount = result.filter(function (taken) {
      return taken === id;
    }).length;
    if (getPet(id) && takingCount < (pets[id] || 0)) {
      result.push(id);
    }
  }
  return result;
}

// ===== ペットのレベル =====

// ペットの種類の、今のレベル（1〜5）を返す
function getPetLevel(petId) {
  const friendship = petFriendship[petId] || 0;
  let level = 0;
  PET_LEVEL_STEPS.forEach(function (need) {
    if (friendship >= need) {
      level = level + 1;
    }
  });
  return level;
}

// 連れているペットの「なかよし」を1ずつふやす（同じ種類を2匹連れていても、その種類に1）
// レベルが上がったら、演出のためにためておく。Lv5 になったら、コインをわたす
function growActivePets() {
  const kinds = activePets.filter(function (petId, index) {
    return activePets.indexOf(petId) === index; // 同じ種類は1回だけ
  });
  kinds.forEach(function (petId) {
    const before = getPetLevel(petId);
    petFriendship[petId] = (petFriendship[petId] || 0) + 1;
    const after = getPetLevel(petId);
    if (after > before) {
      pendingPetLevelUps.push({ petId: petId, level: after });
      if (after === PET_LEVEL_STEPS.length) {
        coins = coins + PET_MAX_LEVEL_COINS;
      }
    }
  });
}

// メイン画面のペットの場所（style.css の .pet-canvas と .pet-canvas.is-second の数と合わせる）
const PET_BOTTOM = 6; // 景色の下から何 px 上か
const PET_SECOND_LEFT = 44; // 2匹目は、左から何 px か（1匹目は 0）

// ペットの絵の設計図から、頭のてっぺんの場所を返す
// top は、何かが描いてある、いちばん上の行。center は、その行で描いてあるマスのまん中（左から何マス目か）
function getPetHeadTop(pixels) {
  for (let row = 0; row < pixels.length; row++) {
    const first = pixels[row].search(/[^.]/); // 「.」ではない、いちばん左のマス
    if (first >= 0) {
      const last = pixels[row].length - 1 - pixels[row].split("").reverse().join("").search(/[^.]/);
      return { top: row, center: (first + last + 1) / 2 };
    }
  }
  return { top: 0, center: pixels[0].length / 2 };
}

// 王冠を、ペットの頭のてっぺんの上に置く（王冠のまん中を頭のまん中に合わせ、下の1マスを頭に重ねる）
// dot は1マスの大きさ（px）、petLeft・petBottom はペットの絵の左下の場所（px）
function placeCrown(crown, pet, dot, petLeft, petBottom) {
  const head = getPetHeadTop(pet.pixels);
  const crownWidth = PIXELS_PET_CROWN[0].length;
  crown.style.left = petLeft + (head.center - crownWidth / 2) * dot + "px";
  crown.style.bottom = petBottom + (pet.pixels.length - head.top - 1) * dot + "px";
}

// Lv5 のペットの王冠を、つける・はずす（ペットの種類ごとに保存する）
function togglePetCrown(petId) {
  petCrownOff[petId] = !petCrownOff[petId];
  savePlayer();
  drawPets(); // メイン画面の王冠を出す・消す
  renderPets(); // ボタンの文字を「つける」「はずす」に切りかえる
}

// ためておいた「🐾 〇〇 が Lv3 になった！」の演出を、順番待ちの列に並べる（撃破の演出のあとに呼ぶ）
function addPendingPetLevelUpEffects() {
  pendingPetLevelUps.forEach(function (levelUp) {
    const pet = getPet(levelUp.petId);
    const isMax = levelUp.level === PET_LEVEL_STEPS.length;
    addEffect(function () {
      clearEffectClasses();
      effectText.textContent = "🐾 " + pet.icon + " " + pet.name + "\nが Lv" + levelUp.level + " になった！" + (isMax ? "\n👑 🪙 +" + PET_MAX_LEVEL_COINS : "");
      restartAnimation(effectOverlay, "is-celebrate");
      playSparkleSound();
    }, CELEBRATE_EFFECT_TIME);
  });
  if (pendingPetLevelUps.length > 0) {
    pendingPetLevelUps = [];
    renderPets(); // なかまの一覧と図鑑のレベルを描き直す
    drawPets(); // Lv5 の 👑 を出す
    renderGacha(); // コインの数を新しくする
  }
}

// 連れていくペットを、メイン画面とタイマーのバーに描く（連れていかないぶんは隠す）
function drawPets() {
  for (let i = 0; i < MAX_ACTIVE_PETS; i++) {
    const pet = getPet(activePets[i]);
    petCanvases[i].hidden = !pet;
    timerPets[i].hidden = !pet;
    // 2匹連れているときは、メイン画面のキャラがかくれすぎないように、ペットを少し小さくする
    petCanvases[i].classList.toggle("is-small", activePets.length >= 2);
    if (pet) {
      drawPixels(petCanvases[i], pet.pixels);
      drawPixels(timerPets[i], pet.pixels);
    }
    // Lv5（いちばん上）のペットだけ、メイン画面で頭の上にドット絵の王冠を出す（2匹のときは、小さいペットに合わせた場所）
    // 「👑 はずす」にしているペットには出さない
    petCrowns[i].hidden = !pet || getPetLevel(pet.id) < PET_LEVEL_STEPS.length || petCrownOff[pet.id] === true;
    drawPixels(petCrowns[i], PIXELS_PET_CROWN);
    // タイマーの歩くペットにも、同じ決まりで王冠を出す
    timerPetCrowns[i].hidden = petCrowns[i].hidden;
    drawPixels(timerPetCrowns[i], PIXELS_PET_CROWN);
    // 王冠の場所を、ペットごとの頭のてっぺんに合わせる（メイン画面は1マス 5px、2匹のときは 3px。タイマーは 2px）
    if (pet) {
      placeCrown(petCrowns[i], pet, activePets.length >= 2 ? 3 : 5, i === 0 ? 0 : PET_SECOND_LEFT, PET_BOTTOM);
      placeCrown(timerPetCrowns[i], pet, 2, 0, 0);
    }
    petCrowns[i].classList.toggle("is-small", activePets.length >= 2);
  }
}

// ボタンを1つ作って返す（ペットのカードで使う）
function createPetButton(text, onClick, disabled) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "pet-button";
  button.textContent = text;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  return button;
}

// ペットのカード（セット中の卵・持っている卵・仲間のペット）を表示し直す
function renderPets() {
  renderSettingEgg();
  renderEggList();
  renderPetList();
  renderCreatures(); // 図鑑の「モンスターとペット」も描き直す（ペットが増えたときのため）
}

// ===== 図鑑の「モンスターとペット」のページ =====

// まだ見つけていないモンスターやペットを描く、黒いかげの色
const SILHOUETTE_COLOR = "#4a4a5a";

// 図鑑の「モンスターとペット」のページを描き直す
function renderCreatures() {
  renderMonsterList();
  renderCreaturePetList();
}

// モンスターの一覧（弱い順。最後にゴールデンスライム）
function renderMonsterList() {
  const list = MONSTERS.slice().reverse().concat([RARE_MONSTER]); // MONSTERS は強い順なので、ひっくり返す
  creatureMonsterList.innerHTML = "";
  let foundCount = 0;
  list.forEach(function (monster) {
    const count = monsterDefeats[monster.id] || 0;
    if (count > 0) {
      foundCount = foundCount + 1;
    }
    const subText = getMonsterExpText(monster) + (count > 0 ? "・×" + count : "");
    creatureMonsterList.appendChild(createCreatureItem(monster.pixels, count > 0 ? monster.name : "？？？", subText, count > 0, ""));
  });
  creatureMonsterCount.textContent = "モンスター " + foundCount + " / " + list.length;
}

// ペットの一覧（なかまの一覧と同じ順）
function renderCreaturePetList() {
  creaturePetList.innerHTML = "";
  let foundCount = 0;
  PETS.forEach(function (pet) {
    const count = pets[pet.id] || 0;
    if (count > 0) {
      foundCount = foundCount + 1;
    }
    const name = count > 0 ? pet.name + (count >= 2 ? " ×" + count : "") + " Lv" + getPetLevel(pet.id) : "？？？"; // 名前のうしろに、ペットのレベル
    creaturePetList.appendChild(createCreatureItem(pet.pixels, name, getPetFromText(pet.id), count > 0, "rank-" + pet.rank));
  });
  creaturePetCount.textContent = "ペット " + foundCount + " / " + PETS.length;
}

// モンスターが出るEXPの文字を返す（「10〜11 EXP」など。レアなら「レア（100 EXP）」）
function getMonsterExpText(monster) {
  if (monster === RARE_MONSTER) {
    return "レア（" + RARE_EXP + " EXP）";
  }
  const index = MONSTERS.indexOf(monster);
  const min = Math.max(monster.minExp, 10); // いちばん弱いスライムは minExp が 0 なので、10 からにする
  const max = index === 0 ? 30 : MONSTERS[index - 1].minExp - 1; // 1つ強いモンスターの手前まで
  return min + "〜" + max + " EXP";
}

// ペットが、どの卵からかえるかの文字を返す（卵からかえらないペットは「最初からいる」、ショップ限定は「🛒 ショップで買える」）
function getPetFromText(petId) {
  const egg = EGG_TYPES.find(function (eggType) {
    return eggType.pets.includes(petId);
  });
  if (egg) {
    return "🥚 " + egg.name;
  }
  return getPet(petId).shop ? "🛒 ショップで買える" : "最初からいる";
}

// 一覧の1つ分（絵・名前・小さな説明）を作って返す。found が false なら、黒いかげで描く
function createCreatureItem(pixels, name, subText, found, rankClass) {
  const item = document.createElement("div");
  item.className = "creature-item " + rankClass;
  item.classList.toggle("is-unknown", !found);

  const canvas = document.createElement("canvas");
  canvas.className = "creature-canvas";
  const grid = makeColorGrid(pixels);
  paintGrid(canvas, found ? grid : makeSilhouette(grid));
  item.appendChild(canvas);

  const nameText = document.createElement("span");
  nameText.className = "creature-name";
  nameText.textContent = name;
  item.appendChild(nameText);

  const sub = document.createElement("span");
  sub.className = "creature-sub";
  sub.textContent = subText;
  item.appendChild(sub);
  return item;
}

// 色の表の、色のあるマスを全部「かげの色」にした、新しい色の表を返す
function makeSilhouette(grid) {
  return grid.map(function (row) {
    return row.map(function (color) {
      return color ? SILHOUETTE_COLOR : null;
    });
  });
}

// ===== 実績（トロフィー） =====

// 実績の表。id は保存するときの名前、coins はとったときにもらえるコイン（むずかしいほど多い）
// condition は画面に出す条件、check は「条件を満たしたら true を返す」関数
const ACHIEVEMENTS = [
  // ⚔️ 撃破
  { id: "defeat-1", coins: 50, name: "はじめての一撃", condition: "合計 1体 撃破する", check: function () { return countAllDefeats() >= 1; } },
  { id: "defeat-10", coins: 100, name: "見習いハンター", condition: "合計 10体 撃破する", check: function () { return countAllDefeats() >= 10; } },
  { id: "defeat-50", coins: 200, name: "一人前ハンター", condition: "合計 50体 撃破する", check: function () { return countAllDefeats() >= 50; } },
  { id: "defeat-100", coins: 500, name: "伝説のハンター", condition: "合計 100体 撃破する", check: function () { return countAllDefeats() >= 100; } },
  // 🔥 連続
  { id: "streak-3", coins: 100, name: "三日坊主じゃない", condition: "3日連続で 1体以上 撃破する", check: function () { return countLongestStreak() >= 3; } },
  { id: "streak-7", coins: 200, name: "一週間の勇者", condition: "7日連続で 1体以上 撃破する", check: function () { return countLongestStreak() >= 7; } },
  // ⭐ レベル
  { id: "level-3", coins: 50, name: "戦士になった", condition: "Lv3 になる", check: function () { return getLevel() >= 3; } },
  { id: "level-5", coins: 100, name: "勇者になった", condition: "Lv5 になる", check: function () { return getLevel() >= 5; } },
  { id: "level-10", coins: 200, name: "竜殺し", condition: "Lv10 になる", check: function () { return getLevel() >= 10; } },
  { id: "level-20", coins: 500, name: "神話の勇者", condition: "Lv20 になる", check: function () { return getLevel() >= 20; } },
  // 🍅 集中
  { id: "focus-1", coins: 50, name: "はじめての集中", condition: "集中タイムを 合計 1回 終える", check: function () { return sumValues(focusHistory) >= 1; } },
  { id: "focus-20", coins: 200, name: "集中マスター", condition: "集中タイムを 合計 20回 終える", check: function () { return sumValues(focusHistory) >= 20; } },
  // 🔁 習慣
  { id: "habit-1", coins: 50, name: "日課の第一歩", condition: "日課を 合計 1回 クリアする", check: function () { return countHabitClears() >= 1; } },
  { id: "habit-30", coins: 200, name: "日課の達人", condition: "日課を 合計 30回 クリアする", check: function () { return countHabitClears() >= 30; } },
  // 🎰 ガチャ
  { id: "gacha-10", coins: 50, name: "コレクター", condition: "図鑑のアイテムを 10種類 集める", check: function () { return countOwnedItems(GACHA_ITEMS) >= 10; } },
  { id: "gacha-super", coins: 100, name: "スーパーレア", condition: "★★★ のアイテムを 1つ 手に入れる", check: function () { return hasSuperRareItem(); } },
  { id: "gacha-all", coins: 500, name: "図鑑コンプリート", condition: "図鑑のアイテムを 48種類 全部 集める", check: function () { return countOwnedItems(GACHA_ITEMS) >= GACHA_ITEMS.length; } },
  // 🐣 ペット
  { id: "pet-hatch", coins: 50, name: "はじめての孵化", condition: "卵を 1回 かえす", check: function () { return hasHatchedEgg(); } },
  { id: "pet-5", coins: 100, name: "ペットなかま", condition: "ペットを 5種類 なかまにする", check: function () { return countPetKinds() >= 5; } },
  { id: "pet-all", coins: 500, name: "ペットマスター", condition: "ペットを 11種類 全部 なかまにする", check: function () { return countPetKinds() >= countNormalPets(); } },
  // 👾 モンスター
  { id: "monster-golden", coins: 100, name: "黄金の出会い", condition: "ゴールデンスライムを たおす", check: function () { return (monsterDefeats[RARE_MONSTER.id] || 0) > 0; } },
  { id: "monster-5", coins: 100, name: "モンスター博士", condition: "モンスターを 5種類 たおす", check: function () { return countMonsterKinds() >= 5; } },
  { id: "monster-all", coins: 500, name: "モンスター図鑑コンプリート", condition: "モンスターを 11種類 全部 たおす", check: function () { return countMonsterKinds() >= MONSTERS.length + 1; } },
];

// { a: 2, b: 3 } のような記録の、数を全部たして返す
function sumValues(record) {
  return Object.keys(record).reduce(function (total, key) {
    return total + record[key];
  }, 0);
}

// 今までに撃破した数の合計（カレンダーの記録から数える）
function countAllDefeats() {
  return sumValues(defeatHistory);
}

// 1体以上撃破した日が、いちばん長く何日続いたかを返す（カレンダーの記録から数える）
function countLongestStreak() {
  const days = Object.keys(defeatHistory).filter(function (date) {
    return defeatHistory[date] > 0;
  }).sort();
  let longest = 0;
  let current = 0;
  for (let i = 0; i < days.length; i++) {
    // 前の日のすぐ次の日なら、続いている。そうでなければ 1日目からやり直す
    const isNextDay = i > 0 && getNextDateText(days[i - 1]) === days[i];
    current = isNextDay ? current + 1 : 1;
    longest = Math.max(longest, current);
  }
  return longest;
}

// 「2026-10-01」のような日付の、次の日の日付の文字を返す
function getNextDateText(dateText) {
  const parts = dateText.split("-");
  const next = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]) + 1);
  return makeDateText(next.getFullYear(), next.getMonth(), next.getDate());
}

// 習慣をクリアした回数の合計（今ある習慣の、クリアした日の記録から数える）
function countHabitClears() {
  return habits.reduce(function (total, habit) {
    return total + (habit.doneDates || []).length;
  }, 0);
}

// ★★★ のアイテムを1つでも持っているか
function hasSuperRareItem() {
  return GACHA_ITEMS.some(function (item) {
    return item.rank === 3 && items[item.id];
  });
}

// 卵をかえしたことがあるか（最初からいるペット以外がいる、またはねこが2匹以上いる）
function hasHatchedEgg() {
  const hasOtherPet = PETS.some(function (pet) {
    return !STARTER_PETS.includes(pet.id) && !pet.shop && pets[pet.id]; // ショップで買ったペットは入れない
  });
  return hasOtherPet || (pets.cat || 0) >= 2;
}

// 仲間にいるペットの種類の数（実績で使う。ショップ限定のペットは、お金で買えば取れる実績にしないため数えない）
function countPetKinds() {
  return PETS.filter(function (pet) {
    return !pet.shop && pets[pet.id];
  }).length;
}

// 卵からかえる・最初からいるペット（ショップ限定ではないペット）の種類の数
function countNormalPets() {
  return PETS.filter(function (pet) {
    return !pet.shop;
  }).length;
}

// たおしたことのあるモンスターの種類の数
function countMonsterKinds() {
  return Object.keys(monsterDefeats).filter(function (id) {
    return monsterDefeats[id] > 0;
  }).length;
}

// まだとっていない実績の条件を確かめて、満たしていたら「とった」にする。とった実績のコインもわたす
// showEffect が true なら「🏆 実績解除！」の演出を出す（ページを開いたときは出さない）
// ページを開いたときに、前にとった実績のコインをまだわたしていなければ、まとめてわたして、その演出を出す
function checkAchievements(showEffect) {
  const newOnes = ACHIEVEMENTS.filter(function (achievement) {
    return !achievements[achievement.id] && achievement.check();
  });
  newOnes.forEach(function (achievement) {
    achievements[achievement.id] = getTodayString();
  });
  const reward = giveAchievementRewards();
  if (newOnes.length === 0 && reward.coins === 0) {
    return; // 新しくとった実績も、わたすコインもない
  }
  savePlayer();
  renderAchievements();
  renderGacha(); // コインの数の表示も新しくする
  if (showEffect && newOnes.length > 0) {
    addAchievementEffect(newOnes, reward.coins);
  } else if (reward.coins > 0) {
    addPastRewardEffect(reward);
  }
}

// とった実績のうち、まだコインをわたしていない実績のコインを、まとめてわたす
// 返すのは { count: 何こ分か, coins: 合計のコイン }
function giveAchievementRewards() {
  const unpaid = ACHIEVEMENTS.filter(function (achievement) {
    return achievements[achievement.id] && !rewardedAchievements[achievement.id];
  });
  let total = 0;
  unpaid.forEach(function (achievement) {
    rewardedAchievements[achievement.id] = true;
    total = total + achievement.coins;
  });
  coins = coins + total;
  return { count: unpaid.length, coins: total };
}

// 「🏆 実績解除！」の演出を、順番待ちの列に並べる（いくつか同時にとれたら、1つの演出にまとめて名前をならべる）
// 最後に、もらったコインの合計（「🪙 +100」）も出す
function addAchievementEffect(newOnes, rewardCoins) {
  const names = newOnes.map(function (achievement) {
    return "「" + achievement.name + "」";
  }).join("\n");
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🏆 実績解除！\n" + names + "\n🪙 +" + rewardCoins;
    restartAnimation(effectOverlay, "is-celebrate");
    playFanfareSound();
  }, CELEBRATE_EFFECT_TIME);
}

// 前にとった実績のコインを、ページを開いたときにまとめてわたしたときの演出
function addPastRewardEffect(reward) {
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "🏆 実績のごほうび！\n前にとった実績 " + reward.count + "こ分\n🪙 +" + reward.coins;
    restartAnimation(effectOverlay, "is-celebrate");
    playFanfareSound();
  }, CELEBRATE_EFFECT_TIME);
}

// 図鑑の「🏆 実績」のページを描き直す
function renderAchievements() {
  achievementList.innerHTML = "";
  let gotCount = 0;
  ACHIEVEMENTS.forEach(function (achievement) {
    const date = achievements[achievement.id];
    if (date) {
      gotCount = gotCount + 1;
    }
    achievementList.appendChild(createAchievementItem(achievement, date));
  });
  achievementCount.textContent = "🏆 実績 " + gotCount + " / " + ACHIEVEMENTS.length;
}

// 実績の1行（🏆 か 🔒・名前・条件・とった日）を作って返す
function createAchievementItem(achievement, date) {
  const row = document.createElement("li");
  row.className = "achievement-item";
  row.classList.toggle("is-got", Boolean(date));

  const icon = document.createElement("span");
  icon.className = "achievement-icon";
  icon.textContent = date ? "🏆" : "🔒";
  row.appendChild(icon);

  const text = document.createElement("div");
  text.className = "achievement-text";
  const name = document.createElement("strong");
  name.textContent = achievement.name;
  const condition = document.createElement("span");
  condition.className = "achievement-condition";
  condition.textContent = achievement.condition + (date ? "（" + formatShortDate(date) + " にとった）" : "");
  text.appendChild(name);
  text.appendChild(condition);
  row.appendChild(text);

  // ごほうびのコイン（とってコインをもらった実績は「もらった」を付ける）
  const reward = document.createElement("span");
  reward.className = "achievement-reward";
  reward.textContent = "🪙 " + achievement.coins + (rewardedAchievements[achievement.id] ? " もらった" : "");
  row.appendChild(reward);
  return row;
}

// 「2026-10-01」のような日付を、「10/1」のような短い文字にして返す
function formatShortDate(dateText) {
  const parts = dateText.split("-");
  return Number(parts[1]) + "/" + Number(parts[2]);
}

// 「セット中：🥚 青い卵（あと 2 回）」と、取り出すボタン
function renderSettingEgg() {
  petSettingText.innerHTML = "";
  if (settingEgg === null) {
    petSettingText.textContent = "セット中：なし（下の「たまご」からセットできます）";
    return;
  }
  const egg = getEggType(settingEgg.type);
  const rest = egg.needed - settingEgg.progress;
  petSettingText.appendChild(
    document.createTextNode("セット中：🥚 " + egg.name + " " + egg.stars + "（集中 あと " + rest + " 回でかえる）")
  );
  petSettingText.appendChild(createPetButton("取り出す", cancelEgg, false));
}

// 持っている卵の一覧（種類ごとに数と「セット」ボタン）
function renderEggList() {
  eggList.innerHTML = "";
  let hasEgg = false;
  for (let i = 0; i < EGG_TYPES.length; i++) {
    const egg = EGG_TYPES[i];
    const count = eggs[egg.type] || 0;
    if (count === 0) {
      continue; // 持っていない卵は出さない
    }
    hasEgg = true;
    const row = document.createElement("li");
    row.className = "pet-row rank-" + egg.rank;
    row.appendChild(document.createTextNode("🥚 " + egg.name + " " + egg.stars + " ×" + count + "（" + egg.needed + "回でかえる）"));
    row.appendChild(
      createPetButton("セット", function () {
        setEgg(egg.type);
      }, settingEgg !== null)
    );
    eggList.appendChild(row);
  }
  if (!hasEgg) {
    eggList.innerHTML = "<li class=\"pet-empty\">まだありません（ガチャで 10% の確率で出ます）</li>";
  }
}

// ペットのボタンの文字を返す（連れている数で変わる）
function getPetButtonText(takingCount) {
  if (takingCount >= 2) {
    return "連れていく中 ×2";
  }
  if (takingCount === 1) {
    return "連れていく中";
  }
  return "連れていく";
}

// 仲間のペットの一覧（数と「連れていく」ボタン）
function renderPetList() {
  petList.innerHTML = "";
  let hasPet = false;
  for (let i = 0; i < PETS.length; i++) {
    const pet = PETS[i];
    const count = pets[pet.id] || 0;
    if (count === 0) {
      continue; // まだ仲間になっていないペットは出さない
    }
    hasPet = true;
    const row = document.createElement("li");
    row.className = "pet-row rank-" + pet.rank;
    row.appendChild(document.createTextNode(pet.icon + " " + pet.name + (count >= 2 ? " ×" + count : "") + " Lv" + getPetLevel(pet.id))); // 名前のうしろに、ペットのレベル

    // Lv5 のペットだけ、王冠をつける・はずすボタンを出す
    if (getPetLevel(pet.id) === PET_LEVEL_STEPS.length) {
      const crownButton = createPetButton(petCrownOff[pet.id] ? "👑 つける" : "👑 はずす", function () {
        togglePetCrown(pet.id);
      }, false);
      crownButton.classList.add("pet-crown-button");
      row.appendChild(crownButton);
    }

    const takingCount = countActivePet(pet.id);
    const button = createPetButton(getPetButtonText(takingCount), function () {
      toggleActivePet(pet.id);
    }, false);
    button.classList.toggle("is-active", takingCount > 0);
    row.appendChild(button);
    petList.appendChild(row);
  }
  if (!hasPet) {
    petList.innerHTML = "<li class=\"pet-empty\">まだいません（卵をセットして、集中タイムを終えるとかえります）</li>";
  }
}

// タイマーが終わったときの演出を列に並べる（集中が終わったときはファンファーレ、休けいのときはキラキラの音）
function addTimerEffect(text, isFocusEnd) {
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = text;
    restartAnimation(effectOverlay, "is-celebrate");
    if (isFocusEnd) {
      playFanfareSound();
    } else {
      playSparkleSound();
    }
  }, CELEBRATE_EFFECT_TIME);
}

// 保存してある集中の回数が今日のものでなければ、今日の分として 0 に戻す
function resetFocusCountIfNewDay() {
  const today = getTodayString();
  if (focusDate !== today) {
    focusDate = today;
    focusCount = 0;
  }
}

// ミリ秒を「24:13」のような「分:秒」の文字にして返す
function formatTime(milliseconds) {
  const totalSeconds = Math.ceil(milliseconds / 1000); // 小数は切り上げ（0.5秒残っていたら「0:01」）
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return minutes + ":" + String(seconds).padStart(2, "0");
}

// タイマーの画面を表示し直す（残り時間・バー・歩くキャラ・ボタン・今日の回数）
function renderTimer() {
  const remaining = getTimerRemaining();
  const progress = 1 - remaining / timerLength; // 進み具合（0 から 1）

  if (timerMode === "focus") {
    timerModeText.textContent = "🔥 集中タイム";
  } else {
    timerModeText.textContent = "☕ 休けいタイム";
  }
  timerTimeText.textContent = formatTime(remaining);

  // バーを進み具合の分だけ伸ばし、キャラをその先に立たせる
  // （キャラの左はしをバーの先にそろえ、キャラの幅の分だけ左にずらして、はみ出さないようにする）
  timerBarFill.style.width = progress * 100 + "%";
  timerBarFill.classList.toggle("is-break", timerMode === "break");
  timerWalkerBox.style.left = progress * 100 + "%";
  timerWalkerBox.style.transform = "translateX(-" + progress * 100 + "%)";

  // 動いているときだけ、キャラとペットを歩かせる（上下にはねる）
  timerWalker.classList.toggle("is-walking", isTimerRunning());
  timerPets.forEach(function (timerPet) {
    timerPet.classList.toggle("is-walking", isTimerRunning());
  });
  timerPetCrowns.forEach(function (crown) {
    crown.classList.toggle("is-walking", isTimerRunning()); // 王冠も、ペットと一緒にはねる
  });

  // 動いているときはスタートを、止まっているときは一時停止を押せなくする
  timerStartButton.disabled = isTimerRunning();
  timerPauseButton.disabled = !isTimerRunning();

  // 右のボタンの文字：集中タイムは「↺ リセット」、休けいタイムは「⏭ スキップ」（押したときの動きは同じ）
  if (timerMode === "break") {
    timerResetButton.textContent = "⏭ スキップ";
  } else {
    timerResetButton.textContent = "↺ リセット";
  }

  // 今日の集中の回数（前の日の数のままにならないように、日付を確かめてから出す）
  resetFocusCountIfNewDay();
  timerCountText.textContent = "今日の集中：" + focusCount + "回";

  // 集中中の音を、今のタイマーの状態に合わせて流す・止める
  updateFocusSound();
}

// 集中中の音の表から、id の行を返す（ないときは undefined）
function getFocusSound(id) {
  return FOCUS_SOUNDS.find(function (sound) {
    return sound.id === id;
  });
}

// 集中中の音を流すか止めるかを決める
// 流すのは「集中タイムが動いている」「効果音を消していない」「音をえらんでいる」のが全部そろったときだけ
function updateFocusSound() {
  const sound = getFocusSound(focusSound);
  const shouldPlay = timerMode === "focus" && isTimerRunning() && !isMuted && sound;
  if (!shouldPlay) {
    timerSound.pause(); // 止める（次に流すときは、続きから）
    return;
  }
  // えらんだ音がまだ入っていなければ入れる（ちがう音に変えたときは、最初から流れる）
  if (timerSound.dataset.soundId !== sound.id) {
    timerSound.src = sound.file;
    timerSound.dataset.soundId = sound.id;
  }
  timerSound.volume = focusVolume / 100; // 設定画面のつまみの大きさ（% を 0〜1 にする）
  if (timerSound.paused) {
    // 流せなかったとき（ファイルが読めないなど）も、アプリが止まらないようにする
    timerSound.play().catch(function (error) {
      console.log("集中中の音を流せませんでした", error);
    });
  }
}

// 「🎵 集中中の音」をえらびなおしたとき：保存して、すぐに反映する
function changeFocusSound() {
  focusSound = timerSoundSelect.value;
  savePlayer();
  updateFocusSound();
}

// 効果音を消す・戻す（押すたびに切りかえて、保存する）
function toggleSound() {
  isMuted = !isMuted;
  savePlayer();
  renderSoundButton();
  updateFocusSound(); // 集中中の音も、消す・戻すに合わせる
}

// 音のボタンの絵文字と見た目を、今の状態に合わせる（🔊 鳴る ／ 🔇 消している）
function renderSoundButton() {
  if (isMuted) {
    soundButton.textContent = "🔇";
    soundButton.setAttribute("aria-label", "効果音を鳴らす");
    soundButton.classList.add("is-muted");
  } else {
    soundButton.textContent = "🔊";
    soundButton.setAttribute("aria-label", "効果音を消す");
    soundButton.classList.remove("is-muted");
  }
}

// 画面を切りかえる（pageId の画面だけを見せて、ほかの画面は隠す）
// pageId は "page-main"・"page-gacha"・"page-collection" のどれか
function showPage(pageId) {
  // 画面の箱を1つずつ見て、pageId と同じものだけを見せる
  for (let i = 0; i < pages.length; i++) {
    pages[i].hidden = pages[i].id !== pageId;
  }

  // 選んでいるタブにだけ、目立たせる目印を付ける
  for (let i = 0; i < pageTabs.length; i++) {
    if (pageTabs[i].dataset.page === pageId) {
      pageTabs[i].classList.add("is-active");
    } else {
      pageTabs[i].classList.remove("is-active");
    }
  }

  // 設定画面を開いているときは、⚙️ ボタンを目立たせる（タブはどれも選んでいない色になる）
  settingsButton.classList.toggle("is-active", pageId === "page-settings");
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
  isOtherOpen = !isOtherOpen;
  applyOtherVisibility(); // 一覧・まとめて削除・しぼりこみ・切りかえボタンを、まとめて出したり隠したりする
}

// 切りかえボタン（他のタスク・明日以降）を押したとき：その一覧を出す（しぼりこみは、その一覧の数になる）
function switchOtherList(view) {
  otherListView = view;
  renderQuests();
}

// 新しいクエストを追加する
// deadline は締切の日付（「2026-10-05」のような文字。締切なしなら ""）
function addQuest(questName, deadline, category, planDate) {
  // 50回に1回くらいの確率で、レアなクエストにする
  // （Math.random() は 0 以上 1 未満のランダムな数。それが RARE_CHANCE より小さければレア）
  const isRare = Math.random() < RARE_CHANCE;

  const newQuest = {
    name: questName,
    exp: getRandomExp(10, 30), // 10〜30 のランダムな獲得EXP
    done: false,
    rare: isRare, // レアなクエストかどうか
    deadline: deadline || "", // 締切の日付（締切なしなら ""）
    createdDate: getTodayString(), // 追加した日（カレンダーで、締切までの毎日に出すときの始まりの日）
    category: category || "", // カテゴリの id（なしなら ""）
    planDate: planDate || "", // やる日（この日にやる予定。なしなら ""）。やる日になるまで、本日のタスクに出さない
  };

  // レアなクエストなら、EXP を 100 にして、「あらわれた！」の演出を出す
  if (isRare) {
    newQuest.exp = RARE_EXP;
    addRareAppearEffect();
  }

  quests.push(newQuest);
  saveQuests();
  console.log("クエストを追加しました", newQuest);
}

// レアなクエストが出たときの演出を列に並べる（金色にふわっと光って、「あらわれた！」が出る）
function addRareAppearEffect() {
  addEffect(function () {
    clearEffectClasses();
    effectText.textContent = "✨ レアモンスターがあらわれた！\n" + RARE_MONSTER.name + "（" + RARE_EXP + " EXP）";
    restartAnimation(effectOverlay, "is-celebrate"); // お祝いと同じ、金色にふわっと光る見た目
    playSparkleSound(); // 「キラキラリーン♪」を鳴らす
  }, CELEBRATE_EFFECT_TIME);
}

// 「✨レア」の目印を作って返す
function createRareLabel() {
  const label = document.createElement("span");
  label.className = "rare-label";
  label.textContent = "✨レア";
  return label;
}

// index 番目のクエストを完了（撃破済み）にする
function completeQuest(index) {
  // すでに撃破済みなら何もしない（二重に完了させない）
  if (quests[index].done) {
    return;
  }
  // 保存すると一覧が並べかえられて番号がずれるので、撃破するクエストを先に覚えておく
  // （ここから下は quests[index] ではなく、覚えておいた quest を使う）
  const quest = quests[index];
  quest.done = true;
  quest.pinned = false; // 撃破したら、ピン止めの数から外す
  saveQuests();
  console.log("クエストを撃破しました", quest);

  // そのクエストのモンスターを、たおした記録に入れる（保存は、下のごほうびのときに一緒にする）
  recordMonsterDefeat(quest);

  // EXP・今日の撃破数・コインをもらう
  giveDefeatRewards(quest.exp, quest.rare === true, true); // 最後の true は「クエストを撃破した」（ボス戦の日のコインのため）
  renderCreatures(); // 図鑑の「モンスターとペット」も描き直す
}

// クエストのEXP（レアならゴールデンスライム）で決まるモンスターの、たおした数を1つ増やす
function recordMonsterDefeat(quest) {
  const monster = getMonster(quest);
  monsterDefeats[monster.id] = (monsterDefeats[monster.id] || 0) + 1;
}

// 撃破したときのごほうび（EXP・今日の撃破数・コイン）をもらって保存する（クエストと習慣で同じものを使う）
// exp は獲得EXP、isRare はレアなクエストかどうか
function giveDefeatRewards(exp, isRare, isQuest) {
  // EXPを累計EXPに足す
  totalExp = totalExp + exp;

  // 今日の撃破数を 1 増やす（日付が変わっていたら、先に 0 に戻す）
  resetTodayCountIfNewDay();
  todayCount = todayCount + 1;

  // カレンダーのために、今日撃破した数を記録する
  const today = getTodayString();
  defeatHistory[today] = (defeatHistory[today] || 0) + 1;

  // 連れているペットの「なかよし」をふやす（レベルが上がったら、あとで演出を出す）
  growActivePets();

  // コインを足す（レアなクエストは多めにもらえる。ボス戦の日のクエストは3倍）
  if (isRare) {
    coins = coins + COIN_PER_RARE_DEFEAT;
  } else if (isQuest && isBossDay()) {
    coins = coins + COIN_PER_DEFEAT * BOSS_COIN_MULTIPLIER;
  } else {
    coins = coins + COIN_PER_DEFEAT;
  }

  savePlayer();
  console.log("累計EXP", totalExp, "今日の撃破数", todayCount);
}

// ===== 毎日の習慣 =====

// 毎日の習慣を localStorage に保存する
function saveHabits() {
  localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
}

// localStorage から、保存しておいた毎日の習慣を取り出す
function loadHabits() {
  const saved = localStorage.getItem(HABITS_KEY);
  if (saved === null) {
    return;
  }

  // 保存されたデータが壊れていても止まらないように、try で囲みます
  try {
    habits = JSON.parse(saved);

    // 前の形の保存データには、クリアした日の記録（doneDates）が無いので、最後にクリアした日から作る
    for (let i = 0; i < habits.length; i++) {
      if (!habits[i].doneDates) {
        habits[i].doneDates = habits[i].doneDate ? [habits[i].doneDate] : [];
      }
    }
  } catch (error) {
    console.log("習慣の保存データが壊れていたので、空の一覧から始めます");
    habits = [];
  }
}

// 新しい習慣を追加する（EXPは登録したときに10〜30で決まり、毎日同じ）
function addHabit(habitName, days) {
  const newHabit = {
    name: habitName,
    exp: getRandomExp(10, 30),
    doneDate: "", // まだ一度も撃破していない
    doneDates: [], // クリアした日の記録（カレンダーで使う）
    days: days.slice(), // やる曜日（0 が日曜、6 が土曜）。slice で、表のコピーを入れる
  };
  habits.push(newHabit);
  saveHabits();
  console.log("習慣を追加しました", newHabit);
}

// ===== 日課の曜日 =====

// 曜日の番号（0 が日曜、6 が土曜。Date の getDay と同じ）と、その名前
const ALL_WEEKDAYS = [0, 1, 2, 3, 4, 5, 6];
const WEEKDAY_NAMES = ["日", "月", "火", "水", "木", "金", "土"];

// これから追加する日課の曜日（入力フォームの曜日ボタンでえらぶ。はじめは毎日）
let newHabitDays = ALL_WEEKDAYS.slice();

// 曜日をえらびなおしている日課の番号（だれもえらびなおしていないときは -1）
let editingHabitIndex = -1;

// 日課をやる曜日の配列を返す（前からある日課は曜日の記録がないので、毎日にする）
function getHabitDays(habit) {
  if (Array.isArray(habit.days) && habit.days.length > 0) {
    return habit.days;
  }
  return ALL_WEEKDAYS;
}

// 今日が、その日課をやる曜日かどうかを返す
function isHabitScheduledToday(habit) {
  return getHabitDays(habit).includes(new Date().getDay());
}

// 曜日の配列を「月・水・金」のような文字にして返す（全部なら「毎日」）
function formatHabitDays(days) {
  if (days.length === 7) {
    return "毎日";
  }
  return days.map(function (day) {
    return WEEKDAY_NAMES[day];
  }).join("・");
}

// 曜日の配列に day があれば外し、なければ入れて、小さい順にならべた新しい配列を返す
function toggleDayInList(days, day) {
  const result = days.includes(day) ? days.filter(function (d) { return d !== day; }) : days.concat([day]);
  return result.sort(function (a, b) { return a - b; });
}

// container の中に、日〜土の曜日ボタンを作る（えらんでいる曜日は濃い色）。押したら onToggle(曜日の番号) を呼ぶ
function renderHabitDayButtons(container, days, onToggle) {
  container.innerHTML = "";
  ALL_WEEKDAYS.forEach(function (day) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "habit-day-button";
    button.classList.toggle("is-active", days.includes(day));
    button.textContent = WEEKDAY_NAMES[day];
    button.addEventListener("click", function () {
      onToggle(day);
    });
    container.appendChild(button);
  });
}

// 入力フォームの曜日ボタンを押したとき：これから追加する日課の曜日を切りかえる
function toggleNewHabitDay(day) {
  newHabitDays = toggleDayInList(newHabitDays, day);
  renderHabitDayButtons(habitDaysBox, newHabitDays, toggleNewHabitDay);
}

// 一覧の日課の曜日ボタンを押したとき：その日課の曜日を切りかえて保存する（1つもなくなるときは切りかえない）
function toggleHabitDay(index, day) {
  const days = toggleDayInList(getHabitDays(habits[index]), day);
  if (days.length === 0) {
    alert("曜日を1つ以上えらんでください");
    return;
  }
  habits[index].days = days;
  saveHabits();
  renderQuests(); // この中で、日課のカードも表示し直す
}

// 一覧の日課の ✏️ を押したとき：曜日ボタンを出す・しまう
function toggleHabitDaysEditor(index) {
  editingHabitIndex = editingHabitIndex === index ? -1 : index;
  renderQuests();
}

// 次にその日課をやる曜日の名前を返す（明日なら「明日」）
function getNextHabitDayText(habit) {
  const today = new Date().getDay();
  for (let i = 1; i <= 7; i++) {
    const day = (today + i) % 7;
    if (getHabitDays(habit).includes(day)) {
      return i === 1 ? "明日" : WEEKDAY_NAMES[day] + "曜日";
    }
  }
  return "明日";
}

// 習慣を、今日もう撃破したかどうかを返す（最後に撃破した日が今日なら true）
function isHabitDoneToday(habit) {
  return habit.doneDate === getTodayString();
}

// index 番目の習慣を撃破する（今日はクリアにして、ごほうびと演出を出す）
function defeatHabit(index) {
  const habit = habits[index];
  if (isHabitDoneToday(habit)) {
    return; // 今日はもう撃破しているので、何もしない
  }

  // 撃破する前のレベルと今日の撃破数を覚えておく（日付が変わっていたら、先に 0 に戻す）
  resetTodayCountIfNewDay();
  const levelBefore = getLevel();
  const countBefore = todayCount;

  habit.doneDate = getTodayString();
  habit.doneDates.push(habit.doneDate); // カレンダーのために、クリアした日を全部覚えておく
  saveHabits();
  giveDefeatRewards(habit.exp, false, false); // 日課はモンスターが出ないので、ボス戦の日でもコインはふだんどおり
  console.log("習慣を撃破しました", habit);

  renderQuests(); // この中で、習慣のカードも表示し直す
  renderStatus();

  // 撃破・レベルアップ・お祝いの演出を、順番待ちの列に並べる
  addDefeatEffects(1, habit.exp, levelBefore, getLevel(), countBefore, todayCount);
  addPendingPetLevelUpEffects(); // ペットのレベルが上がっていたら、撃破の演出のあとに出す
  checkAchievements(true); // 新しくとれた実績があれば、演出を出す
}

// index 番目の習慣を削除する（もらったEXPは減らさない）
function deleteHabit(index) {
  const removed = habits.splice(index, 1);
  saveHabits();
  renderQuests();
  console.log("習慣を削除しました", removed[0]);
}

// 習慣1つ分の行を作って返す
function createHabitItem(habit, index) {
  const item = document.createElement("div");
  item.className = "today-item";
  const isDone = isHabitDoneToday(habit);
  const isRest = !isHabitScheduledToday(habit); // 今日がお休みの曜日か
  if (isDone || isRest) {
    item.classList.add("is-habit-done"); // 今日クリアした日課と、今日お休みの日課は薄くする
  }

  // 日課の名前（今日クリアしていたら、前に ✅ を付ける）
  const name = document.createElement("p");
  name.className = "today-name";
  name.textContent = (isDone ? "✅ " : "") + habit.name;
  item.appendChild(name);

  // やる曜日（「📅 月・水・金」）と ✏️。✏️ を押すと、その下に曜日ボタンが出る
  item.appendChild(createHabitDaysLine(index));
  if (editingHabitIndex === index) {
    const editor = document.createElement("div");
    editor.className = "habit-days";
    renderHabitDayButtons(editor, getHabitDays(habit), function (day) {
      toggleHabitDay(index, day);
    });
    item.appendChild(editor);
  }

  // 「（〇 EXP get）」と、ボタンを横に並べる行
  const row = document.createElement("div");
  row.className = "today-row";
  const exp = document.createElement("p");
  exp.className = "today-exp";
  exp.textContent = getHabitStateText(habit, isDone, isRest);
  row.appendChild(exp);

  const actions = document.createElement("div");
  actions.className = "today-actions";
  if (!isDone && !isRest) {
    actions.appendChild(createHabitDefeatButton(index)); // お休みの日は、撃破ボタンを出さない
  }
  actions.appendChild(createHabitDeleteButton(index));
  row.appendChild(actions);

  item.appendChild(row);
  return item;
}

// 日課の「📅 月・水・金 ✏️」の行を作って返す
function createHabitDaysLine(index) {
  const line = document.createElement("p");
  line.className = "habit-days-text";
  line.textContent = "📅 " + formatHabitDays(getHabitDays(habits[index])) + " ";
  const editButton = document.createElement("button");
  editButton.type = "button";
  editButton.className = "habit-days-edit";
  editButton.textContent = editingHabitIndex === index ? "✅ とじる" : "✏️";
  editButton.addEventListener("click", function () {
    toggleHabitDaysEditor(index);
  });
  line.appendChild(editButton);
  return line;
}

// 日課の状態の文字を返す（クリアした・お休み・まだ）
function getHabitStateText(habit, isDone, isRest) {
  if (isRest) {
    return "💤 今日はお休み";
  }
  if (isDone) {
    return "今日はクリア（次は" + getNextHabitDayText(habit) + "）";
  }
  return "（" + habit.exp + " EXP get）";
}

// 習慣の「⚔️ 撃破する」ボタンを作って返す（レベルアップの演出の間は、代わりに「レベルアップ中…」）
function createHabitDefeatButton(index) {
  if (isDefeatLocked) {
    const waiting = document.createElement("span");
    waiting.className = "today-waiting";
    waiting.textContent = "レベルアップ中…";
    return waiting;
  }
  const button = document.createElement("button");
  button.type = "button";
  button.className = "today-defeat-button";
  button.textContent = "⚔️ 撃破する";
  button.addEventListener("click", function () {
    defeatHabit(index);
  });
  return button;
}

// 習慣の「削除」ボタンを作って返す
function createHabitDeleteButton(index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "delete-button";
  button.textContent = "削除";
  button.addEventListener("click", function () {
    deleteHabit(index);
  });
  return button;
}

// 今日まだクリアしていない習慣の数を返す
function countRemainingHabits() {
  return habits.filter(function (habit) {
    return isHabitScheduledToday(habit) && !isHabitDoneToday(habit); // 今日がお休みの日課は数えない
  }).length;
}

// 「🔁 今日の日課」の切りかえボタンに、今日の残りの数を出す
// まだ残っている →「（あと2）」、全部クリア →「✅」、今日やる日課がない（ない・全部お休み） → 何も付けない
// 2けた（10以上）のときは、ボタンに入りきるように、かっこを取って「 あと12」にする
function renderHabitSwitchText() {
  const remaining = countRemainingHabits();
  let text = "🔁 今日の日課";
  if (remaining >= 10) {
    text = text + " あと" + remaining;
  } else if (remaining > 0) {
    text = text + "（あと" + remaining + "）";
  } else if (habits.some(isHabitScheduledToday)) {
    text = text + " ✅";
  }
  switchHabitButton.textContent = text;
}

// 毎日の習慣のカードを表示し直す
function renderHabits() {
  renderHabitSwitchText(); // 切りかえボタンの残りの数も、いっしょに書きかえる
  habitList.innerHTML = "";
  if (habits.length === 0) {
    const empty = document.createElement("p");
    empty.className = "today-empty";
    empty.textContent = "まだありません（「🔁 日課として追加」にチェックを付けて追加できます）";
    habitList.appendChild(empty);
    return;
  }
  // 今日やる日課を先に、今日お休みの日課をいちばん下にならべる（ボタンで使う番号 i は、もとの番号のまま）
  for (let i = 0; i < habits.length; i++) {
    if (isHabitScheduledToday(habits[i])) {
      habitList.appendChild(createHabitItem(habits[i], i));
    }
  }
  for (let i = 0; i < habits.length; i++) {
    if (!isHabitScheduledToday(habits[i])) {
      habitList.appendChild(createHabitItem(habits[i], i));
    }
  }
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

  // 「🔁 日課として追加」にチェックが付いていれば日課、なければクエストとして追加する
  if (habitCheckbox.checked) {
    // 曜日を1つもえらんでいなければ、追加しない
    if (newHabitDays.length === 0) {
      alert("曜日を1つ以上えらんでください");
      return;
    }
    addHabit(questName, newHabitDays);
    newHabitDays = ALL_WEEKDAYS.slice(); // 次に追加するときのために、毎日にもどしておく
    renderHabitDayButtons(habitDaysBox, newHabitDays, toggleNewHabitDay);
  } else {
    addQuest(questName, deadlineInput.value, categoryInput.value, planInput.value); // 締切・やる日が空ならなし、カテゴリが「なし」なら札なし
  }
  renderQuests(); // この中で、習慣のカードも表示し直す

  // 締切とやる日の欄も空に戻す
  deadlineInput.value = "";
  planInput.value = "";

  // 入力欄を空にして、続けて入力できるようにする
  questInput.value = "";
  questInput.focus();
});

// 「🔁 毎日の習慣として追加」のチェックを付けたり外したりしたとき
// （習慣は毎日なので締切はない。チェックが付いている間は、締切の欄を押せなくする）
habitCheckbox.addEventListener("change", function () {
  deadlineInput.disabled = habitCheckbox.checked;
  planInput.disabled = habitCheckbox.checked; // 日課には、やる日も付けない
  categoryInput.disabled = habitCheckbox.checked; // 日課にはカテゴリを付けないので、えらべなくする
  habitDaysBox.hidden = !habitCheckbox.checked; // 曜日をえらぶボタンは、日課のときだけ出す
});

// 「他のタスク ▽」のボタンが押されたとき
otherToggle.addEventListener("click", toggleOtherQuests);

// 「他のタスク」「🗓️ 明日以降」の切りかえボタンが押されたとき
otherSwitchButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    switchOtherList(button.dataset.list);
  });
});

// 「レベルをリセット」のボタンが押されたとき
resetLevelButton.addEventListener("click", resetLevel);

// 「選んだ〇体をまとめて撃破」のボタンが押されたとき
bulkDefeatButton.addEventListener("click", defeatSelectedQuests);

// 「本日のタスク」「毎日の習慣」の切りかえボタンが押されたとき
switchTodayButton.addEventListener("click", function () {
  switchTodayView(false);
});
switchHabitButton.addEventListener("click", function () {
  switchTodayView(true);
});

// ガチャ画面の中の切りかえボタンが押されたとき（ボタンに書いてある data-gacha のページを見せる）
gachaSwitchButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    switchGachaPage(button.dataset.gacha);
  });
});

// 図鑑の中の切りかえボタンが押されたとき（ボタンに書いてある data-collection のページを見せる）
collectionSwitchButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    switchCollectionPage(button.dataset.collection);
  });
});

// 「1回引く」のボタンが押されたとき
gachaButton.addEventListener("click", drawGacha);

// 「10連ガチャ」のボタンが押されたとき
gachaTenButton.addEventListener("click", drawGachaTen);

// 音のボタンが押されたとき
soundButton.addEventListener("click", toggleSound);

// カレンダーの ◀ ▶ 「今月」のボタンが押されたとき
calendarPrevButton.addEventListener("click", function () {
  moveCalendarMonth(-1);
});
calendarNextButton.addEventListener("click", function () {
  moveCalendarMonth(1);
});
calendarThisMonthButton.addEventListener("click", showThisMonth);

// ポモドーロタイマーのボタンが押されたとき
timerStartButton.addEventListener("click", startTimer);
timerPauseButton.addEventListener("click", pauseTimer);
timerResetButton.addEventListener("click", resetTimer);

// 「🎵 集中中の音」をえらびなおしたとき
timerSoundSelect.addEventListener("change", changeFocusSound);

// 集中・休けいの長さをえらびなおしたとき
timerFocusSelect.addEventListener("change", changeTimerLength);
timerBreakSelect.addEventListener("change", changeTimerLength);

// 右上の ⚙️ ボタンが押されたとき：設定画面を開く
settingsButton.addEventListener("click", function () {
  showPage("page-settings");
});

// 設定画面の、音の大きさのつまみを動かしたとき（input は動かしているあいだ、change ははなしたとき）
effectVolumeSlider.addEventListener("input", changeEffectVolume);
effectVolumeSlider.addEventListener("change", finishEffectVolume);
focusVolumeSlider.addEventListener("input", changeFocusVolume);
focusVolumeSlider.addEventListener("change", savePlayer);

// 設定画面の、ボス戦の日の曜日をえらびなおしたとき
bossDaySelect.addEventListener("change", changeBossDay);

// 設定画面の、データの書き出し・読みこみのボタン
exportButton.addEventListener("click", exportData);
copyButton.addEventListener("click", copyData);
downloadButton.addEventListener("click", downloadData);
importButton.addEventListener("click", function () {
  importData(dataText.value);
});
importFileInput.addEventListener("change", importFromFile);

// 設定画面の「🗑️ データを全部消す」のボタン
deleteAllButton.addEventListener("click", deleteAllData);

// 画面を切りかえるタブが押されたとき（タブに書いてある data-page の画面を見せる）
for (let i = 0; i < pageTabs.length; i++) {
  pageTabs[i].addEventListener("click", function () {
    showPage(pageTabs[i].dataset.page);
  });
}

// 「撃破済みをまとめて削除」のボタンが押されたとき
clearDoneButton.addEventListener("click", function () {
  clearDoneQuests();
  renderQuests();
});

// --- ページを開いたときに最初に1回だけ行うこと ---

// 保存しておいたクエストを取り出して、一覧に表示する
loadQuests();
sortQuests(); // 今までのデータも、締切が近い順に並べる
loadHabits(); // 毎日の習慣も取り出す（表示は、renderQuests の中で行う）
renderHabitDayButtons(habitDaysBox, newHabitDays, toggleNewHabitDay); // 日課を追加するときの曜日ボタンを作っておく
fillCategoryOptions(categoryInput, ""); // クエストを追加するときの、カテゴリをえらぶ箱の中身を作っておく
planInput.min = addDaysToDateText(getTodayString(), 1); // やる日のカレンダーは、明日からえらべるようにする
renderQuests();

// 保存しておいた累計EXPを取り出して、ステータスを表示する
loadPlayer();
resetTodayCountIfNewDay(); // 前に開いた日と違えば、今日の撃破数を 0 に戻す
fillTodayHistory(); // カレンダーの記録がまだない、今日の分の撃破数を入れておく
renderStatus(); // この中で、キャラクターのドット絵も描きます
renderCalendar(); // プレイヤーの状態（撃破の記録）を読み込んだので、カレンダーを表示し直す

// 保存しておいた音の設定に合わせて、音のボタンを表示する
renderSoundButton();
renderVolumeSettings(); // 保存しておいた音の大きさを、設定画面のつまみに出しておく
renderBossDaySetting(); // 保存しておいたボス戦の日の曜日を、設定画面に出しておく
renderQuests(); // ボス戦の日は保存データで決まるので、読みこんだあとに、お知らせとモンスターを描き直す

// ポモドーロタイマーを表示する（最初は、集中 25:00 で止まっている）
timerSoundSelect.value = focusSound; // 保存しておいた「集中中の音」を、えらぶ欄に出しておく
timerFocusSelect.value = focusMinutes; // 保存しておいた集中・休けいの長さも、えらぶ欄に出して
timerBreakSelect.value = breakMinutes;
setupTimer(); // その長さでタイマーを用意しておく
renderTimer();

// 連れていくペットを描いて、ペットのカードを表示する
drawPets();
renderPets();

// ページを開いたときに、もう条件を満たしている実績は、演出なしで「とった」にしてから、実績のページを表示する
checkAchievements(false);
renderAchievements();

// その日はじめて開いたときは、ログインボーナスをわたす
checkLoginBonus();

// 別のタブやアプリからもどってきたとき：開いたまま日付が変わっていたら、ログインボーナスをわたす
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    checkLoginBonus();
  }
});
