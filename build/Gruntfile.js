var path = require('path');
module.exports = function(grunt) {
	var transport = require('grunt-cmd-transport');
	var style = transport.style.init(grunt);
	var text = transport.text.init(grunt);
	var script = transport.script.init(grunt);


	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		transport: {

			options: {

				debug: false,

				idleading: './',

				paths: ['./'],

				parsers: {
					'.js': 		[script.jsParser],
					'.css': 	[style.css2jsParser],
					'.html': 	[text.html2jsParser]
				},

				alias: {
					'zepto': 		'zepto',
					'backbone': 	'backbone',
					'underscore': 	'underscore',
					'viewhelper': 	'viewhelper',
					'common': 		'common',
					'core': 		'core',
					'react':		'react',
					'react-dom':	'react-dom',
					'routerhelper': 'routerhelper'
				}

			},

			app: {

				files: [{
					cwd: '../app/',
					src: [
						'views/*',
						'models/*',
						'vendor_build/**/*',
						'vendor_build/*',
						'plugins/*',
						'*'
					],
					dest: '_build/'
				}]

			}

		},

		concat: {

			app: {

				options: {
					paths: ['./']
				},

				files: {

					'../dist/index.js': [
						'_build/**/*.js',

						'!_build/models/*-debug.js',
						'!_build/views/*-debug.js',
						'!_build/*-debug.js'
					]


				}
			},

			css: {
				options: {
					noncmd: true
				},
				files: {

					'../dist/resources/css/indexInit.css': [
						'../app/resources/css/reset.css',
						'../app/resources/css/app.css',
						'../app/resources/css/index.css',
						'../app/resources/css/input-navbar.css',
						'../app/resources/css/core.css',
						'../app/resources/css/core-hardload.css',
						'../app/resources/css/core-alertwindow.css'
					]

				}
			}

		},

		cssmin: {
			css: {

				files: {

					'../dist/resources/css/indexInit.css': '../dist/resources/css/indexInit.css'

				}
			}

		},

		uglify: {

			lib: {
				files: [{
					expand: true,
					cwd: '../app/libs/',
					src: ['**/*.js'],
					dest: '../dist/libs/'
				}]
			},

			build: {

				files: [

					{
						expand: true,
						cwd: '../dist/',
						src: ['*.js', '!*-debug.js'],
						dest: '../dist/',
						ext: '.js'
					}
				]

			}

		},

		copy: {

			content: {

				files: [{
						src: '../app/index.html',
						dest: '../dist/index.html'
					},

					{
						expand: true,
						cwd: '../app/resources/',
						src: ['**/*', '!**/*.css', '!images/*', "!*.html"],
						dest: '../dist/resources'
					}
				]
			}

		},

		clean: {
			build: ["_build/", '..dist/']
		}


	});

	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks("grunt-contrib-imagemin");
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');



	grunt.registerTask('default', [
		'clean',
		'transport',
		'concat',
		'uglify',
		'cssmin',
		'copy',
		'clean'
	]);


};