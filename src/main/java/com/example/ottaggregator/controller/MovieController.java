package com.example.ottaggregator.controller;

import com.example.ottaggregator.service.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @GetMapping("/now-playing")
    public ResponseEntity<List<Map<String, Object>>> getNowPlayingMovies() {
        return ResponseEntity.ok(movieService.getNowPlayingMovies());
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<Map<String, Object>>> getUpcomingMovies() {
        return ResponseEntity.ok(movieService.getUpcomingMovies());
    }

    @GetMapping("/{tmdbId}")
    public ResponseEntity<Map<String, Object>> getMovieDetails(@PathVariable Long tmdbId) {
        try {
            return ResponseEntity.ok(movieService.getMovieDetails(tmdbId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/search")
    public ResponseEntity<List<Map<String, Object>>> searchMovies(@RequestParam String query) {
        return ResponseEntity.ok(movieService.searchMovies(query));
    }

    @GetMapping("/providers/{tmdbId}")
    public ResponseEntity<List<Map<String, String>>> getWatchProviders(@PathVariable Long tmdbId) {
        return ResponseEntity.ok(movieService.getWatchProviders(tmdbId));
    }
}
