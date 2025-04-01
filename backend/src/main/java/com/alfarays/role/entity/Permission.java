package com.alfarays.role.entity;

import com.alfarays.role.enums.PermissionCategory;
import com.alfarays.shared.AbstractEntity;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "_permissions")
public class Permission extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "_permission_id_seq_generator")
    @SequenceGenerator(name = "_permission_id_seq_generator", sequenceName = "_permission_id_seq", allocationSize = 1, initialValue = 1)
    @Column(name = "id", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "name", nullable = false, unique = true)
    private String name;

    private PermissionCategory category;

    private String description;

    @ManyToMany(mappedBy = "permissions", fetch = FetchType.LAZY)
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

}
