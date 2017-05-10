/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:10:06
* @Last Modified by:   gess
* @Last Modified time: 2017-05-09 22:22:30
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

  public static void main(String[] args) throws Exception {
    OkHttpLogin example = new OkHttpLogin();
    Event eRequest = new Event ( "login" ) ;
    User u = new User ( "Miller", -1, "654321" ) ;
    eRequest.setUser ( u ) ;
    System.out.println ( "--------------------- Request -------------------" ) ;
    System.out.println ( eRequest ) ;
    String json = eRequest.toJSON() ;
    String url = Util.getProperty ( "url", "http:/roma:3000" ) + "/login" ;
    String response = example.post( url, json );
    Event eResponse = Event.fromJSON ( response ) ;
    System.out.println ( "--------------------- Result -------------------" ) ;
    System.out.println(eResponse);
    System.out.println(example.jwt);
  }
}