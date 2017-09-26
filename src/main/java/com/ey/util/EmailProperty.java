package com.ey.util;

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import java.util.logging.Logger;

public class EmailProperty  {
    private static final String propertyFileName = "emailNotification.properties";
    private static Properties property;
	private static final Logger log = Logger.getLogger(EmailProperty.class.getName());

    public static Properties getProperties() throws PropertyNotFoundException{
    	log.info("inside get EmailProperty method");

        InputStream inputStream =  EmailProperty.class.getResourceAsStream("/" + propertyFileName);
        if (inputStream == null){
        	log.severe("input stream null");
            throw new PropertyNotFoundException("Unable to load property file: " + propertyFileName);
        }
        //singleton
        if(property == null){
        	property = new Properties();
            try {
            	property.load(inputStream);
            } catch (IOException e) {
                throw new PropertyNotFoundException("Unable to load property file: " + propertyFileName + "\n" + e.getMessage());
            }           
        }
        return property;
    }

    public static String getProperty(String query) throws PropertyNotFoundException{
        return getProperties().getProperty(query);
    }

}
