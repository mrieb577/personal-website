package com.mrieb.personal_website.requests;

import java.io.IOException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.mrieb.personal_website.Session;
import com.mrieb.personal_website.data.Authorization;

public class AuthCodeRequest extends RestfulAPIRequest {
    public static final transient Logger log = LoggerFactory.getLogger(SpotifyFetchRequest.class);

    public String code;

	@Override
	public void buildResponse() throws Exception {
	    Session.authorization = Authorization.get(code);
	    log.trace("buildResponse - {}", this);
	}

	public AuthCodeRequest(){
        this.requestType = "authcode";
    }
}