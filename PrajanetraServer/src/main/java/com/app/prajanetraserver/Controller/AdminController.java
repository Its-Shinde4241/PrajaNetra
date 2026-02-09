package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.ChangeStatusRequest;
import com.app.prajanetraserver.Service.AdminService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController("/api/admin")
public class AdminController {

    final private AdminService AdminService;

    AdminController(AdminService adminService) {
        this.AdminService = adminService;
    }

    @PutMapping("/complaints/status")
    public ResponseEntity<?> changeComplaintStatus(@Valid @RequestBody ChangeStatusRequest request) {
        try {
            AdminService.changeComplaintStatus(request.getComplaintId(), request.getNewStatus());
            return ResponseEntity.ok("Status updated successfully");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
