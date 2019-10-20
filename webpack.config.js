var path = require('path');


module.exports = {
    //Define o arquivo de inicialização do webpack
    entry: './src/index.js',
    //Define a saída do webpack.
    output: {
      path: __dirname + '/public',
      filename: 'bundle.js'
    },
    //Configurações do devServer
    devServer: {
        stats: "errors-only",
        contentBase: path.join(__dirname, 'public'),
        compress: true,
        //Você pode personalizar isso para trocar o endereço de acesso do servidor.
        host: process.env.HOST,
        port: process.env.PORT,
        open: true,
    },
    module: {
        rules: [
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader',
              
            }
          },
          {
            //Caso haja algum arquivo que ainda não é suportado, você pode adicioná-lo aqui.
            test: /\.(png|jpg|gif|ico|svg|pvr|pkm|static|mp3|webm|mp4)$/,
            use: {
                loader: 'file-loader',
                options: {
                    outputPath: 'assets',
                }
            },
            exclude: /node_modules/,
          },
          {
            test: [/\.vert$/, /\.frag$/],
            use: 'raw-loader'
          },
  
          {
            test: /\.css$/i,
            exclude: /node_modules/,
            use: [
              {
                loader: 'style-loader'
              },
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  importLoaders: 1,
                  localsConvention: 'dashes',
                  sourceMap: true
                }
              }
            ]
          }
        ]
    },     
}