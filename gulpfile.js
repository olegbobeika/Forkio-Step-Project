import gulp from 'gulp'
import concat from 'gulp-concat'
import clean from 'gulp-clean'
import imagemin from 'gulp-imagemin'
import borwserObj from 'browser-sync'
import sass from 'gulp-sass'
import uglifyObj from 'gulp-uglify-es'
import autoprefixer from 'gulp-autoprefixer'
import cleanCSS from 'gulp-clean-css'

const browserSync = borwserObj.create()
const uglify = uglifyObj.default

const FOLDER = {
    dev: 'src/',
    prod: 'dist/',
}

const path = {
    src: {
        scss: `${FOLDER.dev}**/*.scss`,
        js: `${FOLDER.dev}**/*.js`,
        img: `${FOLDER.dev}img/**/*`, //пробую брать картинки из папок-модулей
    },
    build: {
        css: `${FOLDER.prod}css/`,
        js: `${FOLDER.prod}js/`,
        img: `${FOLDER.prod}img/`,
    }
}

//стили
const buildStyles = () => (
    gulp.src(path.src.scss)
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({overrideBrowserslist: ['last 10 versions']})) //заменил на overrideBrowserslist, т.к. консоль выдает ошибку
        .pipe(cleanCSS()) //удаляем все лишнее и минимизируем файл
        .pipe(concat("style.min.css")) //собираем все в один файл с таким именем
        .pipe(gulp.dest(path.build.css))
        .pipe(browserSync.stream())
)

//скрипты - минификация
const buildJS = () => (
    gulp.src(path.src.js)   
        .pipe(concat('script.min.js'))   
        .pipe(uglify())
        .pipe(gulp.dest(path.build.js))
        .pipe(browserSync.stream())
);

//минификация картинок
const buildIMG = () => (
    gulp.src(path.src.img)
        .pipe(imagemin())
        .pipe(gulp.dest(path.build.img))
        .pipe(browserSync.stream())
);

//очистка папки + проверка на ее наличие
const cleanBuild = () => (
    gulp.src(`${FOLDER.prod}/`, {allowEmpty: true})
        .pipe(clean())
);

//отслеживание измений в файлах
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