package com.app.prajanetraserver.Repo;

import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Repository
public interface ComplaintRepo extends JpaRepository<Complaint, UUID> {

    Optional<Complaint> findByComplaintId(String complaintId);

    boolean existsByComplaintId(String complaintId);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    Page<Complaint> findByCategory(String category, Pageable pageable);

    void deleteByComplaintId(String complaintId);

    Page<Complaint> findComplaintsByUser(User user, Pageable pageable);

    @Query("select c.complaintId from Complaint c where c.user.id= :id")
    Set<String> findComplaintIdsByUser(@Param("id") UUID id);

    @Query("""
                select count(c)
                from Complaint c
                where c.user.id = :id
                  and c.status = :status
            """)
    long countByUserAndStatus(
            @Param("id") UUID id,
            @Param("status") ComplaintStatus status
    );


    @Modifying
    @Query("update Complaint set likes=likes+1 where complaintId= :complaintId")
    void incrementLikes(@Param("complaintId") String complaintId);


    @Modifying
    @Query("update Complaint set likes=likes-1 where complaintId= :complaintId and likes !=0")
    void decrementLikes(@Param("complaintId") String complaintId);

    @Modifying
    @Query("""
            update Complaint
            set status = :newStatus
            where complaintId = :complaintId
            """)
    void changeStatus(String complaintId, ComplaintStatus newStatus);
}
