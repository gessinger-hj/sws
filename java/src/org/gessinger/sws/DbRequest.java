/*
* @Author: gess
* @Date:   2016-06-29 19:54:35
* @Last Modified by:   gess
* @Last Modified time: 2016-06-30 23:23:53
*/

package org.gessinger.sws ;
import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;
import java.util.* ;

public class DbRequest
{
  Map<String,Object> m = new HashMap<String,Object>() ;
  JSAcc joe = new JSAcc ( m ) ;
	Map<String,String> attributes ;
	ArrayList<Map<String,Object>> operationList ;
  public static void main(String[] args)
  {
  }
  /**
   * { constructor_description }
   */
  public DbRequest()
  {
  	attributes = (Map<String,String>)joe.add ( "attributes" ) ;
  	operationList = (ArrayList<Map<String,Object>>)joe.add ( "operationList", new ArrayList() ) ;
  }
  public String toString()
  {
  	return "(" + getClass().getName() + ")\n[" + Util.toString ( m ) + "\n]" ;	
  }
  public Map<String,Object> getMap()
  {
  	return m ;
  }
  public Map<String,Object> addSelect ( String table
  																		, List<String> columns
  																		, String where
  																		)
  {
  	Map<String,Object> operation = new HashMap<String,Object>() ;
  	operation.put ( "name", "select" ) ;
  	operation.put ( "table", table ) ;
  	operation.put ( "where", where ) ;
  	operation.put ( "columns", columns ) ;
  	operationList.add ( operation ) ;
  	return operation ;
  }
  public Map<String,Object> addUpdare ( String table
  																		, Map<String,Object> row
  																		, String where
  																		)
  {
  	Map<String,Object> operation = new HashMap<String,Object>() ;
  	operation.put ( "name", "update" ) ;
  	operation.put ( "table", table ) ;
  	operation.put ( "where", where ) ;
  	operation.put ( "row", row ) ;
  	operationList.add ( operation ) ;
  	return operation ;
  }
}