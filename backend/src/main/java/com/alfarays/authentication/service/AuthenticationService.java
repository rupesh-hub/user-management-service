package com.alfarays.authentication.service;

import com.alfarays.authentication.model.AuthenticationRequest;
import com.alfarays.authentication.model.AuthenticationResponse;
import com.alfarays.authentication.model.ForgetPasswordRequest;
import com.alfarays.authentication.model.RegistrationRequest;
import com.alfarays.exception.AuthorizationException;
import com.alfarays.image.entity.Image;
import com.alfarays.image.service.ImageService;
import com.alfarays.mail.enums.MailSubject;
import com.alfarays.mail.service.IMailService;
import com.alfarays.mail.model.MailRequest;
import com.alfarays.mail.enums.MailTemplate;
import com.alfarays.role.repository.RoleRepository;
import com.alfarays.security.TokenService;
import com.alfarays.token.enums.DurationUnit;
import com.alfarays.token.enums.TokenType;
import com.alfarays.token.service.ITokenService;
import com.alfarays.user.entity.User;
import com.alfarays.user.mapper.UserMapper;
import com.alfarays.user.model.PrincipleUser;
import com.alfarays.user.repository.UserRepository;
import com.alfarays.util.GlobalResponse;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.MethodParameter;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.multipart.MultipartFile;

import java.util.*;
import java.util.stream.Collectors;

import static com.alfarays.mail.enums.MailSubject.ACCOUNT_ACTIVATION_REQUEST;
import static com.alfarays.mail.enums.MailTemplate.FORGOT_PASSWORD_REQUEST;
import static com.alfarays.token.enums.DurationUnit.MINUTE;
import static com.alfarays.token.enums.TokenType.*;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;
    private final ImageService imageService;
    private final RoleRepository roleRepository;

    private final ITokenService confirmationTokenService;
    private final IMailService mailService;

    @Value("${application.email.activation_url}")
    private String activationUrl;

    private static final DurationUnit DURATION_UNIT = MINUTE;
    private static final int TOKEN_DURATION = 15;

    @Transactional
    public GlobalResponse<Void> register(RegistrationRequest request, MultipartFile image) throws MethodArgumentNotValidException {

        var user = UserMapper.toEntity(request);
        List<FieldError> fieldErrors = new ArrayList<>();

        //validate username
        var optionalUserByUsername = userRepository.findByUsername(request.username());
        if (optionalUserByUsername.isPresent()) {
            fieldErrors.add(new FieldError("user", "username", String.format("User with username '%s' already exists.", request.username())));
        }

        //validate email
        var optionalUserByEmail = userRepository.findByEmail(request.email());
        if (optionalUserByEmail.isPresent()) {
            fieldErrors.add(new FieldError("user", "email", String.format("User with email '%s' already exists.", request.email())));
        }

        if (!fieldErrors.isEmpty()) {
            BindingResult bindingResult = new BeanPropertyBindingResult(user, "user");
            fieldErrors.forEach(bindingResult::addError);

            // Use MethodParameter to get the method parameter
            MethodParameter methodParameter = new MethodParameter(
                    Arrays.stream(this.getClass().getDeclaredMethods())
                            .filter(method -> method.getName().equals("register"))
                            .findFirst()
                            .orElseThrow(), 0
            );

            throw new MethodArgumentNotValidException(methodParameter, bindingResult);
        }

        user.setPassword(passwordEncoder.encode(user.getPassword()));

        var role = roleRepository.findByName("user")
                .orElseThrow(() -> new RuntimeException("Role 'user' does not exist."));

        user.setRoles(List.of(role));
        user = userRepository.save(user);

        Image profile = imageService.uploadImage(image, user);
        user.setProfile(profile);

        // Confirmation token
        String token = confirmationTokenService.create(user.getUsername(), ACCOUNT_ACTIVATED, TOKEN_DURATION, DURATION_UNIT);

        // Send confirmation email
        sendMail(user, token, ACCOUNT_ACTIVATION_REQUEST.content(), MailTemplate.ACCOUNT_ACTIVATION, activationUrl);

        return GlobalResponse.success(user.getUsername());
    }

    public GlobalResponse<AuthenticationResponse> authenticate(AuthenticationRequest request) {
        try {
            var auth = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.username(), request.password()));

            Map<String, Object> claims = new HashMap<>();
            PrincipleUser principle = (PrincipleUser) auth.getPrincipal();
            claims.put("username", principle.getUsername());
            claims.put("authorities", principle.getAuthorities());

            var token = tokenService.generateToken(claims, principle);

            return GlobalResponse.success(
                    AuthenticationResponse
                            .builder()
                            .name(principle.user().getFirstName() + " " + principle.user().getLastName())
                            .profile(principle.user().getProfile().getPath())
                            .username(principle.getUsername())
                            .email(principle.getUsername())
                            .email(principle.user().getEmail())
                            .token(token)
                            .roles(principle.getAuthorities()
                                    .stream()
                                    .map(GrantedAuthority::getAuthority)
                                    .collect(Collectors.toSet())
                            ).build()
            );
        } catch (Exception e) {
            throw new RuntimeException(e.getMessage().toUpperCase());
        }
    }

    public GlobalResponse<Void> activateAccount(String username, String value, TokenType type) {
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User does not exists."));

        confirmationTokenService.validate(username, value, type);

        // Proceed with successful validation
        user.setEnabled(true);
        userRepository.save(user);
        confirmationTokenService.invalidate(username, value, type);
        return GlobalResponse.success("User's account has been activated.");
    }


    public GlobalResponse<Void> resendConfirmationToken(String username) {
        String token = confirmationTokenService.create(username, ACCOUNT_ACTIVATED, TOKEN_DURATION, DURATION_UNIT);
        var user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User does not exists."));

        sendMail(user, token, ACCOUNT_ACTIVATION_REQUEST.content(), MailTemplate.ACCOUNT_ACTIVATION, activationUrl);

        return GlobalResponse.success("A new confirmation email has been sent to your registered email address.");
    }

    public GlobalResponse<Void> forgetPasswordRequest(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User does not exists."));

        String token = confirmationTokenService.create(username, FORGET_PASSWORD, TOKEN_DURATION, DURATION_UNIT);

        sendMail(user, token, MailSubject.FORGET_PASSWORD_REQUEST.content(), FORGOT_PASSWORD_REQUEST,
                String.format("http://localhost:4200/change-password/%s", token));

        return GlobalResponse.success("A confirmation email has been sent to your registered email address.");
    }

    public GlobalResponse<Void> changePassword(ForgetPasswordRequest request) {
        User user = userRepository.findByUsername(request.username())
                .orElseThrow(() -> new RuntimeException("User does not exists."));

        confirmationTokenService.validate(request.username(), request.token(), FORGET_PASSWORD);

        if (!request.password().equals(request.confirmPassword())) {
            throw new AuthorizationException("Password and confirm password do not match!");
        }

        user.setPassword(passwordEncoder.encode(request.password()));
        userRepository.save(user);

        confirmationTokenService.invalidate(request.username(), request.token(), FORGET_PASSWORD);

        return GlobalResponse.success("Password has been updated successfully.");
    }

    private void sendMail(User user, String token, String subject, MailTemplate template, String confirmationURL) {
        mailService.send(
                MailRequest
                        .builder()
                        .from("rupeshdulal672@gmail.com")
                        .to(user.getEmail())
                        .name(user.getFirstName() + " " + user.getLastName())
                        .username(user.getUsername())
                        .subject(subject)
                        .activationCode(token)
                        .confirmationUrl(confirmationURL)
                        .template(template)
                        .build()
        );
    }

}
