package com.acxiom.crm.dto;

import com.acxiom.crm.entity.Role;
import com.acxiom.crm.entity.User;

public class AuthResponse {

    private Long id;
    private String username;
    private String email;
    private String fullName;
    private Role role;

    public AuthResponse() {
    }

    public AuthResponse(Long id, String username, String email, String fullName, Role role) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
    }

    public static AuthResponse fromEntity(User user) {
        if (user == null) {
            return null;
        }
        return new AuthResponse(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
}
