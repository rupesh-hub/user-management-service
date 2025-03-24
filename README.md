# Complete devsecops demo (3 tier application)
Steps:
1. Create backend application
2. Create frontend application
3. Create Dockerfile for frontend and backend
4. Create CI pipeline for frontend and backend

# Backend CI/CD Pipeline Steps

## 1. Trigger Conditions
The pipeline runs on a push to the **main** branch, except for the following cases:

- **Ignores** changes to:
    - Files in `deployment/**`
    - `README.md`
    - Frontend-related workflow files (`.github/workflows/frontend-*.yaml`)
    - Frontend Docker files (`docker/frontend`)

## 2. Jobs

### Job 1: Compile
**Name**: Compile  
**Runs on**: `ubuntu-latest`

#### Steps:
1. **Checkout Repository**
    - Uses `actions/checkout@v4` to fetch the code.

2. **Setup Java Environment**
    - Uses `actions/setup-java@v4` to install Java 17 (Corretto distribution).

3. **Compile Project**
    - Navigates to the `backend` directory and runs `./mvnw clean compile`.

---

### Job 2: Tests
**Name**: Test  
**Runs on**: `ubuntu-latest`

#### Steps:
1. **Checkout Repository**
    - Same as above.

2. **Setup Java Environment**
    - Same as above.

3. **Run Unit Tests**
    - Navigates to the `backend` directory and runs `./mvnw clean test`.

---

### Job 3: Build
**Name**: Build  
**Runs on**: `ubuntu-latest`  
**Depends on**: `compile` and `test` jobs (runs only if they succeed)

#### Steps:
1. **Checkout Repository**
    - Same as above.

2. **Setup Java Environment**
    - Same as above.

3. **Build Project**
    - Navigates to the `backend` directory and runs `./mvnw clean package` to create the JAR.

---

### Job 4: Build Docker Image
**Name**: Build Docker Image  
**Runs on**: `ubuntu-latest`  
**Depends on**: `build` job

#### Environment Variables:
- `REGISTRY`: `ghcr.io` (GitHub Container Registry)
- `IMAGE_NAME`: GitHub repository name

#### Outputs:
- `image_tag`: Docker image tag generated in the metadata step.

#### Steps:
1. **Checkout Repository**
    - Same as above.

2. **Extract Project Version**
    - Uses Maven to extract the project version (`project.version`) from `backend/pom.xml`.

3. **Setup Docker Buildx**
    - Uses `docker/setup-buildx-action@v3` to configure Docker Buildx for multi-platform builds.

4. **Login to GitHub Container Registry**
    - Uses `docker/login-action@v3` to authenticate with GitHub Container Registry using `GH_TOKEN`.

5. **Extract Metadata for Docker**
    - Uses `docker/metadata-action@v5` to generate tags and labels for the Docker image. Tags include:
        - Git SHA (long format)
        - Branch name
        - `latest`
        - Version from `pom.xml`

6. **Build and Push Docker Image**
    - Uses `docker/build-push-action@v5` to:
        - Build the image using `docker/backend/Dockerfile`.
        - Push the image to GitHub Container Registry with the generated tags.

7. **Trivy Vulnerability Scan**
    - Uses `aquasecurity/trivy-action` to scan the image for OS/library vulnerabilities (CRITICAL/HIGH severity).
    - Fails the job if vulnerabilities are found.

---

### Job 5: Update Kubernetes Deployment
**Name**: Update Kubernetes Deployment  
**Runs on**: `ubuntu-latest`  
**Depends on**: `build-image` job  
**Runs only if**:
- Push to the **main** branch.
- Event is a push (not a pull request, etc.).

#### Steps:
1. **Checkout Code**
    - Uses `actions/checkout@v4` with `GH_TOKEN` to allow pushing changes back.

2. **Setup Git Config**
    - Configures Git username/email for commits.

3. **Update Kubernetes Deployment File**
    - Updates `deployment/backend-deployment.yaml` with the new image tag (`sha-<GIT_SHA>`).
    - Uses `sed` to replace the image line in the YAML file.

4. **Commit and Push Changes**
    - Commits the updated `backend-deployment.yaml` with a message (`[skip ci]` to avoid triggering another run).
    - Pushes the changes back to the repository.

---

## Summary of Key Actions
- **Compile**: Ensures the code compiles.
- **Test**: Runs unit tests.
- **Build**: Packages the JAR.
- **Docker Image**: Builds, scans, and pushes the image to GHCR.
- **K8s Deployment**: Updates the deployment manifest with the new image tag.

---

## Artifacts Generated
- Docker image in GitHub Container Registry (e.g., `ghcr.io/<org>/<repo>:sha-<hash>`).
- Updated `backend-deployment.yaml` with the new image tag.

---

## Security Checks
- **Trivy scan** for critical/high vulnerabilities in the Docker image.
