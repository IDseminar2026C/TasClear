/*
  script.js … ページを「動かす」ためのファイルです。
*/

console.log("script.js が読み込まれました");

// --- HTML の部品を探して覚えておく ---

// クエストの入力フォーム
const questForm = document.getElementById("quest-form");

// クエスト名の入力欄
const questInput = document.getElementById("quest-input");

// クエスト一覧を表示する場所
const questList = document.getElementById("quest-list");

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

// --- 関数 ---

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
  statusLevel.textContent = "Lv " + level;
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
  effectText.textContent = "⚔️ 撃破！ +" + exp + " EXP";
  restartAnimation(effectOverlay, "is-playing");
  restartAnimation(container, "is-shaking");
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
    completeQuest(index);
    renderQuests();
    renderStatus();
    playDefeatEffect(quest.exp);
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

// quests 配列の中身を、画面の一覧に表示し直す
function renderQuests() {
  // いったん一覧を空にする
  questList.innerHTML = "";

  // クエストを1つずつ行にして追加する（i は何番目か）
  for (let i = 0; i < quests.length; i++) {
    questList.appendChild(createQuestItem(quests[i], i));
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

// --- ページを開いたときに最初に1回だけ行うこと ---

// 保存しておいたクエストを取り出して、一覧に表示する
loadQuests();
renderQuests();

// 保存しておいた累計EXPを取り出して、ステータスを表示する
loadPlayer();
renderStatus();
