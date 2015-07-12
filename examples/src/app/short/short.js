'use strict';
Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _infinite = require('infinite');

var _infinite2 = _interopRequireDefault(_infinite);

require('./short.css!');

var short = {};
short.item = function (data) {
    var color = data[1] || 'transparent';
    var title = data[1] ? '' : (0, _mithril2['default'])('.title', data[0]);
    return (0, _mithril2['default'])('.list-item', {
        'class': title ? 'has-title' : '',
        style: {
            'background-color': color
        }
    }, title);
};

function _ref(page) {
    return 'app/short/data/page-' + page + '.json';
}

function _ref2(page) {
    if (console) console.log('page', page);
}

short.view = function () {
    return _mithril2['default'].component(_infinite2['default'], {
        item: short.item,
        maxPages: 21,
        preloadSlots: 1,
        pageUrl: _ref,
        'class': 'short',
        pageChange: _ref2
    });
};

exports['default'] = short;
module.exports = exports['default'];
