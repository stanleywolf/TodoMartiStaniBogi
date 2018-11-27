(function() {
  'use strict';

  let inputField = document.querySelector('input[type="text"]');
  let submitButton = document.querySelector('button[type="submit"]');

  init();

  function addTask(name) {
    let todo = new Todo()
    todo.add(name)
  }

  function removeTask(id) {
    let todo = todosList.filter(todo => todo.id == id)[0]
    todo.remove()
  }

  function toggleTaskDone(id) {
    let todo = todosList.filter(todo => todo.id == id)[0]
    todo.complete()

  }

  function init() {
    apiFetchTodos()
      .then(response => response.json())
      .then(data => {
        data = data || {};
        let todos = data.todos || [];
        todos.forEach(function(todo) {
          let todoObj = new Todo(todo)
          todoObj.render()
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
}());
