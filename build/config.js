({
    baseUrl: "../src",
    mainConfigFile: "../src/config.js",
    wrap: true,
    include: [
        '../bower_components/requirejs/require',
        'config.js'
    ],
    name: "init",
    out: "../build.js",
    stubModules : ['text', 'css'],
    optimizeAllPluginResources: true,
    findNestedDependencies: true,
    removeCombined: false,
    useStrict: true,
    generateSourceMaps: false,
    onBuildWrite   : function (name, path, contents) {
        console.log('Writing: ' + name);

        return contents
    },
    optimize: "uglify2",
    preserveLicenseComments: false
})