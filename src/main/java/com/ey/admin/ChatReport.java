package com.ey.admin;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.ey.db.DBOperationsForReports;

/**
 * Servlet implementation class ChatReport
 */
public class ChatReport extends HttpServlet {
	private static final long serialVersionUID = 1L;
 
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

		String startDate = request.getParameter("startDate");
		String endDate = request.getParameter("endDate");
		
		String operation = request.getParameter("operation");
		
		String responseString = "{}";
		
		switch(operation){
		
		case "getChatReport" :  
			//GET CHAT REPORT BETWEEN STARTDATE AND ENDDATE
			responseString = DBOperationsForReports.getChatReport(startDate, endDate);
			
			break;
						
		case "getChatReportByUsers" : 
			//GET CHAT REPORT BY USER BETWEEN STARTDATE AND ENDDATE
			responseString = DBOperationsForReports.getChatReportByUser(startDate, endDate);
			
			break;
		
		case "getChatReportByQueries" :
			//GET CHAT REPORT BY USER BETWEEN STARTDATE AND ENDDATE
			responseString = DBOperationsForReports.getChatReportByQuires(startDate, endDate);
			
			break;
 		}
		
		response.setContentType("application/json");
		response.getWriter().write(responseString);
	}

}
