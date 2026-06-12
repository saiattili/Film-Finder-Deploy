package com.example.ottaggregator.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_activity")
public class UserActivity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id")
    private Long userId;

    @Column(name = "email")
    private String email;

    @Column(name = "action_type", nullable = false)
    private String actionType; // e.g., "REGISTER", "LOGIN", "ADD_WATCHLIST", "REMOVE_WATCHLIST"

    @Column(name = "movie_id")
    private Long movieId;

    @Column(name = "details")
    private String details;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    // Constructors
    public UserActivity() {
    }

    public UserActivity(Long id, Long userId, String email, String actionType, Long movieId, String details, LocalDateTime createdAt) {
        this.id = id;
        this.userId = userId;
        this.email = email;
        this.actionType = actionType;
        this.movieId = movieId;
        this.details = details;
        this.createdAt = createdAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getActionType() {
        return actionType;
    }

    public void setActionType(String actionType) {
        this.actionType = actionType;
    }

    public Long getMovieId() {
        return movieId;
    }

    public void setMovieId(Long movieId) {
        this.movieId = movieId;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Builder Pattern
    public static UserActivityBuilder builder() {
        return new UserActivityBuilder();
    }

    public static class UserActivityBuilder {
        private Long id;
        private Long userId;
        private String email;
        private String actionType;
        private Long movieId;
        private String details;
        private LocalDateTime createdAt;

        public UserActivityBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public UserActivityBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public UserActivityBuilder email(String email) {
            this.email = email;
            return this;
        }

        public UserActivityBuilder actionType(String actionType) {
            this.actionType = actionType;
            return this;
        }

        public UserActivityBuilder movieId(Long movieId) {
            this.movieId = movieId;
            return this;
        }

        public UserActivityBuilder details(String details) {
            this.details = details;
            return this;
        }

        public UserActivityBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public UserActivity build() {
            return new UserActivity(id, userId, email, actionType, movieId, details, createdAt);
        }
    }
}
