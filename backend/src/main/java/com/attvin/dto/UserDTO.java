package com.attvin.dto;

import com.attvin.model.User;
import lombok.Data;

import java.util.Set;

@Data
public class UserDTO {
    private Long id;
    private String email;
    private String name;
    private String password; // For input only, never returned in responses
    private Set<User.Role> roles;
} 