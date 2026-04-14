package com.mrieb.personal_website.requests;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AuthCodeRequest extends Request {
    private static final transient Logger log = LoggerFactory.getLogger(AuthCodeRequest.class);

    public String code;

    @Override
    public void buildResponse() {
        State.authorizationCode = code;
        log.trace("buildResponse - {}", this);
    }
}
