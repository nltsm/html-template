var gulp = require('gulp'),
	connect = require('gulp-connect'),
	less = require('gulp-less'),
	rename = require('gulp-rename'),
	uglify = require('gulp-uglify'),
	cleanCSS = require('gulp-clean-css'),
	autoprefixer = require('gulp-autoprefixer'),
	concat = require('gulp-concat'),
	plumber = require('gulp-plumber'),
	imageop = require('gulp-image-optimization'),
	sprite = require('gulp.spritesmith'),
	stripComments = require('gulp-strip-css-comments'),
	emptyLines = require("gulp-remove-empty-lines");


var path = {
	app: {
		root: 'app',
		css: 'app/css',
		js: 'app/js',
		images: 'app/img'
	},
	less: {
		root: 'less',
		base: 'less/base',
		lib: 'less/lib',
		project: 'less/blocks',
	},
	js: {
		root: 'scripts',
		major: 'scripts/major',
		jqueryModules: 'scripts/jModules',
		jqueryPlugins: 'scripts/jPlugins',
		app: 'scripts/major/app.js',
		script: 'scripts/major/script.js'
	},
	core: {
		app: "",
		images: "img",
		css: "css",
		fonts: "fonts",
		js: "js"
	}
};

/**
 * Наименования файлов
 */
var names = {
	css: {
		main: 'main.css',
		mainMin: 'main.min.css'
	},
	js: {
		app: 'app.js',
		appMin: 'app.min.js'
	}
};

/**
 * Соединение с сервером
 */
gulp.task('connect', function () {
	connect.server({
		"root": path.app.root,
		"livereload": true
	});
});

/**
 * CSS / less
 */
var base = [
	path.less.root + '/variables.less',
	path.less.root + '/mixins.less',
	path.less.root + '/fonts.less',
	path.less.root + '/reset.less',
	path.less.root + '/sprite.less'
];
gulp.task('css', function () {
	gulp.src(
		[
			base[0], base[1], base[2], base[3],  base[4],
			path.less.base + '/**/*.less', 
			path.less.lib + '/**/*.less', 
			path.less.project + '/**/*.less'
		])
		.pipe(concat(names.css.main))
		.pipe(plumber())
		.pipe(less())
		.pipe(gulp.dest(path.app.css))
		.pipe(connect.reload());
});

/**
 * script
 */
gulp.task('script', function () {
	gulp.src([path.js.app, path.js.jqueryPlugins + '/**/*.*', path.js.jqueryModules + '/**/*.*', path.js.script])
		.pipe(plumber())
		.pipe(concat(names.js.app))
		.pipe(rename(names.js.app))
		.pipe(gulp.dest(path.app.js))
		.pipe(connect.reload());
});

/**
 * Sprite
 */
gulp.task('sprite', function () {
	var spriteData = gulp.src(path.app.images + "/sprite/*.*")
		.pipe(plumber())
		.pipe(sprite({
			imgName: "sprite.png",
			imgPath: "../" + path.core.images + "/sprite.png",
			cssName: "sprite.less",
			cssFormat: "less",
			algorithm: 'binary-tree',
			cssVarMap: function(sprite) {
                sprite.name = 's-' + sprite.name
            },
			//retinaSrcFilter: [path.app.images + "/sprite/*@2x.*"],
			//retinaImgName: 'sprite@2x.png',
			//retinaImgPath: '../' + path.core.images + "/sprite@2x.png"
		}));
	spriteData.img.pipe(gulp.dest(path.app.images));
	spriteData.css.pipe(gulp.dest(path.less.root));
});

gulp.task('svg-sprite', function () {
	
});

/**
 * Наблюдение за файлами html
 */
gulp.task('html', function () {
	gulp.src('').pipe(connect.reload());
});

/**
 * Наблюдение за картинками
 */
gulp.task('img', function () {
	gulp.src(path.app.images).pipe(connect.reload());
});

/**
 * Оптимизиция картинок
 */
gulp.task('images', function () {
	gulp.src([path.app.images + '/**/*.jpg', path.app.images + '/**/*.png', path.app.images + '/**/*.jpeg'])
		.pipe(imageop({
			optimizationLevel: 7,
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest(path.app.images));
});

/**
 * Наблюдение за всеми файлами
 */
gulp.task('watch', function () {
	gulp.watch(path.less.root + '/**/*.*', ['css']);
	gulp.watch([path.js.jqueryPlugins + '/**/*.*', path.js.jqueryModules + '/**/*.*', path.js.major + '/**/*.*'], ['script']);
	gulp.watch([path.app.root + '/**/*.html'], ['html']);
	gulp.watch([path.app.images + "/sprite/*.*"], ['sprite', 'css']);
});

/**
 * Production
 */
gulp.task('prod', function () {
	gulp.src(path.app.css + '/' + names.css.main)
		.pipe(autoprefixer('last 2 versions', '> fancybox%', 'ie 9'))
		.pipe(stripComments())
		.pipe(emptyLines())
		//.pipe(cleanCSS())
		//.pipe(rename(names.css.mainMin))
		.pipe(gulp.dest(path.app.css));

	/*gulp.src(path.app.js + '/' + names.js.app)
		.pipe(uglify())
		.pipe(rename(names.js.appMin))
		.pipe(gulp.dest(path.app.js));*/
});

/**
 * DEFAULT
 */
gulp.task('default', ['connect', 'css', 'script', 'sprite', 'watch']);