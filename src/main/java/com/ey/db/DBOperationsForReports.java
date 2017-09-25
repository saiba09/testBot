package com.ey.db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.logging.Logger;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.ey.util.Queries;

public class DBOperationsForReports {

	private static final Logger log = Logger.getLogger(DBOperationsForReports.class.getName());

	public static String getChatReport(String startDate, String endDate){
		log.info("Inside logEventIntoDB");
		
		Connection connection = ConnectionService.getConnection();
		
		JSONObject responseJson = new JSONObject();
		JSONArray data = new JSONArray();
		
		try{
			PreparedStatement statement = connection.prepareStatement(Queries.getQuery("queryToFetchChatReport"));
			
			//SET PARAMETERS
			statement.setString(1, startDate);
			statement.setString(2, endDate);
			
			//EXECUTE QUERY TO INSERT EVENT LOG
			ResultSet result = statement.executeQuery();
			
			while(result.next()){
				
				JSONObject rowData = new JSONObject();
								
				rowData.put("username", result.getString("Username"));
				rowData.put("email", result.getString("Email"));
				rowData.put("chatEntry", result.getString("Chat_entry"));
				rowData.put("timestamp", result.getString("Timestamp"));
				rowData.put("emailSupportProvided", "NO");
				
				PreparedStatement statement2 = connection.prepareStatement(Queries.getQuery("isEmailSupportProvided"));

				//SET PARAMETERS
				statement2.setString(1, result.getString("Chat_entry"));
				statement2.setInt(2, result.getInt("Chat_session_ID"));
				
				ResultSet result2 = statement2.executeQuery();
				
				if(result2.next()){
					if(result2.getInt("count") != 0)
						rowData.put("emailSupportProvided", "YES");
				}
				
				
				data.add(rowData);
				
				result2.close();
				statement2.close();
			}
			
			responseJson.put("data", data);
			
			//CLOSE DB PARAMETERS 
			result.close();
			statement.close();
			
		}
		catch(SQLException e){
			log.info("Error in getChatReport : "+e);
		}
		finally{
			ConnectionService.closeConnection();
		}
		
		return responseJson.toJSONString();
	}

	public static String getChatReportByUser(String startDate, String endDate) {
		log.info("Inside getChatReportByUser");
		
		Connection connection = ConnectionService.getConnection();
		
		JSONObject responseJson = new JSONObject();
		JSONArray data = new JSONArray();
		
		try{
			PreparedStatement statement = connection.prepareStatement(Queries.getQuery("queryToFetchChatReportByUsers"));
			
			//SET PARAMETERS
			statement.setString(1, startDate);
			statement.setString(2, endDate);
			
			//EXECUTE QUERY TO INSERT EVENT LOG
			ResultSet result = statement.executeQuery();
			
			while(result.next()){
				
				JSONObject rowData = new JSONObject();
								
				rowData.put("numberOfQueries", result.getString("NumberOfQueries"));
				rowData.put("userID", result.getString("User_ID"));
				rowData.put("username", result.getString("Username"));
				
				data.add(rowData);
			}
			
			responseJson.put("data", data);
			
			//CLOSE DB PARAMETERS 
			result.close();
			statement.close();
			
		}
		catch(SQLException e){
			log.info("Error in getChatReportByUser : "+e);
		}
		finally{
			ConnectionService.closeConnection();
		}
		
		return responseJson.toJSONString();
	}

	public static String getChatReportByQuires(String startDate, String endDate) {
		
		log.info("Inside getChatReportByQuires");
		
		Connection connection = ConnectionService.getConnection();
		
		JSONObject responseJson = new JSONObject();
		JSONArray data = new JSONArray();
		
		try{
			PreparedStatement statement = connection.prepareStatement(Queries.getQuery("queryToFetchChatReportByQueries"));
			
			//SET PARAMETERS
			statement.setString(1, startDate);
			statement.setString(2, endDate);
			
			//EXECUTE QUERY TO INSERT EVENT LOG
			ResultSet result = statement.executeQuery();
			
			while(result.next()){
				
				JSONObject rowData = new JSONObject();
								
				rowData.put("numberOfQueries", result.getString("NumberOfQueries"));
				rowData.put("sub_topic_name", result.getString("sub_topic_name"));
				rowData.put("sub_topic_id", result.getString("sub_topic_id"));
				
				data.add(rowData);
			}
			
			responseJson.put("data", data);
			
			//CLOSE DB PARAMETERS 
			result.close();
			statement.close();
			
		}
		catch(SQLException e){
			log.info("Error in getChatReportByQuires : "+e);
		}
		finally{
			ConnectionService.closeConnection();
		}
		
		return responseJson.toJSONString();
	}
	
}
