package com.app.prajanetraserver.Service;


import com.app.prajanetraserver.DTO.ComplaintStatus;
import com.app.prajanetraserver.Repo.ComplaintRepo;
import com.app.prajanetraserver.Repo.UserRepo;
import com.app.prajanetraserver.DTO.UserResponse;
import com.app.prajanetraserver.Model.MyUserDetails;
import com.app.prajanetraserver.Model.User;
import jakarta.transaction.Transactional;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.Set;

@Service
@Transactional
public class UserService implements UserDetailsService {


    private final UserRepo userRepo;

    private final PasswordEncoder passwordEncoder;
    private final ComplaintRepo complaintRepo;

    UserService(PasswordEncoder passwordEncoder, UserRepo userRepo, ComplaintRepo complaintRepo) {
        this.passwordEncoder = passwordEncoder;
        this.userRepo = userRepo;
        this.complaintRepo = complaintRepo;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
        return new MyUserDetails(user);
    }

    public User createUser(String email, String password, String name) {
        if (userRepo.existsByEmail(email)) {
            throw new RuntimeException("User with email " + email + " already exists.");
        }

        User user = new User();
        String userId = generateUserId();
        user.setUserId(userId);
        user.setName(name);
        user.setEmail(email);
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        user.setLoginMethod("LOCAL");

        return userRepo.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepo.findByEmail(email);
    }

    public Optional<User> findByUserId(String id) {
        return userRepo.findUserByUserId((id));
    }

    public User updateUser(User user) {
        return userRepo.save(user);
    }

    public User createOauthUser(User user) {
        user.setPassword(null);
        String userId = generateUserId();
        user.setUserId(userId);
        user.setLoginMethod("GOOGLE");
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());
        return userRepo.save(user);
    }

    public UserResponse getUserResponse(User user) {
        Set<String> complaintIds = complaintRepo.findComplaintIdsByUser(user.getId());
        System.out.println(complaintIds);
        long resolved = complaintRepo.countByUserAndStatus(user.getId(), ComplaintStatus.RESOLVED);
        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getProfileImageUrl(),
                user.getGoogleId(),
                user.getLoginMethod(),
                user.getCreatedAt(),
                user.getUpdatedAt(),
                user.getRoles(),
                complaintIds,
                resolved
        );
    }

    public String generateUserId() {
        String id;
        do {
            long timestamp = System.currentTimeMillis();
            id = "USR" + String.valueOf(timestamp).substring(5);
        } while (userRepo.existsUserByUserId(id));
        return id;
    }
}
