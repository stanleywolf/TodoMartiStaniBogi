import fs from 'fs';
import Todo from './todo';

class FS{
    constructor(dbFile){
        this.dbFile = dbFile;
    }
    GetById(req,res){
        fs.readFile(this.dbFile, 'utf8', (err, data)=> {
            
            let [db] = [JSON.parse(data)]
            let todos = db.todos.filter(el => el.id == req.params.id)
            let todo = todos.length ? todos[0] : null
            if (todo) {
              res.json(todo)
            }
        
            res.status(404).json({error: 'Not Found'})
          });
    }
    GetAll(req,res){

        this._read().then((data) => res.json(JSON.parse(data)))      
    }
    PostAdd(req,res){
        let responseJson = {
            result: {},
            errors: []
          }
          if (!req.body.text) {
            responseJson.errors.push({name: 'text is required'})
            res.status(404).json(responseJson)
          }
        
          this._read()
            .then((data)=> {
                let db = JSON.parse(data)
                let todo = new Todo(
                db.index + 1,
                false,
                req.body.text,
                new Date().toLocaleString(),
                null);
                db.todos.push(todo)
                db.index++
                return this._write(db,todo)
            })
            .then((todo) => {
                 //if (err) throw err;
                 console.log('Saved!')
                 responseJson.result.todo = todo
                res.json(responseJson)
                });          
    } 
     _read() {
        return new Promise((resolve,reject) =>{
            fs.readFile(this.dbFile,(error,data) => resolve(data))
        })
    }  
    _write(db,todo){
        return new Promise((resolve,reject) =>{
            fs.writeFile(this.dbFile,JSON.stringify(db),(error) => resolve(todo))
        })
    }
}



export default FS