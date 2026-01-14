const path = require('path')

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
    // 将所有依赖打包进 bundle，只保留无法打包的模块作为外部依赖
    externals: [
      // 只有这些模块需要作为外部依赖：
      // 1. Prisma - 包含原生二进制文件，必须在运行时安装
      function ({ request }, callback) {
        if (request === '@prisma/client' || request.startsWith('.prisma/')) {
          return callback(null, 'commonjs ' + request)
        }
        // 其他所有依赖都打包进 bundle
        callback()
      },
    ],
  }
}
