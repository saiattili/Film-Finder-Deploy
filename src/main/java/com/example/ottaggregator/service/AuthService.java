package com.example.ottaggregator.service;

import com.example.ottaggregator.dto.AuthResponse;
import com.example.ottaggregator.dto.LoginRequest;
import com.example.ottaggregator.dto.RegisterRequest;
import com.example.ottaggregator.dto.UserResponse;
import com.example.ottaggregator.entity.Profile;
import com.example.ottaggregator.entity.User;
import com.example.ottaggregator.repository.ProfileRepository;
import com.example.ottaggregator.repository.UserRepository;
import com.example.ottaggregator.entity.UserActivity;
import com.example.ottaggregator.repository.UserActivityRepository;
import com.example.ottaggregator.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProfileRepository profileRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email is already registered!");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role("ROLE_USER")
                .build();

        User savedUser = userRepository.save(user);

        // Generate profile with a cute initial avatar seed
        Profile profile = Profile.builder()
                .user(savedUser)
                .bio("Welcome to my movie profile! I love tracking the latest cinema releases and OTT streaming titles.")
                .location("Not Specified")
                .preferredLanguage("English")
                .avatarUrl("https://api.dicebear.com/7.x/bottts/svg?seed=" + savedUser.getId())
                .build();

        profileRepository.save(profile);

        // Log registration activity
        userActivityRepository.save(UserActivity.builder()
                .userId(savedUser.getId())
                .email(savedUser.getEmail())
                .actionType("REGISTER")
                .details("New user registration: " + savedUser.getName())
                .build());

        String token = tokenProvider.generateToken(savedUser.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(savedUser.getEmail())
                .name(savedUser.getName())
                .role(savedUser.getRole())
                .build();
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + request.getEmail()));

        // Log login activity
        userActivityRepository.save(UserActivity.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .actionType("LOGIN")
                .details("Successful login session initialized.")
                .build());

        String token = tokenProvider.generateToken(request.getEmail());

        return AuthResponse.builder()
                .token(token)
                .email(user.getEmail())
                .name(user.getName())
                .role(user.getRole())
                .build();
    }

    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        // Trigger lazy loading of profile if needed
        Profile profile = profileRepository.findByUserId(user.getId()).orElse(null);

        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole())
                .profile(profile)
                .build();
    }

    @Transactional
    public Profile updateProfile(String email, Profile profileDetails) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        Profile profile = profileRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("Profile not found for user: " + email));

        profile.setBio(profileDetails.getBio());
        profile.setLocation(profileDetails.getLocation());
        profile.setPreferredLanguage(profileDetails.getPreferredLanguage());
        if (profileDetails.getAvatarUrl() != null && !profileDetails.getAvatarUrl().isEmpty()) {
            profile.setAvatarUrl(profileDetails.getAvatarUrl());
        }

        return profileRepository.save(profile);
    }
}
