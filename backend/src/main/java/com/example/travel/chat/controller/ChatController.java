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
        
        // Notify recipient OR broadcast to admins if sent to support
        if (chatMessage.getRecipientId() != null && !chatMessage.getRecipientId().equals("SUPPORT")) {
            messagingTemplate.convertAndSendToUser(
                chatMessage.getRecipientId(), "/queue/messages",
                saved
            );
        } else {
            messagingTemplate.convertAndSend("/topic/support", saved);
        }

        // ALWAYS notify sender on their private queue for sync
        messagingTemplate.convertAndSendToUser(
            chatMessage.getSenderId(), "/queue/messages",
            saved
        );
    }

    @GetMapping("/api/chat/users")
    @org.springframework.security.access.prepost.PreAuthorize("hasAnyRole('ADMIN', 'CTV')")
    public List<java.util.Map<String, String>> getActiveChatUsers() {
        return repository.findActiveChatUsers().stream()
            .map(obj -> {
                java.util.Map<String, String> map = new java.util.HashMap<>();
                map.put("userId", (String) obj[0]);
                map.put("userName", (String) obj[1]);
                return map;
            }).toList();
    }

    @GetMapping("/api/chat/history")
    public List<ChatMessage> getChatHistory(@RequestParam String senderId, @RequestParam String recipientId) {
        return repository.findChatHistory(senderId, recipientId);
    }
}
