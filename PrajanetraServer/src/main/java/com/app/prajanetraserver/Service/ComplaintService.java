package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.DTO.ComplaintResponse;
import com.app.prajanetraserver.DTO.CreateComplaintRequest;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ComplaintService {

    private final ComplaintRepo complaintRepo;

    public ComplaintService(ComplaintRepo complaintRepo) {
        this.complaintRepo = complaintRepo;
    }

    public Complaint createComplaint(CreateComplaintRequest request, List<String> imageUrls) {
        String complaintId = generateComplaintId();

        Complaint complaint = new Complaint();
        complaint.setComplaintId(complaintId);
        complaint.setName(request.getName());
        complaint.setEmail(request.getEmail());
        complaint.setPhone(request.getPhone());
        complaint.setCategory(request.getCategory());
        complaint.setLocation(request.getLocation());
        complaint.setDescription(request.getDescription());
        complaint.setImageUrls(imageUrls);
        complaint.setStatus(ComplaintStatus.SUBMITTED);
        complaint.setCreatedAt(LocalDateTime.now());
        complaint.setUpdatedAt(LocalDateTime.now());

        return complaintRepo.save(complaint);
    }

    public Optional<Complaint> getComplaintByComplaintId(String complaintId) {
        return complaintRepo.findByComplaintId(complaintId);
    }

    public Page<Complaint> getAllComplaints(Pageable pageable) {
        return complaintRepo.findAll(pageable);
    }

    public Page<Complaint> getComplaintsByStatus(ComplaintStatus status, Pageable pageable) {
        return complaintRepo.findByStatus(status, pageable);
    }

    public Page<Complaint> getComplaintsByCategory(String category, Pageable pageable) {
        return complaintRepo.findByCategory(category, pageable);
    }

    public Page<Complaint> getComplaintsByEmail(String email, Pageable pageable) {
        return complaintRepo.findByEmail(email, pageable);
    }

    public Complaint updateComplaintStatus(String complaintId, ComplaintStatus newStatus) {
        Complaint complaint = complaintRepo.findByComplaintId(complaintId)
                .orElseThrow(() -> new RuntimeException("Complaint not found with ID: " + complaintId));

        complaint.setStatus(newStatus);
        complaint.setUpdatedAt(LocalDateTime.now());

        return complaintRepo.save(complaint);
    }

    public ComplaintResponse toComplaintResponse(Complaint complaint) {
        return new ComplaintResponse(
                complaint.getComplaintId(),
                complaint.getName(),
                complaint.getEmail(),
                complaint.getPhone(),
                complaint.getCategory(),
                complaint.getLocation(),
                complaint.getDescription(),
                complaint.getImageUrls(),
                complaint.getStatus(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt());
    }

    private String generateComplaintId() {
        String id;
        do {
            long timestamp = System.currentTimeMillis();
            id = "MCP" + String.valueOf(timestamp).substring(5);
        } while (complaintRepo.existsByComplaintId(id));
        return id;
    }
}
