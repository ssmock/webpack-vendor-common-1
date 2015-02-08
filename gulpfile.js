var gulp = require("gulp");
var gutil = require("gulp-util");
var runSequence = require("run-sequence");
var del = require("del");
var webpack = require("webpack");

var commonsChunk = webpack.optimize.CommonsChunkPlugin;
var vendorChunk = {
    // For webpack config.entry.
    modules: ["lodash", "director", "whatwg-fetch"],
    // For webpack config.plugins
    // If this changes, be sure to update its references!
    fileName: "vendor.201502081110.js"
};

var webpackDevServer = require("webpack-dev-server");

function getWebpackConfig(options) {
    return {
        entry: {
            vendor: vendorChunk.modules,
            main: "./src/main.js"
        },
        output: {
            path: __dirname + "/dist",
            publicPath: "dist/",
            filename: "[name].bundle.js"
        },
        plugins: [
            new commonsChunk(
                "vendor",
                vendorChunk.fileName)
        ],
        resolve: {
            modulesDirectories: ["node_modules", "src/core"]
        }
    };
}

function getWebpackConfigForAutoUpdate() {
    var config = getWebpackConfig();

    config.watch = true;

    return config;
}

function getWebpackConfigForProduction() {
    var config = getWebpackConfig();

    config.plugins.push(new webpack.optimize.UglifyJsPlugin());

    return config;
}

function getWebpackCallback(caption, callback) {
    return function (err, stats) {
        if (err) throw new gutil.PluginError(caption, err);

        gutil.log(caption, stats.toString({
            // output options
        }));

        if (callback) callback();
    };
}

gulp.task("clean", function (callback) {
    del(["./dist/**/*"], callback);
});

// Non-minified build
gulp.task("build-js", function (callback) {
    webpack(
		getWebpackConfig(),
		getWebpackCallback("webpack", callback));
});

gulp.task("build-clean-js", function (callback) {
    runSequence("clean", "build-js", callback);
});

// Non-minified build in watch mode
gulp.task("build-watch-js", function (callback) {
    webpack(
		getWebpackConfigForAutoUpdate(),
		getWebpackCallback("webpack"));
});

gulp.task("build-watch-clean-js", function (callback) {
    runSequence("clean", "build-watch-js");
});

// Minified build
gulp.task("prod-build-js", function (callback) {
    webpack(
		getWebpackConfigForProduction(),
		getWebpackCallback("webpack (prod build)", callback));
});

gulp.task("prod-build-clean-js", function (callback) {
    runSequence("clean", "prod-build-js", callback);
});