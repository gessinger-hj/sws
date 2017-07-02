#!/usr/bin/env node

/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:04:24
* @Last Modified by:   gess
* Last Modified time: 2017-05-09 22:22:49
*/

'use strict';

var gepard     = require ( "gepard" ) ;
var HttpStatus = require ( "http-status" ) ;
var JSAcc      = gepard.JSAcc ;
var Log        = gepard.LogFile;
var accessLog  = Log.createInstance() ;
var gbase      = require ( "gbase" ) ;
var fs         = require ( "fs" ) ;
var Path       = require ( "path" ) ;

var express = require('express') ;

function usage ( text )
{
  if ( text )
  {
    console.log(text);
  }
  console.log (
    "GEDCOMHttpServices, handle AppRequests.\n"
  + "Usage: node GEDCOMHttpServices --gedcomsrc=<dir of files>\n"
  + "       Services: getGEDCOMList\n"
  ) ;
  process.exit() ;
}

Log.init ( "level=info,Xedirect=3,file=%GEPARD_LOG%/%APPNAME%.log:max=1m:v=4") ;
accessLog.init ( "file=%GEPARD_LOG%/%APPNAME%.access-%DATE%.log" ) ;

var app = express()

let gedcomDir = new gbase.File ( gepard.getProperty ( "gedcomsrc" ) ) ;
if ( ! gedcomDir.isDirectory() )
{
  usage ( "Not a directory: " + gedcomDir ) ;
}
gedcomDir = gedcomDir.getAbsoluteFile() ;

app.get ( '/', (req, res) =>
{
  res.set ({
    'Content-Type': 'application/json'
  }) ;

  res.status ( HttpStatus.OK ) ;
  res.set (  'Content-Type', 'application/json' ) ;
  res.json ( { Hello: 'World' } ) ;
}) ;
app.post ( '/', ( req, res) =>
{
  var buf = new Buffer('') ;
  req.on ( 'data', chunk => { buf = Buffer.concat ( [ buf, chunk ] ) } ) ;
  req.on ( 'end', function()
  {
    var body = buf.toString ( 'utf8' ) ;
    var e = gepard.Event.prototype.deserialize ( body ) ;
    var topic = e.getName() ;
    var u     = e.getUser() ;
    let joe   = new JSAcc ( e.getBody() ) ;

console.log(e.toString())
    if ( topic === "getGEDCOMList" )
    {
      getGEDCOMList ( req, res, e )
    }
    if ( topic === "getGEDCOMData" )
    {
      getGEDCOMData ( req, res, e )
    }
  }) ;
}) ;
let getGEDCOMList = function ( req, res, e )
{
  let list = gedcomDir.ls ( "*.ged" ) ;
  if ( !list.length )
  {
    e.setStatus ( -1, "Warning", "No entries found" ) ;
    e.control.plang = "JavaScript" ;
    res.status ( HttpStatus.INTERNAL_SERVER_ERROR ) ;
    res.set (  'Content-Type', 'application/json' ) ;
    res.send ( e.serialize() ) ;
    return ;
  }
  else
  {
    let nulist = [] ;
    for ( let i = 0 ; i < list.length ; i++ )
    {
      let path = list[i] ;
      nulist.push ( { path: path, name:Path.basename ( path ) } ) ;
    }
    e.body.gedcomList = nulist ;
    e.setStatus ( 0, "success" ) ;
    e.control.plang = "JavaScript" ;
    res.status ( HttpStatus.OK ) ;
    res.set (  'Content-Type', 'application/json' ) ;
    res.send ( e.serialize() ) ;
  }
};
let getGEDCOMData = function ( req, res, e )
{
  let path = e.getType() ;
  let file = new gbase.File ( path ) ;
  if ( !file.exists() )
  {
    e.setStatus ( -1, "Warning", "File does not exist" ) ;
    e.control.plang = "JavaScript" ;
    res.status ( HttpStatus.INTERNAL_SERVER_ERROR ) ;
    res.set (  'Content-Type', 'application/json' ) ;
    res.send ( e.serialize() ) ;
    return ;
  }
  else
  {
    e.body.gedcomText = file.getString() ;
    e.setStatus ( 0, "success" ) ;
    e.control.plang = "JavaScript" ;
    res.status ( HttpStatus.OK ) ;
    res.set (  'Content-Type', 'application/json' ) ;
    res.send ( e.serialize() ) ;
  }
};

var port = 3000 ;
app.listen ( port, () => {
  Log.log ( "Startet with\n  port=" + port + "\n  log=" + Log._fileName + "\n" ) ;
} ) ;
