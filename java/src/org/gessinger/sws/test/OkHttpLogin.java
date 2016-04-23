/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:10:06
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-04-20 22:56:32
*/

package org.gessinger.sws.test ;
import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;
import java.util.* ;

import java.io.*;
import okhttp3.*;

public class OkHttpLogin
{
  public static final MediaType JSON
      = MediaType.parse("application/json; charset=utf-8");

  OkHttpClient client = new OkHttpClient();
  JWT jwt = null ;
  String post(String url, String json) throws Exception {
    RequestBody body = RequestBody.create(JSON, json);
    Request request = new Request.Builder()
        .url(url)
        .post(body)
        .build();
    Response response = client.newCall(request).execute();
    Headers headers = response.headers() ;
    System.out.println ( headers );
    String token = response.header ( "X-Auth-Token" ) ;
    if ( token != null )
    {
      jwt = new JWT ( token ) ;
    }
    return response.body().string();
  }

  String bowlingJson(String player1, String player2)
  throws Exception
  {
    Event e = new Event ( "login" ) ;
    User u = new User ( "Miller", -1, "654321" ) ;
    e.setUser ( u ) ;
    System.out.println ( e ) ;
    String json = e.toJSON() ;
    return json ;
  }

  public static void main(String[] args) throws Exception {
    OkHttpLogin example = new OkHttpLogin();
    String json = example.bowlingJson("Jesse", "Jake");
    String response = example.post( "http://roma:3000/login", json );
    Event e = Event.fromJSON ( response ) ;
    System.out.println(e);
    System.out.println(example.jwt);
  }
}