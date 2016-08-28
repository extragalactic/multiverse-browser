// Multiverse Browser Gulp

// require modules
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    concat = require('gulp-concat'),
    minify = require('gulp-minify'),
    jshint = require('gulp-jshint'),
    sass = require('gulp-sass'),
    del = require('del'),
    fs = require('fs'),
    browserify = require('gulp-browserify');

// javascript source files
var jsSources = [
  'src/js/app.js',
  'src/js/controllers/homeCtrl.js',
  'src/js/controllers/listCtrl.js',
  'src/js/controllers/detailsCtrl.js',
  'src/js/controllers/headerCtrl.js',
  'src/js/controllers/optionsCtrl.js',
  'src/js/controllers/videoCtrl.js',
  'src/js/controllers/aboutCtrl.js',
  'src/js/services/utilitiesFactory.js',
  'src/js/services/socketFactory.js'
];
var moduleSources = [
  'src/js/galaxyInfo.js'
];
var htmlSources = [
  'src/*.html'
];
var scssSources = [
  'src/scss/*.scss'
];
// all of the dist folders for deleting (excludes the images folder)
var distFolders = [
  'dist/css',
  'dist/fonts',
  'dist/js',
  'dist/lib',
  'dist/partials',
  'dist/templates'
];


// cleans out the dist folder for new files
// (except the images folder, which is quite large)
gulp.task('clean', function(done) {
  del.sync(distFolders);
  done();
});
// copy partials (html) into dist folder
gulp.task('copyViews', function(done) {
  return gulp.src("src/partials/*.html")
      .pipe(gulp.dest('dist/partials'));
});
// copy libraries (Angular) into dist folder
gulp.task('copyLibraries', function(done) {
  return gulp.src("src/lib/**/*")
      .pipe(gulp.dest('dist/lib'));
});
// copy root files to dist folder
gulp.task('copyHtmlRoot', function(done) {
  return gulp.src(["src/index.html", "src/serverIP.js"])
      .pipe(gulp.dest('dist'));
});
// copy over the Bootstrap CSS files (locally intead of a CDN)
gulp.task('copyBootstrapCSS', function(done) {
  return gulp.src("src/css/bootstrap/*")
      .pipe(gulp.dest('dist/css'));
});
// copy any templates that have been overridden
gulp.task('copyTemplates', function(done) {
  return gulp.src("src/templates/**/*")
      .pipe(gulp.dest('dist/templates'));
});
// copy over the Bootstrap CSS files (locally intead of a CDN)
gulp.task('copyFonts', function(done) {
  return gulp.src("src/fonts/*")
      .pipe(gulp.dest('dist/fonts'));
});


// check code for syntax errors
gulp.task('jshint', function() {
  gulp.src(jsSources)
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish-ex'))
    .pipe(jshint.reporter('fail'));
});

// convert Sass to CSS
gulp.task('sass', function() {
  return gulp.src(scssSources)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('dist/css'));
});

// compile Javascript
gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(concat('script.js'))
    .pipe(browserify())
    .pipe(gulp.dest('dist/js'));
});

// minify code for production
gulp.task('minify', function() {
  gulp.src('src/js/script.js')
    .pipe(minify())
    .pipe(gulp.dest('dist/js'));
});

gulp.task('watch', function() {
  gulp.watch(moduleSources, ['jshint', 'js']);
  gulp.watch(jsSources, ['jshint', 'js']);
  gulp.watch(scssSources, ['sass']);
});

//  default task when running Gulp
gulp.task('default', ['clean', 'jshint', 'sass', 'js', 'copyViews', 'copyLibraries', 'copyHtmlRoot', 'copyBootstrapCSS', 'copyTemplates', 'copyFonts', 'watch']);
