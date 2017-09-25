package com.ey.admin;

import java.io.IOException;
import java.util.TreeMap;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

import com.ey.db.DbOperation;


/**
 * Servlet implementation class FetchList
 */
@WebServlet("/fetchList")
public class FetchList extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(FetchList.class.getName());

    
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		log.info("Inside FetchList");
	
		try {
			String token = request.getParameter("token").toString().trim();// token parameter is used to decide action
			log.info("token paramter : " + token);
			switch (token) {
			case "country": // token = 1 implies return list of countries
				response.getWriter().write(getCountries());
				break;
			case "state":
				int countryId = Integer.parseInt(request.getParameter("countryId").toString()); //token = 2 implies return list of states for given countryId
				log.info("countryId fetched : "+ countryId);
				response.getWriter().write(getStates(countryId));
				break;
			
			default:
				break;
			}
					
		} catch (Exception e) {
			log.info("Exception in FetchList :"+e);
		}
		
	
	}
	//Method to create JSON for country list response 
		private String getCountries() {	
			TreeMap<String,Integer> countryList = DbOperation.getCountryList();
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
		private String getStates(int countryId) {
			TreeMap<String, Integer> stateList = DbOperation.getStateList(countryId);
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
