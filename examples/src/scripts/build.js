var fs = require('fs');
var browserify = require('browserify');
var babelify = require('babelify');

function bundle(entries, outfile) {
    browserify({
        entries: entries,
        extensions: ['.es6.js'],
        paths: [
            '.',
            './node_modules',
            './node_modules/mithril-infinite/lib/' // include mithril-infinite-style.js
        ]
    })
    .transform(babelify)
    .transform({
        global: true
    }, 'uglifyify')
    .bundle()
    .on('error', function(err) {
        console.log('Error : ' + err.message);
    })
    .pipe(fs.createWriteStream(outfile));
}

bundle([
    'app/index/index.es6.js'
], '../build/app/index/index-bundle.js');
