"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _todo = _interopRequireDefault(require("./todo"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var FS =
/*#__PURE__*/
function () {
  function FS(dbFile) {
    _classCallCheck(this, FS);

    this.dbFile = dbFile;
  }

  _createClass(FS, [{
    key: "GetById",
    value: function GetById(req, res) {
      _fs.default.readFile(this.dbFile, 'utf8', function (err, data) {
        var _ref = [JSON.parse(data)],
            db = _ref[0];
        var todos = db.todos.filter(function (el) {
          return el.id == req.params.id;
        });
        var todo = todos.length ? todos[0] : null;

        if (todo) {
          res.json(todo);
        }

        res.status(404).json({
          error: 'Not Found'
        });
      });
    }
  }, {
    key: "GetAll",
    value: function GetAll(req, res) {
      this._read().then(function (data) {
        return res.json(JSON.parse(data));
      });
    }
  }, {
    key: "PostAdd",
    value: function PostAdd(req, res) {
      var _this = this;

      var responseJson = {
        result: {},
        errors: []
      };

      if (!req.body.text) {
        responseJson.errors.push({
          name: 'text is required'
        });
        res.status(404).json(responseJson);
      }

      this._read().then(function (data) {
        var db = JSON.parse(data);
        var todo = new _todo.default(db.index + 1, false, req.body.text, new Date().toLocaleString(), null);
        db.todos.push(todo);
        db.index++;
        return _this._write(db, todo);
      }).then(function (todo) {
        //if (err) throw err;
        console.log('Saved!');
        responseJson.result.todo = todo;
        res.json(responseJson);
      });
    }
  }, {
    key: "_read",
    value: function _read() {
      var _this2 = this;

      return new Promise(function (resolve, reject) {
        _fs.default.readFile(_this2.dbFile, function (error, data) {
          return resolve(data);
        });
      });
    }
  }, {
    key: "_write",
    value: function _write(db, todo) {
      var _this3 = this;

      return new Promise(function (resolve, reject) {
        _fs.default.writeFile(_this3.dbFile, JSON.stringify(db), function (error) {
          return resolve(todo);
        });
      });
    }
  }]);

  return FS;
}();

var _default = FS;
exports.default = _default;