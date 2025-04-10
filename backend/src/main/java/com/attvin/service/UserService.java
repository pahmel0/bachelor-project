package com.attvin.service;

import com.attvin.dto.UserDTO;
import org.springframework.security.core.userdetails.UserDetailsService;

public interface UserService extends UserDetailsService {
    
    UserDTO createUser(UserDTO userDTO);
    
    UserDTO getUserById(Long id);
    
    UserDTO getUserByEmail(String email);
    
    UserDTO updateUser(Long id, UserDTO userDTO);
    
    void deleteUser(Long id);
    
    String authenticate(String email, String password);
} 