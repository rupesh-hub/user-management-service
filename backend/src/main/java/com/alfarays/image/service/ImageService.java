package com.alfarays.image.service;

import com.alfarays.image.entity.Image;
import com.alfarays.image.mapper.ImageMapper;
import com.alfarays.image.model.ImageResponse;
import com.alfarays.image.repository.ImageRepository;
import com.alfarays.user.entity.User;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ImageService {

    @Value("${file.upload.directory}")
    private String uploadDir;

    private final ImageRepository imageRepository;

    /**
     * Uploads an image and associates it with a user.
     *
     * @param file The image file to upload.
     * @param user The user associated with the image.
     * @return The saved Image entity.
     */
    public Image uploadImage(MultipartFile file, User user) {
        try {
            Path filePath = saveFileToDisk(file, user);
            String fileDownloadUri = generateFileUrl(filePath);

            Image image = buildImageEntity(file, user, fileDownloadUri, filePath.getFileName().toString());
            return imageRepository.save(image);
        } catch (IOException e) {
            log.error("Error uploading image: ", e);
            throw new RuntimeException("Error uploading image", e);
        }
    }

    /**
     * Retrieves all images associated with a user.
     *
     * @param userId The ID of the user.
     * @return A list of ImageResponse objects.
     */
    public List<ImageResponse> getProfile(Long userId) {
        return imageRepository.findByUserId(userId)
                .stream()
                .map(ImageMapper::toResponse)
                .collect(Collectors.toList());
    }

    /**
     * Deletes an image from the disk and the database.
     *
     * @param existingImage The image to delete.
     * @return True if the deletion was successful.
     * @throws IOException If an error occurs while deleting the file.
     */
    public boolean deleteProfile(Image existingImage) throws IOException {
        Path existingFilePath = Paths.get(existingImage.getPath());
        Files.deleteIfExists(existingFilePath);
        imageRepository.delete(existingImage);
        return true;
    }

    /**
     * Updates an existing image with a new file.
     *
     * @param newProfile    The new image file.
     * @param existingImage The existing image entity.
     * @return The updated Image entity.
     * @throws IOException If an error occurs while updating the file.
     */
    public Image updateProfile(MultipartFile newProfile, Image existingImage) throws IOException {
        if (newProfile == null || newProfile.isEmpty()) {
            return existingImage;
        }

        // Delete the existing file
        Path existingFilePath = Paths.get(existingImage.getPath());
        Files.deleteIfExists(existingFilePath);

        // Save the new file
        Path newFilePath = saveFileToDisk(newProfile, existingImage.getUser());
        String newFileDownloadUri = generateFileUrl(newFilePath);

        // Update the existing image entity
        existingImage.setPath(newFileDownloadUri);
        existingImage.setFilename(newFilePath.getFileName().toString());
        existingImage.setContentType(newProfile.getContentType());
        existingImage.setSize(newProfile.getSize());

        return imageRepository.save(existingImage);
    }

    /**
     * Saves a file to the disk and returns its path.
     *
     * @param file The file to save.
     * @param user The user associated with the file.
     * @return The path where the file was saved.
     * @throws IOException If an error occurs while saving the file.
     */
    private Path saveFileToDisk(MultipartFile file, User user) throws IOException {
        Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();

        // Create the upload directory if it doesn't exist
        if (!Files.exists(uploadPath)) {
            log.info("Creating upload directory: {}", uploadPath);
            Files.createDirectories(uploadPath);
        }

        // Check if the directory is writable
        if (!Files.isWritable(uploadPath)) {
            throw new IOException("Upload directory is not writable: " + uploadPath);
        }

        // Generate a unique filename
        String originalFilename = file.getOriginalFilename();
        String fileExtension = originalFilename != null && originalFilename.contains(".") ?
                originalFilename.substring(originalFilename.lastIndexOf(".")) : "";
        String uniqueFilename = UUID.randomUUID() + fileExtension;

        // Create a date-based subdirectory
        LocalDate currentDate = LocalDate.now();
        String dateSubdirectory = currentDate.format(DateTimeFormatter.ofPattern("yyyy_MM_dd"));
        Path dateDirectory = uploadPath.resolve(dateSubdirectory);

        if (!Files.exists(dateDirectory)) {
            log.info("Creating date subdirectory: {}", dateDirectory);
            Files.createDirectories(dateDirectory);
        }

        // Construct the final file name and path
        String finalFileName = user.getId() + "_" + uniqueFilename;
        Path filePath = dateDirectory.resolve(finalFileName);

        // Save the file to disk
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return filePath;
    }

    /**
     * Generates a URL for the uploaded file.
     *
     * @param filePath The path of the file on disk.
     * @return The generated URL.
     */
    private String generateFileUrl(Path filePath) {
        String dateSubdirectory = filePath.getParent().getFileName().toString();
        String fileName = filePath.getFileName().toString();

        return ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/uploads/")
                .path(dateSubdirectory + "/")
                .path(fileName)
                .toUriString();
    }

    /**
     * Builds an Image entity from the provided data.
     *
     * @param file            The uploaded file.
     * @param user            The user associated with the image.
     * @param fileDownloadUri The URL of the file.
     * @param filename        The name of the file.
     * @return The constructed Image entity.
     */
    private Image buildImageEntity(MultipartFile file, User user, String fileDownloadUri, String filename) {
        return Image.builder()
                .path(fileDownloadUri)
                .filename(filename)
                .contentType(file.getContentType())
                .size(file.getSize())
                .user(user)
                .build();
    }
}