package com.app.prajanetraserver.Controller;

import com.app.prajanetraserver.DTO.FeedResponse;
import com.app.prajanetraserver.Model.MyUserDetails;
import com.app.prajanetraserver.Service.FeedService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feed")
public class FeedController {

    private static final Logger log = LoggerFactory.getLogger(FeedController.class);

    private final FeedService feedService;

    public FeedController(FeedService feedService) {
        this.feedService = feedService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getFeed(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "latest") String sortBy,
            Authentication authentication) {


        String currentUserId = extractUserId(authentication);

        log.info("Feed request: page={}, size={}, category={}, status={}, sortBy={}, user={}",
                page, size, category, status, sortBy, currentUserId);

        try {
            Page<FeedResponse> feedPage = feedService.getFeed(page, size, category, status, sortBy, currentUserId);


            Map<String, Object> response = tofeedPage(feedPage);

            return ResponseEntity.ok(response);
        } catch (Exception e) {

            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/trending")
    public ResponseEntity<List<FeedResponse>> getTrending(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {

        String currentUserId = extractUserId(authentication);
        List<FeedResponse> trending = feedService.getTrendingPosts(limit, currentUserId);
        return ResponseEntity.ok(trending);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Map<String, Object>> getUserFeed(
            @PathVariable String userId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            Authentication authentication) {

        String currentUserId = extractUserId(authentication);
        Page<FeedResponse> feedPage = feedService.getUserFeed(userId, page, size, currentUserId);

        Map<String, Object> response = tofeedPage(feedPage);

        return ResponseEntity.ok(response);
    }

    private String extractUserId(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof MyUserDetails userDetails) {
            return userDetails.getUser().getUserId();
        }
        return null;
    }

    public Map<String, Object> tofeedPage(Page<FeedResponse> feedPage) {
        Map<String, Object> response = new HashMap<>();
        response.put("posts", feedPage.getContent());
        response.put("currentPage", feedPage.getNumber());
        response.put("totalPages", feedPage.getTotalPages());
        response.put("totalItems", feedPage.getTotalElements());
        response.put("hasNext", feedPage.hasNext());
        response.put("hasPrevious", feedPage.hasPrevious());
        return response;
    }
}