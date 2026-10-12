package com.acxiom.crm.service;

import com.acxiom.crm.dto.HealthResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

/**
 * Service to evaluate system and database operational readiness.
 */
@Service
public class HealthService {

    private static final Logger log = LoggerFactory.getLogger(HealthService.class);

    private final DataSource dataSource;

    public HealthService(@Autowired(required = false) DataSource dataSource) {
        this.dataSource = dataSource;
    }

    public HealthResponse checkHealth() {
        String dbStatus = checkDatabaseConnectivity();
        return new HealthResponse(
                "UP",
                "AcxiomCRM Backend",
                "1.0.0",
                "local-development",
                dbStatus
        );
    }

    private String checkDatabaseConnectivity() {
        if (dataSource == null) {
            return "DATABASE_NOT_CONFIGURED";
        }
        try (Connection conn = dataSource.getConnection()) {
            boolean valid = conn.isValid(2);
            return valid ? "CONNECTED" : "UNREACHABLE";
        } catch (SQLException e) {
            log.warn("Database connectivity check failed: {}", e.getMessage());
            return "DISCONNECTED - " + e.getMessage();
        } catch (Exception e) {
            log.warn("Unexpected error checking database: {}", e.getMessage());
            return "ERROR - " + e.getMessage();
        }
    }
}
