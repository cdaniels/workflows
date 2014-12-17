var gulp = require('gulp'),
gutil = require('gulp-util'),
coffee = require('gulp-coffee'),
browserify = require('gulp-browserify'),
compass = require('gulp-compass'),
connect = require('gulp-connect'),
gulpif = require('gulp-if'),
uglify = require('gulp-uglify'),
concat = require('gulp-concat');


//Variable Declaration
var env,
coffeeSources,
jsSources,
sassSources,
htmlSources,
jsonSources,
outputDir,
sassStyle;


//ENVIROMENT VARS
// change local variables based on program envirorment variables
// set the mode with NODE_ENV = ""
env = process.env.NODE_ENV || 'development';

if (env === 'development'){
  outputDir = 'builds/development/';
  sassStyle = 'expanded';
} else {
  outputDir = 'builds/production/';
  sassStyle = 'compressed';
}


//Data Sources
coffeeSources = ['components/coffee/tagline.coffee']
jsSources = [
  'components/scripts/rclick.js',
  'components/scripts/pixgrid.js',
  'components/scripts/tagline.js',
  'components/scripts/template.js'
];
sassSources = ['components/sass/style.scss']
htmlSources = [outputDir + '.html']
jsonSources = [outputDir + 'js/*.json']



gulp.task('log',function(){
  gutil.log('sassStyle is set to: ' + sassStyle)
});


//compile coffee script
gulp.task('coffee',function(){
  gulp.src(coffeeSources)
  .pipe(coffee({bare:true}).on('error',gutil.log))
  .pipe(gulp.dest('components/scripts'))
});

//concatinate scripts
gulp.task('js',function(){
  gulp.src(jsSources)
  .pipe(concat('script.js'))
  .pipe(browserify())
  .pipe(gulpif(env === 'production', uglify()))
  .pipe(gulp.dest(outputDir + 'js'))
  .pipe(connect.reload())
});


gulp.task('compass', function(){
  gulp.src(sassSources)
  .pipe(compass({
    sass:'components/sass',
    image: outputDir + 'images',
    style: sassStyle
  }).on('error', gutil.log))
  .pipe(gulp.dest(outputDir + 'css'))
  .pipe(connect.reload())
});

//watch temp files for changes
gulp.task('watch',function(){
  gulp.watch(coffeeSources,['coffee']);
  gulp.watch(jsSources,['js']);
  gulp.watch('components/sass/*.scss',['compass']);
  gulp.watch(htmlSources,['html']);
  gulp.watch(jsonSources,['json']);
});

//fire up server
gulp.task('connect',function() {
  connect.server({
    root: outputDir,
    livereload:true
  })
});

gulp.task('html',function(){
  gulp.src(htmlSources)
    .pipe(connect.reload())
});

gulp.task('json',function(){
  gulp.src(jsonSources)
    .pipe(connect.reload())
});



gulp.task('default',['log','html','json','coffee','js','compass','connect','watch']);


