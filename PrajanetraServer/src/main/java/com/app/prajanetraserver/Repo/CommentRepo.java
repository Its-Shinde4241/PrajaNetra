package com.app.prajanetraserver.Repo;

import java.util.Optional;
import java.util.UUID;

import com.app.prajanetraserver.Model.Complaint;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.app.prajanetraserver.Model.Comment;

@Repository
public interface CommentRepo extends JpaRepository<Comment, UUID> {

    Optional<Comment> findCommentByCommentId(String commentId);

    @Modifying
    void deleteCommentByCommentId(String commentId);

    boolean existsCommentByCommentId(String commentId);

    Page<Comment> findByComplaint(Complaint complaint, Pageable pageable);

    long countByComplaint(Complaint complaint);
}
