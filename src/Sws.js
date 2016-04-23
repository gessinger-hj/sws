#!/usr/bin/env node

/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:04:24
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-04-22 18:48:22
*/

'use strict';

var gepard     = require ( "gepard" ) ;
var sidds      = require ( "sidds" ) ;
var HttpStatus = require ( "http-status" ) ;
var JSAcc      = gepard.JSAcc ;
var Log        = gepard.LogFile;
var accessLog  = Log.createInstance() ;

var privateKeyFileName = gepard.getProperty ( "pk", gepard.resolve ( "${HOME}/.ssh/id_rsa") ) ;
var publicKeyFileName = gepard.getProperty ( "pem", gepard.resolve ( "${HOME}/.ssh/id_rsa.pem") ) ;

var fs = require ( "fs" ) ;
var privateKey = fs.readFileSync ( privateKeyFileName ) ;
var publicKey = fs.readFileSync ( publicKeyFileName ) ;


var dburl = gepard.getProperty ( "dburl", "mysql://root:luap1997@localhost/sidds" ) ;
var userDB = new sidds.UserDB ( dburl ) ;
var db = new sidds.Database ( dburl ) ;

var express = require('express') ;
var jwt = require('jsonwebtoken');

Log.init ( "level=info,Xedirect=3,file=%GEPARD_LOG%/%APPNAME%.log:max=1m:v=4") ;
accessLog.init ( "file=%GEPARD_LOG%/%APPNAME%.access-%DATE%.log" ) ;

var eee = { className: 'Event',
  name: 'login',
  type: '',
  user: 
   { className: 'User',
     id: 'miller',
     key: 7,
     _pwd: '',
     rights: 
      { CAN_EDIT_USER: 'true',
        CAN_PURCHASE_PRODUCTS: 'true',
        CAN_PURCHASE_GOLD_CARD: 'true' },
     groups: 
      { keys: { AdminGroup: 3, CustomerGroup: 5, KeyAccountCustomerGroup: 6 },
        rights: 
         { AdminGroup: { CAN_EDIT_USER: 'true' },
           CustomerGroup: { CAN_PURCHASE_PRODUCTS: 'true' },
           KeyAccountCustomerGroup: { CAN_PURCHASE_GOLD_CARD: 'true' } } },
     context: '*' },
  control: 
   { createdAt: 'Wed Apr 20 2016 17:34:33 GMT+0200 (CEST)',
     plang: 'Java',
     status: { code: 0, name: 'success', reason: 'verified' } },
  body: {},
  targetIsLocalHost: false } ;

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
app.post ( '/json_test', (req, res) =>
{
  res.set ({
    'Content-Type': 'application/json'
  }) ;
  var buf = new Buffer('') ;
  req.on ( 'data', chunk => { buf = Buffer.concat ( [ buf, chunk ] ) } ) ;
  req.on ( 'end', function()
  {
    var body = buf.toString ( 'utf8' ) ;
    console.log ( body ) ;
    console.log ( req.headers ) ;
    res.status ( HttpStatus.OK ) ;
    res.set (  'Content-Type', 'application/json' ) ;
    jwt.sign ( eee.user, privateKey, { algorithm: 'RS256', expiresIn: '2 days'}, token => {
        res.set (  'Content-Type', 'application/json' ) ;
        res.set (  'x-auth-token', token ) ;
        res.status ( HttpStatus.OK ) ;
        res.json ( eee ) ;
      });
  }) ;
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
      var u = e.getUser() ;
      let joe = new JSAcc ( e.getBody() ) ;
      if ( topic === "DB:REQUEST" )
      {
        var select = joe.value ( "REQUEST/select" ) ;
      }
      db.getConnection ( function ( err, connection )
      {
        if ( err )
        {
          Log.log ( err ) ;
          e.setStatus ( HttpStatus.INTERNAL_SERVER_ERROR, "error", String ( err ) ) ;
          res.status ( HttpStatus.INTERNAL_SERVER_ERROR ) ;
          res.set (  'Content-Type', 'application/json' ) ;
          res.send ( e.serialize() ) ;
          return ;
        }
        var sql = "select * from t_inventory"; 
        this.select ( sql, function ( err, rows )
        {
          if ( err )
          {
            Log.error ( "" + err + " in \n" + sql ) ;
            e.setStatus ( HttpStatus.INTERNAL_SERVER_ERROR, "error", "" + err ) ;
            this.close() ;
            res.status ( HttpStatus.INTERNAL_SERVER_ERROR ) ;
            res.set (  'Content-Type', 'application/json' ) ;
            res.send ( e.serialize() ) ;
            return ;
          }
          else
          {
            this.close() ;
          }
          if ( ! e.body || typeof e.body !== 'object' || Array.isArray ( e.body ) )
          {
            e.body= {} ;
          }
          e.body.RESULT = rows ;
          e.setStatus ( 0, "success" ) ;
          res.set (  'Content-Type', 'application/json' ) ;
          res.status ( HttpStatus.OK ) ;
          e.control.plang = "JavaScript" ;
          res.json ( e ) ;
// gepard.log ( e ) ;
        } ) ;
      });
  // BAD_REQUEST: 400,
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
        return ;
      }
      jwt.sign ( user, privateKey, { algorithm: 'RS256', expiresIn: '2 days'}, token => {
        e.setStatus ( 0, "success", "verified" ) ;
        res.set (  'Content-Type', 'application/json' ) ;
        res.set (  'x-auth-token', token ) ;
        res.status ( HttpStatus.OK ) ;
        res.send ( e.serialize() ) ;
console.log ( e ) ;
      });
    } ) ;
  });
}) ;

var port = 3000 ;
app.listen ( port, () => {
  console.log ( "Startet with\n  port=" + port + "\n  log=" + Log._fileName ) ;
} ) ;
