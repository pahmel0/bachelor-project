package com.attvin.controller;

import com.attvin.dto.UserDTO;
import com.attvin.model.User;
import com.attvin.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    
    private final UserService userService;
    
    @PostMapping("/register")
    public ResponseEntity<UserDTO> register(@RequestBody UserDTO userDTO) {
        return ResponseEntity.ok(userService.createUser(userDTO));
    }
    
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> loginRequest) {
        String email = loginRequest.get("email");
        String password = loginRequest.get("password");
        
        // Authenticate and get token
        String token = userService.authenticate(email, password);
        
        // Get user details
        UserDTO userDTO = userService.getUserByEmail(email);
        
        // Create the response format expected by the frontend
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        
        // Add user details
        Map<String, Object> userMap = new HashMap<>();
        userMap.put("id", userDTO.getId());
        userMap.put("email", userDTO.getEmail());
        userMap.put("roles", userDTO.getRoles().stream()
                .map(User.Role::name)
                .collect(Collectors.toList()));
        
        response.put("user", userMap);
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser() {
        // Security context holder will be used to get the current authenticated user
        // This will be implemented later via Spring Security
        // For now, this is a placeholder
        return ResponseEntity.ok().build();
    }
} 