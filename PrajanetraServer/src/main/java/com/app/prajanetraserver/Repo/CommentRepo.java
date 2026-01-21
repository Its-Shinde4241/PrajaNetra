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

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Comment c set c.likes = c.likes + 1 where c.commentId = :commentId")
    int incrementLikes(@Param("commentId") String commentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Comment c set c.likes=c.likes - 1 where c.commentId = :commentId and c.likes > 0")
    int decrementLikes(@Param("commentId") String commentId);

    @Query("select c.likes from Comment c where c.commentId = :commentId")
    int getLikes(@Param("commentId") String commentId);

    @Query("")
    Page<Comment> findCommentsByComplaint(Complaint complaint, Pageable pageable);
}
