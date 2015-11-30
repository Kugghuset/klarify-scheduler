'use strict'

var gulp = require('gulp');
var spawn = require('child_process').spawn;
var exec = require('child_process').exec;
var shell = require('shelljs');
var livereload = require('gulp-livereload');
var sass = require('gulp-sass');

var node; // Will be the node command.
var mongod;

// Runs the server function via a custom nodemon.
gulp.task('server', function () {
  // Kill node if it's running already.
  if (node) { node.kill() };
  
  // Run a node client on server/app.js
  node = spawn('node', ['server/app.js'], { stdio: 'inherit' });
  // If it closes with the error code 8, something crashed
  node.on('close', function (code) {
    if (code === 8) {
      gulp.log('Error detected, waiting for changes...');
    }
  });
});

// Runs mongod
gulp.task('mongod', function () {
  if (mongod) { mongod.kill(); }
  
  if (shell.which('mongod')) {
    // Run mongod in quiet mode
    mongod = spawn('mongod', ['--quiet'], { stdio: 'inherit' });
    
    mongod.on('close', function (code) {
      console.log(code);
    });
  }
});

// Reloads the page
gulp.task('reload', function () {
  livereload.reload();
});

// Compiles the sass
gulp.task('sass', function () {
  gulp.src('./public/style/global.scss')
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./public/css'))
    .on('unpipe', function (src) {
      // Only injects styles
      livereload.changed('./public/css/global.css');
    });
});

gulp.task('watch', function () {
  gulp.watch('./server/**', ['server']);
  gulp.watch(['./public/app/**', './public/index.html'], ['reload']);
  gulp.watch(['./public/style/*.scss', './public/app/**/*.scss'], ['sass']);
});

// Start the livereload server
livereload.listen()

// Runs the tasks: mongod, sass, server and watch.
gulp.task('default', ['mongod', 'sass', 'server', 'watch']);

// Like default, but no mongod. (Mongod needs to run elsewhere)
gulp.task('app',  ['sass', 'server', 'watch']);

// On process close, clean up.
process.on('exit', function () {
  if (node) { node.kill() };
  if (mongod) { mongod.kill(); }
});