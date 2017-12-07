const path = require('path')
const buble = require('rollup-plugin-buble')
const flow = require('rollup-plugin-flow-no-whitespace')
const cjs = require('rollup-plugin-commonjs')
const node = require('rollup-plugin-node-resolve')
const replace = require('rollup-plugin-replace')
const version = process.env.VERSION || require('../package.json').version
const name = require('../package.json').name
const description = require('../package.json').description
const author = require('../package.json').author
const url = require('../package.json').repository.url
const banner =
  `/**
  * ${name} v${version}
  * ${description}
  * (c) ${new Date().getFullYear()} ${author}
  * repository: ${url}
  * @license MIT
  */`

const resolve = _path => path.resolve(__dirname, '../', _path)

module.exports = [
  // browser dev
  // {
  //   file: resolve('vue-h5plus.js'),
  //   format: 'umd',
  //   env: 'development'
  // },
  // {
  //   file: resolve('vue-h5plus.min.js'),
  //   format: 'umd',
  //   env: 'production'
  // },
  {
    file: resolve('vue-h5plus.common.js'),
    format: 'cjs'
  },
  {
    file: resolve('vue-h5plus.esm.js'),
    format: 'es'
  }
].map(genConfig)

function genConfig(opts) {
  const config = {
    input: {
      input: resolve('src/lib/index.js'),
      plugins: [
        flow(),
        node(),
        cjs(),
        replace({
          __VERSION__: version
        }),
        // buble()
      ]
    },
    output: {
      file: opts.file,
      format: opts.format,
      banner,
      name: 'VueRouter'
    }
  }

  if (opts.env) {
    config.input.plugins.unshift(replace({
      'process.env.NODE_ENV': JSON.stringify(opts.env)
    }))
  }

  return config
}