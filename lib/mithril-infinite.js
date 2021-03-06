'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _verge = require('verge');

var _verge2 = _interopRequireDefault(_verge);

var _mithril = require('mithril');

var _mithril2 = _interopRequireDefault(_mithril);

var SEL_PADDING = '000000';
var SCROLL_WATCH_TIMER = 200;
var RESIZE_TIMER = 500;
var LEEWAY = 100;

/*
Polyfill source:
https://github.com/Financial-Times/polyfill-service/blob/master/polyfills/Object.assign/polyfill.js
*/
if (!Object.assign) {
    Object.assign = function assign(target, source) {
        for (var index = 1, key = undefined; (index in arguments); ++index) {
            source = arguments[index];
            for (key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
}

var infinite = {};

infinite.numToId = function (pageNum) {
    return SEL_PADDING.substring(0, SEL_PADDING.length - ('' + pageNum).length) + pageNum;
};

infinite.getElementSize = function (el, axis) {
    var styles = window.getComputedStyle(el);
    if (axis === 'x') {
        var margin = parseFloat(styles.marginLeft) + parseFloat(styles.marginRight);
        return Math.ceil(el.scrollWidth + margin);
    } else {
        var margin = parseFloat(styles.marginTop) + parseFloat(styles.marginBottom);
        return Math.ceil(el.scrollHeight + margin);
    }
};

infinite.getCurrentPage = function (scrollAmount, state) {
    var pageNumKeys = Object.keys(state.dimensions).sort();
    var acc = state.before || 0;
    var currentPage = 1;
    pageNumKeys.forEach(function (pageKey) {
        if (scrollAmount > acc) {
            currentPage = parseInt(pageKey, 10);
        }
        var size = state.dimensions[pageKey];
        acc += size;
    });
    return currentPage;
};

infinite.calculateSize = function (from, to, state) {
    var fromIndex = Math.max(0, from - 1);
    if (to < fromIndex) {
        return 0;
    }
    var toIndex = to;
    var pageNumKeys = Object.keys(state.dimensions).sort().slice(fromIndex, toIndex);
    var size = state.before || 0;
    pageNumKeys.forEach(function (pageKey) {
        size += state.dimensions[pageKey] || 0;
    });
    size += state.after || 0;
    return size;
};

infinite.calculateStartToContent = function (currentPage, preloadSlots, state) {
    var from = 1;
    var to = currentPage + preloadSlots;
    return infinite.calculateSize(from, to, state);
};

infinite.calculateContentSize = function (currentPage, preloadSlots, state) {
    var from = currentPage - preloadSlots;
    var to = currentPage + preloadSlots;
    return infinite.calculateSize(from, to, state);
};

infinite.calculatePaddingAfter = function (currentPage, preloadSlots, state) {
    var from = currentPage + preloadSlots;
    var to = Object.keys(state.dimensions).length;
    return infinite.calculateSize(from, to, state);
};

infinite.isPageInViewport = function (page, axis, state, scrollView) {
    if (!scrollView) {
        return false;
    }
    var id = infinite.numToId(page);
    var el = scrollView.querySelector('[data-page="' + id + '"]');
    return infinite.isElementInViewport({ el: el, axis: axis });
};

// el, axis = 'y', expand = LEEWAY
infinite.isElementInViewport = function (opts) {
    var el = opts.el;
    var leeway = opts.leeway || LEEWAY;
    var axis = opts.axis || 'y';
    return ({
        x: _verge2['default'].inX(el, leeway),
        y: _verge2['default'].inY(el, leeway),
        both: _verge2['default'].inViewport(el, leeway)
    })[axis];
};

var getPageData = function getPageData(url) {
    return _mithril2['default'].request({
        method: 'GET',
        url: url,
        initialValue: [],
        background: true
    });
};

var page = {};

page.controller = function () {
    var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

    var content = _mithril2['default'].prop([]);
    if (opts.pageData) {
        content = opts.pageData(opts.page);
    } else {
        var url = opts.pageUrl(opts.page);
        getPageData(url).then(function (data) {
            content(data);
            _mithril2['default'].redraw();
        });
    }

    return {
        content: content
    };
};

page.view = function (ctrl) {
    var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var id = infinite.numToId(opts.page);
    var pageTag = opts.pageTag || 'div';
    var className = ['page', opts.page % 2 === 0 ? 'even' : 'odd'].join(' ');
    var processPageData = opts.processPageData || function (content, opts1) {
        return content ? content.map(function (data, index) {
            return opts.item(data, opts1, index);
        }) : null;
    };
    var dimension = opts.state.dimensions[id] || 0;

    // pageSize overrides all measurements on elements here
    var pageSize = 0;
    if (opts.pageSize) {
        pageSize = opts.pageSize(ctrl.content());
        opts.state.dimensions[id] = pageSize;
    }
    var cssSize = pageSize ? pageSize + 'px' : opts.isScrolling && dimension ? dimension + 'px' : 'auto';
    return (0, _mithril2['default'])(pageTag, {
        'data-page': id,
        'class': className,
        // during isScrolling a set size is needed to prevent glitches,
        // especially when isScrolling back
        style: dimension ? Object.assign({}, opts.axis === 'x' ? {
            width: cssSize
        } : {
            height: cssSize
        }) : {},
        config: pageSize ? {} : function (el) {
            // always update the natural size
            var size = infinite.getElementSize(el, opts.axis);
            if (size) {
                opts.state.dimensions[id] = size;
            }
        }
    }, processPageData(ctrl.content(), opts));
};

infinite.controller = function (opts) {
    return {
        state: {
            dimensions: {}
        },
        maxPages: opts.maxPages || Number.MAX_VALUE,
        scrollView: null,
        isScrolling: false,
        scrollWatchScrollingStateId: null,
        scrollWatchUpdateStateId: null,
        paddingAfter: null,
        preloadSlots: opts.preloadPages || 1,
        boundingClientRect: {},
        currentPage: 0
    };
};

infinite.view = function (ctrl, opts) {
    var state = ctrl.state;
    var scrollAmount = ctrl.scrollView ? opts.axis === 'x' ? ctrl.scrollView.scrollLeft : ctrl.scrollView.scrollTop : 0;
    var currentPage = infinite.getCurrentPage(scrollAmount, state);

    if (currentPage !== ctrl.currentPage) {
        if (opts.pageChange) {
            opts.pageChange(currentPage);
        }
    }
    ctrl.currentPage = currentPage;

    var pages = [];
    for (var i = -ctrl.preloadSlots; i <= ctrl.preloadSlots; i++) {
        var pageNum = currentPage + i;
        if (pageNum > 0 && pageNum <= ctrl.maxPages) {
            pages.push(pageNum);
        }
    }

    var contentTag = opts.contentTag || 'div';
    var classList = ['scroll-view', 'scroll-view-' + (opts.axis || 'y'), opts['class'] || ''];
    var startToContentSize = infinite.calculateStartToContent(currentPage, ctrl.preloadSlots, state);
    var contentSize = infinite.calculateContentSize(currentPage, ctrl.preloadSlots, state);
    var paddingBefore = startToContentSize - contentSize;
    var paddingAfter = opts.contentSize ? 0 : infinite.calculatePaddingAfter(currentPage, ctrl.preloadSlots, state);
    var isFirstPageVisible = infinite.isPageInViewport(1, opts.axis, state, ctrl.scrollView);
    var isLastPageVisible = opts.maxPages ? infinite.isPageInViewport(opts.maxPages, opts.axis, state, ctrl.scrollView) : true;

    if (ctrl.scrollView) {
        // in case the screen size was changed, reset preloadSlots
        var boundingClientRect = ctrl.scrollView.getBoundingClientRect();
        ctrl.boundingClientRect = ctrl.boundingClientRect || boundingClientRect;
        if (boundingClientRect.width !== ctrl.boundingClientRect.width || boundingClientRect.height !== ctrl.boundingClientRect.height) {
            ctrl.preloadSlots = opts.preloadPages || 1;
        }
        ctrl.boundingClientRect = boundingClientRect;

        console.log(contentSize, boundingClientRect);
        // calculate if we have room to load more
        if (contentSize === 0) {
            setTimeout(function () {
                _mithril2['default'].redraw();
            }, 0);
        } else if (contentSize > 0 && contentSize < boundingClientRect.height) {
            ctrl.preloadSlots++;
            setTimeout(function () {
                _mithril2['default'].redraw();
            }, 0);
        }
    }

    var content = (0, _mithril2['default'])('div', {
        config: function config(el, inited, context) {
            if (inited) {
                return;
            }
            if (opts.scrollView) {
                ctrl.scrollView = document.querySelector(opts.scrollView);
            } else {
                ctrl.scrollView = el;
            }
            ctrl.scrollView.className = classList.join(' ');

            var handleScroll = function handleScroll() {
                ctrl.isScrolling = true;

                // reset isScrolling state only when scrolling is done
                clearTimeout(ctrl.scrollWatchScrollingStateId);
                ctrl.scrollWatchScrollingStateId = setTimeout(function () {
                    ctrl.isScrolling = false;
                    // update pages
                    _mithril2['default'].redraw();
                }, SCROLL_WATCH_TIMER);

                // debounce updates while scrolling
                if (!ctrl.scrollWatchUpdateStateId) {
                    ctrl.scrollWatchUpdateStateId = setTimeout(function () {
                        // update pages
                        _mithril2['default'].redraw();
                        ctrl.scrollWatchUpdateStateId = null;
                    }, SCROLL_WATCH_TIMER);
                }
            };
            ctrl.scrollView.addEventListener('scroll', handleScroll);
            context.onunload = function () {
                ctrl.scrollView.removeEventListener('scroll', handleScroll);
            };
        }
    }, (0, _mithril2['default'])('.scroll-content', {
        style: Object.assign({}, opts.axis === 'x' ? {
            width: paddingBefore + contentSize + paddingAfter + 'px'
        } : {
            height: paddingBefore + contentSize + paddingAfter + 'px'
        }, opts.contentSize ? opts.axis === 'x' ? { 'min-width': opts.contentSize + 'px' } : { 'min-height': opts.contentSize + 'px' } : {}) }, [(0, _mithril2['default'])('.padding-before', {
        style: Object.assign({}, opts.axis === 'x' ? {
            width: paddingBefore + 'px'
        } : {
            height: paddingBefore + 'px'
        }) }), (0, _mithril2['default'])(contentTag, {
        'class': 'content'
    }, [opts.before && contentSize ? (0, _mithril2['default'])('.before', {
        style: {
            // visually hide this element until the last page is into view
            // to prevent flashes of after content when scrolling fast
            visibility: isFirstPageVisible ? 'visible' : 'hidden'
        },
        config: function config(el) {
            // always update the natural size
            var size = infinite.getElementSize(el, opts.axis);
            if (size) {
                ctrl.state.before = size;
            }
        }
    }, opts.before) : null, (0, _mithril2['default'])('.pages', pages.map(function (p) {
        return _mithril2['default'].component(page, Object.assign({}, opts, {
            page: p,
            key: p,
            isScrolling: ctrl.isScrolling,
            scrollView: ctrl.scrollView,
            state: state
        }));
    })), opts.after && contentSize ? (0, _mithril2['default'])('.after', {
        style: {
            // visually hide this element until the last page is into view
            // to prevent flashes of after content when scrolling fast
            visibility: isLastPageVisible ? 'visible' : 'hidden'
        },
        config: function config(el) {
            // always update the natural size
            var size = infinite.getElementSize(el, opts.axis);
            if (size) {
                ctrl.state.after = size;
            }
        }
    }, opts.after) : null]), (0, _mithril2['default'])('.padding-after', {
        style: Object.assign({}, opts.axis === 'x' ? {
            width: paddingAfter + 'px'
        } : {
            height: paddingAfter + 'px'
        }) })]));
    return content;
};

// Debounce window resize
var resizeTimer = 0;
window.onresize = function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
        _mithril2['default'].redraw();
    }, RESIZE_TIMER);
};

exports['default'] = infinite;
module.exports = exports['default'];

