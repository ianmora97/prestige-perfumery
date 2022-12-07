var gulp = require('gulp');
var sass = require('gulp-sass')(require('sass'));
var concat = require('gulp-concat');

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("./public/sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("./public/css"));
});

// move animate.css to web/css
gulp.task('animate', function() {
    return gulp.src('../node_modules/animate.css/animate.css')
        .pipe(concat('animate.css'))
        .pipe(gulp.dest("./public/css"));
});

// move bootstrap JS and Jquery
gulp.task('js', function() {
    return gulp.src([
            '../node_modules/jquery/dist/jquery.min.js',
            '../node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
        ])
        .pipe(concat('bootstrap.js'))
        .pipe(gulp.dest('./public/js'));
});
// watching all tasks
gulp.task('all', gulp.series('sass','js','animate', function() {
    gulp.watch("./public/sass/*.scss", gulp.series('sass'));
}));

// watching only scss task
gulp.task('styles', gulp.series('sass', function() {
    gulp.watch("./public/sass/*.scss", gulp.series('sass'));
}));
gulp.task('default', gulp.series('styles'));