import shell from 'shelljs';
import fs from 'fs-extra';
import * as sass from 'sass';
import autoprefixer from 'autoprefixer';
import postcss from 'postcss';
import cssnano from 'cssnano';

const paths = {
  srcRoot: './src',
  distRoot: './dist',
  docsAssets: './docs/assets',
  distAssets: './dist/assets',
  scssEntry: './src/assets/scss/default.scss',
  compiledCss: './src/assets/css/default.rc.css',
  compiledCssMap: './src/assets/css/default.rc.css.map',
  minifiedCss: './src/assets/css/default.min.rc.css',
  minifiedCssMap: './src/assets/css/default.min.rc.css.map',
};

const processJs = async () => {
  console.log('js processing start.');
  const result = shell.exec('rollup -c rollup.config.js');
  if (result.code !== 0) {
    throw new Error('rollup build failed.');
  }
  console.log('js processing finished.');
};

const processCss = async () => {
  console.log('sass processing start.');
  const sassResult = sass.compile(paths.scssEntry);

  console.log('autoprefixing start.');
  const prefixed = await postcss([autoprefixer()]).process(sassResult.css, {
    from: paths.scssEntry,
    to: paths.compiledCss,
    map: { inline: false },
  });
  await fs.outputFile(paths.compiledCss, prefixed.css);
  if (prefixed.map) {
    await fs.outputFile(paths.compiledCssMap, prefixed.map.toString());
  }
  console.log('autoprefixing finished.');

  console.log('minify start.');
  const minified = await postcss([cssnano()]).process(prefixed.css, {
    from: paths.compiledCss,
    to: paths.minifiedCss,
    map: { inline: false },
  });
  await fs.outputFile(paths.minifiedCss, minified.css);
  if (minified.map) {
    await fs.outputFile(paths.minifiedCssMap, minified.map.toString());
  }
  console.log('minify finished.');
};

const copyBuildOutputs = async () => {
  console.log('copy src to dist.');
  await fs.remove(paths.distRoot);
  await fs.copy(paths.srcRoot, paths.distRoot);

  console.log('copy dist/assets to docs/assets.');
  await fs.remove(paths.docsAssets);
  await fs.copy(paths.distAssets, paths.docsAssets);
};

const cleanupIntermediateFiles = async () => {
  console.log('cleanup intermediate .rc files.');
  const patterns = [
    './src/assets/css/*.rc.css',
    './src/assets/css/*.rc.css.map',
    './src/assets/js/*.rc.js',
    './dist/assets/css/*.rc.css',
    './dist/assets/css/*.rc.css.map',
    './dist/assets/js/*.rc.js',
    './docs/assets/css/*.rc.css',
    './docs/assets/css/*.rc.css.map',
    './docs/assets/js/*.rc.js',
  ];

  for (const pattern of patterns) {
    shell.rm('-f', pattern);
  }
};

const build = async () => {
  await processJs();
  await processCss();
  await copyBuildOutputs();
  await cleanupIntermediateFiles();
};

build().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
