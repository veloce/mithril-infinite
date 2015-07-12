'use strict';

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var _appImagesImages = require('app/images/images');

var _appImagesImages2 = _interopRequireDefault(_appImagesImages);

var _appGridGrid = require('app/grid/grid');

var _appGridGrid2 = _interopRequireDefault(_appGridGrid);

var _appTableTable = require('app/table/table');

var _appTableTable2 = _interopRequireDefault(_appTableTable);

var _appShortShort = require('app/short/short');

var _appShortShort2 = _interopRequireDefault(_appShortShort);

var _appHorizontalHorizontal = require('app/horizontal/horizontal');

var _appHorizontalHorizontal2 = _interopRequireDefault(_appHorizontalHorizontal);

require('./index.css!');

var menuData = [{
    href: '/images',
    title: 'Images',
    subtitle: '200 images of various heights'
}, {
    href: '/grid',
    title: 'Image grid',
    subtitle: 'Responsive grid with 1, 2, 3 and 4 columns'
}, {
    href: '/table',
    title: 'Data table',
    subtitle: 'Table rows of various heights'
}, {
    href: '/short',
    title: 'Short content',
    subtitle: 'Automatically finds loadable space'
}, {
    href: '/horizontal',
    title: 'Horizontal',
    subtitle: 'Horizontal scroller'
}];

var menu = (0, _mithril2['default'])('ul.menu', [(0, _mithril2['default'])('li.header', 'Examples'), menuData.map(function (menuItem) {
    return (0, _mithril2['default'])('li', (0, _mithril2['default'])('a', { href: menuItem.href, config: _mithril2['default'].route }, [(0, _mithril2['default'])('span.title', menuItem.title), (0, _mithril2['default'])('span.subtitle', menuItem.subtitle)]));
})]);

var app = {};
app.view = function () {
    return (0, _mithril2['default'])('div', [(0, _mithril2['default'])('h1', 'Infinite scroll for Mithril'), menu]);
};

_mithril2['default'].route.mode = 'hash';
_mithril2['default'].route(document.body, '/', {
    '/': app,
    '/images': _appImagesImages2['default'],
    '/grid': _appGridGrid2['default'],
    '/table': _appTableTable2['default'],
    '/short': _appShortShort2['default'],
    '/horizontal': _appHorizontalHorizontal2['default']
});
