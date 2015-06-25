/**
 * Created by Jonathan Perez on 2015-06-22.
 */

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**!\n * jPanel v<%= pkg.version %>\n * Copyright (c) 2015 Jonathan Perez.\n * Licensed under the MIT License.\n */\n'
            },
            dist: {
                files: {
                    'dist/js/jpanel.min.js': ['src/js/jpanel.js']
                }
            }
        },
        qunit: {
            files: ['test/**/*.html']
        },
        jshint: {
            files: ['Gruntfile.js', 'src/**/*.js', 'test/**/*.js'],
            options: {
                // options here to override JSHint defaults
                globals: {
                    jQuery: false,
                    console: true,
                    module: true,
                    document: true
                }
            }
        },
        cssmin: {
            target: {
                files: {
                    'dist/css/jpanel.min.css': ['src/css/jpanel.css']
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    grunt.registerTask('test', [
        'jshint',
        'qunit'
    ]);

    grunt.registerTask('default', [
        'cssmin',
        'uglify'
    ]);

};