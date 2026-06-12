package com.example.ottaggregator.repository;

import com.example.ottaggregator.entity.MovieCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MovieCacheRepository extends JpaRepository<MovieCache, Long> {
    Optional<MovieCache> findByTmdbMovieId(Long tmdbMovieId);
}
