//idの引用と定義



const input = document.getElementById('todo-write');
const addBtn = document.getElementById('todo-submit');
const clearAllBtn = document.getElementById('clearAllBtn');
const list = document.getElementById('task-list');

// 追加ボタン
addBtn.addEventListener('click', addTask);
// Enterキーでも追加
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// 全削除ボタン
clearAllBtn.addEventListener('click', () => {
  list.innerHTML = '';
});

function addTask() {
  const taskText = input.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');
  
  // タスク本文
  const span = document.createElement('span');
  span.textContent = taskText;
  span.addEventListener('click', () => {
    li.classList.toggle('completed'); // 完了済みトグル
  });

  // 削除ボタン
  const delBtn = document.createElement('button');
  delBtn.textContent = '削除';
  delBtn.addEventListener('click', () => {
    list.removeChild(li);
  });

  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);

  input.value = '';
}
console.log(list); // nullじゃなければOK


//Addボタンを押したらテキストボックス内の内容をliに追加
//チェックボタンを押したら色が薄くなる、線を引く
//ばつボタンを押したら該当の項目を消す
//リセットボタンを押したら全部消える