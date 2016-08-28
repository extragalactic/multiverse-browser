'use strict';

// require modules
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    jshint = require('gulp-jshint'),
    yaml = require('js-yaml'),
    sass = require('gulp-sass'),
    yargs = require('yargs'),
    rimraf = require('gulp-rimraf'),
    del = require('del'),
    fs = require('fs'),
    browserify = require('gulp-browserify');

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
//const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

//function loadConfig() {
//  let ymlFile = fs.readFileSync('config.yml', 'utf8');
//  return yaml.load(ymlFile);
//}

// list source files
var jsSources = [
  'public/js/app.js',
  'public/js/controllers/homeCtrl.js',
  'public/js/controllers/listCtrl.js',
  'public/js/controllers/detailsCtrl.js',
  'public/js/controllers/headerCtrl.js',
  'public/js/controllers/optionsCtrl.js',
  'public/js/controllers/videoCtrl.js',
  'public/js/controllers/aboutCtrl.js',
  'public/js/services/utilitiesFactory.js',
  'public/js/services/socketFactory.js'
];
var moduleSources = [
  'public/js/galaxyInfo.js'
];
var htmlSources = [
  'public/*.html'
];
var scssSources = [
  'public/scss/*.scss'
];
// all of the Dist folders except the images folder
var distFolders = [
  'dist/css',
  'dist/fonts',
  'dist/js',
  'dist/lib',
  'dist/partials',
  'dist/templates'
];

// Delete most of the "dist" folder
// This happens every time a build starts

gulp.task('clean', function(done) {
  rimraf('dist/css', gulp.done);
  done();
});

//function clean(done) {
//  rimraf('dist/css', done);
//}
function copyViews() {
  return gulp.src('public/partials/*.html')
    .pipe(gulp.dest('dist/partials'));
}
function copyHtmlRoot() {
  return gulp.src(['public/index.html', 'public/serverIP.js'])
    .pipe(gulp.dest('dist'));
}
function copyLibraries() {
  return gulp.src('public/lib')
    .pipe(gulp.dest('dist/lib'));
}

// define tasks
function jshint() {
  return gulp.src(jsSources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish-ex'))
    .pipe(jshint.reporter('fail'));
}

function sass() {
  return gulp.src(scssSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
}

function js() {
  return gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('dist/js'));
}

function minify() {
  return gulp.src('dist/js/script.js')
    .pipe(minify())
    .pipe(gulp.dest('dist/js'));
}

function watch() {
  gulp.watch(moduleSources, ['jshint', 'js']);
  gulp.watch(jsSources, ['jshint', 'js']);
  gulp.watch(scssSources, ['sass']);
}

// tasks
gulp.task('build', function(done) {
  gulp.series('clean', gulp.parallel(jshint, sass, js));
  done();
});

gulp.task('default', function(done) {
  gulp.series('build', watch);
  done();
});
