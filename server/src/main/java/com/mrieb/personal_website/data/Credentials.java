package com.mrieb.personal_website.data;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import com.google.gson.Gson;
import com.mrieb.personal_website.Session;

public class Credentials {
    public String client_id;
    public String secret_id;

    public static Credentials load() throws IOException {
        Credentials c;
        try(InputStream stream = Session.class.getResourceAsStream("/credentials.json")){
            String credentialString = new String(stream.readAllBytes());
            c = new Gson().fromJson(credentialString, Credentials.class);
        } catch(FileNotFoundException e){
            throw new IOException("Could not find the credential file");
        }
        return c;
    }
}
