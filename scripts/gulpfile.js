// use strict code
"use strict";

// global node modules
var gulp = require("gulp");
var conf = require("./js/00-load.js");
var copy = require("./js/01-copy.js");
var build_pre = require("./js/02-build_pre.js");
var build_post = require("./js/03-build_post.js");
var serve = require("./js/04-serve.js");

// url functions
gulp.task("baseUrl", function(done) {
  conf.hugo.url = conf.hugo.baseUrl;
  done();
});
gulp.task("tempUrl", function(done) {
  conf.hugo.url = conf.hugo.tempUrl;
  done();
});

// copy function
gulp.task("copy", function(done) {
  copy(conf, done);
  // done();
});

// sass function
gulp.task("build:pre:bulma", function(done) {
  build_pre.bulma(conf, done);
});
gulp.task("build:pre:htko", function(done) {
  build_pre.htko(conf, done);
});
gulp.task("build:pre", gulp.series("build:pre:bulma", "build:pre:htko"));

// build function
gulp.task("build:post:hugo", function(done) {
  build_post.hugo(conf, done);
});
gulp.task("build:post:lint", function(done) {
  build_post.lint(conf, done);
});
gulp.task("build:post", gulp.series("build:post:hugo", "build:post:lint"));

// server function
gulp.task("serve", function(done) {
  serve.launch(conf, done);
});
gulp.task("reload", function(done) {
  serve.reload(done);
});

// watch function
gulp.task("watch", function(done) {
  gulp.watch(conf.filters.sass).on("change", gulp.series("build:pre"));
  gulp.watch(conf.filters.hugo).on("change", gulp.series("build:post", "reload"));
});

// tasks
gulp.task("build:all", gulp.series("copy", "build:pre", "build:post"));
gulp.task("builder", gulp.series("baseUrl", "build:all", "serve", "watch"));
gulp.task("server", gulp.series("tempUrl", "build:all", "serve", "watch"));
