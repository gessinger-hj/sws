/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 22:48:54
* @Last Modified by:   Hans Jürgen Gessinger
* @Last Modified time: 2016-04-11 23:07:27
*/
package org.gessinger.sws.test ;

import java.io.IOException;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;

public class OkHttpGet
{
  OkHttpClient client = new OkHttpClient();

  String run ( String url )
  throws IOException
  {
    Request request = new Request.Builder()
        .url(url)
        .build()
        ;

    Response response = client.newCall(request).execute();
    return response.body().string();
  }

  public static void main ( String[] args )
  throws IOException
  {
    OkHttpGet example = new OkHttpGet();
    // String response = example.run("https://raw.github.com/square/okhttp/master/README.md");
    String response = example.run( "http://localhost:3000" );
    System.out.println(response);
  }
}