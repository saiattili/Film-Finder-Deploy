package com.example.ottaggregator.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "profiles")
public class Profile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(columnDefinition = "TEXT")
    private String bio;

    private String location;

    @Column(name = "preferred_language")
    private String preferredLanguage;

    @Column(name = "avatar_url")
    private String avatarUrl;

    // Constructors
    public Profile() {
    }

    public Profile(Long id, User user, String bio, String location, String preferredLanguage, String avatarUrl) {
        this.id = id;
        this.user = user;
        this.bio = bio;
        this.location = location;
        this.preferredLanguage = preferredLanguage;
        this.avatarUrl = avatarUrl;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getPreferredLanguage() {
        return preferredLanguage;
    }

    public void setPreferredLanguage(String preferredLanguage) {
        this.preferredLanguage = preferredLanguage;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    // Builder Pattern
    public static ProfileBuilder builder() {
        return new ProfileBuilder();
    }

    public static class ProfileBuilder {
        private Long id;
        private User user;
        private String bio;
        private String location;
        private String preferredLanguage;
        private String avatarUrl;

        public ProfileBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProfileBuilder user(User user) {
            this.user = user;
            return this;
        }

        public ProfileBuilder bio(String bio) {
            this.bio = bio;
            return this;
        }

        public ProfileBuilder location(String location) {
            this.location = location;
            return this;
        }

        public ProfileBuilder preferredLanguage(String preferredLanguage) {
            this.preferredLanguage = preferredLanguage;
            return this;
        }

        public ProfileBuilder avatarUrl(String avatarUrl) {
            this.avatarUrl = avatarUrl;
            return this;
        }

        public Profile build() {
            return new Profile(id, user, bio, location, preferredLanguage, avatarUrl);
        }
    }
}
