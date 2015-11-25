var gulp = require('gulp');

var path = require('path');

var fs = require('fs');

var _ = require('lodash');

var amd = require('gulp-requirejs-optimize');

var cwd = process.cwd();

var default_config = {
  config_file: path.join(cwd, 'src', 'static', 'scripts', 'configs', 'require.js'),
  almond_file: 'libs/almond/almond',
  src: path.join(cwd, 'src', 'static', 'scripts', '*.js'),
  dest: path.join(cwd, 'dist', 'static', 'scripts'),
  static_path: path.join(cwd, 'src', 'static')
};

var self = {
  config: default_config,
  run: function(config) {
    config = _.assign(this.config, config);
    scripts(config);
  }
};

function getFile(path) {
  return fs.readFileSync(path, {
    encoding: 'utf-8'
  });
}

function getJSON(path) {
  var str = getFile(path);
  if (str) {
    return JSON.parse(str);
  }

  return {};
}

function scripts(config) {
  var require_config = getJSON(path.join(config.config_file));
  require_config.baseUrl = config.static_path;
  
  gulp.src(config.src)
    .pipe(amd(function(file) {
      require_config.preserveLicenseComments = false;
      require_config.wrap = true;
      require_config.name = config.almond_file;
      require_config.include = ['scripts/' + file.relative];
      return require_config;
    }))
    .pipe(gulp.dest(config.dest));
}

gulp.task('scripts', function() {
  self.run();
});

module.exports = self;
