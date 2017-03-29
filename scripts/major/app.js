;(function (window, undefined) {
	var modules = {};
	
	window.app = {
		local: true,
		props: {},
		methods: {},
		
		addModule: function (moduleName, fn, call) {
			call = call || false;

			if (modules[moduleName]) {
				throw {
 				    message: 'Module exists'
 			    };
			}
			
			modules[moduleName] = fn;
			
			if (call == true) {
				app.callModule(moduleName);
			}
		},
		callModule: function (moduleName) {
			if (typeof modules[moduleName]['init'] == 'function') {
				try {
					modules[moduleName]['init']();
				}
				catch(e) {
					if (app.local) {
						console.error(e.message);
					}
				}
			}
		},
		modulesInit: function () {
			for (var moduleName in modules) {
				try {
					window[moduleName] = new modules[moduleName]() || {};
					modules[moduleName] = window[moduleName];
				}
				catch(e) {
					if (app.local) {
						console.error(e.message);
					}
				}
			}
		},
		getModules: function () {
			return modules;
		}
	};
})(window, undefined);

app.methods.inBlock = function ($block, offset) {
	var blockTop = $block.offset().top, 
		blockHeight = $block.innerHeight(), 
		scrollTop = $(window).scrollTop(), 
		windowHeight = $(window).height();
	
	offset = offset || 0;
	
	return !!(scrollTop >= (blockTop - windowHeight + offset)
			&& scrollTop < blockTop + blockHeight);
};

app.props.adaptive = {
	desktop: 1170,
	tablet: 769,
	mobile: 481
};