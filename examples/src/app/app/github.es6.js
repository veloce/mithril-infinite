'use strict';

import m from 'mithril';
import styler from 'app/app/styler';
import style from './github-style';
styler.add('github', style);

let content = (opts = {}) => {
	return m('.github', [
		!opts.home ? m('a', {href: '/', config: m.route}, 'All examples') : null,
		m('hr'),
		m.trust('mithril-infinite, Infinite Scroll for Mithril on mobile and desktop. Project page on <a href="https://github.com/ArthurClemens/mithril-infinite">Github</a>.')
	]);
};

export default content;
