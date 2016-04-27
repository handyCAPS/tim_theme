/*global module:false*/
module.exports = function(grunt) {

    function addSlashes() {
        return [].join.call(arguments, '/');
    }


    var Path = {
        dist: {
            base: 'dist'
        },
        dev: {
            base: 'dev'
        },
        wp: {
            base: '../wp_tim/wp-content'
        }
    };

    Path.dev.js = addSlashes(Path.dev.base, 'js');
    Path.dev.scss = addSlashes(Path.dev.base, 'scss');

    Path.dist.js = addSlashes(Path.dist.base, 'js');
    Path.dist.css = addSlashes(Path.dist.base, 'css');

    Path.wp.theme = addSlashes(Path.wp.base, 'themes/timdoppenberg');

    Path.wp.js = addSlashes(Path.wp.theme, 'js');
    Path.wp.css = addSlashes(Path.wp.theme, 'css');

  // Project configuration.
    grunt.initConfig({
        // Metadata.
        pkg: grunt.file.readJSON('package.json'),
        banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
            '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
            '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
            '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
            ' Licensed  */\n',
        // Task configuration.
        concat: {
            options: {
                banner: '<%= banner %>',
                stripBanners: true
            },
        dist: {
            src: [Path.dev.js + '/main.js'],
            dest: Path.dist.js + '/main.js'
        }
        },
        uglify: {
            options: {
            banner: '<%= banner %>'
        },
        dist: {
            src: '<%= concat.dist.dest %>',
            dest: Path.wp.js + '/main.js'
        }
        },
        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                undef: true,
                unused: true,
                boss: true,
                eqnull: true,
                browser: true,
                devel: true,
                globals: {
                    require: true
                }
            },
            gruntfile: {
                src: 'Gruntfile.js'
            },
            lib_test: {
                src: ['lib/**/*.js', 'test/**/*.js']
            }
        },
        sass: {
            dist: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: Path.dev.scss,
                    src: '**/*.scss',
                    dest: Path.dist.css,
                    ext: '.css'
                }]
            },
            wp: {
                options: {
                    style: 'expanded'
                },
                files: [{
                    expand: true,
                    cwd: Path.dev.scss,
                    src: '**/*.scss',
                    dest: Path.wp.css,
                    ext: '.css'
                }]
            }
        },
        postcss: {
            options: {
                processors: [
                    require('autoprefixer')
                ]
            },
            dist: {
                src: Path.wp.css + '/main.css'
            }
        },
        copy: {
            theme: {
                files: [{
                    expand: true,
                    src: ['timdoppenberg/**'],
                    dest: addSlashes(Path.wp.base, 'themes/')
                }]
            }
        },
        watch: {
            options: {
                livereload: true
            },
            gruntfile: {
                files: '<%= jshint.gruntfile.src %>',
                tasks: ['jshint:gruntfile']
            },
            lib_test: {
                files: '<%= jshint.lib_test.src %>',
                tasks: ['jshint:lib_test']
            },
            scss: {
                files: Path.dev.scss + '**/*.scss',
                tasks: ['sass', 'postcss']
            },
            theme: {
                files: 'timdoppenberg/**/*.php',
                tasks: ['copy']
            }
        }
        });

        // These plugins provide necessary tasks.
        require('load-grunt-tasks')(grunt);

        // Default task.
        grunt.registerTask('default', ['jshint', 'concat', 'uglify']);

    };
