package com.app.prajanetraserver.Repo;


import com.app.prajanetraserver.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepo extends JpaRepository<User, UUID> {

    Optional<User> findByEmail(String email);

    boolean existsByEmail(String email);

    boolean existsById(UUID uuid);

    boolean existsUserByUserId(String id);

    Optional<User> findUserByUserId(String userId);
}
