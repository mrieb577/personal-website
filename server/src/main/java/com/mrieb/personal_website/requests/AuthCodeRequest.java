package com.mrieb.personal_website.requests;

import com.mrieb.personal_website.server.RequestException;
import java.io.IOException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.HashMap;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import com.mrieb.personal_website.server.RequestException;
import com.google.gson.Gson;


public class AuthCodeRequest extends Request {
    //private static final transient Logger log = LoggerFactory.getLogger(AuthCodeRequest.class);
    private static final transient String REDIRECT_URI = "http://127.0.0.1:5173";
    //private static final transient String REDIRECT_URI = "http://[::1]:5173";

    public String code;
    public int responseCode;

    @Override
    public void buildResponse() throws RequestException {
        State.authorizationCode = code;

        try{
            Map<String, String> body = new HashMap<>();
            body.put("grant_type", "authorization_code");
            body.put("code", State.authorizationCode);
            body.put("redirect_uri", REDIRECT_URI);

            HttpURLConnection connection = (HttpURLConnection) new URL("https://accounts.spotify.com/api/token").openConnection();
            connection.setRequestMethod("POST");
            connection.addRequestProperty("Content-Type", "application/x-www-form-urlencoded");
            connection.addRequestProperty("Authorization", "Bearer " + State.credentials.getBase64String());

            String bodyString = new Gson().toJson(body);
            System.out.println(bodyString);
            connection.getOutputStream().write(bodyString.getBytes());

            responseCode = connection.getResponseCode();
            if(responseCode == 200){
                String response = connection.getResponseMessage();
                System.out.println("Authorization Response - " + response);
            }
            else {
                throw new IOException("" + responseCode);
            }
        } catch(Exception e){
            throw new RequestException();
        }

        System.out.println("buildResponse - " +  this);
    }
}
