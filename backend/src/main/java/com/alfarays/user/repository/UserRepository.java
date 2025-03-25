package com.alfarays.user.repository;

import com.alfarays.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query(name="User.findByUsername")
    Optional<User> findByUsername(@Param("username") String username);

    @Query(name="User.findByEmail")
    Optional<User> findByEmail(@Param("email") String email);

}