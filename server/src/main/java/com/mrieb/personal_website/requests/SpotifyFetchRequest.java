package com.mrieb.personal_website.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.reactive.function.client.WebClient;

public class SpotifyFetchRequest extends RestfulAPIRequest{
    public static final transient Logger log = LoggerFactory.getLogger(SpotifyFetchRequest.class);
    
    @Override
    public void buildResponse(){
        
    }

    public SpotifyFetchRequest(){
        this.requestType = "fetch";
    }
}
