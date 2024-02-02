const shell = require('shelljs');
const fs = require('fs-extra');
const sass = require('sass');
const autoprefixer = require('autoprefixer');
const postcss = require('postcss');
const cssnano = require('cssnano');

const path = {
  "sass":{
    "src":"./dev/scss/",
    "dist":"./dev/css/",
    "name":"default"
  },
  "css":{
    "src":"./dev/css/",
    "dist":"./dist/css/",
    "name":"default"
  },
  "js":{
    "src":"./dev/js/",
    "dist":"./dist/js/",
    "name":"mdview"
  },
}

const src_scss = `${path.sass.src}${path.sass.name}.scss`;
const compiled_css = `${path.css.src}${path.css.name}.rc.css`;
const compiled_css_map = `${path.css.src}${path.css.name}.rc.map.css`;
const minified_css = `${path.css.src}${path.css.name}.min.rc.css`;
const minified_css_map = `${path.css.src}${path.css.name}.min.rc.map.css`;
const dist_compiled_css = `${path.css.dist}${path.css.name}.css`;
const dist_minified_css = `${path.css.dist}${path.css.name}.min.css`;
const compiled_js = `${path.js.src}${path.js.name}.rc.js`;
const dist_compiled_js = `${path.js.dist}${path.js.name}.js`;
const minified_js = `${path.js.src}${path.js.name}.min.rc.js`;
const dist_minified_js = `${path.js.dist}${path.js.name}.min.js`;

const process_js = async () =>{
  console.log("js processing start.")
  shell.exec('rollup -c rollup.config.js')
  console.log("js processing finished.")
}

// Compile SASS 

const process_css = async  () =>{
  console.log("sass processing start.")

  const scss_source = sass.compile(src_scss);
  await fs.outputFile(compiled_css, scss_source.css);
  
  console.log("sass processing finished.")
  
  // Autoprefixing and minify
  fs.readFile(compiled_css, 'utf-8', (err, file) => {
    try{
    if (err) {throw err}
    console.log("autoprefixing start.")
    postcss([autoprefixer()])
    .process(file, { from: compiled_css, to: compiled_css })
    .then(result => {
      fs.writeFile( compiled_css, result.css, () => true)
      if ( result.map ) {
        fs.writeFile(compiled_css_map, result.map.toString(), () => true)
      }
      console.log("autoprefixing finished.")
      return result;
    }).then(data =>{
      console.log("minify start.")
      postcss([cssnano()])
      .process(data.css, { from: compiled_css, to: minified_css })
      .then(result => {
        fs.writeFile(minified_css, result.css, () => true)
        if ( result.map ) {
          fs.writeFile(minified_css_map, result.map.toString(), () => true)
        }
        console.log("minify finished.")
  
      })
    })
  } catch(e) {
    console.error(e);
  }
  })
}

// Copy files
const copy_files = async  () =>{
  console.log("copy css files from dev to dist")
  await fs.copyFileSync(compiled_css, dist_compiled_css)
  await fs.copyFileSync(minified_css, dist_minified_css)
  console.log("copy js files from dev to dist")
  await fs.copyFileSync(compiled_js, dist_compiled_js)
  await fs.copyFileSync(minified_js, dist_minified_js)
  console.log("copy img files from dev to dist")
  await fs.copySync('./dev/img/', './dist/img/')
  console.log("copy files from dist to docs")
  fs.copySync('./dist/', './docs/')
}

const build = async () => {
  await process_js()
  await process_css();
  copy_files();
}

build();