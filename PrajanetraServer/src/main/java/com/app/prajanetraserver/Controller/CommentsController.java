package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.CommentRequest;
import com.app.prajanetraserver.DTO.CommentResponse;
import com.app.prajanetraserver.Model.MyUserDetails;
import com.app.prajanetraserver.Service.CommentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/comments")
public class CommentsController {

    private final CommentService commentService;

    public CommentsController(CommentService commentService) {
        this.commentService = commentService;
    }

    @PostMapping("/create")
    public ResponseEntity<Map<String, Object>> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            CommentResponse commentResponse = commentService.createComment(commentRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment created successfully");
            response.put("comment", commentResponse);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to create comment: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllComments() {
        try {
            List<CommentResponse> commentResponses = commentService.getAllComments();
            Map<String, Object> response = new HashMap<>();
            response.put("comments", commentResponses);
            response.put("totalItems", commentResponses.size());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve comments: " + e.getMessage()));
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<Map<String, Object>> getCommentsByComplaintId(
            @PathVariable String complaintId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir,
            Authentication authentication) {
        try {
            String currentUserId = extractUserId(authentication);
            Map<String, Object> response = commentService.getCommentsByComplaintId(
                    complaintId, page, size, sortBy, sortDir, currentUserId);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve comments: " + e.getMessage()));
        }
    }

    @PutMapping("/{commentId}/toggle-like")
    public ResponseEntity<Map<String, Object>> toggleLike(
            @PathVariable String commentId,
            @RequestParam String userId) {
        try {
            Map<String, Object> likeResult = commentService.toggleLike(commentId, userId);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Like toggled successfully");
            response.put("likes", likeResult.get("likes"));
            response.put("isLiked", likeResult.get("isLiked"));
            response.put("likedByUsers", likeResult.get("likedByUsers"));
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to toggle like: " + e.getMessage()));
        }
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> updateComment(
            @PathVariable String commentId,
            @RequestParam String description) {
        try {
            CommentResponse commentResponse = commentService.updateComment(commentId, description);
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Comment updated successfully");
            response.put("comment", commentResponse);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update comment: " + e.getMessage()));
        }
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Map<String, Object>> deleteComment(@PathVariable String commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.ok(Map.of("message", "Comment deleted successfully"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to delete comment: " + e.getMessage()));
        }
    }

    private String extractUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails userDetails) {
            return userDetails.getUser().getUserId();
        }
        return null;
    }
}