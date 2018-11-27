"use strict";

var _express = _interopRequireDefault(require("express"));

var _path = _interopRequireDefault(require("path"));

var _fs = _interopRequireDefault(require("fs"));

var _fileSystem = _interopRequireDefault(require("./fileSystem.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dbFile = './src/db.json';
var app = (0, _express.default)();
var FileSys = new _fileSystem.default(dbFile);
app.use(_express.default.json());
app.use(_express.default.urlencoded({
  extended: true
}));
app.use(_express.default.static('public'));
app.get('/', function (req, res) {
  return res.sendFile(_path.default.join(__dirname + '/../index.html'));
});
app.get('/todo/:id', function (req, res) {
  return FileSys.GetAll(req, res);
});
app.get('/todo/:id', function (req, res) {
  return FileSys.GetById(req, res);
});
app.post('/todo/add', function (req, res) {
  return FileSys.PostAdd(req, res);
});
app.put('/todo/:id/text/:text', function (req, res) {
  var responseJson = {
    result: {},
    errors: []
  };

  if (!req.params.id) {
    responseJson.errors.push({
      name: 'id is required'
    });
  }

  if (!req.params.text) {
    responseJson.errors.push({
      name: 'text is required'
    });
  }

  if (!!responseJson.errors.length) {
    res.status(404).json(responseJson);
  }

  _fs.default.readFile(dbFile, 'utf8', function (err, data) {
    var db = JSON.parse(data);
    console.log(db);
    db.todos = db.todos.map(function (el) {
      if (el.id == req.params.id) {
        el.name = req.params.text;
        el.updatedAt = new Date().toLocaleString();
      }

      return el;
    });

    _fs.default.writeFile(dbFile, JSON.stringify(db), function (err) {
      if (err) throw err;
      console.log('Updated!');
      res.json(responseJson);
    });
  });
});
app.put('/todo/:id/check', function (req, res) {
  var responseJson = {
    result: {},
    errors: []
  };

  if (!req.params.id) {
    responseJson.errors.push({
      name: 'id is required'
    });
    res.status(404).json(responseJson);
  }

  _fs.default.readFile(dbFile, 'utf8', function (err, data) {
    var db = JSON.parse(data);
    db.todos = db.todos.map(function (el) {
      if (el.id == req.params.id) {
        el.isDone = !el.isDone;
      }

      return el;
    });

    _fs.default.writeFile(dbFile, JSON.stringify(db), function (err) {
      if (err) throw err;
      console.log('Checked!');
      res.json(responseJson);
    });
  });
});
app.delete('/todo/:id', function (req, res) {
  var responseJson = {
    result: {},
    errors: []
  };

  if (!req.params.id) {
    responseJson.errors.push({
      name: 'id is required'
    });
    res.status(404).json(responseJson);
  }

  _fs.default.readFile(dbFile, 'utf8', function (err, data) {
    var db = JSON.parse(data);
    db.todos = db.todos.filter(function (el) {
      if (el.id != req.params.id) {
        return el;
      }
    });

    _fs.default.writeFile(dbFile, JSON.stringify(db), function (err) {
      if (err) throw err;
      console.log('Deleted!');
      res.json(responseJson);
    });
  });
});
app.all('*', function (req, res) {
  res.status(404).end();
});
app.listen(5000, function (err) {
  console.log(err);
});