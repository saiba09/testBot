package com.ey.chatbot;
//https://beta-007-dot-poc-iot.appspot.com/webhook

import java.util.HashMap;
import java.util.logging.Logger;

import com.ey.db.DbOperation;
import com.google.gson.JsonElement;
import com.google.gson.JsonPrimitive;

import ai.api.model.AIOutputContext;
import ai.api.model.Fulfillment;
import ai.api.web.AIWebhookServlet;

@SuppressWarnings("serial")
public class MyWebhookServlet extends AIWebhookServlet  { 
	//https://ai-ml-eychat.appspot.com/webhook  
	private static final Logger log = Logger.getLogger(MyWebhookServlet.class.getName());
	@Override
	protected void doWebhook(AIWebhookRequest input, Fulfillment output) {
		String action = input.getResult().getAction();
		BotHandlerServlet handler = new BotHandlerServlet();
		HashMap<String, JsonElement> parameter = input.getResult().getParameters();
		switch (action) {
		case "compliance_expert_yes":
			log.info("Webhook : compliance_expert_yes");
			output = handler.compilanceExpertYesHandler(output);
			break;
		case "query":
			String topic = parameter.get("topics").toString().replaceAll("^\"|\"$", "");
			String law_scope = parameter.get("law_scope").toString().replaceAll("^\"|\"$", "");
			log.info("Webhook : topic :"+topic + " law scope :"+law_scope);
			output  = getQueryResponse(topic,law_scope.toUpperCase() , output );
			break;
		case "state_laws": 
			topic = parameter.get("topic").toString().replaceAll("^\"|\"$", "");
			String state = parameter.get("state").toString().replaceAll("^\"|\"$", "");
			log.info("Webhook : topic :"+topic + " state :"+state);
			output  = getStateActionResponse(topic,state.toUpperCase() , output );
			break;

		default:
			break;
		}
		//output.setSpeech(input.getResult().toString());

	}
	protected Fulfillment getQueryResponse(String topic , String law_scope , Fulfillment output){
		String response = "" ;
		String responseSpeech = "";
		log.info("inside getQueryResponse");
		if (law_scope.equals("FEDERAL")) {
			try {
				String responseFromDB = DbOperation.getResponse(topic, law_scope, "1");
				if (responseFromDB.isEmpty()) {
					response = "Sorry I didn't found anything on "+ topic;
					responseSpeech = response ;
				}
				else{
				response = "This is what I found about federal law on" + topic+ ". \n" ;
				//response += obj1.get(law_scope).toString();
				response += responseFromDB;
				log.info("responseFromDB : "+responseFromDB);
				responseSpeech = response +  "\n \n This is what I found. Does it help ?";
				response += "\n\nDoes this help?\n :obYes:cb :obNo:cb" ;
				}
				output.setDisplayText(response);
				output.setSpeech(responseSpeech);
				//webhook_res["contextOut"].append({"name":"complaince_expert", "lifespan":2,"parameters":{ "topic": topic} })
				
				AIOutputContext contextOut = new AIOutputContext();
				HashMap<String, JsonElement> outParameters = new HashMap<String , JsonElement>();
				JsonElement contextOutParameter ;
				contextOutParameter = new JsonPrimitive(topic);
				outParameters.put("topic",contextOutParameter );
				contextOut.setLifespan(2);
				contextOut.setName("complaince_expert");
				contextOut.setParameters(outParameters);
				log.info("Context out parameters" + contextOutParameter.toString());
				output.setContextOut(contextOut);


			} catch (Exception e) {
				log.severe("Exception Fetching response from database");
			}
		}
		else if(law_scope.equals("STATE")){
			log.info("Ask for state ? ");
			output.setSpeech("Which state ?");
			output.setDisplayText("Which State ?");
			AIOutputContext contextOut = new AIOutputContext();
			contextOut.setLifespan(5);
			contextOut.setName("state_law");
			HashMap<String, JsonElement> outParameters = new HashMap<String , JsonElement>();
			JsonElement contextOutParameter ;
			contextOutParameter = new JsonPrimitive(topic);
			outParameters.put("topic",contextOutParameter );
			contextOut.setParameters(outParameters);
			log.info("" + contextOut.getLifespan() + " : " + contextOut.getName() );
			output.setContextOut(contextOut);

		}

		return output ;
	}
	protected Fulfillment getStateActionResponse(String topic , String state , Fulfillment output){
		log.info("inside getStateActionResponse");
		String response = "" ;
		String responseSpeech = "";

		AIOutputContext contextOut = new AIOutputContext();
		try {
			String responseFromDB = DbOperation.getResponse(topic, state, "1");
			if (responseFromDB.isEmpty()) {
				response = "Sorry I didn't found anything on "+ topic+ " for "+state ;
				responseSpeech = response;
			}
			else{
			response = "This is what I found on" + topic+ ". \n" ;
			response += responseFromDB ;
			responseSpeech = response  + "\n \n This is what I found. Does it help ?";
			response +=  "\n\nDoes this help?\n :obYes:cb :obNo:cb";
			log.info("responseFromDB : "+responseFromDB);
			}
			output.setDisplayText(response );
			output.setSpeech(response);
			
			//webhook_res["contextOut"].append({"name":"complaince_expert", "lifespan":2,"parameters":{ "topic": topic} })
			HashMap<String, JsonElement> outParameters = new HashMap<String , JsonElement>();
			JsonElement contextOutParameter ;
			contextOutParameter = new JsonPrimitive(topic);
			outParameters.put("topic",contextOutParameter );
			contextOut.setLifespan(2);
			contextOut.setName("complaince_expert");
			contextOut.setParameters(outParameters);
			log.info("" + contextOut.getLifespan() + " : " + contextOut.getName() );
			output.setContextOut(contextOut);

		} catch (Exception e) {
			log.severe("Exception Fetching response from database");
		}
		log.info("sending response from webhook");
		return output ;
	}
	protected Fulfillment compilanceExpertYesHandler(Fulfillment output) {
		// TODO Auto-generated method stub
		output.setDisplayText("You may write your detailed query via email and our compliance expert will get back to you within 3 working days. If your query is urgent in nature then you may opt for urgent response desk and you may receive response within 24 hours. \n\nWould you like to write a query with standard response time?\n :obYes:cb :obNo:cb");
		output.setSpeech("You may write your detailed query via email and our compliance expert will get back to you within 3 working days. If your query is urgent in nature then you may opt for urgent response desk and you may receive response within 24 hours.       Would you like to write a query with standard response time?");
		return output;
	}
}