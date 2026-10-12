package com.acxiom.crm.controller;

import com.acxiom.crm.dto.ApiResponse;
import com.acxiom.crm.dto.AuthResponse;
import com.acxiom.crm.dto.LoginRequest;
import com.acxiom.crm.entity.User;
import com.acxiom.crm.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.web.bind.annotation.*;

/**
 * Controller handling user authentication (Login, Logout, Current User Profile).
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger log = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final UserRepository userRepository;
    private final com.acxiom.crm.service.AuditLogService auditLogService;

    public AuthController(AuthenticationManager authenticationManager,
                          SecurityContextRepository securityContextRepository,
                          UserRepository userRepository,
                          com.acxiom.crm.service.AuditLogService auditLogService) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    /**
     * POST /api/auth/login
     */
    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody LoginRequest loginRequest,
                                                           HttpServletRequest request,
                                                           HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getUsernameOrEmail().trim(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContext context = SecurityContextHolder.createEmptyContext();
            context.setAuthentication(authentication);
            SecurityContextHolder.setContext(context);
            securityContextRepository.saveContext(context, request, response);

            User user = userRepository.findByUsernameOrEmail(authentication.getName())
                    .orElseThrow(() -> new IllegalStateException("Authenticated user not found in database"));

            auditLogService.logAction(user.getUsername(), "LOGIN", "USER", String.valueOf(user.getId()), "Successful login");
            log.info("User '{}' (role: {}) logged in successfully.", user.getUsername(), user.getRole());
            return ResponseEntity.ok(ApiResponse.success("Authentication successful", AuthResponse.fromEntity(user)));
        } catch (BadCredentialsException ex) {
            auditLogService.logAction(loginRequest.getUsernameOrEmail(), "LOGIN_FAILED", "USER", null, "Bad credentials attempt");
            log.warn("Failed login attempt for identifier: {}", loginRequest.getUsernameOrEmail());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "Invalid username/email or password"));
        }
    }

    /**
     * POST /api/auth/logout
     */
    @PostMapping("/logout")
    public ResponseEntity<ApiResponse<Void>> logout(HttpServletRequest request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getName())) {
            auditLogService.logAction(auth.getName(), "LOGOUT", "USER", null, "User logged out");
            log.info("Logging out user '{}'", auth.getName());
        }

        HttpSession session = request.getSession(false);
        if (session != null) {
            session.invalidate();
        }
        SecurityContextHolder.clearContext();

        return ResponseEntity.ok(ApiResponse.success("Logged out successfully", null));
    }

    /**
     * GET /api/auth/me
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<AuthResponse>> getCurrentUser(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated() || "anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "User is not authenticated"));
        }

        User user = userRepository.findByUsernameOrEmail(authentication.getName())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.error(401, "User record not found"));
        }

        return ResponseEntity.ok(ApiResponse.success("Current user profile retrieved", AuthResponse.fromEntity(user)));
    }
}
