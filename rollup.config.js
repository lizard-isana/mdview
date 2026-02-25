import {babel} from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import resolve from '@rollup/plugin-node-resolve';


export default {
  input: 'src/assets/js/mdview.js',
  plugins: [
    resolve({
      browser: true
    }),
    babel({
      exclude: "node_modules/**",
      babelHelpers: "bundled",
    }),
    terser()
  ],
  output: {
    file: 'src/assets/js/mdview.min.js',
    format: 'iife',
  },
  onwarn: (warning, defaultHandler) => {
    if (warning.code === 'THIS_IS_UNDEFINED') return;
    defaultHandler(warning);
  }
};
