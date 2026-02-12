const input = document.querySelector('#taskInput');
const button = document.querySelector('#addBtn');
const list = document.querySelector('#taskList');

button.addEventListener('click', () => {
  const li = document.createElement('li');
  li.textContent = input.value;
  list.appendChild(li);
  input.value = '';
});

//some texts