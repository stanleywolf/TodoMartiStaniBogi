(function() {
  'use strict';
  // TODO optimise task removal by useing object {} for storing the tasks
  // TODO optimise html task removal by passing target and removing it from parent
  // TODO optimise toggling done --||--

  let index;
  let tasks;
  let r = new Requester()
  let inputField = document.querySelector('input[type="text"]');
  let submitButton = document.querySelector('button[type="submit"]');
  let todoList = document.querySelector('ul.tasks');

  init();

  function addTask(name) {
    apiCreateTodo(name)
      .then(response => response.json())
      .then(data => {
        console.log(data)
        renderTask(data.result.todo);
      })
  }

  function removeTask(id) {
    apiDeleteTodo(id)
      .then(data => {
        let element = document.querySelector('.task[data-task-id="' + id + '"]');
        element.parentElement.removeChild(element);
      })
  }

  function renderTask(todo) {
    let html = Handlebars.templates.task(todo);
    todoList.innerHTML = html + todoList.innerHTML;
  }

  function toggleTaskDone(id) {
    apiCheckTodo(id)
      .then(() => {
        let element = document.querySelector('.task[data-task-id="' + id + '"]');
        element.classList.toggle('done');
      })
  }

  window.init = init

  function init() {
    apiFetchTodos()
      .then(response => response.json())
      .then(data => {
        console.log(data)
        data = data || {};
        let todos = data.todos || [];
        todos.forEach(function(todo) {
          renderTask(todo);
        })
      })
  }

  function showError() {
    // TODO: Implemenet show error
  }

  submitButton.addEventListener('click', function() {
    let val = inputField.value;
    if (!val) {
      showError()
      return;
    }
    addTask(val);
    inputField.value = '';
  })

  document.addEventListener('click', function(e) {
    let taskId = e.target.getAttribute('data-task-id');
    if (e.target.className === 'btn btn-done') {
      toggleTaskDone(taskId);
      return;
    }
    if (e.target.className === 'btn btn-remove') {
      removeTask(taskId);
      return;
    }
  })

  async function apiFetchTodos() {
    return await r.GET('/todo/all')
  }

  async function apiFetchTodo(id) {
    return await r.GET('/todo/' + id)
  }

  async function apiCreateTodo(name) {
    return await r.POST('/todo/add', {text: name})
  }

  async function apiDeleteTodo(id) {
    return await r.DELETE('/todo/' + id)
  }

  async function apiUpdateTodo(id, text) {
    return await r.PUT('/todo/' + id + '/text/' + text )
  }

  async function apiCheckTodo(id) {
    return await r.PUT('/todo/' + id + '/check')
  }

}());
