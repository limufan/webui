/* jshint node: true */
/*!
* webui"s Gruntfile
*/

module.exports = function (grunt) {
    "use strict";
    var developJs = [
				"js/jquery-extend.js",
				"js/webui-mask.js",
				"js/webui-input.js",
				"js/webui-selectInput.js",
				"js/webui-hiddenInput.js",
				"js/webui-textbox.js",
				"js/webui-dateInput.js",
				"js/webui-checkboxList.js",
				"js/webui-dateRangeInput.js",
				"js/webui-form.js",
				"js/webui-numberInput.js",
				"js/webui-numberRangeInput.js",
				"js/webui-radioList.js",
				"js/webui-select.js",
				"js/webui-textarea.js",
				"js/webui-datagrid.js",
				"js/webui-simpleSelect.js",
				"js/webui-complexSelect.js",
				"js/webui-boolRadio.js",
				"js/webui-boolCheckbox.js",
				"js/webui-popoverTrigger.js",
				"js/webui-messageBox.js",
				"js/webui-pagination.js",
				"js/webui-label.js",
				"js/webui-formModal.js",
  "js/webui-dateTimeInput.js",
  "js/webui-dateTimeRangeInput.js",
  "js/webui-file.js",
  "js/webui-autocomplete.js"
    ];
    var webuiJs = developJs.concat(["js/webui-datepicker.js", "js/is.js", "js/fecha.js"]);
    var webuiTestJs = [
     "tests/qunit-bridge.js",
     "tests/webui-input-test.js",
     "tests/webui-dateInput-test.js",
     "tests/webui-textbox-test.js",
     "tests/webui-checkboxList-test.js",
     "tests/webui-dateRangeInput-test.js",
     "tests/webui-numberInput-test.js",
     "tests/webui-numberRangeInput-test.js",
     "tests/webui-radioList-test.js",
     "tests/webui-simpleSelect-test.js",
     "tests/webui-textarea-test.js",
     "tests/webui-form-test.js"
    ];

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
        banner: '/*!\n' +
            ' * Bootstrap v<%= pkg.version %> (<%= pkg.homepage %>)\n' +
            ' * Copyright 2011-<%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
            ' */\n',
        clean: {
            dist: "dist"
        },
        jshint: {
            options: {
                jshintrc: ".jshintrc"
            },
            gruntfile: {
                src: "Gruntfile.js"
            },
            webui: {
                src: developJs
            }
        },
        concat: {
            js: {
                src: webuiJs,
                dest: "dist/webui.js"
            },
            css: {
                src: ["css/webui.css", "css/webui-datepicker.css"],
                dest: "dist/webui.css"
            }
        },
        uglify: {
            webui: {
                options: {
                },
                src: "dist/webui.js",
                dest: "dist/webui.min.js"
            }
        },
        qunit: {
            webuiTest: {
                options: {
                    inject: webuiJs.concat(webuiTestJs),
                    urls: ["tests/qunit-test.html"]
                }
            },
            webuiMinTest: {
                options: {
                    inject: webuiTestJs.concat(["dist/webui.min.js"]),
                    urls: ["tests/qunit-test.html"]
                }
            }
        },
        gremlins: {
            webui: {
                options: {
                    path: 'http://localhost:8081/webui-form1.html',
                    test: "tests/gremlins-config.js"
                }
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-qunit");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks('grunt-gremlins');

    // Default task.
    grunt.registerTask("default", ["clean", "jshint", "concat", "uglify", "qunit"]);

};

