var fs = require('fs');
var rollup = require('rollup');
var uglify = require('uglify-js');
var cjs = require('rollup-plugin-commonjs')
var node = require('rollup-plugin-node-resolve')
var babel = require('rollup-plugin-babel');
var package = require('../package.json');

const banner =
  `/**
  * ${package.name} v${package.version}
  * ${package.description}
  * (c) ${new Date().getFullYear()} ${package.author}
  * repository: ${package.repository.url}
  * @license MIT
  */
  `
rollup.rollup({
  entry: 'src/lib/index.js',
  plugins: [
    node(),
    cjs(),
    babel()
  ]
})
  .then(function (bundle) {
    return write('vue-h5plus.common.js', bundle.generate({
      format: 'cjs'
    }).code, bundle);
  })
  .catch(logError);

function write(dest, code, bundle) {
  code = banner + uglify.minify(code, {
    output: {
      ascii_only: true
    }
  }).code
  return new Promise(function (resolve, reject) {
    fs.writeFile(dest, code, function (err) {
      if (err) return reject(err);
      console.log(blue(dest) + ' ' + getSize(code));
      resolve(bundle);
    });
  });
}

function getSize(code) {
  return (code.length / 1024).toFixed(2) + 'kb';
}

function logError(e) {
  console.log(e);
}

function blue(str) {
  return '\x1b[1m\x1b[34m' + str + '\x1b[39m\x1b[22m';
}
