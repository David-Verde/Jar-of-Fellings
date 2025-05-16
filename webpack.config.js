const createExpoWebpackConfigAsync = require('@expo/webpack-config');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  config.module.rules.push({
    test: /\.(mp4|mov)$/,
    use: {
      loader: 'file-loader',
      options: {
        name: '[name].[ext]',
        outputPath: 'videos/',
        publicPath: 'videos/'
      }
    }
  });

  return config;
};