package com.app.prajanetraserver.Model;

import com.app.prajanetraserver.DTO.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.*;

@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "users")
@Getter
public class User {
    @Id
    @GeneratedValue
    private UUID id;

    @Setter
    @Column(unique = true, nullable = false)
    private String userId;

    @Setter
    @Column(nullable = false)
    private String name;

    @Setter
    private String password;

    @Setter
    @Column(unique = true, nullable = false)
    private String email;

    @Setter
    @Column(length = 1000)
    private String profileImageUrl;

    @Setter
    @Column(unique = true)
    private String googleId;

    @Setter
    @Column(name = "login_method", nullable = false)
    private String loginMethod = "LOCAL";


    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Complaint> complaints = new ArrayList<>();

    @Setter
    @Column(nullable = false)
    private LocalDateTime createdAt;

    @Setter
    @Column(nullable = false)
    private LocalDateTime updatedAt;

    @Setter
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"))
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Set<Role> roles = new HashSet<>(Set.of(Role.USER));

    @Setter
    @ElementCollection
    @CollectionTable(name = "user_liked_complaints", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "complaint_id")
    private Set<String> likedComplaints = new HashSet<>();

    @Setter
    @ElementCollection
    @CollectionTable(name = "user_saved_complaints", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "complaint_id")
    private Set<String> savedComplaints = new HashSet<>();

    // Getters
    public Set<String> getLikedComplaints() {
        if (likedComplaints == null) {
            likedComplaints = new HashSet<>();
        }
        return likedComplaints;
    }


    public Set<String> getSavedComplaints() {
        if (savedComplaints == null) {
            savedComplaints = new HashSet<>();
        }
        return savedComplaints;
    }


    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
