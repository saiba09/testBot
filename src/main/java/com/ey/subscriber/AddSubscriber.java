package com.ey.subscriber;

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
import com.ey.eventmanagement.EventLogger;
import com.ey.eventmanagement.EventName;
import com.ey.util.ReadParameters;
/**
 * Servlet implementation class AddSubscriber
 */
public class AddSubscriber extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(AddSubscriber.class
			.getName());
	private String status = "ACTIVE";
	private String characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	HttpSession session = null;

	protected void doPost(HttpServletRequest request,
			HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		String responseJson = ReadParameters.readPostParameter(request);
		response.setContentType("application/json");
		session = request.getSession(false);
		JSONParser parser = new JSONParser();

		try {
			JSONObject jsonResponseObject = (JSONObject) parser
					.parse(responseJson);

			String username = jsonResponseObject.get("username").toString();
			String email = jsonResponseObject.get("email").toString();
			boolean isadmin = Boolean.parseBoolean(jsonResponseObject.get(
					"isadmin").toString());
			String encryptedPassword = null;
			if (isadmin) {
				String password = RandomStringUtils.random(9, characters);
				log.info("password :"+password);
				encryptedPassword = EncryptDecrypt.encrypt(password);
			}
			HttpSession session = request.getSession(false);
			//int userId = (int)session.getAttribute("userId");
			//log.info("userId in session :"+userId);
			response.getWriter().write(
					addSubscriber(username, email, encryptedPassword, status,
							isadmin));

		} catch (ParseException e) {
			log.severe("SQL Exception in add subscriber");
		} catch (Exception e) {
			log.severe("Exception in add subscriber");
		}
	}

	private String addSubscriber(String username, String email,
			String password, String status, boolean isadmin) {
		String response = "";
		int result = DbOperation.addSubscriber(username, email, password,
				isadmin, status);
		log.info("result in add subscriber :" + result);

		if(result == 1)
		{
			log.info("user id in session :"+(int)session.getAttribute("userId"));
			EventLogger.logEvent("New Subscriber Added", EventName.CREATE_USER, (int)session.getAttribute("userId"));
		}
		response = getResponseJson(result);
		log.info("Response : " + response);

		return response;
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
