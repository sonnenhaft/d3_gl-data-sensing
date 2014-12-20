var gulp = require('gulp');

var usemin = require('gulp-usemin');
var uglify = require('gulp-uglify');
var minifyHtml = require('gulp-minify-html');
var minifyCss = require('gulp-minify-css');
var rev = require('gulp-rev');
var ngAnnotate = require('gulp-ng-annotate');
var inject = require('gulp-inject');
gulp.task('usemin', ['html', 'compile-less'], function () {
    return gulp.src('index.html')
        .pipe(inject(gulp.src('.tmp/templates.js', {read: false}),
            {starttag: '<!-- inject:.tmp/templates:js -->'}
        ))
        .pipe(usemin({
            css: [minifyCss(), 'concat', rev()],
            html: [minifyHtml()],
            js: [sourcemaps.init(), ngAnnotate(), uglify(), rev(), sourcemaps.write('./maps')]
        }))
        .pipe(gulp.dest('build/'));
});

var templateCache = require('gulp-angular-templatecache');
gulp.task('html', ['clean'], function () {
    return gulp.src('sensors-app/**/*.html')
        .pipe(templateCache({
            root: 'sensors-app/',
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
var sourcemaps = require('gulp-sourcemaps');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix = new LessPluginAutoPrefix({browsers: ['last 2 versions']});
gulp.task('less', ['clean-less'], function () {
    return gulp.src('sensors-app/**/*.less')
        .pipe(sourcemaps.init())
        .pipe(less({plugins: [autoprefix]}))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('sensors-app'));
});

gulp.task('clean-less', function () {
    return gulp.src([
        'sensors-app/**/*.css',
        'sensors-app/**/*.map',
        'sensors-app/maps'
    ]).pipe(clean());
});

gulp.task('watch', function () {
    gulp.watch('sensors-app/**/*.less', function (file) {
        var path = file.path;
        if (path.indexOf('less') === -1 || file.type !== 'changed') {
            return;
        }
        console.log('file changed: ' + path);// jshint ignore:line
        var folder = path.slice(0, path.lastIndexOf('\\'));
        gulp.src(path)
            .pipe(sourcemaps.init())
            .pipe(less({plugins: [autoprefix]}))
            .pipe(sourcemaps.write('.'))
            .pipe(gulp.dest(folder));
    });
});

var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
gulp.task('lint', function() {
    return gulp.src(['sensors-app/**/*.js', 'gulpfile.js'])
        .pipe(jshint()).pipe(jshint.reporter(stylish));
});

gulp.task('compile-less', ['clean-less', 'less']);
gulp.task('build', ['clean', 'compile-less', 'html', 'usemin', 'remove .tmp']);

var  connect = require('gulp-connect');
gulp.task('connect', function() {
    return connect.server({
        middleware: function(connect, o) {
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