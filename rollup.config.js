import {babel} from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

module.exports = [
  {
    input: 'dev/js/mdview.js',
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      }),
      terser()
    ],
    output: {
      file: 'dev/js/mdview.rc.js',
      name: 'mdview',
      format: 'umd',
    },
  }
];