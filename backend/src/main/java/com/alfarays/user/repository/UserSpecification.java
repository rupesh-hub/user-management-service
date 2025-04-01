package com.alfarays.user.repository;

import com.alfarays.user.entity.User;
import com.alfarays.user.model.UserFilterDTO;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class UserSpecification {

    public static Specification<User> withFilter(UserFilterDTO filter) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            // Search across multiple fields
            if (StringUtils.hasText(filter.getSearchTerm())) {
                String searchTerm = "%" + filter.getSearchTerm().toLowerCase() + "%";
                predicates.add(criteriaBuilder.or(
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("firstName")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("lastName")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("email")), searchTerm),
                        criteriaBuilder.like(criteriaBuilder.lower(root.get("username")), searchTerm)
                ));
            }

            // Individual field filters
            if (StringUtils.hasText(filter.getFirstName())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("firstName")),
                        "%" + filter.getFirstName().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(filter.getLastName())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("lastName")),
                        "%" + filter.getLastName().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(filter.getEmail())) {
                predicates.add(criteriaBuilder.like(
                        criteriaBuilder.lower(root.get("email")),
                        "%" + filter.getEmail().toLowerCase() + "%"
                ));
            }

            if (StringUtils.hasText(filter.getUsername())) {
                predicates.add(criteriaBuilder.equal(
                        criteriaBuilder.lower(root.get("username")),
                        filter.getUsername().toLowerCase()
                ));
            }

            // Boolean filters
            if (filter.getActive() != null) {
                predicates.add(criteriaBuilder.equal(root.get("active"), filter.getActive()));
            }

            // Date range filters
            if (filter.getCreatedAfter() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(
                        root.get("createdOn"),
                        filter.getCreatedAfter().atStartOfDay()
                ));
            }

            if (filter.getCreatedBefore() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(
                        root.get("createdOn"),
                        filter.getCreatedBefore().atTime(LocalTime.MAX)
                ));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
