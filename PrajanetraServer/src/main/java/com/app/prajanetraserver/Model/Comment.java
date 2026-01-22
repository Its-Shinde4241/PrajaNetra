    package com.app.prajanetraserver.Model;

    import jakarta.persistence.*;
    import lombok.AllArgsConstructor;
    import lombok.Data;
    import lombok.NoArgsConstructor;
    import net.minidev.json.annotate.JsonIgnore;

    import java.time.LocalDateTime;
    import java.util.UUID;

    @Entity
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Table(name = "comments", indexes = @Index(name = "idx_comment_complaint", columnList = "complaint_id"))
    public class Comment {
        @Id
        @GeneratedValue
        private UUID id;

        @Column(nullable = false, unique = true)
        private String commentId;

        @Column(nullable = false)
        private String text;

        private int likes = 0;

        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "user_id", nullable = false)
        private User user;

        @JsonIgnore
        @ManyToOne(fetch = FetchType.LAZY, optional = false)
        @JoinColumn(name = "complaint_id", nullable = false)
        private Complaint complaint;

        private LocalDateTime createdAt;
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
