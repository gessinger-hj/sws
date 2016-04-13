#!/usr/bin/env node

/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:04:24
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-04-11 23:28:24
*/

'use strict';

var express = require('express')
var app = express()

app.get ( '/', (req, res) =>
{
  res.send('Hello World')
}) ;
app.post ( '/', ( request, res) =>
{
	var buf = new Buffer('') ;
	request.on ( 'data', chunk => { buf = Buffer.concat ( [ buf, chunk ] ) } ) ;
	request.on ( 'end', function()
	{
  	var body = buf.toString ( 'utf8' ) ;
  	console.log ( body ) ;
  	var json = JSON.parse ( body ) ;
  	console.log ( json ) ;
  	res.send('XXXXXXXXXXHello World')
	});
}) ;

app.listen(3000)