package com.example.ottaggregator.controller;

import com.example.ottaggregator.entity.User;
import com.example.ottaggregator.entity.UserActivity;
import com.example.ottaggregator.repository.ProfileRepository;
import com.example.ottaggregator.repository.UserRepository;
import com.example.ottaggregator.repository.WatchlistRepository;
import com.example.ottaggregator.repository.UserActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        // Return list of all registered users
        List<User> users = userRepository.findAll();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/activities")
    public ResponseEntity<List<UserActivity>> getAllActivities() {
        // Return list of all recorded user activities sorted by time
        List<UserActivity> activities = userActivityRepository.findAllByOrderByCreatedAtDesc();
        return ResponseEntity.ok(activities);
    }

    @DeleteMapping("/users/{userId}")
    @Transactional
    public ResponseEntity<Void> deleteUser(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + userId));

        // Delete user's profile
        profileRepository.findByUserId(userId).ifPresent(profile -> profileRepository.delete(profile));

        // Delete user's watchlist entries
        watchlistRepository.findByUserId(userId).forEach(item -> watchlistRepository.delete(item));

        // Delete user record
        userRepository.delete(user);

        // Save admin audit log
        userActivityRepository.save(UserActivity.builder()
                .actionType("DELETE_USER")
                .details("Admin deleted user account: " + user.getEmail() + " (ID: " + userId + ")")
                .build());

        return ResponseEntity.ok().build();
    }
}
