package com.example.ottaggregator.dto;

public class WatchlistRequest {
    private Long tmdbMovieId;
    private String movieTitle;
    private String posterPath;
    private String category;

    // Constructors
    public WatchlistRequest() {
    }

    public WatchlistRequest(Long tmdbMovieId, String movieTitle, String posterPath, String category) {
        this.tmdbMovieId = tmdbMovieId;
        this.movieTitle = movieTitle;
        this.posterPath = posterPath;
        this.category = category;
    }

    // Getters and Setters
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
}
