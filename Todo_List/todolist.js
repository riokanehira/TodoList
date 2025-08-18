//idの引用と定義



const input = document.getElementById('todo-write');
const addBtn = document.getElementById('todo-submit');
const clearAllBtn = document.getElementById('clearAllBtn');
const list = document.getElementById('task-list');

let taskOrder = [];
let taskIdCounter = 0;



// 追加ボタン
addBtn.addEventListener('click', addTask);
// Enterキーでも追加
input.addEventListener('keypress', e => {
  if (e.key === 'Enter') addTask();
});

// 全削除ボタン
clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete everything?')){
    list.innerHTML = '';
    taskOrder = [];
  }
    
});



function moveWithAnimation(element, parent, before = null) {
  element.style.transition = 'opacity 0.3s ease';
  element.style.opacity = '0';

  setTimeout(() => {
    if (before) {
      parent.insertBefore(element, before);
    } else {
      parent.appendChild(element);
    }

    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  }, 200);
}

function addTask() {
  const taskText = input.value.trim();
  if (taskText === '') return;

  const li = document.createElement('li');
  li.classList.add('task', 'list');

  // タスク本文
  const span = document.createElement('span');
  span.textContent = taskText;
  span.classList.add('task');

  const taskId = `task-${taskIdCounter++}`;
  li.dataset.id = taskId;


  //  順序記録に追加
  taskOrder.push(taskId);

  // チェックボックス
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';

  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);

    if (checkbox.checked) {
      li.classList.add('checked');
      moveWithAnimation(li, list); // チェック時：末尾へ移動
    } else {
      li.classList.remove('checked');

      // 元の順序に基づき、挿入位置を計算
      const currentUncompleted = [...list.children].filter(el => {
        return !el.classList.contains('completed') && el !== li;
      });

      const targetIndex = taskOrder.indexOf(taskId);
      let insertBeforeEl = null;
      for (let i = 0; i < currentUncompleted.length; i++) {
        const elId = currentUncompleted[i].dataset.id;
        if (taskOrder.indexOf(elId) > targetIndex) {
          insertBeforeEl = currentUncompleted[i];
          break;
        }
      }


      moveWithAnimation(li, list, insertBeforeEl);
    }
  });

  // 削除ボタン
  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  delBtn.classList.add('delete');
  delBtn.addEventListener('click', () => {
    list.removeChild(li);
  });

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
  input.value = '';
}
