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
