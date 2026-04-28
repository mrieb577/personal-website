package com.mrieb.personal_website.obsessions;

import java.util.Base64;

public class Credentials {
    public String clientId;
    public String secretId;

    @Override
    public String toString(){
        return "Client: " + clientId + "\nSecret: " + secretId;
    }

    public String getBase64String(){
        String from = clientId + ":" + secretId;
        return Base64.getEncoder().encodeToString(from.getBytes());
    }
}
