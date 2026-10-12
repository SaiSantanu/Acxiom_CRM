package com.acxiom.crm.config;

import com.acxiom.crm.entity.Role;
import com.acxiom.crm.entity.User;
import com.acxiom.crm.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Initializes default development roles and accounts if no users exist.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DataInitializer.class);

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.security.admin.username:admin}")
    private String adminUsername;

    @Value("${app.security.admin.email:admin@acxiom.com}")
    private String adminEmail;

    @Value("${app.security.admin.password:Admin#1234}")
    private String adminPassword;

    public DataInitializer(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            log.info("No users found in database. Initializing default accounts for RBAC...");

            // 1. Admin Account
            User admin = new User(
                    adminUsername,
                    adminEmail,
                    passwordEncoder.encode(adminPassword),
                    "System Administrator",
                    Role.ADMIN
            );
            userRepository.save(admin);
            log.info("Initialized default ADMIN: username='{}', email='{}'", adminUsername, adminEmail);

            // 2. Sales Manager Account
            User manager = new User(
                    "manager",
                    "manager@acxiom.com",
                    passwordEncoder.encode("Manager#1234"),
                    "Operations Manager",
                    Role.MANAGER
            );
            userRepository.save(manager);
            log.info("Initialized default MANAGER: username='manager', email='manager@acxiom.com'");

            // 3. Sales Executive Account
            User sales = new User(
                    "sales",
                    "sales@acxiom.com",
                    passwordEncoder.encode("Sales#1234"),
                    "Alex Mercer",
                    Role.SALES_EXECUTIVE
            );
            userRepository.save(sales);
            log.info("Initialized default SALES_EXECUTIVE: username='sales', email='sales@acxiom.com'");
        }
    }
}
