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

// 「選んだ〇体をまとめて撃破」のボタン
const bulkDefeatButton = document.getElementById("bulk-defeat-button");

// 効果音を消したり戻したりするボタン
const soundButton = document.getElementById("sound-button");

// 画面を切りかえるタブのボタン（3つ）と、画面の箱（3つ）
const pageTabs = document.querySelectorAll(".page-tab");
const pages = document.querySelectorAll(".page");

// コインの表示、ガチャのボタン、図鑑の部品
const coinText = document.getElementById("coin-text");
const gachaButton = document.getElementById("gacha-button");
const collectionCount = document.getElementById("collection-count");
const collectionList = document.getElementById("collection-list");
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

// 装備したときに、キャラのドット絵に重ねて描く絵
// x・y は絵を置く場所（左上のマス）、rows は設計図（「.」は塗らない）
const EQUIP_SPRITES = {
  "cloth-hat": { x: 2, y: 1, rows: ["..KKKKK..", ".KBBBBBK.", "KBBBBBBBK"] }, // 青いぼうし
  "king-crown": { x: 4, y: 0, rows: ["Y.Y.Y", "YYYYY"] }, // 金の冠
  "wood-stick": { x: 13, y: 3, rows: ["G", "G", "G", "G", "G", "G", "G", "G", "G", "G", "G"] }, // 木の棒
  "steel-sword": {
    x: 12,
    y: 0,
    rows: [".s.", ".s.", ".s.", ".s.", ".s.", ".s.", ".s.", "YYY", ".G.", ".G.", ".G."], // 銀の剣
  },
  "hunter-bow": {
    x: 12,
    y: 2,
    rows: [".G..", ".sG.", ".s.G", ".s.G", ".s.G", ".s.G", ".s.G", ".s.G", ".sG.", ".G.."], // 弓と弦
  },
  "legend-sword": {
    x: 12,
    y: 0,
    rows: [".ll.", ".ll.", ".ll.", ".ll.", ".ll.", ".ll.", ".ll.", "YYYY", ".G..", ".G..", ".G.."], // 光る太い剣
  },
  "iron-shield": { x: 0, y: 8, rows: ["KKKKK", "KsDsK", "KDDDK", "KsDsK", "KsDsK", ".KKK."] }, // 鉄の盾
  "travel-boots": { x: 3, y: 13, rows: [".bb.bb.", ".bb.bb.", "bbb.bbb"] }, // 茶色のブーツ
  "power-ring": { x: 2, y: 10, rows: ["Y"] }, // 左手の金の指輪
  "sage-crystal": { x: 0, y: 3, rows: [".p.", "pIp", ".p."] }, // 左の空中にうかぶ紫の水晶

  // ここから下は、ガチャを48種類にしたときに足した装備の絵
  "iron-helmet": { x: 2, y: 1, rows: ["..KKKKK..", ".KsssssK.", "KsDDDDDsK"] }, // 銀のかぶと（ぼうしの形ちがい）
  "wizard-hat": { x: 2, y: 0, rows: ["....K....", "...KpK...", "..KpppK..", "KpppppppK"] }, // 紫のとんがり帽子
  "hand-axe": { x: 13, y: 3, rows: ["Gss", "Gss", "G..", "G..", "G..", "G..", "G..", "G..", "G.."] }, // 手おの
  "trident": {
    x: 11,
    y: 0,
    rows: ["s.s.s", "sssss", "..s..", "..G..", "..G..", "..G..", "..G..", "..G..", "..G..", "..G..", "..G.."], // 三つ又の槍
  },
  "magic-staff": {
    x: 12,
    y: 1,
    rows: [".p.", "pIp", ".p.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G.", ".G."], // 先に紫の玉が付いた杖
  },
  "leather-boots": { x: 3, y: 13, rows: [".CC.CC.", ".CC.CC.", "CCC.CCC"] }, // 明るい茶色のブーツ（旅人のブーツの色ちがい）
  "swift-shoes": { x: 3, y: 13, rows: [".FF.FF.", ".FF.FF.", "FFF.FFF"] }, // 緑のくつ（旅人のブーツの色ちがい）
  "leather-gloves": { x: 2, y: 9, rows: ["L.........L", "L.........."] }, // 両手の茶色の手袋
  "scarf": { x: 4, y: 8, rows: ["RRRRR", "....R"] }, // 首の赤いマフラー
  "charm": { x: 5, y: 9, rows: [".T.", "TBT", ".T."] }, // 胸の青いお守り
};

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

// ゴールデンスライムのドット絵の設計図（金色のスライム。まわりにキラキラ）
const PIXELS_GOLDEN_SLIME = [
  "..T.............",
  ".TTT.......T....",
  "..T.......TTT...",
  "...........T....",
  "................",
  ".......KK.......",
  "......KAAK......",
  ".....KAJAAK.....",
  "....KAJAAAAK..T.",
  "...KAAAAAAAAKTTT",
  "..KAEAAAEAAAAKT.",
  "..KAAAAAAAAAAK..",
  "..KAAAMMAAAAAK..",
  "..KAAAAAAAAAAK..",
  "...KAAAAAAAAK...",
  "....KKKKKKKK....",
];

