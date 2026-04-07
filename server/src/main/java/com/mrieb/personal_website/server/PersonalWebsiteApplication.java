package com.mrieb.personal_website.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@SpringBootApplication
@RestController
public class PersonalWebsiteApplication {
	public static void main(String[] args) {
		SpringApplication.run(PersonalWebsiteApplication.class, args);
	}

	@GetMapping("/auth")
	public String authenticate(@RequestParam(value = "code", defaultValue = "none given") String code){
	    return code;
	}
}
