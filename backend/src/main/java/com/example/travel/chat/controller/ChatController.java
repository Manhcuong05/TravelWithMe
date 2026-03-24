package com.example.travel.chat.controller;

import com.example.travel.chat.entity.ChatMessage;
import com.example.travel.chat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ChatController {

    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageRepository repository;

    @MessageMapping("/chat")
    public void processMessage(@Payload ChatMessage chatMessage) {
        chatMessage.setTimestamp(LocalDateTime.now());
        chatMessage.setStatus(ChatMessage.MessageStatus.SENT);
        
        ChatMessage saved = repository.save(chatMessage);
        
        // Notify recipient
        if (chatMessage.getRecipientId() != null) {
            messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                saved
            );
        } else {
            // General support topic
            messagingTemplate.convertAndSend("/topic/support", saved);
        }
    }

    @GetMapping("/api/chat/history")
    public List<ChatMessage> getChatHistory(@RequestParam String senderId, @RequestParam String recipientId) {
        return repository.findChatHistory(senderId, recipientId);
    }
}
