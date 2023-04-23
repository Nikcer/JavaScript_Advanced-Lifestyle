// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const Dotenv = require('dotenv-webpack');
const isProduction = process.env.NODE_ENV == "production";
const CopyWebpackPlugin = require('copy-webpack-plugin');

const stylesHandler = isProduction
  ? MiniCssExtractPlugin.loader
  : "style-loader";

const config = {
  entry: "./src/js/index.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    
  },
  devServer: {
    open: true,
    host: "localhost",
    port: 3000,
    
  },
  
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      favicon: './src/img/favicon.ico',
      
      

    }),

    new MiniCssExtractPlugin({
       filename: '.src/css/style.css',   
    }),

    new Dotenv(),
    
    
    
    
  ],
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/i,
        loader: "babel-loader",
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
        
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|jpg|gif)$/i,
        type: "asset",
        use: [
          {
            loader: 'file-loader',
            options: {
              
              name: '[name].[ext]',
              outputPath: 'images',
            }
          }
        ]
      },
    
      
      
      
      

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";

    config.plugins.push(new MiniCssExtractPlugin());
  } else {
    config.mode = "development";
  }
  return config;
};