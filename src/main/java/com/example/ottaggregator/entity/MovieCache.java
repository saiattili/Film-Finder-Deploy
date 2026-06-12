package com.example.ottaggregator.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "movie_cache")
public class MovieCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "tmdb_movie_id", nullable = false, unique = true)
    private Long tmdbMovieId;

    @Column(nullable = false)
    private String title;

    @Column(name = "release_date")
    private String releaseDate;

    @Column(name = "poster_path")
    private String posterPath;

    @Column(name = "vote_average")
    private Double voteAverage;

    @Column(columnDefinition = "TEXT")
    private String overview;

    @Column(name = "source_type")
    private String sourceType; // e.g. "THEATER", "OTT"

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    // Constructors
    public MovieCache() {
    }

    public MovieCache(Long id, Long tmdbMovieId, String title, String releaseDate, String posterPath, Double voteAverage, String overview, String sourceType, LocalDateTime updatedAt) {
        this.id = id;
        this.tmdbMovieId = tmdbMovieId;
        this.title = title;
        this.releaseDate = releaseDate;
        this.posterPath = posterPath;
        this.voteAverage = voteAverage;
        this.overview = overview;
        this.sourceType = sourceType;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getTmdbMovieId() {
        return tmdbMovieId;
    }

    public void setTmdbMovieId(Long tmdbMovieId) {
        this.tmdbMovieId = tmdbMovieId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public Double getVoteAverage() {
        return voteAverage;
    }

    public void setVoteAverage(Double voteAverage) {
        this.voteAverage = voteAverage;
    }

    public String getOverview() {
        return overview;
    }

    public void setOverview(String overview) {
        this.overview = overview;
    }

    public String getSourceType() {
        return sourceType;
    }

    public void setSourceType(String sourceType) {
        this.sourceType = sourceType;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // Builder Pattern
    public static MovieCacheBuilder builder() {
        return new MovieCacheBuilder();
    }

    public static class MovieCacheBuilder {
        private Long id;
        private Long tmdbMovieId;
        private String title;
        private String releaseDate;
        private String posterPath;
        private Double voteAverage;
        private String overview;
        private String sourceType;
        private LocalDateTime updatedAt;

        public MovieCacheBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public MovieCacheBuilder tmdbMovieId(Long tmdbMovieId) {
            this.tmdbMovieId = tmdbMovieId;
            return this;
        }

        public MovieCacheBuilder title(String title) {
            this.title = title;
            return this;
        }

        public MovieCacheBuilder releaseDate(String releaseDate) {
            this.releaseDate = releaseDate;
            return this;
        }

        public MovieCacheBuilder posterPath(String posterPath) {
            this.posterPath = posterPath;
            return this;
        }

        public MovieCacheBuilder voteAverage(Double voteAverage) {
            this.voteAverage = voteAverage;
            return this;
        }

        public MovieCacheBuilder overview(String overview) {
            this.overview = overview;
            return this;
        }

        public MovieCacheBuilder sourceType(String sourceType) {
            this.sourceType = sourceType;
            return this;
        }

        public MovieCacheBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public MovieCache build() {
            return new MovieCache(id, tmdbMovieId, title, releaseDate, posterPath, voteAverage, overview, sourceType, updatedAt);
        }
    }
}
