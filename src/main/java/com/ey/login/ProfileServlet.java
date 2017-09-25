package com.ey.login;

import java.io.IOException;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.RandomStringUtils;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import com.ey.db.DbOperation;
import com.ey.subscriber.EncryptDecrypt;
import com.ey.util.ReadParameters;


/**
 * Servlet implementation class ProfileServlet
 */
public class ProfileServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(ProfileServlet.class
			.getName());
	
    protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("inside get method profile page");
		int userId = Integer.parseInt(request.getParameter("userId"));
		response.getWriter().write(DbOperation.getUserProfile(userId));
	}

	protected void doPut(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		log.info("inside post method profile page");
		HttpSession session = request.getSession(false);
		JSONParser parser = new JSONParser();
		String responseJson = ReadParameters.readPostParameter(request);
		String username,email,password = null;
		int userId;
		boolean isadmin;
		try {
			JSONObject jsonResponseObject = (JSONObject) parser
					.parse(responseJson);

			username = jsonResponseObject.get("username").toString();
			email = jsonResponseObject.get("email").toString();
			userId = Integer.parseInt(jsonResponseObject.get("userId").toString());
			isadmin = Boolean.parseBoolean(jsonResponseObject.get("isadmin").toString());
			if(isadmin){
				password = jsonResponseObject.get("password").toString();
				log.info("changed password :"+password);
				password = EncryptDecrypt.encrypt(password);
			}
			response.getWriter().write(getResponseJson(DbOperation.modifyUserProfile(userId, username, email, password, isadmin)));
		} catch (ParseException e) {
			log.severe("SQL Exception in add subscriber");
		} catch (Exception e) {
			log.severe("Exception in add subscriber");
		}
	}
	
	private static String getResponseJson(int result) {

		String response;
		if (result == 1) {
			response = " {  \"status\": {    \"code\": 200,    \"errorType\": \"Success\"  }}";

		} else if (result == -2) {
			response = " {  \"status\": {    \"code\": 201,    \"errorType\": \"ExistingMailID\"  }}";
		} else {
			response = " {  \"status\": {    \"code\": 400,    \"errorType\": \"Request Failed\"  }}";
		}
		return response;
	}
}
