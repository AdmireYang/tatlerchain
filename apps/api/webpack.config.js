const path = require('path')

module.exports = function (options) {
  return {
    ...options,
    resolve: {
      ...options.resolve,
      alias: {
        '@': path.resolve(__dirname, 'src'),
        // 将 @port/database 直接映射到 @prisma/client
        // 因为 @port/database 只是重新导出 @prisma/client
        '@port/database': '@prisma/client',
        '@port/types': path.resolve(__dirname, '../../packages/types/src'),
        '@port/utils': path.resolve(__dirname, '../../packages/utils/src'),
      },
    },
    // 外部依赖（不打包进 bundle）
    externals: [
      function ({ request }, callback) {
        // Prisma 相关的必须作为外部依赖
        if (
          request === '@prisma/client' ||
          request.startsWith('.prisma/') ||
          request === '@port/database'
        ) {
          // 将 @port/database 映射为 @prisma/client
          if (request === '@port/database') {
            return callback(null, 'commonjs @prisma/client')
          }
          return callback(null, 'commonjs ' + request)
        }
        callback()
      },
    ],
  }
}
