package com.mrieb.personal_website.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.reactive.function.client.WebClient;

import com.mrieb.personal_website.Session;

public class SpotifyFetchRequest extends RestfulAPIRequest{
    public static final transient Logger log = LoggerFactory.getLogger(SpotifyFetchRequest.class);

    @Override
    public void buildResponse() throws Exception {
        if(Session.authorization == null) throw new Exception("The current session has not been authorized!");

        log.trace("buildResponse - {}", this);
    }

    public SpotifyFetchRequest(){
        this.requestType = "fetch";
    }
}
