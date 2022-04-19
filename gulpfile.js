const gulp = require('gulp');
const ts = require('gulp-typescript');
const JSON_FILES = ['src/*.json', 'src/**/*.json'];
const HTML_FILES = ['src/*.html', 'src/**/*.html'];
const YAML_FILES = ['src/*.yml', 'src/**/*.yml'];
const XML_FILES = ['src/*.xml', 'src/**/*.xml'];
const JS_FILES = ['src/*.js', 'src/**/*.js', 'node_modules/*.js'];
// pull in the project TypeScript config
const tsProject = ts.createProject('tsconfig.json');

gulp.task('scripts', function () {
    const tsResult = tsProject.src()
        .pipe(tsProject())
        .on('error', function (err) {
            console.log(err.toString());
            this.emit('end');
        });
    return tsResult.js.pipe(gulp.dest('dist'));
});


gulp.task('assets', function () {
    return gulp.src(JSON_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('js', function () {
    return gulp.src(JS_FILES)
        .pipe(gulp.dest('dist'));
});

// Gulp task to copy HTML files to output directory
gulp.task('html', function () {
    return gulp.src(HTML_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('yaml', function () {
    return gulp.src(YAML_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('xml', function () {
    return gulp.src(XML_FILES)
        .pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
    gulp.watch(HTML_FILES, gulp.series('html'));
    gulp.watch(JSON_FILES, gulp.series('assets'));
    gulp.watch(YAML_FILES, gulp.series('yaml'));
    gulp.watch(XML_FILES, gulp.series('xml'));
    gulp.watch(JS_FILES, gulp.series('js'));
    gulp.watch('src/**/*.ts', gulp.series('scripts'));

});


gulp.task('default', gulp.parallel('scripts', 'assets', 'html', 'yaml', 'xml', 'js'));