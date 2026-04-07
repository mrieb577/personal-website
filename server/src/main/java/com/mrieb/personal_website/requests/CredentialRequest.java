package com.mrieb.personal_website.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class CredentialRequest extends RestfulAPIRequest {
    public static final transient Logger log = LoggerFactory.getLogger(CredentialRequest.class);
    
    @Override
    public void buildResponse(){

    }

    public CredentialRequest(){
        this.requestType = "credentials";
    }
}
