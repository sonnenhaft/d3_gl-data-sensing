var gulp = require('gulp');

var sourcemaps = require('gulp-sourcemaps');
gulp.task('usemin', ['html', 'compile-less'], function () {
    var usemin = require('gulp-usemin');
    var uglify = require('gulp-uglify');
    var minifyHtml = require('gulp-minify-html');
    var minifyCss = require('gulp-minify-css');
    var rev = require('gulp-rev');
    var ngAnnotate = require('gulp-ng-annotate');
    var inject = require('gulp-inject');
    var processhtml = require('gulp-processhtml');

    var pkg = require('./package.json');
    return gulp.src('index.html')
        .pipe(inject(gulp.src('.tmp/templates.js', {read: false}),
            {starttag: '<!-- inject:.tmp/templates:js -->'}
        ))
        .pipe(usemin({
            html: [processhtml({
                commentMarker: 'process',
                process: true,
                data: { version: pkg.version}
            }), minifyHtml()],
            css: [minifyCss(), 'concat', rev()],
            js: [ngAnnotate(), uglify(), rev()]
            //js: [sourcemaps.init(), ngAnnotate(), uglify(), rev(), sourcemaps.write('./maps')]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('html', ['clean'], function () {
    var templateCache = require('gulp-angular-templatecache');
    return gulp.src('src/**/*.html')
        .pipe(templateCache({
            root: 'src/',
            module: 'sensors-app'
        }))
        .pipe(gulp.dest('.tmp'));
});

var clean = require('gulp-clean');
gulp.task('clean', function () {
    return gulp.src(['.tmp/*', 'build/*']).pipe(clean());
});

gulp.task('remove .tmp', ['usemin'], function () {
    return gulp.src('.tmp').pipe(clean());
});

var less = require('gulp-less');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix = new LessPluginAutoPrefix({browsers: ['last 2 versions']});
gulp.task('less', ['clean-less'], function () {
    return gulp.src('src/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({plugins: [autoprefix]}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('src'));
});

gulp.task('clean-less', function () {
    return gulp.src([
        'src/**/*.css',
        'src/**/*.map',
        'src/maps'
    ]).pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('src/**/*.less', function (file) {
        var path = file.path;
        if (path.indexOf('less') === -1 || file.type !== 'changed') {
            return;
        }
        var folder = path.slice(0, path.lastIndexOf('\\'));
        gulp.src(path)
            .pipe(sourcemaps.init())
            .pipe(less({plugins: [autoprefix]}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(folder));
    });
});


gulp.task('jshint', function() {
    var jshint = require('gulp-jshint');
    return gulp.src(['src/**/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('compile-less', ['clean-less', 'less']);
gulp.task('build', ['clean', 'compile-less', 'html', 'usemin', 'remove .tmp']);

gulp.task('connect', function() {
    return require('gulp-connect').server({
        middleware: function() {
            return [ (function() {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse('http://localhost:8088/api');
                options.route = '/api';
                return proxy(options);
            })() ];
        }
    });
});

gulp.task('dev-server', ['connect', 'watch']);