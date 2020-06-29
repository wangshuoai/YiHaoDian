// 编写gulp要做的任务
/*
    gulp.task() 创建任务的
    gulp.src()  找文件源路径
    pipe() 管道
    gulp.dest() 目的路径
*/
// 将这些静态文件进行整理

// 整理html文件
// gulp-htmlmin压缩html代码：
const gulp = require("gulp");
const htmlmin = require("gulp-htmlmin");
gulp.task("copy-html", ()=>{
    return gulp.src("*.html")
    .pipe(gulp.dest("dist/"))
    .pipe(connect.reload());
})

//整理图片
gulp.task("images", ()=>{
    return gulp.src(["*.{jpg,png}"])
    .pipe(gulp.dest("dist/images"))
    .pipe(connect.reload());
})

// 整理js代码
gulp.task("scripts", ()=>{
    return gulp.src(["*.js","!gulpfile.js"])
    .pipe(gulp.dest("dist/js"))
    .pipe(connect.reload());
})

// 整理json数据
gulp.task("json", ()=>{
    return gulp.src("data/*.json")
    .pipe(gulp.dest("dist/data"))
    .pipe(connect.reload());
})

// 整理php文件
gulp.task("php", ()=>{
    return gulp.src("user/*.php")
    .pipe(gulp.dest("dist/user"))
    .pipe(connect.reload());
})

// 整理bootstrap文件
gulp.task("bootstrap",()=>{
    return gulp.src("bootstrap-3.3.7-dist\\**\\*")
    .pipe(gulp.dest("dist/bootstrap/"))
    .pipe(connect.reload());
})

//处理sass：使用gulp插件gulp-sass gulp-rename gulp-minify-css
//如果我们要对我们生成css代码进行重命名，一个文件一个任务
const scss = require("gulp-sass");
const rename = require("gulp-rename");
gulp.task("scss1", ()=>{
    return gulp.src("stylesheet/*.scss")
    .pipe(scss())
    .pipe(gulp.dest("dist/css"))
    .pipe(connect.reload());
})

//监听发之前将所有的任务去执行一遍
gulp.task("build",["copy-html", 'images', "scripts", "json", "php", "bootstrap", "scss1"], ()=>{
    console.log("项目建立成功");
})

//设置监听，设置服务，同时启动监听和服务
gulp.task("watch", ()=>{
    gulp.watch("*.html", ["copy-html"]);
    gulp.watch("*.{jpg,png}", ['images']);
    gulp.watch(["*.js", "!gulpfile.json"], ["scripts"]);
    gulp.watch("stylesheet/*.scss", ["scss1"]);
    gulp.watch("data/*.json", ["json"]);
    gulp.watch("user/*.php", ["php"]);
    gulp.watch("bootstrap-3.3.7-dist", ["bootstrap"]);
})

// 启动一个临时服务器，不支持运行php
const connect = require("gulp-connect");
gulp.task("server", ()=>{
    connect.server({
        root:"dist", //根目录
        port:9999,  // 端口号
        livereload:true  // 实时刷新
    })
})

//设置默认任务，同时启动服务和监听
gulp.task("default", ["watch", "server"]);