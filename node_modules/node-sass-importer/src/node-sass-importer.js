var fs = require('fs');

/**
 * Resolve given path into real path
 *
 * @param path
 * @return {String}
 */
function normalizePath(path) {
    try {
        path = fs.realpathSync(path).replace(/[\\\/]+/g, '/');
    } catch (e) {
        path = path.replace(/[\\\/]+/g, '/');
    }
    return path;
}

/**
 * Resolve given URL
 *
 * @param {String} url
 * @param {String} context
 * @param {Object} runtime
 */
function resolveImport(url, context, runtime) {
    var resolved = undefined;
    runtime.options.roots.forEach(function (root) {
        runtime.options.paths.forEach(function (path) {
            runtime.options.filePrefixes.forEach(function (filePrefix) {
                runtime.options.fileExtensions.forEach(function (fileExtension) {
                    if (resolved === undefined) {
                        var local = url.split('/');
                        var fn = local.pop();
                        fn = filePrefix + fn + fileExtension;
                        local.push(fn);
                        local = [context, root, path, local.join('/')].join('/').replace(/\{url}/g, url).replace(/[\\\/]+/g, '/');
                        try {
                            local = normalizePath(local);
                            var lstat = fs.lstatSync(local);
                            if (lstat.isFile()) {
                                var lc = local;
                                lc = lc.split('/');
                                lc.pop();
                                lc = lc.join('/');
                                var contents = '';
                                if (runtime.loaded.indexOf(local) === -1) {
                                    contents = fs.readFileSync(local).toString();
                                }
                                resolved = {
                                    context: lc,
                                    path: local,
                                    contents: contents
                                };
                            }
                        } catch (e) {
                            if (e.code !== 'ENOENT') {
                                console.log(e.message);
                            }
                        }
                    }
                })
            })
        });
    });
    return resolved;
}

function getRuntime(context) {
    var runtime;
    if (context.options.importerRuntime === undefined) {
        runtime = {
            options: {
                roots: [''],
                paths: [
                    '',
                    '{url}',
                    '{url}-scss',
                    '{url}/scss'
                ],
                filePrefixes: [
                    '',
                    '_'
                ],
                fileExtensions: [
                    '.scss'
                ]
            },
            stacks: [],
            loaded: []
        };
        for (var key in runtime.options) {
            if (!runtime.options.hasOwnProperty(key)) {
                return;
            }
            if ((context.options.importerOptions || false) && (context.options.importerOptions[key] || false)) {
                var custom = context.options.importerOptions[key];
                if (custom instanceof Array) {
                    custom.forEach(function (v) {
                        if (runtime.options[key].indexOf(v) === -1) {
                            runtime.options[key].push(v);
                        }
                    });
                } else {
                    if (typeof(custom.toString) === 'function') {
                        custom = custom.toString();
                    }
                    custom += '';
                    if (runtime.options[key].indexOf(custom) === -1) {
                        runtime.options[key].push(custom);
                    }
                }
            }
        }
        context.options.importerRuntime = runtime;
    } else {
        runtime = context.options.importerRuntime;
    }
    return runtime;
}

module.exports = function (url, prev, done) {
    var runtime = getRuntime(this);
    var resolved = undefined;
    var stack = undefined;
    while (runtime.stacks.length) {
        var ts = runtime.stacks[runtime.stacks.length - 1];
        if (ts.id === prev) {
            stack = [].concat(ts.stack);
            break;
        } else {
            runtime.stacks.pop();
        }
    }
    if (stack === undefined) {
        runtime.stacks.push({id: prev, stack: [normalizePath(process.cwd())]});
        stack = [].concat(runtime.stacks[runtime.stacks.length - 1].stack);
    }
    do {
        resolved = resolveImport(url, stack[stack.length - 1], runtime);
        if (resolved === undefined) {
            stack.pop();
            continue;
        }
        var stackIndex = stack.indexOf(resolved.context);
        if (stackIndex === -1) {
            stack.push(resolved.context);
        }
        runtime.stacks.push({id: url, stack: stack});
        if (runtime.loaded.indexOf(resolved.path) === -1) {
            runtime.loaded.push(resolved.path);
        }
        break;
    } while (resolved === undefined && stack.length);
    if (resolved !== undefined) {
        var cnt = ((resolved.contents.length) ? resolved.contents : '// ' + url + "\n");
        done({contents: cnt});
    } else {
        done({contents: '@error "Failed to load SCSS include: ' + url + '"'});
    }
};
