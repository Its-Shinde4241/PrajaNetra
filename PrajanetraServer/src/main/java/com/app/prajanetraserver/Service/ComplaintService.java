package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.Model.Complaint;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.DTO.ComplaintResponse;
import com.app.prajanetraserver.DTO.CreateComplaintRequest;
import com.app.prajanetraserver.Repo.UserRepo;
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
    private final UserRepo userRepo;

    public ComplaintService(ComplaintRepo complaintRepo, UserRepo userRepo) {
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
    }

    public Complaint createComplaint(CreateComplaintRequest request, List<String> imageUrls) {
        String complaintId = generateComplaintId();
        System.out.println(imageUrls);
        Complaint complaint = new Complaint();
        complaint.setTitle(request.getTitle());
        complaint.setComplaintId(complaintId);
        complaint.setUser(userRepo.findUserByUserId(request.getUserId()).orElseThrow());
        complaint.setCategory(request.getCategory());
        complaint.setLatitude(request.getLatitude());
        complaint.setLongitude(request.getLongitude());
        complaint.setFormattedAddress(request.getFormattedAddress());
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

    public Page<Complaint> getComplaintsByUserId(String userId, Pageable pageable) {
        return complaintRepo.findComplaintsByUser(userRepo.findUserByUserId(userId).orElseThrow(), pageable);
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
                complaint.getUser().getUserId(),
                complaint.getTitle(),
                complaint.getCategory(),
                complaint.getLatitude(),
                complaint.getLongitude(),
                complaint.getFormattedAddress(),
                complaint.getDescription(),
                complaint.getLikes(),
                complaint.getImageUrls(),
                complaint.getStatus(),
                complaint.getCreatedAt(),
                complaint.getUpdatedAt()
        );
    }

    public void deleteComplaint(String complaintId) {
        complaintRepo.deleteByComplaintId(complaintId);
    }

    public void incrementLikes(String complaintId) {
        complaintRepo.incrementLikes(complaintId);
    }

    public void decrementLikes(String complaintId) {
        complaintRepo.decrementLikes(complaintId);
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
