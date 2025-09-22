type Task = {
  text: string;
  completed: boolean;
};

const taskInput = document.getElementById('taskInput') as HTMLInputElement;
const addTaskBtn = document.getElementById('addTaskBtn') as HTMLButtonElement;
const taskList = document.getElementById('taskList') as HTMLUListElement;

document.addEventListener('DOMContentLoaded', loadTasks);
addTaskBtn.addEventListener('click', addTask);

function addTask(): void {
  const taskText: string = taskInput.value.trim();
  if (taskText === '') return;

  const task: Task = { text: taskText, completed: false };
  saveTask(task);
  renderTask(task);

  taskInput.value = '';
}

function renderTask(task: Task): void {
  const li: HTMLLIElement = document.createElement('li');
  li.textContent = task.text;

  if (task.completed) {
    li.classList.add('completed');
  }

  li.addEventListener('click', () => {
    task.completed = !task.completed;
    updateStorage();
    li.classList.toggle('completed');
  });

  const deleteBtn: HTMLButtonElement = document.createElement('button');
  deleteBtn.textContent = 'X';
  deleteBtn.className = 'delete';
  deleteBtn.addEventListener('click', (e: MouseEvent) => {
    e.stopPropagation();
    li.remove();
    removeTask(task.text);
  });

  li.appendChild(deleteBtn);
  taskList.appendChild(li);
}

function saveTask(task: Task): void {
  const tasks: Task[] = getTasks();
  tasks.push(task);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasks(): Task[] {
  const storedTasks: string | null = localStorage.getItem('tasks');
  return storedTasks ? JSON.parse(storedTasks) as Task[] : [];
}

function loadTasks(): void {
  const tasks: Task[] = getTasks();
  tasks.forEach(renderTask);
}

function updateStorage(): void {
  const tasks: Task[] = [];
  document.querySelectorAll<HTMLLIElement>('#taskList li').forEach(li => {
    tasks.push({
      text: li.childNodes[0].textContent || '',
      completed: li.classList.contains('completed')
    });
  });
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTask(taskText: string): void {
  let tasks: Task[] = getTasks();
  tasks = tasks.filter(task => task.text !== taskText);
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
