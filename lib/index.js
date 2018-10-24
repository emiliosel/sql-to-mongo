'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (config) {
  return {
    config: config
  };
};

function sayHiTo(name) {
  return 'Hi, ' + name;
}

var message = sayHiTo('Bruno');

console.log(message);