package com.ey.login;
import java.io.IOException;

import java.io.PrintWriter;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.ey.db.DbOperation;
import com.ey.eventmanagement.ChatSession;
import com.ey.eventmanagement.EventLogger;
import com.ey.eventmanagement.EventName;
import com.ey.util.ReadParameters;

/**
 * Servlet implementation class Login
 */

public class LoginServlet extends HttpServlet {
	
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(LoginServlet.class
			.getName());
	private String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	
	@Override
	protected void doPost(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		log.info("inside login servlet");
		String responseJson = ReadParameters.readPostParameter(request);
		HttpSession session = request.getSession(false);
		JSONParser parser = new JSONParser();
		JSONObject jsonResponseObject=null;
		boolean isAdmin = false,logEvent=false;
		int userId =-1;
		try {
			jsonResponseObject = (JSONObject) parser
					.parse(responseJson);
			if(jsonResponseObject.containsKey("email"))
			{
				session = request.getSession();
				String email = jsonResponseObject.get("email").toString();
				JSONObject user = DbOperation.isValidEmail(email);
				int result = -1;
				if(user!=null)
				{
					userId = (int) user.get("userId");
					result = userId;
					isAdmin = Boolean.parseBoolean(user.get("isadmin").toString());
					session.setAttribute("userId", userId);
					session.setAttribute("isadmin", isAdmin);
					if(!isAdmin)
						logEvent = true;
				}
				response.getWriter().write(getResponseJson(result,userId,isAdmin));
			}
			else{
				String password = jsonResponseObject.get("password").toString();
				userId = Integer.parseInt(jsonResponseObject.get("userId").toString());
				isAdmin = Boolean.parseBoolean(jsonResponseObject.get("isadmin").toString());
				int result = DbOperation.isValidPassword(userId, password);
				if(result == 1)
					logEvent = true;
				response.getWriter().write(getResponseJson(result,userId,isAdmin));
			}
			if(logEvent){
				int chat_session_id = ChatSession.startSession(userId);
				log.info("chat_Session_id : "+chat_session_id);
				//session.setAttribute("chat_session_id", chat_session_id);
				EventLogger.logEvent("User Logged In", EventName.LOGIN, userId);
			}
		} catch (ParseException e1) {
			log.info("Parse exception in Login controller");
		}
	}
	
	

	private static String getResponseJson(int result, int userId, boolean isadmin) {

		JSONObject response = new JSONObject();
		JSONObject obj = new JSONObject();
		if (result != -1) {
			obj.put("code", "200");
			obj.put("errorType", "Success");
			response.put("status", obj);
			response.put("userId", userId);
			response.put("isadmin", isadmin);
		}else {
			obj.put("code", "400");
			obj.put("errorType", "Request Failed");
			response.put("status", obj);
		}
		return response.toJSONString();
	}
}