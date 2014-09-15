// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    minifycss = require('gulp-minify-css'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    clean = require('gulp-clean'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    compass = require('gulp-compass'),
    path = require('path'),
    embedlr = require("gulp-embedlr"),
    cache = require('gulp-cache'),
    uncss = require('gulp-uncss'),
    processhtml = require('gulp-processhtml'),
    livereload = require('gulp-livereload'),
    lr = require('tiny-lr'),
    server = lr();

// Styles
gulp.task('styles', function() {
  return gulp.src('src/styles/main.scss')
    .pipe(sass({ style: 'expanded', compass: true }))
    .pipe(autoprefixer('last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'))
    .pipe(gulp.dest('dist/styles'))
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/styles'))
    .pipe(notify({ message: 'Styles task complete' }));
});

//remove comments and livereload scripts from output html files -  gulp-processhtml

gulp.task('processHTML', function() {
    return gulp.src('./src/index.html')
    .pipe(processhtml('index.html'))
    .pipe(gulp.dest('./dist/'))
    .pipe(notify({ message: 'processHTML task complete' }));
});

gulp.task('uncss', function() {
    return gulp.src('./dist/styles/main.css')
        .pipe(uncss({html: ['./dist/index.html']})) //html: ['index.html', 'about.html']
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('./dist/styles/'))
        .pipe(notify({ message: 'UNCSS task complete' }));
});


// Scripts
gulp.task('scripts', function() {
     return gulp.src(['src/scripts/*.js', '!./src/modernizr.js'])
    .pipe(concat('main.js'))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(livereload(server))
    .pipe(gulp.dest('dist/scripts'))
    .pipe(notify({ message: 'Scripts task complete' }));
});

// Images
gulp.task('images', function() {
  return gulp.src('src/images/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images/'))
    .pipe(notify({ message: 'Images task complete' }));
});

gulp.task('html', function() {
    return gulp.src("src/**/*.html")
    .pipe(embedlr())
    .pipe(gulp.dest("dist/"))
    .pipe(livereload(server));
})
    
// Clean
gulp.task('clean', function() {
  return gulp.src(['dist/styles', 'dist/scripts', 'dist/images'], {read: false})
    .pipe(clean());
});


// Default task
gulp.task('default', ['watch', 'styles', 'scripts', 'images', 'uncss', 'processHTML']);

// Watch
gulp.task('watch', function() {

  // Listen on port 35729
  server.listen(35729, function (err) {
    if (err) {
      return console.log(err)
    };
   });

    // Watch .scss files
    gulp.watch('src/styles/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('src/scripts/**/*.js', ['scripts']);

    // Watch image files
    gulp.watch('src/images/*', ['images']);

     gulp.watch('src/**/*.html', ['html']);

});


