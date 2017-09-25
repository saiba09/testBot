package com.ey.admin;

import java.io.IOException;
import java.util.HashMap;
import java.util.TreeMap;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;

import com.ey.db.*;
import com.ey.util.ReadParameters;

public class ManageGeo extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(ManageGeo.class.getName());

	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		String requestJson  = ReadParameters.readPostParameter(request);
		JSONParser parser = new JSONParser();
		log.info("Inside ManageGeo");
		
		try {
			JSONObject requestObject = (JSONObject) parser.parse(requestJson);
			int token = Integer.parseInt(requestObject.get("token").toString()); // token parameter is used to decide action
			int topicId = Integer.parseInt(requestObject.get("topicId").toString());
			int subTopicId = Integer.parseInt(requestObject.get("subTopicId").toString());
			log.info("topic : "+topicId +" subTopic : " +subTopicId);
			log.info("token paramter : " + token);
			switch (token) {
			case 1: // token = 1 implies return list of countries
				response.getWriter().write(getCountries(subTopicId,topicId));
				break;
			case 2:
				int countryId = Integer.parseInt(requestObject.get("countryId").toString()); //token = 2 implies return list of states for given countryId
				log.info("countryId fetched : "+ countryId);
				response.getWriter().write(getStates(countryId,subTopicId,topicId));
				break;
			case 3: //token = 3 implies return law description for given stateId, topicId & subTopicId
				int stateId = Integer.parseInt(requestObject.get("stateId").toString());
				log.info("topicId : " + topicId + " subTopicId : "+subTopicId+ "  stateId : "+stateId);
				response.setContentType("text/html; charset=UTF-8");
				response.getWriter().write(getLawDescription(subTopicId ,stateId,topicId));
				break;
			default:
				break;
			}
					
		} catch (Exception e) {
			log.info("Exception in ManageGeo :"+e);
		}
		
	}

	private String getLawDescription(int subTopicId, int stateId, int topicId) {
		String res = "{ }";
		JSONObject response = DbOperation.getResponse(subTopicId, stateId);// Method to fetch details from database 
		if (! response.isEmpty()) {
			res = response.toJSONString(); 
		}
		return res;
	}

	@SuppressWarnings("unchecked")
	//Method to create JSON for country list response 
	private String getCountries(int subTopicId , int topicId) {	
		TreeMap<String,Integer> countryList = DbOperation.getCountryList(subTopicId,topicId);
		if (countryList.isEmpty()) {
			return "{\"countries\": [] }";
		}
		JSONObject response = new JSONObject();
		JSONArray reponseArray = new JSONArray();
		for (String country : countryList.keySet()) {
			JSONObject countryDesc = new JSONObject();
			countryDesc.put("country_name", country);
			countryDesc.put("country_id", countryList.get(country));
			reponseArray.add(countryDesc);
		}
		response.put("countries", reponseArray);
		return response.toJSONString();
	}

	@SuppressWarnings("unchecked")
	//Method to create JSON for state list response 
	private String getStates(int countryId , int subTopicId , int topicId) {
		TreeMap<String, Integer> stateList = DbOperation.getStateList(countryId,subTopicId,topicId);
		if (stateList.isEmpty()) {
			return "{\"states\" : [] }";
		}
		JSONObject response = new JSONObject();
		JSONArray reponseArray = new JSONArray();
		for (String state : stateList.keySet()) {
			JSONObject stateDesc = new JSONObject();
			stateDesc.put("state_name", state);	
			stateDesc.put("state_id", stateList.get(state));
			reponseArray.add(stateDesc);
		}
		response.put("states", reponseArray);
		return response.toJSONString();
	}


}
