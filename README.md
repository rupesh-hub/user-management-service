# **Complete CI/CD Pathway for Development**

This CI/CD pipeline covers the following steps for both **Frontend** and **Backend** applications in a 3-tier system. The process includes building, testing, packaging, creating Docker images, and updating Kubernetes deployments.

---

## **1. Development Phase (Local Development)**

### Backend:
- **Technologies**: Java (Spring Boot, Maven)
- **Development**:
    - Developers create Java code for the backend.
    - Backend application is version-controlled in Git.
    - Developer runs local unit tests and ensures the application runs correctly.

### Frontend:
- **Technologies**: React.js (Node.js, npm)
- **Development**:
    - Developers create components, services, and views for the frontend.
    - Developers test frontend features locally using `npm run test`.
    - Local linting with `npm run lint` and ensure the build process runs with `npm run build`.

---

## **2. GitHub Repository Setup**

### Backend:
- The backend code is stored in a GitHub repository with the standard structure.

### Frontend:
- The frontend code is stored in a separate GitHub repository or subdirectory within the main repository.

---

## **3. Backend CI/CD Pipeline**

### 1. **Trigger Conditions**
The pipeline runs on a push to the **main** branch, except for the following cases:
- **Ignores** changes to:
    - Files in `deployment/**`
    - `README.md`
    - Frontend-related workflow files (`.github/workflows/frontend-*.yaml`)
    - Frontend Docker files (`docker/frontend`)

---

### 2. **Jobs**

#### Job 1: Compile
**Name**: Compile  
**Runs on**: `ubuntu-latest`

##### Steps:
1. **Checkout Repository**
    - Uses `actions/checkout@v4` to fetch the code.

2. **Setup Java Environment**
    - Uses `actions/setup-java@v4` to install Java 17 (Corretto distribution).

3. **Compile Project**
    - Navigates to the `backend` directory and runs `./mvnw clean compile`.

---

#### Job 2: Tests
**Name**: Test  
**Runs on**: `ubuntu-latest`

##### Steps:
1. **Checkout Repository**
    - Same as above.

2. **Setup Java Environment**
    - Same as above.

3. **Run Unit Tests**
    - Navigates to the `backend` directory and runs `./mvnw clean test`.

---

#### Job 3: Build
**Name**: Build  
**Runs on**: `ubuntu-latest`  
**Depends on**: `compile` and `test` jobs (runs only if they succeed)

##### Steps:
1. **Checkout Repository**
    - Same as above.

2. **Setup Java Environment**
    - Same as above.

3. **Build Project**
    - Navigates to the `backend` directory and runs `./mvnw clean package` to create the JAR.

---

#### Job 4: Build Docker Image
**Name**: Build Docker Image  
**Runs on**: `ubuntu-latest`  
**Depends on**: `build` job

##### Environment Variables:
- `REGISTRY`: `ghcr.io` (GitHub Container Registry)
- `IMAGE_NAME`: GitHub repository name

##### Outputs:
- `image_tag`: Docker image tag generated in the metadata step.

##### Steps:
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

#### Job 5: Update Kubernetes Deployment
**Name**: Update Kubernetes Deployment  
**Runs on**: `ubuntu-latest`  
**Depends on**: `build-image` job  
**Runs only if**:
- Push to the **main** branch.
- Event is a push (not a pull request, etc.).

##### Steps:
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

### 3. **Summary of Key Actions**
- **Compile**: Ensures the code compiles.
- **Test**: Runs unit tests.
- **Build**: Packages the JAR.
- **Docker Image**: Builds, scans, and pushes the image to GHCR.
- **K8s Deployment**: Updates the deployment manifest with the new image tag.

---

### 4. **Artifacts Generated**
- Docker image in GitHub Container Registry (e.g., `ghcr.io/<org>/<repo>:sha-<hash>`).
- Updated `backend-deployment.yaml` with the new image tag.

---

### 5. **Security Checks**
- **Trivy scan** for critical/high vulnerabilities in the Docker image.

---

## **4. Frontend CI/CD Pipeline**

### 1. **Trigger Conditions**
The pipeline runs on a push to the **main** branch, except for the following cases:
- **Ignores** changes to:
    - Files in `deployment/**`
    - `docker/backend`
    - Frontend-related workflow files (`.github/workflows/backend*`)
    - `README.md`

