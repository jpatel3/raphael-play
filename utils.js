function loadModule(modNameOrObject) {
        var src, deps = [];

        if (typeof modNameOrObject === "string") {
            src = urlBase + "utils/" + modNameOrObject + ".js";
            deps = Tuva.moduleDependencies[modNameOrObject] || [];
        } else {
            src = modNameOrObject.src;
        }

        // Return the promise if it exists already
        var selfPromise = modulePromises[src];
        if (selfPromise) {
            return selfPromise;
        } else {
            selfPromise = $.Deferred();
        }

        var depsPromises = [];

        // Load the dependencies
        $.each(deps, function(i, dep) {
            depsPromises.push(loadModule(dep));
        });

        // Load the module once all of the dependencies have been loaded
        $.when.apply($, depsPromises).then(function() {
            Tuva.loadScript(src, function() {
                selfPromise.resolve();
            });
        });

        modulePromises[src] = selfPromise;
        return selfPromise;
    }