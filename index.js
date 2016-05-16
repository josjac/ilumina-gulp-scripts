var gulp = require('gulp');

var path = require('path');

var fs = require('fs');

var _ = require('lodash');

var amd = require('gulp-requirejs-optimize');

var amdclean = require('gulp-amdclean');

var uglify = require('gulp-uglify');

var cwd = process.cwd();

var default_config = {
  config_file: path.join(cwd, 'src', 'static', 'scripts', 'configs', 'require.js'),
  almond_file: 'libs/almond/almond',
  src: path.join(cwd, 'src', 'static', 'scripts', '*.js'),
  dest: path.join(cwd, 'dist', 'static', 'scripts'),
  static_path: path.join(cwd, 'src', 'static'),
  amd_clean: true
};

var self = {
  config: default_config,
  set: function(config) {
    this.config = _.assign(this.config, config);
  },
  run: function(config) {
    scripts(config || this.config);
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
  
  var buff = gulp.src(config.src)
    .pipe(
      amd(function(file) {
        require_config.preserveLicenseComments = false;
        require_config.wrap = true;
        
        if (config.amd_clean) {
          require_config.optimize = 'none';
        }
        else {
          require_config.name = config.almond_file;
        }
        
        require_config.include = ['scripts/' + file.relative];
        return require_config;
      })
    );
    
  if (config.amd_clean) {
    buff.pipe(
      amdclean.gulp({
        removeAllRequires: true,
        aggressiveOptimizations: true
      })
    )
      
    .pipe(
      uglify()
    )
    
    .pipe(
      gulp.dest(config.dest)
    );
  }
  
  else {
    buff.pipe(
      gulp.dest(config.dest)
    );
  }
}

gulp.task('scripts', function() {
  self.run();
});

module.exports = self;
