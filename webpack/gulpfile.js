var gulp        = require('gulp');
var sass        = require('gulp-sass');

// Compile sass into CSS
gulp.task('sass', function() {
    return gulp.src("sass/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("../server/static/css"));
});

// watching SCSS files
gulp.task('serve', gulp.series('sass', function() {
    gulp.watch("sass/*.scss", gulp.series('sass'));
}));

gulp.task('default', gulp.series('serve'));