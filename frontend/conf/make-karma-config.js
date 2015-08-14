/* make-karma-config.js
 *
 * This file is responsible for building a karma configuration (usually found
 * in `karma.conf.js`) from a set of options.  Since we have three different
 * configurations - one-shot, regular, or with code coverage, this file takes
 * some input options and then outputs the appropriate configuration.
 */

var forOwn = require('lodash-node/modern/object/forOwn'),
    isNaN = require('lodash-node/modern/lang/isNaN'),
    path = require('path'),
    webpackConfig = require('./webpack.test.js');

// ------------------------------------------------------------

/**
 * Validates the input options and returns the new options object.
 *
 * @param {Object} options
 * @returns {Number} The validated options
 */
var validateOptions = function(options) {
  var out = {
    coverage: false,        // Generate code coverage?
    notify:   false,        // Send notification?
    ci:       false,        // Running in continuous integration?
  };

  forOwn(options, function(value, key) {
    if( 'coverage' === key ) {
      out.coverage = !!value;
    } else if( 'notify' === key ) {
      out.notify = !!value;
    } else if( 'ci' === key ) {
      out.ci = !!value;
    } else {
      throw new Error("make-karma-config: option '" + key + "' doesn't exist");
    }
  });

  return out;
};


/**
 * Builds the configuration from the given options.
 *
 * @param {Object} opts The input options
 * @returns {Object} The built configuration
 */
module.exports = function(opts) {
  var options = validateOptions(opts),
      testDir = path.join(__dirname, '..', 'test');

  var testFilesJs = path.join(testDir, '**', '*.test.js'),
      testFilesJsx = path.join(testDir, '**', '*.test.jsx');

  var karmaConfig = {
    // TravisCI, etc. can run Firefox in xvfb
    browsers: [options.ci ? 'Firefox' : 'Chrome'],
    browserNoActivityTimeout: 30000,
    frameworks: ['mocha'],

    files: [
      '../node_modules/babel-core/browser-polyfill.js',
      testFilesJs,
      testFilesJsx,
    ],
    preprocessors: {},

    webpackMiddleware: {
      noInfo: true,
    },

    // Be more terse when running in CI
    reporters: [options.ci ? 'dots' : 'mocha'],

    // Karma plugins to load
    plugins: [
      'karma-webpack',
      'karma-mocha',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
    ],
  };

  // Set preprocessors.
  karmaConfig.preprocessors[testFilesJs] = ['webpack'];
  karmaConfig.preprocessors[testFilesJsx] = ['webpack'];

  // Add appropriate browser loaders
  karmaConfig.plugins.push(options.ci ? 'karma-firefox-launcher' : 'karma-chrome-launcher');

  // Add coverage options.
  if( options.coverage ) {
    // Setup webpack configuration.
    // Needs to load first to prevent linting issues
    webpackConfig.module.preLoaders = [
      {
        test: /\.jsx?$/,
        exclude: /(\/test\/|node_modules)/,
        loader: 'isparta-loader?{babel: {optional:["es7.classProperties"]}}',
      },
    ].concat(webpackConfig.module.preLoaders);

    // Set coverage options.
    karmaConfig.coverageReporter = {
      dir: path.join(__dirname, '..', 'coverage'),

      reporters: options.ci ? [
        { type: 'text' },
      ] : [
        { type: 'text' },
        { type: 'html', subdir: 'report-html' },
      ],
    };

    // Add karma plugins/reporters
    karmaConfig.plugins.push('karma-coverage');
    karmaConfig.reporters.push('coverage');
  }

  // Add notify options.
  if( options.notify ) {
    karmaConfig.plugins.push('karma-notify-reporter');
    karmaConfig.reporters.push('notify');
  }

  // Done!
  karmaConfig.webpack = webpackConfig;
  return karmaConfig;
};
