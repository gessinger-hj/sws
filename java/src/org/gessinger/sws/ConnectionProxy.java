/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:10:06
* @Last Modified by:   gess
* @Last Modified time: 2016-07-09 14:19:59
*/

package org.gessinger.sws ;
import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;
import java.util.* ;

import java.io.* ;
import okhttp3.* ;

public class ConnectionProxy
{
  public static final MediaType JSON
      = MediaType.parse("application/json; charset=utf-8");

  OkHttpClient client = new OkHttpClient();
  JWT jwt = null ;
  String url ;
  public ConnectionProxy ( String url )
  {
    this.url = url ;
  }
  String post ( String json )
  throws Exception
  {
    return post ( json, null ) ;
  }
  String post ( String json, String urlOffset )
  throws Exception
  {
    String uri = url + ( urlOffset != null ? "/" + urlOffset : "" ) ;
    RequestBody body = RequestBody.create(JSON, json);
    // Request request = new Request.Builder()
    Request.Builder rb = new Request.Builder() ;
    if ( jwt != null )
    {
      rb.addHeader ( "x-auth-token", jwt.getToken() ) ;
    }
    Request request = rb.url(uri)
                      .post(body)
                      .build()
                      ;
    Response response = client.newCall(request).execute();
    String token = response.header ( "x-auth-token" ) ;
    if ( token != null )
    {
      jwt = new JWT ( token ) ;
    }
    return response.body().string();
  }
  public Event post ( Event e )
  throws Exception
  {
    return post ( e, null ) ;
  }
  public Event post ( Event e, String urlOffset )
  throws Exception
  {
    String response = post ( e.toJSON(), urlOffset ) ;
    Event ee = Event.fromJSON ( response ) ;
    return ee ;
  }
  public Event login ( String uid, String pwd )
  throws Exception
  {
    Event e = new Event ( "login" ) ;
    User u = new User ( uid, -1, pwd ) ;
    e.setUser ( u ) ;
    return post ( e, "login" ) ;
  }
  public JWT getJWT()
  {
    return jwt ;  
  }
  public static void main(String[] args)
  {
    Util.argsToProperties ( args ) ;
    String uid = Util.getProperty ( "uid", "dk" ) ;
    String pwd = Util.getProperty ( "pwd", "654321" ) ;
    try
    {
      ConnectionProxy cp = new ConnectionProxy ( "http://roma:3000" ) ;
      Event e = cp.login ( uid, pwd ) ;

      DbRequest req = new DbRequest() ;
      String mode = Util.getProperty ( "mode", "s" ) ;
      if ( mode.indexOf ( 's' ) == 0 )
      {
        req.addSelect ( "t_inventory", null, "inventory_key=?", new String[] { "3" } ) ;
      }
      if ( mode.indexOf ( 'u' ) >= 0 )
      {
        JSAcc joe = new JSAcc() ;
        joe.add ( "miscellaneous", new Date().toString() ) ;
        req.addUpdate ( "t_inventory", joe.map(), "inventory_key=3" ) ;
      }
      if ( mode.indexOf ( 's', 1 ) >= 0 )
      {
        req.addSelect ( "t_inventory", null, "inventory_key=?", new String[] { "3" } ) ;
      }
System.out.println ( req ) ;

      Event e_req = new Event ( "DB:REQUEST" ) ;
      e_req.putValue ( "REQUEST", req.getMap() ) ;
System.out.println ( e_req );
      Event e_res = cp.post ( e_req ) ;
System.out.println ( e_res );
      DbResult res = new DbResult ( e_res ) ;
      // List<Map<String,Object>> rows = res.getRows ( 1 ) ; //"t_inventory" ) ;
      List<Map<String,Object>> rows = res.getRows ( "t_inventory" ) ;
      System.out.println (  Util.toString ( rows ) ) ;
    }
    catch ( Throwable exc )
    {
      exc.printStackTrace() ;
    }
  }
}