package com.example.ottaggregator.repository;

import com.example.ottaggregator.entity.WatchlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WatchlistRepository extends JpaRepository<WatchlistItem, Long> {
    List<WatchlistItem> findByUserId(Long userId);
    Optional<WatchlistItem> findByUserIdAndTmdbMovieId(Long userId, Long tmdbMovieId);
    boolean existsByUserIdAndTmdbMovieId(Long userId, Long tmdbMovieId);
    void deleteByUserIdAndTmdbMovieId(Long userId, Long tmdbMovieId);
}
