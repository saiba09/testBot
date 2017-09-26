package com.ey.admin;

import java.io.IOException;
import java.util.Properties;
import java.util.logging.Logger;

import javax.mail.Authenticator;
import javax.mail.PasswordAuthentication;
import javax.mail.Session;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ey.util.EmailProperty;
import com.ey.util.EmailUtil;
import com.ey.util.PropertyNotFoundException;

/**
 * Servlet implementation class EmailNotification
 */
public class EmailNotification extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private static final Logger log = Logger.getLogger(EmailNotification.class.getName());

	protected void doGet(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		log.info("inside doGet()");
		try{
			final String fromEmail = EmailProperty.getProperty("fromEmail");
			final String password = EmailProperty.getProperty("password");
		String receipent = "akshayMhapankar25@gmail.com";
		String messageType = request.getParameter("subject");
		String messageBody = request.getParameter("body");
		final String toEmail = receipent; 

		log.info("TLSEmail Start");
		Properties props = new Properties();
	
		props.put("mail.smtp.host", EmailProperty.getProperty("mail.smtp.host")); // SMTP Host
		props.put("mail.smtp.port", EmailProperty.getProperty("mail.smtp.port")); // TLS Port
		props.put("mail.smtp.auth", EmailProperty.getProperty("mail.smtp.auth")); // enable authentication
		props.put("mail.smtp.starttls.enable", EmailProperty.getProperty("mail.smtp.starttls.enable")); // enable STARTTLS
		
		log.info("props : " + props.toString());
		// create Authenticator object to pass in Session.getInstance argument
		Authenticator auth = new Authenticator() {
			// override the getPasswordAuthentication method
			protected PasswordAuthentication getPasswordAuthentication() {
				return new PasswordAuthentication(fromEmail, password);
			}
		};
		String subjectLine = EmailProperty.getProperty("subject."+messageType);
		String body = EmailProperty.getProperty("body."+messageType+".head") + messageBody + EmailProperty.getProperty("body."+messageType+".tail");
		Session session = Session.getInstance(props, auth);
		log.info("calling sendEmail()");
		EmailUtil.sendEmail(session, toEmail, subjectLine, body);
		}catch(PropertyNotFoundException e){
			log.severe("Exception : "+ e);
		}
	}

}
