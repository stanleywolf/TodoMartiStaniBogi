import express from 'express';
import path from 'path';
import fs from 'fs';
import FS from './fileSystem.js'
const dbFile = './src/db.json';
const app = express()

const FileSys = new FS(dbFile);

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static('public'))


app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/../index.html')));

app.get('/todo/:id',(req,res) => FileSys.GetAll(req,res));

app.get('/todo/:id',(req,res) => FileSys.GetById(req,res));

app.post('/todo/add', (req,res) => FileSys.PostAdd(req,res));

app.put('/todo/:id/text/:text', (req,res) => {
  let responseJson = {
    result: {},
    errors: []
  }
  if (!req.params.id) {
    responseJson.errors.push({name: 'id is required'})
  }
  if (!req.params.text) {
    responseJson.errors.push({name: 'text is required'})
  }
  if (!!responseJson.errors.length) {
    res.status(404).json(responseJson)
  }

  fs.readFile(dbFile, 'utf8', (err, data) => {
    let db = JSON.parse(data)
    console.log(db)
    db.todos = db.todos.map(el => {
      if(el.id == req.params.id) {
        el.name = req.params.text
        el.updatedAt = new Date().toLocaleString()
      }

      return el
    })

    fs.writeFile(dbFile, JSON.stringify(db), (err) => {
      if (err) throw err;
      console.log('Updated!')
      res.json(responseJson)
    })
  })
})

app.put('/todo/:id/check', (req,res) => {
  let responseJson = {
    result: {},
    errors: []
  }
  if (!req.params.id) {
    responseJson.errors.push({name: 'id is required'})
    res.status(404).json(responseJson)
  }

  fs.readFile(dbFile, 'utf8', (err, data) =>{
    let db = JSON.parse(data)
    db.todos = db.todos.map(el => {
      if(el.id == req.params.id) {
        el.isDone = !el.isDone
      }

      return el
    })

    fs.writeFile(dbFile, JSON.stringify(db),  (err) =>{
      if (err) throw err;
      console.log('Checked!')
      res.json(responseJson)
    })
  })
})

app.delete('/todo/:id', (req,res) => {
  let responseJson = {
    result: {},
    errors: []
  }
  if (!req.params.id) {
    responseJson.errors.push({name: 'id is required'})
    res.status(404).json(responseJson)
  }

  fs.readFile(dbFile, 'utf8',(err, data) =>{
    let db = JSON.parse(data)
    db.todos = db.todos.filter(el => {
      if(el.id != req.params.id) {
        return el
      }
    })

    fs.writeFile(dbFile, JSON.stringify(db),  (err) =>{
      if (err) throw err;
      console.log('Deleted!')
      res.json(responseJson)
    })
  })
})

app.all('*', (req, res) => {
  res.status(404).end()
})


app.listen(5000, (err) => {
  console.log(err)
})
