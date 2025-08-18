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

  // チェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  li.classList.toggle('task');
  li.classList.toggle('list');
  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);
  });

  // タスク本文
  const span = document.createElement('span');
  span.textContent = taskText;
  span.classList.toggle('task');

  // 削除ボタン
  const delBtn = document.createElement('button');
  delBtn.textContent = 'Delete';
  //delBtn.classList.toggle('task');
  delBtn.classList.toggle('delete');
  delBtn.addEventListener('click', () => {
    list.removeChild(li);
  });

  // 要素をliに追加
  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);

  input.value = '';
}