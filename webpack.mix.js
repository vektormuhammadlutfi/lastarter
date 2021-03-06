const mix = require('laravel-mix');
const MiniCssExtractPlugin  = require('mini-css-extract-plugin');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

mix.options({
   extractVueStyles: false,
});

mix.disableNotifications();
mix.setPublicPath('public');

mix.webpackConfig({
   resolve: {
      extensions: ['.js', '.json', '.vue'],
      alias: {
         '@': path.join(__dirname, './resources'),
      }
   },
   output: {
      chunkFilename: 'dist/[name].js',
   },
   module: {
      rules: [
         {
            test: /\.sass$/,
            use: [
               MiniCssExtractPlugin.loader,
               { loader: 'css-loader', options: { sourceMap: !mix.inProduction() } },
               {
                     loader: 'sass-loader',
                     options: {
                        sourceMap: !mix.inProduction(), 
                        implementation: require("sass"), 
                        prependData: "@import '@/styles/variables.scss'",
                        sassOptions: {
                           fiber: require('fibers'),
                        }
                     },
               },
            ],
         },
         // {
         //    test: /\.scss$/,
         //    use: [
         //       MiniCssExtractPlugin.loader,
         //       { loader: 'css-loader', options: { sourceMap: !mix.inProduction() } },
         //       {
         //             loader: 'sass-loader',
         //             options: {
         //                sourceMap: !mix.inProduction(), 
         //                implementation: require("sass"), 
         //                sassOptions: {
         //                   fiber: require('fibers'),
         //                }
         //             },
         //       },
         //    ],
         // },
      ],
   },
   devServer: {
      disableHostCheck: true,
   },
   plugins: [
      new MiniCssExtractPlugin({
         filename: "[name].css",
         chunkFilename: "[name].css",
         ignoreOrder: false
      }),
      new MomentLocalesPlugin(),
   ],
   externals: {
      "vue": "Vue",
   }
});

mix.copy('node_modules/moment/min/moment.min.js', 'public/dist/moment.js');

if (mix.inProduction()) {
   mix.copy('node_modules/vue/dist/vue.min.js', 'public/dist/vue.js');
   mix.version();
} else {
   mix.copy('node_modules/vue/dist/vue.js', 'public/dist/vue.js');
   mix.sourceMaps(true, 'inline-source-map');
}


mix.js('resources/js/app.js', 'public/dist')
mix.js('resources/js/vuetify.js', 'public/dist')
mix.sass('resources/styles/main.scss', 'public/dist');