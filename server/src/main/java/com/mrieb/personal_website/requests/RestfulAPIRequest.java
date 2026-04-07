package com.mrieb.personal_website.requests;

import java.io.IOException;

public abstract class RestfulAPIRequest {
    protected String requestType;

    public String getRequestType(){
        return requestType;
    }

    public abstract void buildResponse() throws IOException;
}
