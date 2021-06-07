const gulp = require('gulp');
const concat = require('gulp-concat');
const clean = require('gulp-clean');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const cssMinify = require('gulp-css-minify');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const FOLDER = {
  prod: 'dist/',
  dev: 'src/'
};
const path = {
  src: {
    scss: `${FOLDER.dev}**/*.scss`,
    js: `${FOLDER.dev}**/*.js`,
    img: `${FOLDER.dev}img/**/*`
  },
  build: {
    css: `${FOLDER.prod}css/`,
    js: `${FOLDER.prod}js/`,
    img: `${FOLDER.prod}img/`
  }
};

const buildStyles = () => (
  gulp.src(path.src.scss)
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(cleanCSS())
    .pipe(cssMinify())
    .pipe(cssmin())
    .pipe(rename({suffix: '.min'}))


    .pipe(gulp.dest(path.build.css))
    .pipe(browserSync.stream())
);

const buildJS = () => (
    gulp.src(path.src.js)
      .pipe(concat('script.js'))
      .pipe(uglify())
      .pipe(rename({suffix: '.min'}))

      .pipe(gulp.dest(path.build.js))
      .pipe(browserSync.stream())
  )
;

const buildIMG = () => (
  gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.build.img))
    .pipe(browserSync.stream())
);

const cleanBuild = () => (
  gulp.src('dist/', {allowEmpty: true})
    .pipe(clean())
);

const watcher = () => {
  browserSync.init({
    server: {
      baseDir: "./"
    }
  });

  gulp.watch(path.src.scss, buildStyles).on("change", browserSync.reload);
  gulp.watch(path.src.js, buildJS).on("change", browserSync.reload);
  gulp.watch(path.src.img, buildIMG).on("change", browserSync.reload);
  gulp.watch('./index.html', null).on('change', browserSync.reload);
};


gulp.task('build', gulp.series(
  cleanBuild,
  gulp.parallel(buildIMG, buildJS, buildStyles)
));

gulp.task('dev', gulp.series('build', watcher));
