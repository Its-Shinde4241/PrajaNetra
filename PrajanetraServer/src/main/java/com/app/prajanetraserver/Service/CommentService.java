package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.CommentRequest;
import com.app.prajanetraserver.DTO.CommentResponse;
import com.app.prajanetraserver.Model.Comment;
import com.app.prajanetraserver.Repo.CommentRepo;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@Transactional
public class CommentService {

    @Autowired
    private CommentRepo commentRepo;

    @Autowired
    private ComplaintRepo complaintRepo;

    @Autowired
    private UserRepo userRepo;

    public CommentResponse toCommentResponse(Comment comment) {
        return new CommentResponse(comment.getCommentId(), comment.getText(), comment.getLikes(), comment.getUser().getUserId(), comment.getComplaint().getComplaintId());
    }

    public CommentResponse createComment(CommentRequest commentRequest) {
        Comment comment = new Comment();
        String commentId = generateCommentId();
        comment.setCommentId(commentId);
        comment.setText(commentRequest.text());
        comment.setUser(userRepo
                .findUserByUserId(commentRequest.userId())
                .orElseThrow()
        );
        comment.setComplaint(complaintRepo
                .findByComplaintId(commentRequest.complaintId())
                .orElseThrow()
        );
        return toCommentResponse(commentRepo.save(comment));
    }

    public CommentResponse updateComment(String commentId, String description) {
        Comment comment = commentRepo.findCommentByCommentId(commentId).orElseThrow(() -> new RuntimeException("Comment not found with  id :" + commentId));
        comment.setText(description);
        return toCommentResponse(commentRepo.save(comment));
    }

    public void deleteComment(String commentId) {
        if (!commentRepo.existsCommentByCommentId(commentId)) {
            throw new RuntimeException("Comment not found");
        }
        commentRepo.deleteCommentByCommentId(commentId);
    }


    public int increaseLikes(String commentId) {
        int ch = commentRepo.incrementLikes(commentId);
        if (ch == 0) {
            throw new RuntimeException("Comment not found");
        }
        return commentRepo.getLikes(commentId);
    }

    public int decreaseLikes(String commentId) {
        int ch = commentRepo.decrementLikes(commentId);
        if (ch == 0) {
            throw new RuntimeException("Comment not found");
        }
        return commentRepo.getLikes(commentId);
    }

    public String generateCommentId() {
        String id;
        do {
            long timestamp = System.currentTimeMillis();
            id = "MCP" + String.valueOf(timestamp).substring(5);
        } while (commentRepo.existsCommentByCommentId((id)));
        return id;
    }

}
