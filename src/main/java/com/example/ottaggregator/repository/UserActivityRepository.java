package com.example.ottaggregator.repository;

import com.example.ottaggregator.entity.UserActivity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserActivityRepository extends JpaRepository<UserActivity, Long> {
    List<UserActivity> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<UserActivity> findAllByOrderByCreatedAtDesc();
}
