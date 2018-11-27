function Requester() {
}

Requester.prototype.GET = async url => {
  return await request('GET', url)
}

Requester.prototype.POST = async (url, data) => {
  return await request('POST', url, data)
}

Requester.prototype.PUT = async url => {
  return await request('PUT', url)
}

Requester.prototype.DELETE = async url => {
  return await request('DELETE', url)
}

async function request(method, url, data) {
  console.log(method)

  if(!url) throw new Error('Parameter `url` is required')

  // data = data || {}

  let obj = { method: method }

  if (method === 'POST') {
    obj.headers = { "Content-Type": "application/json; charset=utf-8"}
    obj.body = JSON.stringify(data)
  }
  console.log(obj)
  let response = await fetch(url, obj)

  return response
}

let r = new Requester()
