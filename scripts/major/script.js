jQuery(function () {
	app.modulesInit();
	
	var modules = app.getModules();

	for (var module in modules) {
		app.callModule(module);
	}
});