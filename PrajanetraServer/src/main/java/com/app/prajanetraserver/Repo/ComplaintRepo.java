package com.app.prajanetraserver.Repo;

import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface ComplaintRepo extends JpaRepository<Complaint, UUID> {

    Optional<Complaint> findByComplaintId(String complaintId);

    boolean existsByComplaintId(String complaintId);

    Page<Complaint> findByStatus(ComplaintStatus status, Pageable pageable);

    Page<Complaint> findByCategory(String category, Pageable pageable);

    void deleteByComplaintId(String complaintId);

    Page<Complaint> findComplaintsByUser(User user, Pageable pageable);
}
