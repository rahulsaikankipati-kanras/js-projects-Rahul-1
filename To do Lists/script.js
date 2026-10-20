const taskInput = document.getElementById('taskInput');
const dateInput = document.getElementById('dateInput');
const timeInput = document.getElementById('timeInput');
const searchInput = document.getElementById('search');
const taskList = document.getElementById('taskList');
const message = document.getElementById('message');
const messageText = document.getElementById('messageText');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

const saveTasks = () => {
  localStorage.setItem('tasks', JSON.stringify(tasks));
  showTasks();
};


const getToday = () => {
  const now = new Date();
  let month = now.getMonth() + 1;
  let day = now.getDate();
  if (month < 10) month = '0' + month;
  if (day < 10) day = '0' + day;
 return `${now.getFullYear()}-${month}-${day}`;
};

const formatTime = (time) => {
  const parts = time.split(':');
  let hour = Number(parts[0]);
  const minutes = parts[1];
  let ampm = 'AM';
  if (hour >= 12) ampm = 'PM';
  if (hour > 12) hour = hour - 12;
  if (hour === 0) hour = 12;
  if (hour < 10) hour = '0' + hour;
  return `${hour}:${minutes} ${ampm}`;
};

const createTask = (task) => {
  const item = document.createElement('div');
  item.className = 'task';

  const text = document.createElement('span');
  text.className = 'task-text';
  text.textContent = task.text;

  const time = document.createElement('span');
  time.className = 'task-time';
  time.textContent = formatTime(task.time);

  const editBtn = document.createElement('button');
  editBtn.className = 'edit';
  editBtn.textContent = 'Edit';
  editBtn.addEventListener("click",() => {
    const newText = prompt('Edit task', task.text);
    if (newText && newText.trim() !== '') {
      task.text = newText.trim();
      saveTasks();
    }})  
  

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete';
  deleteBtn.textContent = 'Delete';
  deleteBtn.addEventListener("click",() => {
    tasks = tasks.filter((t) => t.id !== task.id);
    saveTasks();
  }) 

  item.appendChild(text);
  item.appendChild(time);
  item.appendChild(editBtn);
  item.appendChild(deleteBtn);
  return item;
};

const showSection = (title, list, today) => {
  if (list.length === 0) return;

  const heading = document.createElement('h2');
  heading.className = 'section-title';
  heading.textContent = title;
  taskList.appendChild(heading);

  const dates = [];
  list.forEach((task) => {
    if (!dates.includes(task.date)) dates.push(task.date);
  });

  dates.forEach((date) => {
    const day = document.createElement('div');
    day.className = 'day';

    const dayHeading = document.createElement('h3');
    dayHeading.textContent = date === today ? 'Today' : date;
    day.appendChild(dayHeading);

    const dayTasks = list.filter((task) => task.date === date);
    dayTasks.forEach((task) => day.appendChild(createTask(task)));

    taskList.appendChild(day);
  });
};

const showTasks = () => {
  const today = getToday();
  const search = searchInput.value.toLowerCase();

  const matching = tasks.filter((task) => task.text.toLowerCase().includes(search));
  matching.sort((a, b) => (a.date + a.time > b.date + b.time ? 1 : -1));

  taskList.textContent = '';

  if (matching.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty';
    empty.textContent = 'No tasks found';
    taskList.appendChild(empty);
    return;
  }

  const dueTasks = matching.filter((task) => task.date < today);
  const upcomingTasks = matching.filter((task) => task.date >= today);
  showSection('Due Tasks', dueTasks, today);
  showSection('Upcoming Tasks', upcomingTasks, today);
};

const addTask = () => {
  if (taskInput.value.trim() === '' || dateInput.value === '' || timeInput.value === '') {
    messageText.textContent = 'Please fill in all fields';
    message.classList.remove('hidden');
    return;
  }
  message.classList.add('hidden');
  tasks.push({
    id: Date.now(),
    text: taskInput.value.trim(),
    date: dateInput.value,
    time: timeInput.value
  });

  taskInput.value = '';
  dateInput.value = '';
  timeInput.value = '';
  saveTasks();
};

document.getElementById('addBtn').addEventListener('click', addTask);

document.getElementById('closeMsg').addEventListener('click', () => {
    message.classList.add('hidden');
});

searchInput.addEventListener('input', showTasks);


showTasks();