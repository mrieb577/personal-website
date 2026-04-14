package com.mrieb.personal_website.requests;

import com.mrieb.personal_website.server.RequestException;

public abstract class Request {
    private String requestType;

    public abstract void buildResponse() throws RequestException;

    public String getType(){
        return requestType;
    }
}
