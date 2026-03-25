package com.example.travel.chat.repository;

import com.example.travel.chat.entity.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Long> {
    @Query("SELECT c FROM ChatMessage c WHERE (c.senderId = :id1 AND (c.recipientId = :id2 OR c.recipientId IS NULL OR c.recipientId = 'SUPPORT')) OR (c.senderId = :id2 AND c.recipientId = :id1) ORDER BY c.timestamp ASC")
    List<ChatMessage> findChatHistory(String id1, String id2);

    @Query("SELECT c FROM ChatMessage c WHERE c.senderId = :userId OR c.recipientId = :userId ORDER BY c.timestamp ASC")
    List<ChatMessage> findUserChatHistory(String userId);

    @Query("SELECT DISTINCT c.senderId, c.senderName, u.avatarUrl FROM ChatMessage c JOIN com.example.travel.identity.entity.User u ON c.senderId = u.id WHERE c.recipientId IS NULL OR c.recipientId = 'SUPPORT' OR c.recipientId = 'ADMIN'")
    List<Object[]> findActiveChatUsers();
}
