'use strict';

var gulp     = require('gulp'),
    plugins  = require('gulp-load-plugins')(),
    taskPath = './tasks/',
    // async readdir does not identify task names
    taskList = require('fs').readdirSync(taskPath),
    cheerio = require('gulp-cheerio');


var change = require('gulp-change');

taskList.forEach(function (taskFile) {
    require(taskPath + taskFile)(gulp, plugins);
});
