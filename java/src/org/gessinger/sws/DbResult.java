		/*
* @Author: gess
* @Date:   2016-06-29 19:54:35
* @Last Modified by:   gess
* @Last Modified time: 2016-07-07 15:19:21
*/

package org.gessinger.sws ;
import org.gessinger.gepard.* ;
import org.gessinger.nutil.* ;
import java.util.* ;

public class DbResult
{
  Map<String,Object> m  ;
  JSAcc joe ;
	Map<String,String> attributes ;
	ArrayList<Map<String,Object>> resultList ;
  /**
   * { constructor_description }
   */
  public DbResult ( Map<String,Object> m )
  {
  	this.m = m ;
  	joe = new JSAcc ( m ) ;
  	attributes = (Map<String,String>)joe.value ( "attributes" ) ;
  	if ( attributes == null )
  	{
  		attributes = (Map<String,String>)joe.add ( "attributes" ) ;
  	}
  	resultList = (ArrayList<Map<String,Object>>)joe.value ( "resultList", new ArrayList() ) ;
  }
  public DbResult ( Event e )
  {
    m = (Map<String,Object>) e.getValue ( "RESULT" ) ;
  	joe = new JSAcc ( m ) ;
  	attributes = (Map<String,String>)joe.value ( "attributes" ) ;
  	resultList = (ArrayList<Map<String,Object>>)joe.value ( "resultList", new ArrayList() ) ;
	}
	public String toString()
  {
  	return "(" + getClass().getName() + ")\n[" + Util.toString ( m ) + "\n]" ;	
  }
  public Map<String,Object> getMap()
  {
  	return m ;
  }
  public List<Map<String,Object>> getResultList()
  {
  	return resultList ;
  }
  public List<Map<String,Object>> getRows()
  {
  	if ( resultList.isEmpty() )
  	{
  		return new ArrayList<Map<String,Object>>() ;
  	}
  	return (List<Map<String,Object>>)resultList.get ( 0 ).get ( "rows" ) ;
  }
  public List<Map<String,Object>> getRows ( String operationName )
  {
  	for ( Map<String,Object> op : resultList )
  	{
  		String name = (String) op.get ( "name" ) ;
  		List<Map<String,Object>> rows = (List<Map<String,Object>>) op.get ( "rows" ) ;
  		if ( name.equals ( operationName ) )
  		{
  			return rows ;	
  		}
  	}
  	return new ArrayList<Map<String,Object>>() ;
  }
  public List<Map<String,Object>> getRows ( int index )
  {
  	Map<String,Object> op = resultList.get ( index ) ;
 		List<Map<String,Object>> rows = (List<Map<String,Object>>) op.get ( "rows" ) ;
  	return rows ;
  }
}