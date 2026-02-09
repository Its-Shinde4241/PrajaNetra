package com.app.prajanetraserver.Service;

import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.DTO.Role;
import com.app.prajanetraserver.DTO.UserResponse;
import com.app.prajanetraserver.Model.User;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminService {

    final private ComplaintRepo complaintRepo;
    final private UserRepo userRepo;
    private final UserService userService;

    AdminService(ComplaintRepo complaintRepo, UserRepo userRepo, UserService userService) {
        this.complaintRepo = complaintRepo;
        this.userRepo = userRepo;
        this.userService = userService;
    }

    public void changeComplaintStatus(String complaintId, ComplaintStatus newStatus) {
        complaintRepo.changeStatus(complaintId, newStatus);
    }

    @Transactional
    public UserResponse makeStaff(String userId) {
        try {
            User user = userRepo.findUserByUserId(userId)
                    .orElseThrow(() -> new RuntimeException("user not found for id : " + userId));
            user.getRoles().add(Role.MUNICIPAL_STAFF);
            System.out.println(user);
            userRepo.save(user);
            return userService.getUserResponse(user);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

}
