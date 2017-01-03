# boilerplate-grunt-backbone-react-seajs-zepto
a boilerplate for Grunt-Backbone-React-SeaJs-Zepto project

这是个主要使用 grunt + backbone + React + seajs + zepto的 demo，可作为开发模板使用。

框架中将Backbone和React的整合，使用了Backbone做MVC框架，React做模板，可以认为是React替换掉了Backbone的View，这个是入门小例子

框架目的：在手机上对Backbone和React的整合，该例子使用了Backbone的Model和React整合，可以认为是React替换掉了Backbone的View，这个是入门小例子 。 最后使用grunt的压缩机制合并文件。

实现内容：通过传递的json数据构建Backbone的Model，使用react的模板功能将数据展现出来。

使用组件： 1. zepto 2. underscore 3. backbone 4.react 5. seajs

---------

## Requirements
 - [Node.js](https://nodejs.org)
 - [npm](https://www.npmjs.com/)
 - [grunt](https://github.com/gruntjs/grunt/)


## Usage
####安装
```
git clone https://github.com/xixichensh/boilerplate-grunt-backbone-react-seajs-zepto.git
cd boilerplate-grunt-backbone-seajs-zepto/build
npm install
```
####开发
```
安装react实时编译工具，将jsx实时转成js

1.执行命令：jsx -w -x jsx myreact/ static/hello/src/build

2.jsx -w -x jsx vendor/ vendor_build

3.在主目录下下执行
-w 是观察文件修改，并自动重新生产js文件到指定的目录下
-x 文件扩展名的处理，默认是js

4.vendor/    目录是jsx文件的目录， vendor_build 是生产js文件目录

double click index.html start
```
####打包
```
grunt or double click build.bat
```
## Dependencies
- [backbone](https://github.com/jashkenas/backbone)
- [zepto](https://github.com/madrobby/zepto)
- [underscore](https://github.com/jashkenas/underscore)
- [seajs](https://github.com/seajs/seajs)
- [react](http://facebook.github.io/react/)
