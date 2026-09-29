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

// --- データ ---

// 登録されたクエストをすべて入れておく配列
// 1つのクエストは { name: タスク名, exp: 獲得EXP, done: 完了したか } の形
let quests = [];

// --- 関数 ---

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

// クエスト1つ分の行（li）を作って返す
function createQuestItem(quest, index) {
  const item = document.createElement("li");
  item.className = "quest-item";

  // タスク名（textContent を使うので、入力した文字はそのまま文字として表示されます）
  const name = document.createElement("span");
  name.className = "quest-name";
  name.textContent = quest.name;

  // 獲得EXP
  const exp = document.createElement("span");
  exp.className = "quest-exp";
  exp.textContent = quest.exp + " EXP";

  item.appendChild(name);
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
  console.log("クエストを追加しました", newQuest);
}

// index 番目のクエストを削除する
// （完了済みでも、もらったEXPは減らさない決まりです）
function deleteQuest(index) {
  const removed = quests.splice(index, 1);
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
