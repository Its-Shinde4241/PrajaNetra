package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.CommentRequest;
import com.app.prajanetraserver.DTO.CommentResponse;
import com.app.prajanetraserver.Model.Comment;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Repo.CommentRepo;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Transactional
public class CommentService {

    private final CommentRepo commentRepo;
    private final ComplaintRepo complaintRepo;
    private final UserRepo userRepo;

    public CommentService(CommentRepo commentRepo, ComplaintRepo complaintRepo, UserRepo userRepo) {
        this.commentRepo = commentRepo;
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
    }

    /**
     * Convert Comment entity to CommentResponse DTO.
     * Pass currentUserId as null when user context is not available.
     */
    public CommentResponse toCommentResponse(Comment comment, String currentUserId) {
        boolean isLiked = false;
        if (currentUserId != null && comment.getLikedByUsers() != null) {
            isLiked = comment.getLikedByUsers().contains(currentUserId);
        }
        User commentUser = comment.getUser();
        return new CommentResponse(
                comment.getCommentId(),
                comment.getText(),
                comment.getLikes(),
                commentUser.getUserId(),
                commentUser.getName(),
                commentUser.getProfileImageUrl(),
                comment.getComplaint().getComplaintId(),
                comment.getLikedByUsers(),
                isLiked,
                comment.getCreatedAt()
        );
    }

    /**
     * Overloaded: when no user context is available
     */
    public CommentResponse toCommentResponse(Comment comment) {
        return toCommentResponse(comment, null);
    }

    public CommentResponse createComment(CommentRequest commentRequest) {
        if (commentRequest.text() == null || commentRequest.text().trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text is required");
        }
        if (commentRequest.userId() == null || commentRequest.userId().trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }
        if (commentRequest.complaintId() == null || commentRequest.complaintId().trim().isEmpty()) {
            throw new IllegalArgumentException("Complaint ID is required");
        }

        Comment comment = new Comment();
        String commentId = generateCommentId();
        comment.setCommentId(commentId);
        comment.setText(commentRequest.text());
        comment.setLikes(0);
        comment.setUser(
                userRepo.findUserByUserId(commentRequest.userId())
                        .orElseThrow(() -> new RuntimeException("User not found with ID: " + commentRequest.userId()))
        );
        comment.setComplaint(
                complaintRepo.findByComplaintId(commentRequest.complaintId())
                        .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + commentRequest.complaintId()))
        );

        Comment saved = commentRepo.save(comment);
        return toCommentResponse(saved, commentRequest.userId());
    }

    public CommentResponse updateComment(String commentId, String description) {
        if (description == null || description.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment text cannot be empty");
        }
        Comment comment = commentRepo.findCommentByCommentId(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + commentId));
        comment.setText(description);
        return toCommentResponse(commentRepo.save(comment));
    }

    public void deleteComment(String commentId) {
        if (!commentRepo.existsCommentByCommentId(commentId)) {
            throw new RuntimeException("Comment not found with ID: " + commentId);
        }
        commentRepo.deleteCommentByCommentId(commentId);
    }

    /**
     * Toggle like on a comment — exactly like complaint toggle.
     * If user already liked -> remove like (unlike).
     * If user hasn't liked -> add like.
     * Returns a map with updated likes count and liked status.
     */
    public Map<String, Object> toggleLike(String commentId, String userId) {
        if (commentId == null || commentId.trim().isEmpty()) {
            throw new IllegalArgumentException("Comment ID is required");
        }
        if (userId == null || userId.trim().isEmpty()) {
            throw new IllegalArgumentException("User ID is required");
        }

        Comment comment = commentRepo.findCommentByCommentId(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found with ID: " + commentId));

        boolean isLiked;

        if (comment.getLikedByUsers().contains(userId)) {
            // User already liked — remove like
            comment.getLikedByUsers().remove(userId);
            comment.setLikes(comment.getLikedByUsers().size());
            isLiked = false;
        } else {
            // User hasn't liked — add like
            comment.getLikedByUsers().add(userId);
            comment.setLikes(comment.getLikedByUsers().size());
            isLiked = true;
        }

        commentRepo.save(comment);

        Map<String, Object> result = new HashMap<>();
        result.put("likes", comment.getLikes());
        result.put("isLiked", isLiked);
        result.put("likedByUsers", comment.getLikedByUsers());
        return result;
    }

    public List<CommentResponse> getAllComments() {
        return commentRepo.findAll()
                .stream()
                .map(this::toCommentResponse)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getCommentsByComplaintId(String complaintId, int page, int size, String sortBy, String sortDir, String currentUserId) {
        Complaint complaint = complaintRepo.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        Sort.Direction direction = sortDir.equalsIgnoreCase("asc") ? Sort.Direction.ASC : Sort.Direction.DESC;
        Pageable pageable = PageRequest.of(page, size, Sort.by(direction, sortBy));

        Page<Comment> commentPage = commentRepo.findByComplaint(complaint, pageable);

        List<CommentResponse> comments = commentPage.getContent()
                .stream()
                .map(comment -> toCommentResponse(comment, currentUserId))
                .collect(Collectors.toList());

        Map<String, Object> result = new HashMap<>();
        result.put("comments", comments);
        result.put("currentPage", commentPage.getNumber());
        result.put("totalPages", commentPage.getTotalPages());
        result.put("totalItems", commentPage.getTotalElements());
        result.put("hasNext", commentPage.hasNext());
        result.put("hasPrevious", commentPage.hasPrevious());

        return result;
    }

    public String generateCommentId() {
        String id;
        do {
            long timestamp = System.currentTimeMillis();
            id = "CMT" + String.valueOf(timestamp).substring(5);
        } while (commentRepo.existsCommentByCommentId(id));
        return id;
    }
}