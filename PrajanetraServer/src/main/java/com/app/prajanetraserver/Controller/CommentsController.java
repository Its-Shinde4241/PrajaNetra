package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.CommentRequest;
import com.app.prajanetraserver.DTO.CommentResponse;
import com.app.prajanetraserver.Model.Comment;
import com.app.prajanetraserver.Repo.CommentRepo;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Service.CommentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/comments")
public class CommentsController {

    @Autowired
    private CommentService commentService;
    @Autowired
    private CommentRepo commentRepo;
    @Autowired
    private ComplaintRepo complaintRepo;

    @PostMapping("/create")
    public ResponseEntity<CommentResponse> createComment(@RequestBody CommentRequest commentRequest) {
        try {
            CommentResponse commentResponse = commentService.createComment(commentRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getALlComments() {
        try {
            List<Comment> comments = commentRepo.findAll();
            List<CommentResponse> commentResponses = new ArrayList<>();
            for (Comment comment : comments) {
                commentResponses.add(commentService.toCommentResponse(comment));
            }
            return ResponseEntity.ok(commentResponses);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/complaint/{complaintId}")
    public ResponseEntity<Map<String, Object>> getCommentsByComplaintId(
            @PathVariable String complaintId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        try {
            Sort sort = sortDir.equalsIgnoreCase("asc")
                    ? Sort.by(sortBy).ascending()
                    : Sort.by(sortBy).descending();

            Pageable pageable = PageRequest.of(page, size, sort);
            Page<Comment> commentPage = commentRepo.findCommentsByComplaint(complaintRepo.findByComplaintId(complaintId).orElseThrow(), pageable);

            List<CommentResponse> commentResponses = commentPage.getContent()
                    .stream()
                    .map(commentService::toCommentResponse)
                    .toList();

            Map<String, Object> response = new HashMap<>();
            response.put("comments", commentResponses);
            response.put("currentPage", commentPage.getNumber());
            response.put("totalItems", commentPage.getTotalElements());
            response.put("totalPages", commentPage.getTotalPages());
            response.put("hasNext", commentPage.hasNext());
            response.put("hasPrevious", commentPage.hasPrevious());

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/inclike/{commentId}")
    public ResponseEntity<?> increaseLikes(@PathVariable String commentId) {
        try {
            int likes = commentService.increaseLikes(commentId);
            return ResponseEntity.status(HttpStatus.OK).body(likes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/declike/{commentId}")
    public ResponseEntity<?> decreaseLikes(@PathVariable String commentId) {
        try {
            int likes = commentService.decreaseLikes(commentId);
            return ResponseEntity.status(HttpStatus.OK).body(likes);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @PutMapping("/update/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable String commentId, @RequestParam String description) {
        try {
            CommentResponse commentResponse = commentService.updateComment(commentId, description);
            return ResponseEntity.status(HttpStatus.OK).body(commentResponse);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping("/del/{commentId}")
    public ResponseEntity<?> deleteComment(@PathVariable String commentId) {
        try {
            commentService.deleteComment(commentId);
            return ResponseEntity.status(HttpStatus.OK).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

}
