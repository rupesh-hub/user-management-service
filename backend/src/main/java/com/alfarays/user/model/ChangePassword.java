package com.alfarays.user.model;

import com.alfarays.token.enums.TokenType;
import lombok.*;


public record ChangePassword(String oldPassword, String newPassword, String confirmNewPassword, String token, TokenType type) {

    public boolean isValid() {
        return !oldPassword.equals(newPassword) && newPassword.equals(confirmNewPassword);
    }

}