---

### 2. **Jobs**

#### Job 1: Unit Test
**Name**: Unit test  
**Runs on**: `ubuntu-latest`

##### Steps:
1. **Checkout code**
    - Uses `actions/checkout@v4` to fetch the code.

2. **Setup Node.js**
    - Uses `actions/setup-node@v4` to install Node.js `20`.
    - Caches `npm` dependencies using `**/package-lock.json`.

3. **Install dependencies**
    - Navigates to the `frontend` directory and runs `npm ci`.

4. **Run tests**
    - Runs `npm test` in the `frontend` directory. If no tests are found, it prints a message indicating no tests.

---

#### Job 2: Static Code Analysis
**Name**: Static code analysis (Linting)  
**Runs on**: `ubuntu-latest`

##### Steps:
1. **Checkout code**
    - Same as above.

2. **Setup Node.js**
    - Same as above.

3. **Install dependencies**
    - Same as above.

4. **Run ESLint**
    - Runs `npm run lint` in the `frontend` directory. If no linting errors are found, it prints a message.

---

#### Job 3: Build
**Name**: Build  
**Runs on**: `ubuntu-latest`  
**Needs**: `test`, `lint` jobs (runs only if they succeed)

##### Steps:
1. **Checkout code**
    - Same as above.

2. **Setup Node.js**
    - Same as above.

3. **Install dependencies**
    - Same as above.

4. **Build project**
    - Runs `npm run build` in the `frontend` directory. If no build artifacts are found, it prints a message.

5. **Upload build artifacts**
    - Uses `actions/upload-artifact@v4` to upload the build artifacts from `frontend/dist/frontend/browser`.

---

#### Job 4: Docker Build and Push
**Name**: Docker build and push  
**Runs on**: `ubuntu-latest`  
**Needs**: `build` job

##### Environment Variables:
- `REGISTRY`: `ghcr.io` (GitHub Container Registry)
- `IMAGE_NAME`: `<github.repository>-frontend`

##### Outputs:
- `image_tag`: The Docker image tag generated in the metadata step.

##### Steps:
1. **Checkout code**
    - Same as above.

2. **Download build artifacts**
    - Uses `actions/download-artifact@v4` to download build artifacts from the `frontend/dist/frontend/browser` path.

3. **Setup Docker Buildx**
    - Uses `docker/setup-buildx-action@v3` to configure Docker Buildx for multi-platform builds.

4. **Log in to GitHub Container Registry**
    - Uses `docker/login-action@v2` to authenticate with GitHub Container Registry using `GH_TOKEN`.

5. **Extract metadata for Docker**
    - Uses `docker/metadata-action@v5` to generate tags and labels for the Docker image. Tags include:
        - Git SHA (long format)
        - Branch name
        - `latest`

6. **Build Docker image**
    - Uses `docker/build-push-action@v5` to build the image using `docker/frontend/Dockerfile`. The image is not pushed yet.

7. **Save built image ID**
    - Gets the image ID from the build output and saves it as an environment variable (`IMAGE_ID`).

8. **Push Docker image**
    - Uses `docker/build-push-action@v5` to push the built Docker image to GitHub Container Registry with the generated tags and labels.

9. **Set image tag output**
    - Sets the `image_tag` output using the first 7 characters of the Git commit SHA.

---

#### Job 5: Update Kubernetes Deployment
**Name**: Update Kubernetes Deployment  
**Runs on**: `ubuntu-latest`  
**Needs**: `docker` job  
**Runs only if**:
- Push to the **main** branch.
- Event is a push (not a pull request, etc.).

##### Steps:
1. **Checkout code**
    - Uses `actions/checkout@v4` with `GH_TOKEN` to allow pushing changes back.

2. **Setup Git config**
    - Configures Git username and email for commits.

3. **Update Kubernetes deployment file**
    - Defines the new Docker image with the tag (`sha-${{ github.sha }}`).
    - Uses `sed` to replace the image line in `deployment/frontend-deployment.yaml` with the new image tag.

4. **Commit and push changes**
    - Commits the updated `frontend-deployment.yaml` file with a message (`[skip ci]` to avoid triggering another run).
    - Pushes the changes back to the repository.

