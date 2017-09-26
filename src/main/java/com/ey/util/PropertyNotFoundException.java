package com.ey.util;

public class PropertyNotFoundException extends Exception {
	String exception;
	/**
	 * Exception fetching property for API from file
	 */
	private static final long serialVersionUID = 1L;
	PropertyNotFoundException(String exception){
		this.exception = exception;
	}
	@Override
	public String toString() {
		// TODO Auto-generated method stub
		return "Exception fetching property for API from file : " + exception;
	}
@Override
public String getMessage() {
	// TODO Auto-generated method stub
	return exception;
}
}
