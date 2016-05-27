'use strict';

require('shelljs/global')
const _ = require('lodash')
const fs = require('fs')
const path = require('path')
const rm  = require('rimraf')
const yargs = require('yargs')
const readdir = require('readdir')

const argv = yargs.argv
const ASPECT = 1.779166667
//^^^^^
/*16x9 images */

let DIR = argv.d.toString() || ''
let FORMAT = argv.format || 'jpg'
let RESIZE = argv.r || 64
let FPS = Math.round(25 / (argv.fps || 2))
let PAPERHEIGHT = argv.h || 7016 // 4961 //A3
let PAPERWIDTH = argv.w || 4961 // 3508 //A3




function selectImages(allPaths){
	let _newPaths = []
	allPaths.forEach((p,i)=>{
		if(i % FPS === 0){
			_newPaths.push(p)
		}
	})

	identify(_newPaths[0])
	resizeAllImages(_newPaths)
}

function identify(p){
	let o = exec(`identify ${p} -format "%w x %h"`).stdout
	console.log(o);
}

function resizeAllImages(paths){
	let _outDir = path.join(path.parse(paths[0]).dir, '_out')
	let _newImages = []
	rm(_outDir, ()=>{
		fs.mkdirSync(_outDir)
		paths.forEach((p,i) =>{
			let pr = path.parse(p)
			let b = pr.name + '_r'
			let o = path.join(_outDir, b) + pr.ext
			_newImages.push(o)
			exec(`convert ${p} -resize x${RESIZE} ${o}`)
			console.log(i, paths.length-1);
			if(i === paths.length-1){
				_montage(_outDir)
			}
		})
	})
}

function _montage(outDir){
	let _w = RESIZE * ASPECT
	let _row = Math.ceil(PAPERHEIGHT / RESIZE)
	let _col = Math.ceil(PAPERWIDTH / _w)
	cd(outDir)
	let cmd = `montage *.${FORMAT} -tile ${_col}x${_row} -geometry ${_w}x${RESIZE}+0+0 _OUT.jpg`
	console.log(cmd);
	exec(cmd)
}

selectImages

let _images = readdir.readSync(path.join(__dirname, DIR) , [`*.${FORMAT}`], readdir.ABSOLUTE_PATHS );

selectImages(_images)

