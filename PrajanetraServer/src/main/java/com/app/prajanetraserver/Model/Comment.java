package com.app.prajanetraserver.Model;

import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Table(name = "comments", indexes = @Index(name = "idx_comment_complaint", columnList = "complaint_id"))
public class Comment {
    @Id
    @GeneratedValue
    private UUID id;

    @Setter
    @Column(nullable = false, unique = true)
    private String commentId;

    @Setter
    @Column(nullable = false)
    private String text;

    @Setter
    private int likes = 0;

    @Setter
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Setter
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "complaint_id", nullable = false)
    private Complaint complaint;

    @Setter
    private LocalDateTime createdAt;
    @Setter
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
