package com.example.ottaggregator.service;

import com.example.ottaggregator.dto.WatchlistRequest;
import com.example.ottaggregator.entity.User;
import com.example.ottaggregator.entity.WatchlistItem;
import com.example.ottaggregator.repository.UserRepository;
import com.example.ottaggregator.repository.WatchlistRepository;
import com.example.ottaggregator.entity.UserActivity;
import com.example.ottaggregator.repository.UserActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class WatchlistService {

    @Autowired
    private WatchlistRepository watchlistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserActivityRepository userActivityRepository;

    @Transactional
    public WatchlistItem addToWatchlist(String email, WatchlistRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (watchlistRepository.existsByUserIdAndTmdbMovieId(user.getId(), request.getTmdbMovieId())) {
            throw new RuntimeException("Movie is already in your watchlist!");
        }

        WatchlistItem item = WatchlistItem.builder()
                .userId(user.getId())
                .tmdbMovieId(request.getTmdbMovieId())
                .movieTitle(request.getMovieTitle())
                .posterPath(request.getPosterPath())
                .category(request.getCategory())
                .build();
        WatchlistItem savedItem = watchlistRepository.save(item);
        
        userActivityRepository.save(UserActivity.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .actionType("ADD_WATCHLIST")
                .movieId(request.getTmdbMovieId())
                .details("Added to watchlist: " + request.getMovieTitle())
                .build());

        return savedItem;
    }

    @Transactional(readOnly = true)
    public List<WatchlistItem> getWatchlist(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return watchlistRepository.findByUserId(user.getId());
    }

    @Transactional
    public void removeFromWatchlist(String email, Long tmdbMovieId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        watchlistRepository.deleteByUserIdAndTmdbMovieId(user.getId(), tmdbMovieId);

        userActivityRepository.save(UserActivity.builder()
                .userId(user.getId())
                .email(user.getEmail())
                .actionType("REMOVE_WATCHLIST")
                .movieId(tmdbMovieId)
                .details("Removed movie from watchlist. (ID: " + tmdbMovieId + ")")
                .build());
    }

    @Transactional(readOnly = true)
    public boolean checkWatchlist(String email, Long tmdbMovieId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        return watchlistRepository.existsByUserIdAndTmdbMovieId(user.getId(), tmdbMovieId);
    }
}
