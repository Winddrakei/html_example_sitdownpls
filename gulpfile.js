const { src, dest, series, watch } = require('gulp');
const mode = require('gulp-mode')({
  modes: ["prod", "dev"],
  default: "dev",
  verbose: false
});
const concat = require('gulp-concat');
const htmlMin = require('gulp-htmlmin');
const autoPrefixes = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const svgSprite = require('gulp-svg-sprite');
const image = require('gulp-image');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify-es').default;
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const browserSync = require('browser-sync').create();
const del = require('del');
const rigger = require('gulp-rigger');

const styles = () => {
  return src('src/css/**/*.css')
    .pipe(mode.dev(sourcemaps.init()))
    .pipe(concat('style.css'))
    .pipe(autoPrefixes({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2,
    }))
    .pipe(mode.dev(sourcemaps.write()))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const htmlMinify = () => {
  return src('src/*.html')
    .pipe(rigger())
    .pipe(mode.prod(htmlMin({
      collapseWhitespace: true,
    })))
    .pipe(dest('dist'))
    .pipe(browserSync.stream());
}

const svgSprites = () => {
  return src('src/img/svg/**/*.svg')
    .pipe(svgSprite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/images'));
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  });
}

const images = () => {
  return src([
    'src/img/**/*.jpg',
    'src/img/**/*.png',
    'src/img/**/*.jpeg',
    'src/img/*.svg'
  ])
  .pipe(image())
  .pipe(dest('dist/images'));
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
  .pipe(mode.dev(sourcemaps.init()))
  .pipe(babel({
    presets: ['@babel/env']
  }))
  .pipe(concat('main.js'))
  .pipe(uglify().on('error', notify.onError()))
  .pipe(mode.dev(sourcemaps.write()))
  .pipe(dest('dist'))
  .pipe(browserSync.stream())
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist/res'));
}

const clean = () => {
  return del(['dist']);
}

watch('src/**/*.html', htmlMinify);
watch('src/css/**/*.css', styles);
watch('src/img/svg/**/*.svg', svgSprites);
watch('src/js/**/*.js', scripts);
watch('src/resources/**, resources');

exports.styles = styles;
exports.htmlMinify = htmlMinify;
exports.scripts = scripts;
exports.default = series(clean, resources, htmlMinify, scripts, styles, images, svgSprites, watchFiles);
