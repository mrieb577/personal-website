package com.mrieb.personal_website.data;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Base64;
import java.util.Objects;

import com.google.gson.Gson;
import com.mrieb.personal_website.Session;

public class Authorization {
    public static final transient String REDIRECT_URI = "http:/127.0.0.1:5173";
    //public static final transient String REDIRECT_URI = "http:/[::1]:5173";

    public String access_token;
    public Integer expires_in;
    public String refresh_token;
    public String scope;
    public String token_type;

    public long grant_time;

    private static String readResponse(HttpURLConnection connection) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String inputLine;
        StringBuilder content = new StringBuilder();
        while ((inputLine = in.readLine()) != null) {
            content.append(inputLine);
        }
        in.close();
        return content.toString();
    }


    public static Authorization get(String code) throws Exception{
        HttpURLConnection connection = (HttpURLConnection) new URL("https://accounts.spotify.com/api/token").openConnection();
        connection.setRequestMethod("POST");
        connection.setRequestProperty("Content-Type", "application/x-www-form-urlencoded");
        connection.setRequestProperty("Authorization",
            "Bearer " + Base64.getEncoder().encodeToString((Session.credentials.client_id + ':' + Session.credentials.secret_id).getBytes()));
        connection.getOutputStream().write(
            ("{\n\t\"grant_type\": \"authorization_code\",\n\t\"code\": " + code + ",\n\t\"redirect_uri\": " + REDIRECT_URI + "\n}")
            .getBytes());

        if(connection.getResponseCode() == 200){
            Authorization auth = new Gson().fromJson(readResponse(connection), Authorization.class);
            return auth;
        }
        return null;
    }

    public static void verify(Authorization creds){
        Objects.requireNonNull(creds);

        // request a refresh of the access token if the token is too old
        return;
    }

    @Override
    public String toString(){
        return access_token;
    }
}
