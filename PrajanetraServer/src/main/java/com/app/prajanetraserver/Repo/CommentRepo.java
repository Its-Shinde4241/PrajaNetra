package com.app.prajanetraserver.Repo;

import com.app.prajanetraserver.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface CommentRepo extends JpaRepository<Comment, UUID> {

    Optional<Comment> findCommentByCommentId(String commentId);


    void deleteCommentByCommentId(String commentId);

    boolean existsCommentByCommentId(String commentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Comment c set c.likes = c.likes + 1 where c.commentId = :commentId")
    int incrementLikes(@Param("commentId") String commentId);


    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("update Comment c set c.likes=c.likes - 1 where c.commentId = :commentId")
    int decrementLikes(@Param("commentId") String commentId);

    @Query("select c.likes from Comment c where c.commentId = :commentId")
    int getLikes(@Param("commentId") String commentId);
}
