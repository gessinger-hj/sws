/*
* @Author: gess
* @Date:   2016-06-29 19:54:35
* @Last Modified by:   gess
* @Last Modified time: 2016-07-07 12:59:34
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
  public void putAttribute ( String name, String value )
  {
    attributes.put ( name,value ) ;  
  }
  public String getAttribute ( String name )
  {
    return getAttribute ( name, null ) ;  
  }
  public String getAttribute ( String name, String def )
  {
    String value = attributes.get ( name ) ;
    if ( value == null ) return def ;
    return value ;
  }
  public Map<String,Object> addSelect ( String table )
  {
    return addSelect ( table, null, null, null ) ;
  }
  public Map<String,Object> addSelect ( String table
                                      , List<String> columns
                                      )
  {
    return addSelect ( table, columns, null, null ) ;
  }
  public Map<String,Object> addSelect ( String table
                                      , List<String> columns
                                      , String where
                                      )
  {
    return addSelect ( table, columns, where, null ) ;
  }
  public Map<String,Object> addSelect ( String table
  																		, List<String> columns
  																		, String where
                                      , String[] hostVars
                                      )
  {
    Map<String,Object> operation = new HashMap<String,Object>() ;
    operation.put ( "name", "select" ) ;
    operation.put ( "table", table ) ;
    operation.put ( "where", where ) ;
    operation.put ( "columns", columns ) ;
  	operation.put ( "hostVars", hostVars ) ;
    operationList.add ( operation ) ;
    return operation ;
  }
  public Map<String,Object> addUpdate ( String table
                                      , Map<String,Object> row
                                      , String where
                                      )
  {
    return addUpdate ( table, row, where, null ) ;
  }
  public Map<String,Object> addUpdate ( String table
                                      , Map<String,Object> row
                                      , String where
                                      , String[] hostVars
                                      )
  {
    Map<String,Object> operation = new HashMap<String,Object>() ;
    operation.put ( "name", "update" ) ;
    operation.put ( "table", table ) ;
    operation.put ( "where", where ) ;
    operation.put ( "row", row ) ;
    operation.put ( "hostVars", hostVars ) ;
  	operationList.add ( operation ) ;
  	return operation ;
  }
}