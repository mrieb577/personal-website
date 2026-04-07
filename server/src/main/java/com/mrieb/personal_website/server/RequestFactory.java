package com.mrieb.personal_website.server;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.coyote.BadRequestException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.gson.Gson;
import com.mrieb.personal_website.requests.CredentialRequest;
import com.mrieb.personal_website.requests.RestfulAPIRequest;

import jakarta.servlet.http.HttpServletRequest;

// code credit goes to CS314 at Colorado State University
// I think the SpringBoot code was done by Leo Rodolico
@RestController
@RequestMapping("/api")
public class RequestFactory {
    private static final Logger log = LoggerFactory.getLogger(RequestFactory.class);
    private static final DateTimeFormatter dateTimeFormat = DateTimeFormatter.ofPattern("yyyy/MM/dd HH:mm:ss");
    private static final Map<String, Class<? extends RestfulAPIRequest>> requestTypes = new LinkedHashMap<>();

    static {
        requestTypes.put("credentials", CredentialRequest.class);
    }

    @CrossOrigin
    @PostMapping(value = "/{endpoint}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<String> handle(@PathVariable String endpoint, @RequestBody String body, HttpServletRequest request){
        Class<? extends RestfulAPIRequest> requestClass = requestTypes.get(endpoint);
        if(requestClass == null){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
        return processRequest(request, body, requestClass);
    }

    private ResponseEntity<String> processRequest(HttpServletRequest request, String body, Class<? extends RestfulAPIRequest> requestClass) {
        logRequest(request, body);
        try{
            //validation?
            RestfulAPIRequest requestObj = new Gson().fromJson(body, requestClass);
            requestObj.buildResponse();
            String jsonResponse = new Gson().toJson(requestObj);
            log.trace("Response - {}", jsonResponse);
            return ResponseEntity.ok(jsonResponse);
        } catch (IOException e) {
            log.info("Bad Request - {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
        } catch (Exception e) {
            log.info("Server Error - ", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
        }
    }

    private void logRequest(HttpServletRequest request, String body) {
        String message = "Request - "
                + "[" + dateTimeFormat.format(LocalDateTime.now()) + "] "
                + request.getRemoteAddr() + " "
                + "\"" + request.getMethod() + " "
                + request.getRequestURI() + " "
                + request.getProtocol() + "\" "
                + "[" + body + "]";
        log.info(message);
    }
}
