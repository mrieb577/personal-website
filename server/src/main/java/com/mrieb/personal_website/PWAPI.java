package com.mrieb.personal_website;

import java.io.IOException;
import java.io.InputStream;
import java.util.Scanner;

import com.google.gson.Gson;
import com.mrieb.personal_website.obsessions.Credentials;
import com.mrieb.personal_website.requests.State;
import com.mrieb.personal_website.server.RestController;

public class PWAPI {
    private static final int PORT = 19721;

    public static void main(String[] args) {
        try{
            InputStream credsIS = PWAPI.class.getResourceAsStream("credentials.json");
            String credentialsJson = new String(credsIS.readAllBytes());
            State.credentials = new Gson().fromJson(credentialsJson, Credentials.class);
        } catch(IOException e){
            e.printStackTrace();
            System.err.println("Could not find the credentials.json file needed to connect to Spotify.");
            return;
        }

        Scanner scanner = new Scanner(System.in);
        RestController controller = new RestController(PORT);
        try{
            controller.start();
            System.out.println("Server running on port: " + PORT);
            System.out.println("Press ENTER to kill server...");
            scanner.nextLine();
        } catch (Exception e) {
            e.printStackTrace();
        } finally {
            controller.stop();
            scanner.close();
            System.out.println("Shutting down...");
        }
    }
}
