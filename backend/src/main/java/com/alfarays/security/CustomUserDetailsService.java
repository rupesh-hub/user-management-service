package com.alfarays.security;

import com.alfarays.image.repository.ImageRepository;
import com.alfarays.user.model.PrincipleUser;
import com.alfarays.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final ImageRepository imageRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found by username: " + username));
        imageRepository.findByUserId(user.getId())
                .ifPresent(user::setProfile);
        return new PrincipleUser(user);
    }

}
