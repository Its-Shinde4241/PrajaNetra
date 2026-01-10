package com.app.prajanetraserver.Controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController

public class HomeController {

    @GetMapping("/")
    public String home() {
        System.out.println("home");
        return "STARTER API RUNNING ON!";
    }
}
