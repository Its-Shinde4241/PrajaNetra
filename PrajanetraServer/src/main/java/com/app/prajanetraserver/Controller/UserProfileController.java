package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.FeedResponse;
import com.app.prajanetraserver.Service.FeedService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class UserProfileController {

    private final FeedService feedService;

    @GetMapping("/{userId}/liked")
    public Page<FeedResponse> getLikedComplaints(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sortBy
    ) {
        return feedService.getUserLikedComplaints(userId, page, size, sortBy);
    }

    @GetMapping("/{userId}/saved")
    public Page<FeedResponse> getSavedComplaints(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "latest") String sortBy
    ) {
        return feedService.getUserSavedComplaints(userId, page, size, sortBy);
    }
}