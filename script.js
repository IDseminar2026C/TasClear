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

// 勇者のドット絵を描く場所
const heroCanvas = document.getElementById("hero-canvas");

// ステータス表示の部品（アイコン・称号・レベル・経験値バー・経験値の数字）
const statusIcon = document.getElementById("status-icon");
const statusName = document.getElementById("status-name");
const statusLevel = document.getElementById("status-level");
const expBarFill = document.getElementById("exp-bar-fill");
const expText = document.getElementById("exp-text");

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

// localStorage にプレイヤーの状態をしまうときの名前
const PLAYER_KEY = "tasclear-player";

// 1レベル上がるのに必要なEXP
const EXP_PER_LEVEL = 100;

// レベルアップの演出を出すまでの待ち時間の番号（途中でやめるときに使う）
let levelUpTimer = null;

// 勇者のドット絵の設計図（16×16マス）
// 1文字が1マスで、文字によって塗る色が決まります（「.」は塗らない）
// この表を書きかえると、勇者の見た目を変えられます
const HERO_PIXELS = [
  ".............W..",
  "....KKKKK....W..",
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

// 設計図の文字と、塗る色の対応表
const HERO_COLORS = {
  K: "#222222", // ふちどり（黒）
  H: "#8b4513", // 髪（茶色）
  S: "#f5c89a", // はだ
  E: "#222222", // 目
  M: "#c0392b", // 口（赤）
  B: "#2e6bd6", // よろい（青）
  Y: "#d4a017", // 金色の飾り・剣のつば
  G: "#8b5a2b", // 剣の持ち手（茶色）
  W: "#d0d8e0", // 剣の刃（銀色）
};

// --- 関数 ---

// 勇者のドット絵を描く
function drawHero() {
  const pen = heroCanvas.getContext("2d"); // 絵を描くための道具

  // 上から1行ずつ、左から1マスずつ見ていく（y は何行目、x は何マス目）
  for (let y = 0; y < HERO_PIXELS.length; y++) {
    for (let x = 0; x < HERO_PIXELS[y].length; x++) {
      const color = HERO_COLORS[HERO_PIXELS[y][x]];

      // 色が決まっているマスだけ、1マス分の四角を塗る
      if (color) {
        pen.fillStyle = color;
        pen.fillRect(x, y, 1, 1);
      }
    }
  }
}

// プレイヤーの状態（累計EXP）を localStorage に保存する
function savePlayer() {
  localStorage.setItem(PLAYER_KEY, JSON.stringify({ totalExp: totalExp }));
}

// localStorage から、保存しておいた累計EXPを取り出す
function loadPlayer() {
  const saved = localStorage.getItem(PLAYER_KEY);

  // まだ何も保存されていなければ、0 のまま
  if (saved === null) {
    return;
  }

  // 保存されたデータが壊れていても止まらないように、try で囲みます
  try {
    totalExp = JSON.parse(saved).totalExp || 0;
    console.log("累計EXPを読み込みました", totalExp);
  } catch (error) {
    console.log("プレイヤーの保存データが壊れていたので、0 から始めます");
    totalExp = 0;
  }
}

// 累計EXPから、今のレベルを計算して返す（100 ごとに 1 上がる。Lv1 から始まる）
function getLevel() {
  return Math.floor(totalExp / EXP_PER_LEVEL) + 1;
}

// レベルから、称号とアイコンを決めて返す
function getTitle(level) {
  if (level >= 5) {
    return { icon: "👑", name: "勇者" };
  }
  if (level >= 3) {
    return { icon: "⚔️", name: "戦士" };
  }
  return { icon: "🧑‍🌾", name: "見習い冒険者" };
}

// ステータス（アイコン・称号・レベル・経験値バー）を画面に表示し直す
function renderStatus() {
  const level = getLevel();
  const title = getTitle(level);

  // 今のレベルの中で、どれだけ貯まっているか（0〜99）
  const currentExp = totalExp % EXP_PER_LEVEL;

  statusIcon.textContent = title.icon;
  statusName.textContent = title.name;
  statusLevel.textContent = level; // 丸の中には数字だけを出す
  expBarFill.style.width = (currentExp / EXP_PER_LEVEL) * 100 + "%";
  expText.textContent = currentExp + " / " + EXP_PER_LEVEL + " EXP";
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

// 撃破の演出を出す（光る・揺れる・「撃破！ +〇 EXP」の文字が出る）
function playDefeatEffect(exp) {
  // 待っているレベルアップの演出があれば、やめる（演出が重ならないように）
  clearTimeout(levelUpTimer);
  effectOverlay.classList.remove("is-levelup");

  effectText.textContent = "⚔️ 撃破！ +" + exp + " EXP";
  restartAnimation(effectOverlay, "is-playing");
  restartAnimation(container, "is-shaking");
}

// レベルアップの演出を出す（虹色にぴかぴか光って、レベルと称号が出る）
function playLevelUpEffect() {
  const level = getLevel();
  const title = getTitle(level);

  // 撃破の演出の目印を外してから、レベルアップの演出を動かす
  effectOverlay.classList.remove("is-playing");
  effectText.textContent =
    "🎉 レベルアップ！ Lv " + level + "\n" + title.icon + " " + title.name;
  restartAnimation(effectOverlay, "is-levelup");
}

// クエスト1つ分の完了チェックボックスを作って返す
// index は、そのクエストが quests 配列の何番目か
function createDoneCheckbox(quest, index) {
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "done-checkbox";
  checkbox.checked = quest.done;

  // 撃破済みのクエストは、チェックを外せないように押せなくする
  checkbox.disabled = quest.done;

  // チェックされたら、そのクエストを完了にして表示し直す
  checkbox.addEventListener("change", function () {
    // 撃破する前のレベルを覚えておく
    const levelBefore = getLevel();

    completeQuest(index);
    renderQuests();
    renderStatus();
    playDefeatEffect(quest.exp);

    // レベルが上がっていたら、撃破の演出が終わる 1秒後 にレベルアップの演出を出す
    if (getLevel() > levelBefore) {
      levelUpTimer = setTimeout(playLevelUpEffect, 1000);
    }
  });
  return checkbox;
}

// 「撃破済み」の目印を作って返す
function createDoneLabel() {
  const label = document.createElement("span");
  label.className = "done-label";
  label.textContent = "撃破済み";
  return label;
}

// クエスト1つ分の行（li）を作って返す
function createQuestItem(quest, index) {
  const item = document.createElement("li");
  item.className = "quest-item";

  // 撃破済みなら、薄く表示するための目印（クラス）を付ける
  if (quest.done) {
    item.classList.add("is-done");
  }

  // タスク名（textContent を使うので、入力した文字はそのまま文字として表示されます）
  const name = document.createElement("span");
  name.className = "quest-name";
  name.textContent = quest.name;

  // 獲得EXP
  const exp = document.createElement("span");
  exp.className = "quest-exp";
  exp.textContent = quest.exp + " EXP";

  item.appendChild(createDoneCheckbox(quest, index));
  item.appendChild(name);

  // 撃破済みなら「撃破済み」の目印を出す
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

  // クエスト名（大きく表示）
  const name = document.createElement("p");
  name.className = "today-name";
  name.textContent = quest.name;

  // 「（〇 EXP get）」
  const exp = document.createElement("p");
  exp.className = "today-exp";
  exp.textContent = "（" + quest.exp + " EXP get）";

  // 「撃破する」の文字付きチェックボックス
  const check = document.createElement("label");
  check.className = "today-check";
  check.appendChild(createDoneCheckbox(quest, index));
  check.appendChild(document.createTextNode("撃破する"));

  // チェックボックスと削除ボタンを横に並べる箱
  const actions = document.createElement("div");
  actions.className = "today-actions";
  actions.appendChild(check);
  actions.appendChild(createDeleteButton(index));

  todayQuest.appendChild(name);
  todayQuest.appendChild(exp);
  todayQuest.appendChild(actions);
}

// 画面のクエスト表示（本日のタスクと、他のタスクの一覧）をすべて表示し直す
function renderQuests() {
  const todayIndex = findTodayIndex();
  renderToday(todayIndex);

  // 他のタスクの一覧を、いったん空にする
  questList.innerHTML = "";

  // 本日のタスク以外のクエストを、1つずつ行にして追加する（i は何番目か）
  for (let i = 0; i < quests.length; i++) {
    if (i !== todayIndex) {
      questList.appendChild(createQuestItem(quests[i], i));
    }
  }
}

// 「他のタスク」の一覧を、開いていれば閉じ、閉じていれば開く
function toggleOtherQuests() {
  questList.hidden = !questList.hidden;

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

  // そのクエストのEXPを累計EXPに足して、保存する
  totalExp = totalExp + quests[index].exp;
  savePlayer();
  console.log("累計EXP", totalExp);
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

// --- ページを開いたときに最初に1回だけ行うこと ---

// 保存しておいたクエストを取り出して、一覧に表示する
loadQuests();
renderQuests();

// 保存しておいた累計EXPを取り出して、ステータスを表示する
loadPlayer();
renderStatus();

// 勇者のドット絵を描く
drawHero();
