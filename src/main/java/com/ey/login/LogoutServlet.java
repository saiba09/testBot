package com.ey.login;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.ey.eventmanagement.EventLogger;
import com.ey.eventmanagement.EventName;
import com.ey.util.ReadParameters;

/**
 * Servlet implementation class LogoutServlet
 */
public class LogoutServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(LoginServlet.class
			.getName());
	
   @Override
   protected void doDelete(HttpServletRequest request, HttpServletResponse response)
		throws ServletException, IOException {
	   	log.info("inside logout method");
		HttpSession session = request.getSession(false);
		String responseJson = ReadParameters.readPostParameter(request);
		JSONParser parser = new JSONParser();
		JSONObject jsonResponseObject=null;
		try {
			jsonResponseObject = (JSONObject) parser
					.parse(responseJson);
			int userId = Integer.parseInt(jsonResponseObject.get("userId").toString());
			EventLogger.logEvent("User Logged Out", EventName.LOGOUT, userId);
			session.setAttribute("userId", null);
			session.setAttribute("username", null);
			session.invalidate();
			session = null;
			response.getWriter().write(getResponseJson(userId));
		} catch (ParseException e) {
			log.info("parse exception in logout");
		}
   }
   
   @SuppressWarnings("unchecked")
   private static String getResponseJson(int result) {

		JSONObject response = new JSONObject();
		JSONObject obj = new JSONObject();
		if (result != -1) {
			obj.put("code", "200");
			obj.put("errorType", "Success");
			response.put("status", obj);
		}else {
			obj.put("code", "400");
			obj.put("errorType", "Request Failed");
			response.put("status", obj);
		}
		return response.toJSONString();
	}
}
