/*
* @Author: Hans Jürgen Gessinger
* @Date:   2016-04-11 22:48:54
* @Last Modified by:   gess
* Last Modified time: 2017-05-10 16:25:51
*/
package org.gessinger.sws.test ;

import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;

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
    String url = Util.getProperty ( "url", "http:/roma:3000" ) ;c
    String response = example.run( url );
    System.out.println(response);
  }
}