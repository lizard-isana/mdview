import {babel} from '@rollup/plugin-babel';
import {terser} from 'rollup-plugin-terser';

module.exports = [
  {
    input: 'dev/js/mdview.js',
    plugins: [
      babel({
        exclude: "node_modules/**",
        babelHelpers: "bundled",
      })
    ],
    output: {
      file: 'dev/js/mdview.rc.js',
      format: 'iife',
    },
    onwarn: (warning, defaultHandler) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      defaultHandler(warning)
    }
  },
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
      file: 'dev/js/mdview.min.rc.js',
      format: 'iife',
    },
    onwarn: (warning, defaultHandler) => {
      if (warning.code === 'THIS_IS_UNDEFINED') return;
      defaultHandler(warning)
    }
  }
];