---

### 3. **Summary of Key Actions**
- **Unit Test**: Runs unit tests for the frontend.
- **Lint**: Runs static code analysis using ESLint.
- **Build**: Builds the frontend project and uploads the build artifacts.
- **Docker Build and Push**: Builds and pushes the Docker image to GHCR.
- **K8s Deployment**: Updates the Kubernetes deployment manifest with the new frontend image tag.

---

### 4. **Artifacts Generated**
- Docker image in GitHub Container Registry (e.g., `ghcr.io/<org>/<repo>-frontend:sha-<hash>`).
- Updated `frontend-deployment.yaml` with the new image tag.


---
# Continuous Deployment Guide

## 1. Create an Instance in AWS/Azure
Set up a virtual machine in AWS or Azure.

## 2. Install Necessary Software and Plugins
```sh
  sudo apt-get update && sudo apt-get upgrade -y
```

## 3. Install Docker
```sh
  sudo apt-get install docker.io -y
  sudo usermod -aG docker $USER && newgrp docker
```

## 4. Install KIND Cluster & Kubectl
### Install KIND (For AMD64 / x86_64)
```sh 
  curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-amd64
  chmod +x ./kind
  sudo mv ./kind /usr/local/bin/kind
```
### Install Kubectl
```sh
   VERSION="v1.30.0"
   URL="https://dl.k8s.io/release/${VERSION}/bin/linux/amd64/kubectl"
   curl -LO "$URL"
   chmod +x kubectl
   sudo mv kubectl /usr/local/bin/
   kubectl version --client
```

## 5. Setup Kubernetes Cluster Using KIND
Create a config file **kind-cluster-config.yaml**:
```yaml
   kind: Cluster
   apiVersion: kind.x-k8s.io/v1alpha4
   
   nodes:
   - role: control-plane
     image: kindest/node:v1.32.0
   - role: worker
     image: kindest/node:v1.32.0
   - role: worker
     image: kindest/node:v1.32.0
```

Create the cluster:
```sh
  kind create cluster --config kind-cluster-config.yaml --name kubernetes
```
Verify the cluster:
```sh
   kubectl get nodes
   kubectl cluster-info
```

## 6. Install ArgoCD
### Create ArgoCD Namespace
```sh
   kubectl create namespace argocd
```
### Apply ArgoCD Installation Manifest
```sh
   kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```
### Port Forward ArgoCD API Server
```sh
   kubectl port-forward svc/argocd-server -n argocd 8080:443
```
### Get ArgoCD Login Credentials
```sh
   kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

## 7. Create a Kubernetes Secret for GitHub Container Registry (GHCR)
Before deploying applications, create a secret to pull images from GHCR:
```sh
   kubectl create secret docker-registry github-container-registry \
     --docker-server=ghcr.io \
     --docker-username=<USERNAME> \
     --docker-password=<PERSONAL_ACCESS_TOKEN> \
     --docker-email=<EMAIL>
```
### Why is this required?
Kubernetes needs authentication to pull private container images from GitHub Container Registry (GHCR).

## 8. Deploy Application to ArgoCD KIND Cluster
Create an application in ArgoCD UI or use YAML manifests.

## 9. Access Application
Port forward the deployed service:
```sh
  kubectl port-forward svc/<APPLICATION_SERVICE_NAME> -n <NAMESPACE> 8081:80
```

## 10. Verification & Debugging Commands
### Check Cluster Nodes
```sh
  kubectl get nodes
  kubectl describe nodes
```
### Check Running Pods
```sh
  kubectl get pods -n <NAMESPACE>
  kubectl describe pod <POD_NAME> -n <NAMESPACE>
```
### View Logs
```sh
  kubectl logs -f <POD_NAME> -n <NAMESPACE>
```
### Execute a Shell in a Pod (Example: MySQL)
```sh
  kubectl exec -it <MYSQL_POD_NAME> -n <NAMESPACE> -- /bin/sh
```

## 11. Cleanup (Optional)
To delete the cluster:
```sh
  kind delete cluster --name kubernetes
```

---
This guide provides **step-by-step instructions** to set up a Kubernetes cluster using KIND, deploy ArgoCD, and run applications efficiently. 🚀

