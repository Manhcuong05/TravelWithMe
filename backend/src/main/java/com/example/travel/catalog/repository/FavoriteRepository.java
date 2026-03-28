package com.example.travel.catalog.repository;

import com.example.travel.catalog.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, String> {
    List<Favorite> findByUserId(String userId);
    List<Favorite> findByUserIdAndItemType(String userId, String itemType);
    Optional<Favorite> findByUserIdAndItemTypeAndItemId(String userId, String itemType, String itemId);
    boolean existsByUserIdAndItemTypeAndItemId(String userId, String itemType, String itemId);
    void deleteByUserIdAndItemTypeAndItemId(String userId, String itemType, String itemId);
}