// レアなクエストのときに出すモンスター
const RARE_MONSTER = { name: "ゴールデンスライム", pixels: PIXELS_GOLDEN_SLIME, isBoss: false };

// --- 関数 ---

// 本日のタスクのクエストから、出すモンスターを決めて返す
// レアなクエストならゴールデンスライム、それ以外は EXP で決める
function getMonster(quest) {
  if (quest.rare) {
    return RARE_MONSTER;
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
  paintGrid(heroCanvas, scale2x(makeHeroGrid()));
}

// 設計図（pixels）のドット絵を、なめらかに広げて canvas に描く（モンスターに使う）
function drawPixels(canvas, pixels) {
  paintGrid(canvas, scale2x(makeColorGrid(pixels)));
}

// キャラクターの16×16の色の表を作り、装備しているアイテムの絵を重ねて返す
function makeHeroGrid() {
  const grid = makeColorGrid(getTitle(getLevel()).pixels);

  // 武器を装備しているときは、キャラがもともと持っている武器（右側）を先に消す
  if (equipped.weapon) {
    clearGridArea(grid, 12, 0, 4, 9); // 右上（剣の刃やつばのあたり）
    clearGridArea(grid, 13, 9, 3, 5); // 右下（持ち手のあたり。腕は消さない）
  }

  // 頭の装備をしているときは、もともとの王冠や光の輪がはみ出さないように、いちばん上の1行（頭の上）を先に消す
  if (equipped.head) {
    clearGridArea(grid, 0, 0, 12, 1);
  }

  // 部位ごとに、装備しているアイテムの絵を重ねる
  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const itemId = equipped[EQUIP_SLOTS[i].slot];
    if (itemId) {
      const sprite = EQUIP_SPRITES[itemId];
      overlayOnGrid(grid, sprite.rows, sprite.x, sprite.y);
    }
  }
  return grid;
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
function overlayOnGrid(grid, rows, left, top) {
  for (let y = 0; y < rows.length; y++) {
    for (let x = 0; x < rows[y].length; x++) {
      const color = HERO_COLORS[rows[y][x]];
      if (color) {
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
    coins: coins,
    items: items,
    equipped: equipped,
    muted: isMuted,
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
    coins = player.coins || 0; // 前の形の保存データには無いので、そのときは 0
    items = player.items || {};
    equipped = player.equipped || {};
    isMuted = player.muted === true; // 前の形の保存データには無いので、そのときは「鳴らす」
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
  volume.connect(audio.destination);
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
  volume.connect(audio.destination);
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
  volume.connect(audio.destination);
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
  });
  return button;
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

// index 番目から step の向き（-1 なら上、1 なら下）に見ていき、
// いちばん近い「まだ撃破していないクエスト」が何番目かを返す（無いときは -1）
// ただし、ピン止めしているかどうかがちがうクエストとは入れ替えないので、そのときも -1 を返す
function findUndoneNeighbor(index, step) {
  let i = index + step;
  while (i >= 0 && i < quests.length) {
    if (!quests[i].done) {
      if (isPinned(quests[i]) === isPinned(quests[index])) {
        return i;
      }
      return -1; // ピン止めの境目なので、ここより先には動かせない
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

  // ピン止め中なら、行を少し黄色くする目印を付ける
  if (isPinned(quest) && !quest.done) {
    item.classList.add("is-pinned");
  }

  // 1行を2段に分ける（上の段：名前とEXP、下の段：ボタン）
  item.appendChild(createQuestItemTop(quest, index));
  item.appendChild(createQuestItemBottom(quest, index));
  return item;
}

// 他のタスクの一覧の、上の段を作って返す（クエスト名・目印・獲得EXP）
function createQuestItemTop(quest, index) {
  const top = document.createElement("div");
  top.className = "quest-top";

  // タスク名（押すと名前を直せる）
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
    if (!quests[i].done) {
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
    if (!quests[i].done && indexes.length < TODAY_MAX) {
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
  nameLine.appendChild(createQuestName(quest, index, "p", "today-name")); // 押すと名前を直せる
  nameLine.appendChild(createPinButton(quest, index)); // 📌ボタン
  nameLine.appendChild(createMoveButtons(index, false)); // 右はしに、横に並べた▲▼ボタン

  // ピン止め中なら、行を少し黄色くする目印を付ける
  if (isPinned(quest)) {
    item.classList.add("is-pinned");
  }
  item.appendChild(nameLine);

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
  const todayIndexes = findTodayIndexes(); // 本日のタスク（最大5つ）
  renderToday(todayIndexes);
  renderMonster(findTodayIndex()); // モンスターは、本日のタスクのいちばん上のクエストの分

  // 選んだクエストのうち、まだあって未撃破のものだけを残す
  // （削除したもの・撃破したものは、選んだ状態から外す）
  selectedQuests = selectedQuests.filter(function (quest) {
    return quests.includes(quest) && !quest.done;
  });

  // 他のタスクの一覧を、いったん空にする
  questList.innerHTML = "";

  // 1回目：まだ撃破していないクエストを先に並べる（本日のタスクの分は除く）
  for (let i = 0; i < quests.length; i++) {
    if (!todayIndexes.includes(i) && !quests[i].done) {
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

  // まとめて撃破のボタンを表示し直す
  renderBulkDefeatButton();
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

// ランク（1〜3）の★を返す
function getRankStars(rank) {
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
}

// アイテムを1つ出して、持っている数を1つ増やし、出たアイテムを返す（1回引く・10連で使う）
function drawOneItem() {
  const item = pickGachaItem();
  items[item.id] = (items[item.id] || 0) + 1;
  return item;
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
}

// 10連ガチャの演出を列に並べる（「🎰 10連ガチャ！ ★★★×1 ★★×3 ★×6」のように、ランクごとの数を出す）
function addGachaTenEffect(results) {
  // ランクごとに、いくつ出たか数える（counts[3] が ★★★ の数）
  const counts = { 1: 0, 2: 0, 3: 0 };
  for (let i = 0; i < results.length; i++) {
    counts[results[i].rank] = counts[results[i].rank] + 1;
  }

  addEffect(function () {
    clearEffectClasses();
    effectText.textContent =
      "🎰 10連ガチャ！\n★★★×" + counts[3] + "  ★★×" + counts[2] + "  ★×" + counts[1];
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
    const kinds = GACHA_ITEMS.filter(function (item) {
      return item.rank === rank.rank;
    }).length;
    const each = (rank.chance / kinds) * 100;

    const row = document.createElement("li");
    row.className = "gacha-rate rank-" + rank.rank;
    row.textContent =
      rank.stars + " " + rank.name + "　" + Math.round(rank.chance * 100) + "%" +
      "（" + kinds + "種類・1つあたり 約" + Math.round(each * 10) / 10 + "%）";
    gachaRateList.appendChild(row);
  }
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

// 「そうび：頭 👑 ／ 武器 🗡️ ／ …」の文字を作って返す
function getEquipSummary() {
  const parts = [];
  for (let i = 0; i < EQUIP_SLOTS.length; i++) {
    const itemId = equipped[EQUIP_SLOTS[i].slot];
    let icon = "―"; // 何も装備していない部位は「―」
    if (itemId) {
      icon = GACHA_ITEMS.find(function (item) {
        return item.id === itemId;
      }).icon;
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
function createCollectionGroup(rank) {
  const group = document.createElement("div");

  // そのランクのアイテムだけを取り出す
  const rankItems = GACHA_ITEMS.filter(function (item) {
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
    collectionList.appendChild(createCollectionGroup(GACHA_RANKS[i]));
  }

  // 全部で何種類集めたか
  collectionCount.textContent = "図鑑 " + countOwnedItems(GACHA_ITEMS) + " / " + GACHA_ITEMS.length;

  // 今の装備
  equipSummary.textContent = getEquipSummary();
}

// 効果音を消す・戻す（押すたびに切りかえて、保存する）
function toggleSound() {
  isMuted = !isMuted;
  savePlayer();
  renderSoundButton();
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
  // 50回に1回くらいの確率で、レアなクエストにする
  // （Math.random() は 0 以上 1 未満のランダムな数。それが RARE_CHANCE より小さければレア）
  const isRare = Math.random() < RARE_CHANCE;

  const newQuest = {
    name: questName,
    exp: getRandomExp(20, 30), // 20〜30 のランダムな獲得EXP
    done: false,
    rare: isRare, // レアなクエストかどうか
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
  quests[index].done = true;
  quests[index].pinned = false; // 撃破したら、ピン止めの数から外す
  saveQuests();
  console.log("クエストを撃破しました", quests[index]);

  // そのクエストのEXPを累計EXPに足す
  totalExp = totalExp + quests[index].exp;

  // 今日の撃破数を 1 増やす（日付が変わっていたら、先に 0 に戻す）
  resetTodayCountIfNewDay();
  todayCount = todayCount + 1;

  // コインを足す（レアなクエストは多めにもらえる）
  if (quests[index].rare) {
    coins = coins + COIN_PER_RARE_DEFEAT;
  } else {
    coins = coins + COIN_PER_DEFEAT;
  }

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

// 「選んだ〇体をまとめて撃破」のボタンが押されたとき
bulkDefeatButton.addEventListener("click", defeatSelectedQuests);

// 「1回引く」のボタンが押されたとき
gachaButton.addEventListener("click", drawGacha);

// 「10連ガチャ」のボタンが押されたとき
gachaTenButton.addEventListener("click", drawGachaTen);

// 音のボタンが押されたとき
soundButton.addEventListener("click", toggleSound);

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
renderQuests();

// 保存しておいた累計EXPを取り出して、ステータスを表示する
loadPlayer();
resetTodayCountIfNewDay(); // 前に開いた日と違えば、今日の撃破数を 0 に戻す
renderStatus(); // この中で、キャラクターのドット絵も描きます

// 保存しておいた音の設定に合わせて、音のボタンを表示する
renderSoundButton();
