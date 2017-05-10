/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 23:10:06
* @Last Modified by:   gess
* @Last Modified time: 2017-05-09 18:57:17
*/

package org.gessinger.sws.test ;

import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;

import java.io.IOException;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.Headers ;

public class OkHttpPost
{
  public static final MediaType JSON
      = MediaType.parse("application/json; charset=utf-8");

  OkHttpClient client = new OkHttpClient();

  String post(String url, String json) throws IOException {
    RequestBody body = RequestBody.create(JSON, json);
    Request request = new Request.Builder()
        .url(url)
        .post(body)
        .build();
    Response response = client.newCall(request).execute();
    Headers headers = response.headers() ;
    System.out.println ( headers );
    return response.body().string();
  }

  String bowlingJson(String player1, String player2) {
    // Event e = new Event ( "login" ) ;
    // User u = new User
    return "{\"winCondition\":\"HIGH_SCORE\","
        + "\"name\":\"Bowling\","
        + "\"round\":4,"
        + "\"lastSaved\":1367702411696,"
        + "\"dateStarted\":1367702378785,"
        + "\"players\":["
        + "{\"name\":\"" + player1 + "\",\"history\":[10,8,6,7,8],\"color\":-13388315,\"total\":39},"
        + "{\"name\":\"" + player2 + "\",\"history\":[6,10,5,10,10],\"color\":-48060,\"total\":41}"
        + "]}";
  }

  public static void main(String[] args) throws IOException {
    OkHttpPost example = new OkHttpPost();
    String json = example.bowlingJson("Jesse", "Jake");
    String url = Util.getProperty ( "url", "http://roma:3000" ) ;
    String response = example.post( url, json );
    System.out.println(response);
  }
}