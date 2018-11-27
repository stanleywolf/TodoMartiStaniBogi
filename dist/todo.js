"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Todo = function Todo(id, isDone, name, createdAt, updatedAt) {
  _classCallCheck(this, Todo);

  this.id = id;
  this.isDone = isDone;
  this.name = name;
  this.createdAt = createdAt;
  this.updatedAt = updatedAt;
}; //module.exports = Todo


var _default = Todo;
exports.default = _default;