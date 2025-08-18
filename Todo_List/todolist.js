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

  const taskMemory = `task-${taskIdCounter++}`;
  taskOrder.push(taskMemory);
  createTaskElement(taskMemory, taskText, false);
  saveTasksToStorage();
  input.value = '';
}

function addTaskFromStorage(taskMemory, text, completed) {
  createTaskElement(taskMemory, text, completed);
}


function saveTasksToStorage() {
  const tasks = [...list.children].map(li => ({
    id: li.dataset.id,
    text: li.querySelector('span').textContent,
    completed: li.classList.contains('completed')
  }));
  localStorage.setItem('tasks', JSON.stringify(tasks));
  localStorage.setItem('taskOrder', JSON.stringify(taskOrder));
}

function loadTasksFromStorage() {
  const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
  const order = JSON.parse(localStorage.getItem('taskOrder') || '[]');
  taskOrder = order;
  taskIdCounter = 0;

  tasks.forEach(task => {
    addTaskFromStorage(task.id, task.text, task.completed);
    const numericId = parseInt(task.id.replace('task-', ''));
    if (!isNaN(numericId) && numericId >= taskIdCounter) {
      taskIdCounter = numericId + 1;
    }
  });
}

function createTaskElement(taskMemory, text, completed) {
  const li = document.createElement('li');
  li.classList.add('task', 'list');
  li.dataset.id = taskMemory;

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = completed;

  const span = document.createElement('span');
  span.textContent = text;
  span.classList.add('task');

  const delBtn = document.createElement('button');
  delBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
  delBtn.classList.add('delete');
  delBtn.addEventListener('click', () => {
    list.removeChild(li);
    taskOrder = taskOrder.filter(id => id !== taskMemory);
    saveTasksToStorage();
  });

  checkbox.addEventListener('change', () => {
    li.classList.toggle('completed', checkbox.checked);

    if (checkbox.checked) {
      li.classList.add('checked');
      moveWithAnimation(li, list);
    } else {
      li.classList.remove('checked');

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

    saveTasksToStorage(); //  状態保存
  });

  li.classList.toggle('completed', completed);
  if (completed) li.classList.add('checked');

  li.appendChild(checkbox);
  li.appendChild(span);
  li.appendChild(delBtn);
  list.appendChild(li);
}
window.addEventListener('DOMContentLoaded', loadTasksFromStorage);

clearAllBtn.addEventListener('click', () => {
  if (confirm('Are you sure you want to delete everything?')) {
    list.innerHTML = '';
    taskOrder = [];
    localStorage.removeItem('tasks');
    localStorage.removeItem('taskOrder');
  }
});

// 並び替えを可能にするSortableJSの初期化
new Sortable(list, {
  animation: 150,
  ghostClass: 'sortable-ghost',
  onEnd: function (evt) {
    const newOrder = [...list.children].map(li => li.dataset.id);
    taskOrder = newOrder;
    saveTasksToStorage();
  }
});

