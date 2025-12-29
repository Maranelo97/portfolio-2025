module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-coverage'),
      require('karma-jasmine-html-reporter'),
    ],

    files: [{ pattern: 'src/test-setup.ts', watched: false }],
    client: {
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },

    coverageReporter: {
      dir: require('path').join(__dirname, './coverage'),
      reporters: [{ type: 'lcov', subdir: '.' }, { type: 'html' }, { type: 'text-summary' }],
      check: {
        global: {
          statements: 100,
          branches: 100,
          functions: 100,
          lines: 100,
        },
      },
    },

    reporters: ['progress', 'kjhtml', 'coverage'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
