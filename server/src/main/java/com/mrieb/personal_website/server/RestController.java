package com.mrieb.personal_website.server;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.reflect.Type;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.google.gson.Gson;
import com.mrieb.personal_website.requests.AuthCodeRequest;
import com.mrieb.personal_website.requests.Request;

import spark.Spark;

public class RestController {
    private static final int HTTP_OK = 200;
    private static final int HTTP_BAD_REQUEST = 400;
    private static final int HTTP_SERVER_ERROR = 500;
    
    //private static Logger log = LoggerFactory.getLogger(RestController.class);

    private Gson gson;

    public RestController(int port){
        Spark.port(port);
        gson = new Gson();
    }

    public void start(){
        Spark.exception(Exception.class, (exc, req, res) -> handleException(exc, res));
        
        Spark.path("/api", () -> {
            Spark.before("/*", (req, res) -> logRequest(req, res));
            Spark.post("/code", (req, res) -> processHttpRequest(req, res, AuthCodeRequest.class));
        });
    }

    private String processHttpRequest(spark.Request req, spark.Response res, Type requestType){
        setupResponse(res);
        String jsonString = req.body();
        try{
            // TODO: json validation here
            Request requestObj = gson.fromJson(jsonString, requestType);
            requestObj.buildResponse();
            String jsonResponse = gson.toJson(requestObj);
            //log.trace("Response - {}", jsonResponse);
            System.out.println("Response - " + jsonResponse);
            return jsonResponse;
        } catch (BadRequestException e) {
            System.out.println("Bad Request - " + e.getMessage());
            res.status(HTTP_BAD_REQUEST);
        } catch (Exception e) {
            System.out.println("Server Error - " + e);
            res.status(HTTP_SERVER_ERROR);
        }
        return jsonString;
    }

    public void stop(){
        Spark.stop(); // it has been brought to my attention that this is bad practice
    }

    private void logRequest(spark.Request request, spark.Response response) {
		System.out.println(request.requestMethod() + " " + request.pathInfo() + "\nREQUEST:\n" + request.body() + "\nRESPONSE:\n"
				+ response.body());
	}

    // Exception handling
	private void handleException(Exception exception, spark.Response response) {
		StringWriter sw = new StringWriter();
		PrintWriter pw = new PrintWriter(sw);
		exception.printStackTrace();
		exception.printStackTrace(pw);
		System.err.println(sw.toString());
		response.body("KO");
		response.status(500);
	}

	private void setupResponse(spark.Response response) {
        response.type("application/json");
        response.header("Access-Control-Allow-Origin", "*");
        response.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
        response.status(HTTP_OK);
    }
}
