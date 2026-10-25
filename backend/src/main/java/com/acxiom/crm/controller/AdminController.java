package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.CreateUserRequest;
import com.acxiom.crm.dto.UserResponse;
import com.acxiom.crm.entity.Role;
import com.acxiom.crm.entity.User;
import com.acxiom.crm.exception.DuplicateResourceException;
import com.acxiom.crm.exception.ResourceNotFoundException;
import com.acxiom.crm.repository.UserRepository;
import com.acxiom.crm.service.AuditLogService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controller strictly reserved for ADMIN role to manage users, roles, and
 * account status.
 */
@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

        private final UserRepository userRepository;
        private final PasswordEncoder passwordEncoder;
        private final AuditLogService auditLogService;

        public AdminController(
                        UserRepository userRepository,
                        PasswordEncoder passwordEncoder,
                        AuditLogService auditLogService) {
                this.userRepository = userRepository;
                this.passwordEncoder = passwordEncoder;
                this.auditLogService = auditLogService;
        }

        /**
         * GET /api/admin/users
         */
        @GetMapping("/users")
        public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
                List<UserResponse> users = userRepository.findAll().stream()
                                .map(UserResponse::fromEntity)
                                .toList();
                return ResponseEntity.ok(ApiResponse.success("Users retrieved successfully", users));
        }

        /**
         * POST /api/admin/users
         * Creates new user with BCrypt password hashing.
         */
        @PostMapping("/users")
        public ResponseEntity<ApiResponse<UserResponse>> createUser(
                        @Valid @RequestBody CreateUserRequest request,
                        Authentication authentication) {
                if (userRepository.existsByUsername(request.getUsername().trim())) {
                        throw new DuplicateResourceException(
                                        "User with username '" + request.getUsername() + "' already exists");
                }
                if (userRepository.existsByEmail(request.getEmail().trim().toLowerCase())) {
                        throw new DuplicateResourceException(
                                        "User with email '" + request.getEmail() + "' already exists");
                }

                User user = new User(
                                request.getUsername().trim(),
                                request.getEmail().trim().toLowerCase(),
                                passwordEncoder.encode(request.getPassword()),
                                request.getFullName().trim(),
                                request.getRole());

                User saved = userRepository.save(user);

                String actor = authentication != null ? authentication.getName() : "ADMIN";
                auditLogService.logAction(
                                actor,
                                "USER_CREATED",
                                "USER",
                                saved.getId().toString(),
                                "Created user '" + saved.getUsername() + "' with role " + saved.getRole());

                return ResponseEntity.status(HttpStatus.CREATED)
                                .body(ApiResponse.success("User created successfully", UserResponse.fromEntity(saved)));
        }

        /**
         * PUT /api/admin/users/{id}/role
         */
        @PutMapping("/users/{id}/role")
        public ResponseEntity<ApiResponse<UserResponse>> updateUserRole(
                        @PathVariable Long id,
                        @RequestParam Role role,
                        Authentication authentication) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

                Role oldRole = user.getRole();
                user.setRole(role);
                User saved = userRepository.save(user);

                String actor = authentication != null ? authentication.getName() : "ADMIN";
                auditLogService.logAction(
                                actor,
                                "USER_ROLE_CHANGED",
                                "USER",
                                saved.getId().toString(),
                                "Changed role of user '" + saved.getUsername() + "' from " + oldRole + " to " + role);

                return ResponseEntity.ok(
                                ApiResponse.success("User role updated successfully", UserResponse.fromEntity(saved)));
        }

        /**
         * PATCH /api/admin/users/{id}/status
         * Activates or deactivates a user account.
         */
        @PatchMapping("/users/{id}/status")
        public ResponseEntity<ApiResponse<UserResponse>> updateUserStatus(
                        @PathVariable Long id,
                        @RequestParam boolean active,
                        Authentication authentication) {
                User user = userRepository.findById(id)
                                .orElseThrow(() -> new ResourceNotFoundException("User", "id", id));

                user.setActive(active);
                User saved = userRepository.save(user);

                String actor = authentication != null ? authentication.getName() : "ADMIN";
                auditLogService.logAction(
                                actor,
                                "USER_STATUS_CHANGED",
                                "USER",
                                saved.getId().toString(),
                                "Changed active status of user '" + saved.getUsername() + "' to " + active);

                return ResponseEntity.ok(ApiResponse.success("User status updated successfully",
                                UserResponse.fromEntity(saved)));
        }
}
