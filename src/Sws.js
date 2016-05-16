#!/usr/bin/env node

/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:04:24
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-05-05 14:28:57
*/

'use strict';

var gepard     = require ( "gepard" ) ;
var sidds      = require ( "sidds" ) ;
var DbRequest  = sidds.DbRequest ;
var DbResult   = sidds.DbResult ;
var HttpStatus = require ( "http-status" ) ;
var JSAcc      = gepard.JSAcc ;
var Log        = gepard.LogFile;
var accessLog  = Log.createInstance() ;

var privateKeyFileName = gepard.getProperty ( "pk", gepard.resolve ( "${HOME}/.ssh/id_rsa") ) ;
var publicKeyFileName = gepard.getProperty ( "pem", gepard.resolve ( "${HOME}/.ssh/id_rsa.pem") ) ;

var fs = require ( "fs" ) ;
var privateKey = fs.readFileSync ( privateKeyFileName ) ;
var publicKey = fs.readFileSync ( publicKeyFileName ) ;


var dburl = gepard.getProperty ( "dburl", "mysql://root:luap1997@localhost/inventum" ) ;
var userDB = new sidds.UserDB ( dburl ) ;
var db = new sidds.Database ( dburl ) ;
let conf = {
  operations: {
    "t_inventory": {
      "immutableColumns":
      { "operator_modified":true
      , "created_at":true
      , "last_modified":true
      , "inventory_key":true
      }
    , "select_table": "v_inventory"
    , "update_table": "t_inventory"
    , "delete_table": "t_inventory"
    }
  }
} ;
db.setConfig ( conf ) ;

var express = require('express') ;
var jwt = require('jsonwebtoken');

Log.init ( "level=info,Xedirect=3,file=%GEPARD_LOG%/%APPNAME%.log:max=1m:v=4") ;
accessLog.init ( "file=%GEPARD_LOG%/%APPNAME%.access-%DATE%.log" ) ;

var app = express()

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
    var t = req.header ( "x-auth-token" ) ;
console.log ( req ) ;
    gepard.log ( e ) ;
    {
    // jwt.verify ( t, publicKey, { algorithm: 'RS256' }, ( err, decoded ) => {
    //   if ( err )
    //   {
    //     Log.log ( err ) ;
    //     e.setStatus ( HttpStatus.FORBIDDEN, "error", String ( err ) ) ;
    //     res.status ( HttpStatus.FORBIDDEN ) ;
    //     res.set (  'Content-Type', 'application/json' ) ;
    //     res.send ( e.serialize() ) ;
    //     return ;
    //   }
      var topic = e.getName() ;
      var u     = e.getUser() ;
      let joe   = new JSAcc ( e.getBody() ) ;
      if ( topic === "DB:REQUEST" )
      {
        let request = e.getValue ( "REQUEST" ) ;
        if ( ! request )
        {
          let err = "Missing body.request dataset" ;
          Log.log ( err ) ;
          e.setStatus ( HttpStatus.BAD_REQUEST, "error", String ( err ) ) ;
          res.status ( HttpStatus.BAD_REQUEST ) ;
          res.set (  'Content-Type', 'application/json' ) ;
          res.send ( e.serialize() ) ;
          return ;
        }
        db.executeRequest ( new DbRequest ( request ), ( result ) => {
          if ( result.error )
          {
            Log.log ( result.error ) ;
            e.setStatus ( HttpStatus.INTERNAL_SERVER_ERROR, "error", String ( result.error ) ) ;
            res.status ( HttpStatus.INTERNAL_SERVER_ERROR ) ;
            res.set (  'Content-Type', 'application/json' ) ;
            res.send ( e.serialize() ) ;
            return ;
          }
          // console.log ( result ) ;
          db.commit() ;
          e.setStatus ( 0, "success" ) ;
          // Log.log ( e ) ;
          console.log ( e ) ;
          e.body.RESULT = result ;
          res.set (  'Content-Type', 'application/json' ) ;
          res.status ( HttpStatus.OK ) ;
          e.control.plang = "JavaScript" ;
          res.json ( e ) ;
          // db.disconnect() ;
          db.close() ;
        });
      }
    };
  }) ;
}) ;

app.post ( '/login', (req, res) =>
{
  var buf = new Buffer('') ;
  req.on ( 'data', chunk => { buf = Buffer.concat ( [ buf, chunk ] ) } ) ;
  req.on ( 'end', function()
  {
    var body = buf.toString ( 'utf8' ) ;
    var e = gepard.Event.prototype.deserialize ( body ) ;
    if ( ! e.body || typeof e.body !== 'object' || Array.isArray ( e.body ) )
    {
      e.body= {} ;
    }

    var u = e.getUser() ;
    userDB.verifyUser ( u, ( err, user ) => {
      u._pwd = '' ;
      if ( err )
      {
        e.setStatus ( HttpStatus.FORBIDDEN, "error", String ( err ) ) ;
        res.status ( HttpStatus.FORBIDDEN ) ;
        res.set (  'Content-Type', 'application/json' ) ;
        res.send ( e.serialize() ) ;
        Log.logln ( "" + err + " for id=" + u.id ) ;
        return ;
      }
      jwt.sign ( user, privateKey, { algorithm: 'RS256', expiresIn: '2 days'}, token => {
        e.setStatus ( 0, "success", "verified" ) ;
        res.set (  'Content-Type', 'application/json' ) ;
        res.set (  'x-auth-token', token ) ;
        res.status ( HttpStatus.OK ) ;
        res.send ( e.serialize() ) ;
        Log.logln ( "Logged in id=" + u.id ) ;
      });
    } ) ;
  });
}) ;

var port = 3000 ;
app.listen ( port, () => {
  Log.log ( "Startet with\n  port=" + port + "\n  log=" + Log._fileName + "\n" ) ;
} ) ;
