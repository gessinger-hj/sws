/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:10:06
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-04-18 15:54:38
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
      rb.addHeader ( "Authorization-Token", jwt.getToken() ) ;
    }
    Request request = rb.url(uri)
                      .post(body)
                      .build()
                      ;
    Response response = client.newCall(request).execute();
    String token = response.header ( "Authorization-Token" ) ;
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
    String uid = Util.getProperty ( "uid", "Miller" ) ;
    String pwd = Util.getProperty ( "pwd", "654321" ) ;
    try
    {
      ConnectionProxy cp = new ConnectionProxy ( "http://localhost:3000" ) ;
      Event e = cp.login ( uid, pwd ) ;
      System.out.println(e);
      Event e_request_select_inventory = new Event ( "DB:REQUEST" ) ;
      e_request_select_inventory.putValue ( "REQUEST/select/table", "t_inventory" ) ;
      e_request_select_inventory.putValue ( "REQUEST/select/columns", new String[] { "*" } ) ;
      Event e_result_select_inventory = cp.post ( e_request_select_inventory ) ;
System.out.println ( e_result_select_inventory );
      ArrayList<Map<String,Object>> rows = (ArrayList<Map<String,Object>>) e_result_select_inventory.getValue ( "RESULT" ) ;
      System.out.println (  Util.toString ( rows ) ) ;
    }
    catch ( Throwable exc )
    {
      exc.printStackTrace() ;
    }
  }
}