package com.alfarays.util;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;

import java.util.List;

/**
 * A generic response class for API responses.
 *
 * @param <T> The type of data included in the response.
 */
@Value
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE) // Force usage of static factory methods
@JsonInclude(JsonInclude.Include.NON_NULL)
public class GlobalResponse<T> {

    String message;
    ResponseStatus status;
    String code;
    String error;
    List<String> errors;
    T data;
    Paging page;

    /**
     * Enum for response status.
     */
    public enum ResponseStatus {
        SUCCESS, FAILURE
    }

    /**
     * Static factory method for a successful response with data.
     *
     * @param data The data to include in the response.
     * @return A GlobalResponse instance.
     */
    public static <T> GlobalResponse<T> success(T data) {
        return GlobalResponse.<T>builder()
                .message("Success")
                .status(ResponseStatus.SUCCESS)
                .code("200")
                .data(data)
                .build();
    }

    /**
     * Static factory method for a successful response with data and pagination.
     *
     * @param data The data to include in the response.
     * @param page The pagination details.
     * @return A GlobalResponse instance.
     */
    public static <T> GlobalResponse<T> success(T data, Paging page) {
        return GlobalResponse.<T>builder()
                .message("Success")
                .status(ResponseStatus.SUCCESS)
                .code("200")
                .data(data)
                .page(page)
                .build();
    }

    /**
     * Static factory method for a successful response with a custom message and data.
     *
     * @param message The custom message.
     * @param data    The data to include in the response.
     * @return A GlobalResponse instance.
     */
    public static <T> GlobalResponse<T> success(String message, T data) {
        return GlobalResponse.<T>builder()
                .message(message)
                .status(ResponseStatus.SUCCESS)
                .code("200")
                .data(data)
                .build();
    }

    /**
     * Static factory method for a successful response with a custom message.
     *
     * @param message The custom message.
     * @return A GlobalResponse instance.
     */
    public static GlobalResponse<Void> success(String message) {
        return GlobalResponse.<Void>builder()
                .message(message)
                .status(ResponseStatus.SUCCESS)
                .code("200")
                .build();
    }

    /**
     * Static factory method for a generic successful response.
     *
     * @return A GlobalResponse instance.
     */
    public static GlobalResponse<Void> success() {
        return GlobalResponse.<Void>builder()
                .status(ResponseStatus.SUCCESS)
                .code("200")
                .build();
    }

    /**
     * Static factory method for a failure response with an error message.
     *
     * @param errorMessage The error message.
     * @return A GlobalResponse instance.
     */
    public static GlobalResponse<Void> failure(String errorMessage) {
        return GlobalResponse.<Void>builder()
                .status(ResponseStatus.FAILURE)
                .code("500")
                .error(errorMessage)
                .build();
    }

    /**
     * Static factory method for a failure response with a list of errors.
     *
     * @param errors The list of errors.
     * @return A GlobalResponse instance.
     */
    public static GlobalResponse<Void> failure(List<String> errors) {
        return GlobalResponse.<Void>builder()
                .status(ResponseStatus.FAILURE)
                .code("500")
                .errors(errors)
                .build();
    }

    /**
     * Static factory method for a failure response with a custom status code.
     *
     * @param errorMessage The error message.
     * @param code        The custom status code.
     * @return A GlobalResponse instance.
     */
    public static GlobalResponse<Void> failure(String errorMessage, String code) {
        return GlobalResponse.<Void>builder()
                .status(ResponseStatus.FAILURE)
                .code(code)
                .error(errorMessage)
                .build();
    }
}