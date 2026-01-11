const path = require('path');

module.exports = function (options) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
        '@port/database': path.resolve(__dirname, '../../packages/database/src'),
        '@port/types': path.resolve(__dirname, '../../packages/types/src'),
        '@port/utils': path.resolve(__dirname, '../../packages/utils/src'),
      },
    },
  };
};

