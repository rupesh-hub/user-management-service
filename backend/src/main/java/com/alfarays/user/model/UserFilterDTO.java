package com.alfarays.user.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Sort;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserFilterDTO {
    private String searchTerm; // Searches across firstName, lastName, email, username
    private String firstName;
    private String lastName;
    private String email;
    private String username;
    private Boolean active;
    private LocalDate createdAfter;
    private LocalDate createdBefore;

    // Sorting
    private String sortBy = "createdAt"; // Default sort field
    private Sort.Direction sortDirection = Sort.Direction.DESC; // Default sort direction
}