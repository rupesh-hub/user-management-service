package com.alfarays.token.entity;

import com.alfarays.shared.AbstractEntity;
import com.alfarays.token.enums.TokenType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "_tokens")
public class Token extends AbstractEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "_token_id_seq_generator")
    @SequenceGenerator(name = "_token_id_seq_generator", sequenceName = "_token_id_seq", allocationSize = 1, initialValue = 1)
    @Column(name = "id", nullable = false, updatable = false, unique = true)
    private Long id;

    @Column(name = "token", nullable = false, unique = true)
    private String token;

    private LocalDateTime expiresAt;

    private String username;

    @Enumerated(EnumType.STRING)
    private TokenType type;

}
