package com.example.ottaggregator.dto;

import com.example.ottaggregator.entity.Profile;

public class UserResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Profile profile;

    // Constructors
    public UserResponse() {
    }

    public UserResponse(Long id, String name, String email, String role, Profile profile) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profile = profile;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Profile getProfile() {
        return profile;
    }

    public void setProfile(Profile profile) {
        this.profile = profile;
    }

    // Builder Pattern
    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }

    public static class UserResponseBuilder {
        private Long id;
        private String name;
        private String email;
        private String role;
        private Profile profile;

        public UserResponseBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserResponseBuilder name(String name) {
            this.name = name;
            return this;
        }

        public UserResponseBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserResponseBuilder role(String role) {
            this.role = role;
            return this;
        }

        public UserResponseBuilder profile(Profile profile) {
            this.profile = profile;
            return this;
        }

        public UserResponse build() {
            return new UserResponse(id, name, email, role, profile);
        }
    }
}
