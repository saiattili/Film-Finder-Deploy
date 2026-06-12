package com.example.ottaggregator.controller;

import com.example.ottaggregator.dto.WatchlistRequest;
import com.example.ottaggregator.entity.WatchlistItem;
import com.example.ottaggregator.service.WatchlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/watchlist")
public class WatchlistController {

    @Autowired
    private WatchlistService watchlistService;

    @GetMapping
    public ResponseEntity<List<WatchlistItem>> getWatchlist(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(watchlistService.getWatchlist(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<WatchlistItem> addToWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody WatchlistRequest request) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(watchlistService.addToWatchlist(userDetails.getUsername(), request));
    }

    @DeleteMapping("/{tmdbMovieId}")
    public ResponseEntity<Void> removeFromWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbMovieId) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        watchlistService.removeFromWatchlist(userDetails.getUsername(), tmdbMovieId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/check/{tmdbMovieId}")
    public ResponseEntity<Boolean> checkWatchlist(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long tmdbMovieId) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(watchlistService.checkWatchlist(userDetails.getUsername(), tmdbMovieId));
    }
}
