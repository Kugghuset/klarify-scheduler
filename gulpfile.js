'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var path = require('path');
var runSequence = require('run-sequence');
var webpack = require('webpack');
var argv = require('minimist')(process.argv.slice(2));

var RELEASE = !!argv.release;   // Minimize and optimize during a build?
var AUTOPREFIXER_BROWSERS = [                     // https://github.com/ai/autoprefixer
  'ie >= 10',
  'ie_mob >= 10',
  'ff >= 30',
  'chrome >= 34',
  'safari >= 7',
  'opera >= 23',
  'ios >= 7',
  'android >= 4.4',
  'bb >= 10'
];

var DEST = './build';
var src = {};
var watch = false;
var browserSync;

// The default task
gulp.task('default', ['sync']);

// Clean output directory
gulp.task('clean', del.bind(null, ['.tmp', 'build/*', '!build/.git'], {dot: true}));

// 3rd party libraries
gulp.task('vendor', function () {
    return gulp.src([
            'app/assets/fonts/**',
            'bower_components/bootstrap/dist/fonts/**',
            'bower_components/font-awesome/fonts/**'
        ])
        .pipe(gulp.dest('build/fonts'));
});

// Images
gulp.task('images', function () {
    src.images = 'app/assets/images/**';

    return gulp.src(src.images)
            .pipe($.changed(DEST + '/images'))
            .pipe($.imagemin({
                progressive: true,
                interlaced: true
            }))
            .pipe(gulp.dest(DEST + '/images'))
            .pipe($.size({title: 'images'}))
});

// CSS style sheets
gulp.task('styles', function () {
    src.styles = 'app/assets/styles/*';

    return gulp
        .src(src.styles)
        .pipe($.plumber())
        .pipe($.less())
        .on('error', console.error.bind(console))
        .pipe($.autoprefixer({browsers: AUTOPREFIXER_BROWSERS}))
        .pipe($.csscomb())
        .pipe($.if(RELEASE, $.minifyCss()))
        .pipe(gulp.dest('build/css'))
        .pipe($.size({title: 'styles'}));
});

// compile Index page.
gulp.task('jade', function() {
    src.index = 'app/client/index.jade';
    return gulp.src(src.index)
        .pipe($.jade())
        .pipe(gulp.dest('build/'));
});

// compile views page.
gulp.task('views', function() {
    src.views = [
        'app/client/views/**/*.jade',
        'app/client/directives/**/*.jade',
        'app/client/layout/**/*.jade'
    ];
    return gulp
            .src(src.views)
            .pipe($.jade())
            .pipe(gulp.dest('build/views'));
});

// Build the app from source code
gulp.task('build', ['clean'], function (cb) {
    runSequence(['vendor', 'styles', 'images', 'jade', 'views', 'bundle'], cb);
});

// Build and start watching for modifications
gulp.task('build:watch', function (cb) {
    watch = true;
    runSequence('build', function () {
        gulp.watch(src.styles, ['styles']);
        gulp.watch(src.views, ['views']);
        gulp.watch(src.index, ['jade']);
        gulp.watch(src.images, ['images']);
        cb();
    });
});

// Bundle
gulp.task('bundle', function (cb) {
    var started = false;
    var config = require('./webpack.config.js');
    var bundler = webpack(config);

    function bundle(err, stats) {
        if (err) {
            throw new $.util.PluginError('webpack', err);
        }

        if (argv.verbose) {
            $.util.log('[webpack]', stats.toString({colors: true}));
        }

        if (!started) {
            started = true;
            return cb();
        }
    }

    if (watch) {
        bundler.watch(200, bundle);
    } else {
        bundler.run(bundle);
    }
});

// Launch a Node.js/express server
gulp.task('serve', ['build:watch'], function (cb) {
    src.server = [
        'app/www/**/*'
    ];

    var started = false;
    var cp = require('child_process');

    var server = (function startup() {
        var child = cp.fork('bin/www');

        child.on('message', function (message) {
            if (message.match(/^online$/)) {
                if (browserSync) {
                    browserSync.reload();
                }
                if (!started) {
                    started = true;

                    gulp.watch(src.server, function () {
                        $.util.log('Restarting development server.');
                        server.kill('SIGTERM');
                        server = startup();
                    });
                    cb();
                }
            }
        });
        return child;
    })();

    process.on('exit', function () {
        server.kill('SIGTERM');
    });
});

// Launch BrowserSync development server
gulp.task('sync', ['serve'], function (cb) {
    browserSync = require('browser-sync');

    browserSync({
        notify: false,
        // Run as an https by setting 'https: true'
        // Note: this uses an unsigned certificate which on first access
        //       will present a certificate warning in the browser.
        https: false,
        // Informs browser-sync to proxy our Express app which would run
        // at the following location
        proxy: 'localhost:4000'
    }, cb);

    process.on('exit', function () {
        browserSync.exit();
    });

    gulp.watch(['build/**/*.*'].concat(
        src.server.map(function (file) {
            return '!' + file;
        })
    ), function (file) {
        browserSync.reload(path.relative(__dirname, file.path));
    });
});
