#!/usr/bin/env node

var gepard = require ( "gepard" ) ;
var gbase = require ( "gbase" ) ;
var fs = require ( "fs" ) ;
var Path = require ( "path" ) ;
function usage ( text )
{
	if ( text )
	{
		console.log(text);
	}
	console.log (
		"GEDCOMServices, handle AppRequests.\n"
	+ "Usage: node GEDCOMServices --gedcomsrc=<dir of files>\n"
	+ "       Services: getGEDCOMList\n"
	) ;
	process.exit() ;
}

if ( gepard.getProperty ( "help" ) )
{
	usage() ;
}

new gepard.Admin().isRunning ( function admin_is_running ( state )
{
	if ( ! state )
	{
		console.log ( "Not running on " + this.getHostPort() ) ;
		process.exit ( 1 ) ;
	}
	execute() ;
});
function execute()
{
	let gedcomDir = new gbase.File ( gepard.getProperty ( "gedcomsrc" ) ) ;
	if ( ! gedcomDir.isDirectory() )
	{
		usage ( "Not a directory: " + gedcomDir ) ;
	}
	gedcomDir = gedcomDir.getAbsoluteFile() ;
	var c = gepard.getClient() ;
	c.on ( "getGEDCOMList", e =>
	{
		let list = gedcomDir.ls ( "*.ged" ) ;
		if ( !list.length )
		{
			e.setStatus ( -1, "Warning", "No entries found" ) ;
		}
		else
		{
			let nulist = [] ;
			for ( let i = 0 ; i < list.length ; i++ )
			{
				let path = list[i] ;
				let title = Path.basename ( path, ".ged" ).replace ( /\+/g, " " ) ;
				nulist.push ( { path: path, name:Path.basename ( path ), title: title } ) ;
			}
			e.body.gedcomList = nulist ;
		}
		e.sendBack() ;
	});
	c.on ( "getGEDCOMData", e =>
	{
		let path = e.getType() ;
		let file = new gbase.File ( path ) ;
		if ( !file.exists() )
		{
			e.setStatus ( -1, "Warning", "File does not exist" ) ;
		}
		else
		{
			e.body.gedcomText = file.getString() ;
		}
		e.sendBack() ;
	});
	c.on('end', function()
	{
		console.log('socket disconnected');
	});
	c.on('shutdown', function()
	{
		console.log('broker shut down');
	});
}
