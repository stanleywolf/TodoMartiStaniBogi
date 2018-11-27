let todosList = [];

class Todo {
  constructor({id, name, isDone, createdAt, updatedAt} = {}) {
    if (id) {
      this.id = id
      this.name = name
      this.isDone = isDone
      this.createdAt = createdAt
      this.updatedAt = updatedAt
      todosList.push(this)
    }
  }

  add(name) {
    apiCreateTodo(name)
      .then(response => response.json())
      .then(data => {
        if (data.errors.length > 0) {
          return
        }
        data = data.result.todo
        this.id = data.id
        this.name = data.name
        this.isDone = data.isDone
        this.createdAt = data.createdAt
        this.updatedAt = data.updatedAt
        todosList.push(this)
        this.render();
      })
  }

  remove() {
    apiDeleteTodo(this.id)
      .then(data => {
        todosList = todosList.filter( todo => todo.id !== this.id )
        let element = document.querySelector('.task[data-task-id="' + this.id + '"]');
        element.parentElement.removeChild(element);
      })
  }

  complete() {
    apiCheckTodo(this.id)
      .then(() => {
        let element = document.querySelector('.task[data-task-id="' + this.id + '"]');
        element.classList.toggle('done');

        console.log("TOGGLE")
      })
  }

  render() {
    let html = Handlebars.templates.task(this);
    let todoList = document.querySelector('ul.tasks');
    todoList.innerHTML = html + todoList.innerHTML;
  }




}
