package com.example.ottaggregator.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "watchlist", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "tmdb_movie_id"})
})
public class WatchlistItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "tmdb_movie_id", nullable = false)
    private Long tmdbMovieId;

    @Column(name = "movie_title", nullable = false)
    private String movieTitle;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "category")
    private String category; // e.g. "THEATER", "OTT"

    @CreationTimestamp
    @Column(name = "added_at", nullable = false, updatable = false)
    private LocalDateTime addedAt;

    // Constructors
    public WatchlistItem() {
    }

    public WatchlistItem(Long id, Long userId, Long tmdbMovieId, String movieTitle, String posterPath, String category, LocalDateTime addedAt) {
        this.id = id;
        this.userId = userId;
        this.tmdbMovieId = tmdbMovieId;
        this.movieTitle = movieTitle;
        this.posterPath = posterPath;
        this.category = category;
        this.addedAt = addedAt;
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

    public Long getTmdbMovieId() {
        return tmdbMovieId;
    }

    public void setTmdbMovieId(Long tmdbMovieId) {
        this.tmdbMovieId = tmdbMovieId;
    }

    public String getMovieTitle() {
        return movieTitle;
    }

    public void setMovieTitle(String movieTitle) {
        this.movieTitle = movieTitle;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDateTime getAddedAt() {
        return addedAt;
    }

    public void setAddedAt(LocalDateTime addedAt) {
        this.addedAt = addedAt;
    }

    // Builder Pattern
    public static WatchlistItemBuilder builder() {
        return new WatchlistItemBuilder();
    }

    public static class WatchlistItemBuilder {
        private Long id;
        private Long userId;
        private Long tmdbMovieId;
        private String movieTitle;
        private String posterPath;
        private String category;
        private LocalDateTime addedAt;

        public WatchlistItemBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WatchlistItemBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public WatchlistItemBuilder tmdbMovieId(Long tmdbMovieId) {
            this.tmdbMovieId = tmdbMovieId;
            return this;
        }

        public WatchlistItemBuilder movieTitle(String movieTitle) {
            this.movieTitle = movieTitle;
            return this;
        }

        public WatchlistItemBuilder posterPath(String posterPath) {
            this.posterPath = posterPath;
            return this;
        }

        public WatchlistItemBuilder category(String category) {
            this.category = category;
            return this;
        }

        public WatchlistItemBuilder addedAt(LocalDateTime addedAt) {
            this.addedAt = addedAt;
            return this;
        }

        public WatchlistItem build() {
            return new WatchlistItem(id, userId, tmdbMovieId, movieTitle, posterPath, category, addedAt);
        }
    }
}
