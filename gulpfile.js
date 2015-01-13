var gulp = require('gulp');

var less = require('gulp-less');
var sourcemaps = require('gulp-sourcemaps');
var LessPluginAutoPrefix = require('less-plugin-autoprefix');
var autoprefix = new LessPluginAutoPrefix({browsers: ['last 2 versions']});
gulp.task('usemin', ['ng-templates&app-version', 'compile-less'], function () {
    var usemin = require('gulp-usemin');
    var uglify = require('gulp-uglify');
    var minifyHtml = require('gulp-minify-html');
    var minifyCss = require('gulp-minify-css');
    var rev = require('gulp-rev');
    var ngAnnotate = require('gulp-ng-annotate');
    var inject = require('gulp-inject');
    var processhtml = require('gulp-processhtml');
    var cssBase64 = require('gulp-css-base64');
    return gulp.src('index.html')
        .pipe(inject(gulp.src(['.tmp/templates.js', '.tmp/package.js'], {read: false}),
            {starttag: '<!-- inject:.tmp/templates-and-app-version:js -->'}
        ))
        .pipe(usemin({
            html: [processhtml({
                commentMarker: 'process',
                process: true
            }), minifyHtml()],
            css: [cssBase64({maxWeightResource: 10000000}), minifyCss(), 'concat', rev()],
            js: [sourcemaps.init(), ngAnnotate(), uglify(), rev(), sourcemaps.write('.')]
        }))
        .pipe(gulp.dest('build/'));
});

gulp.task('ng-templates&app-version', ['clean'], function () {
    var gulpNgConfig = require('gulp-ng-config');
    gulp.src('package.json')
        .pipe(gulpNgConfig('package-json'))
        .pipe(gulp.dest('.tmp/'));

    var templateCache = require('gulp-angular-templatecache');
    var pkg = require('./package.json');
    return gulp.src('src/**/*.html')
        .pipe(templateCache({
            root: 'src/',
            module: pkg.ngAppName
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

gulp.task('less', ['clean-less'], function () {
    return compileLess('src/**/*.less', 'src');
});

gulp.task('clean-less', function () {
    return gulp.src([
        'src/**/*.css',
        'src/**/*.map',
        'src/maps'
    ]).pipe(clean());
});

function compileLess(src, dest) {
    return gulp.src(src)
        //.pipe(sourcemaps.init())
        .pipe(less({plugins: [autoprefix]}))
        //.pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest(dest));
}

gulp.task('jshint', function () {
    var jshint = require('gulp-jshint');
    return gulp.src(['src/**/*.js', 'gulpfile.js'])
        .pipe(jshint())
        .pipe(jshint.reporter(require('jshint-stylish')));
});

gulp.task('compile-less', ['clean-less', 'less']);
gulp.task('build', ['clean', 'compile-less', 'ng-templates&app-version',  'usemin', 'remove .tmp']);

gulp.task('connect', function () {
    return require('gulp-connect').server({
        middleware: function () {
            return [(function () {
                var url = require('url');
                var proxy = require('proxy-middleware');
                var options = url.parse('http://localhost:8088/api');
                options.route = '/api';
                return proxy(options);
            })()];
        }
    });
});

(function(livereload){
    gulp.task('watch', function () {
        livereload.listen();
        gulp.watch(['src/**/*.js', 'src/**/*.html', 'index.html'], function (file) {
            console.log('script changed: ' +  file.path); // jshint ignore:line
            gulp.src(file.path).pipe(livereload());
        });
        gulp.watch('src/**/*.less', function (file) {
            if (file.type === 'changed') {
                var path = file.path;
                console.log('changed: ' + path); // jshint ignore:line
                var folder = path.slice(0, path.lastIndexOf('\\'));
                compileLess(path, folder);
            }
        });
    }).on('change', livereload.changed);
})(require('gulp-livereload'));

gulp.task('server-with-less', ['connect', 'watch', 'less']);
gulp.task('default', ['connect', 'watch']);
