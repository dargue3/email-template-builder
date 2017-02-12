# node-sass-importer
Simple implementation of custom importer of SCSS files for node-sass. May be useful in a case if your SASS styles includes some third-party libraries and you don't want to hard link paths to them into your code. 

Also it mimics [compass-import-once](https://github.com/Compass/compass/tree/stable/import-once) functionaliy and avoid repetitive loading of SCSS files that are included multiple times into project. 

## Usage
Example usage in Gulp task
```js
gulp.src('*.scss')
    .pipe(sass({
        importer: require('node-sass-importer')
    })
```

## Options
Since importer signature is defined by node-sass itself - additional options are stored into ```importerOptions``` entry within node-sass options set.
Importer tries to locate SCSS files by constructing their paths from given parts. They are:

### roots
Array of additional root paths to search for SCSS files in. Should be defined as relative paths against current directory, main Node process is running from.      
Default: ```['']```     
Possible usage: ```['sass', 'node_modules']```

### paths
Array of additional path components within any of root paths to search SCSS files in. Can contain ```{url}``` placeholder, it will be replaced with value of ```url``` argument that is passed to importer. Possible usage pattern is to let importer to load SCSS files from third-party libraries (e.g. Susy) installed as npm modules.   
Default: ```['', '{url}', '{url}-scss', '{url}/scss']```    

### filePrefixes
Array of prefixes to set before SCSS file name. Normally is not needed to be overridden.   
Default: ```['', '_']```


### fileExtensions
Array of file extension to set after SCSS file name. Normally is not needed to be overridden.   
Default: ```['.scss']```
