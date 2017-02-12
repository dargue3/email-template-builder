
# Sass loader once for [webpack](http://webpack.github.io/)

## Install

`npm install sass-loader-once --save-dev`

The sass-loader-once requires [sass-loader](https://github.com/jtangelder/sass-loader) and requires [node-sass-import-once](https://github.com/at-import/node-sass-import-once) and requires [node-sass](https://github.com/sass/node-sass) and [webpack](https://github.com/webpack/webpack)
as [`peerDependency`](https://docs.npmjs.com/files/package.json#peerdependencies). Thus you are able to specify the required versions accurately.

---
## dome
``` js

module.exports = {
	...
	module:{
		loaders:[
			{
                test: /\.scss$/,loader:"css!sass-loader-once"
                
            },
			...
		]

	...
}

```

separate css output file 

``` js

module.exports = {
	...
	module:{
		loaders:[
			{
                test: /\.scss$/,
                loader: ExtractTextPlugin.extract('css!sass-loader-once')
            },
			...
		]

	...
}

```


## License

MIT 
