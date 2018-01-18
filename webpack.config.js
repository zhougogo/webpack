const path = require('path');
const webpack = require('webpack');
//配置JS压缩 一般用于生产环境
// const uglify = require('uglifyjs-webpack-plugin');
const htmlPlugin = require('html-webpack-plugin');
//CSS分离插件
const extractTextPlugin = require("extract-text-webpack-plugin");
//同步检查html模板
const glob = require('glob');
//引入拷贝其它资源
// const copyWebpackPlugin = require("copy-webpack-plugin");
//去除css冗余
const PurifyCSSPlugin = require("purifycss-webpack");
//引入入口文件
// const entry = require('./webpack_config/entry_webpack.js');
//设置公共的路径
if(process.env.type == "build"){
    //开发环境执行
    var website={
        publicPath:"http://192.168.1.120:80/"
    }
}else{
    //生产环境执行
    var website={
        publicPath:"http://192.168.1.120:80/"
    }
}


module.exports = {
    //调试
    // devtool:'source-map',

    //入口文件的配置项
    entry:{
        bundle:"./src/entery.js",
        index:"./src/index.js",
        jquery:'jquery',
        vue:'vue'
    },
    //出口文件的配置项
    output:{
        //获取项目的绝对路径
        path:path.resolve(__dirname,"dist"),
        //打包后的文件名称
        filename:"js/[name].js",
        //设置公共的路径，方便图片和css的引入
        publicPath:website.publicPath
    },
    //模块：例如解读CSS,图片如何转换，压缩
    module:{
        rules:[
            {
                test:/\.css$/,
                use:extractTextPlugin.extract({
                    fallback: "style-loader",
                    use: [{
                        loader:"css-loader",
                        options:{
                            importLoaders:1
                        }
                    },
                    "postcss-loader"
                ]
                })
            },{
                test:/\.less$/,
                use:extractTextPlugin.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"less-loader"
                    }],
                    fallback:"style-loader"
                })
            },{
                test:/\.scss$/,
                use:extractTextPlugin.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"sass-loader"
                    }],
                    fallback:"style-loader"
                })
            },{
                test:/\.(png|jpg|gif|jepg)/,
                use:[{
                    loader:"url-loader",
                    options:{
                        limit:50,
                        outputPath:"images/"
                    }
                }]
            },{
                test:/\.(htm|html)$/i,
                use:["html-withimg-loader"]
            },{
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                //打包的时候去掉node_modules包
                exclude:/node_modules/
            }
        ]

    },
    //插件，用于生产模版和各项功能
    plugins:[
        //抽离外链
        new webpack.optimize.CommonsChunkPlugin({
            name:["jquery",'vue'],
            filename:"js/[name].js",
            minChunks:2//最小抽离文件
        }),
        //配置引入第三方类库外部插件，必须是npm 安装过的
        // new webpack.ProvidePlugin({
        //     $:"jquery"
        // }),
        //配置JS压缩
        // new uglify(),
        new htmlPlugin({
            //对html进行压缩
            minify:{
                //去掉了属性的引号
                removeAttributeQuotes:true,
            },
            //避免缓存js
            hash:true,
            //打包的html模版路径和文件名称。
            template:'./src/index.html'
        }),
        //打包后的文件目录,有图片文件文件
        new extractTextPlugin("css/index.css"),
        new PurifyCSSPlugin({
            //找html模板，遍历这个文件，查找哪些css被使用了
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),
        //拷贝其他资源插件
        // new copyWebpackPlugin([{
        //     from:__dirname+'/src/public',
        //     to:'./public'
        // }]),
        //版权
        new webpack.BannerPlugin('输入版本信息--周红')
    ],
    //配置webpack开发服务功能
    devServer:{
        //配置ip地址
        //配置热更新 安装npm install webpack-dev-server --save-dev
        contentBase:path.resolve(__dirname,'dist'),
        host:'192.168.1.120',
        //服务器压缩
        compress:true,
        //服务器端口
        port:80

    },
    watchOptions:{
        //监测修改的时间
        poll:1000,
        ignored:/node_modules/,
    }
}