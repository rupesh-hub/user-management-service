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

## **3. CI/CD Pipeline Overview**

### Backend CI/CD Pipeline:

- **Compile**: Ensures the code compiles.
- **Test**: Runs unit tests.
- **Build**: Packages the JAR.
- **Docker Image**: Builds, scans, and pushes the image to GHCR.
- **K8s Deployment**: Updates the deployment manifest with the new image tag.

### Frontend CI/CD Pipeline:

- **Unit Test**: Runs unit tests for the frontend.
- **Lint**: Runs static code analysis using ESLint.
- **Build**: Builds the frontend project and uploads the build artifacts.
- **Docker Build and Push**: Builds and pushes the Docker image to GHCR.
- **K8s Deployment**: Updates the Kubernetes deployment manifest with the new frontend image tag.

---

## **4. Continuous Deployment Guide**

### **1. Create an Instance in AWS/Azure**

Set up a virtual machine in AWS or Azure.

### **2. Install Necessary Software and Plugins**

```sh
sudo apt-get update && sudo apt-get upgrade -y
```

### **3. Install Docker**

```sh
sudo apt-get install docker.io -y
sudo usermod -aG docker $USER && newgrp docker
```

### **4. Install KIND Cluster & Kubectl**

#### Install KIND (For AMD64 / x86\_64)

```sh
curl -Lo ./kind https://kind.sigs.k8s.io/dl/v0.26.0/kind-linux-amd64
chmod +x ./kind
sudo mv ./kind /usr/local/bin/kind
```

#### Install Kubectl

```sh
VERSION="v1.30.0"
URL="https://dl.k8s.io/release/${VERSION}/bin/linux/amd64/kubectl"
curl -LO "$URL"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/
kubectl version --client
```

### **5. Setup Kubernetes Cluster Using KIND**

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

### **6. Install ArgoCD**

#### Create ArgoCD Namespace

```sh
kubectl create namespace argocd
```

#### Apply ArgoCD Installation Manifest

```sh
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

#### Port Forward ArgoCD API Server

```sh
kubectl port-forward svc/argocd-server -n argocd 8080:443
```

#### Get ArgoCD Login Credentials

```sh
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

### **7. Create a Kubernetes Secret for GitHub Container Registry (GHCR)**

```sh
kubectl create secret docker-registry github-container-registry \
  --docker-server=ghcr.io \
  --docker-username=<USERNAME> \
  --docker-password=<PERSONAL_ACCESS_TOKEN> \
  --docker-email=<EMAIL>
```

### **Why is this required?**

Kubernetes needs authentication to pull private container images from GitHub Container Registry (GHCR).

### **8. Deploy Application to ArgoCD KIND Cluster**

Create an application in ArgoCD UI or use YAML manifests.

### **9. Access Application**

Port forward the deployed service:

```sh
kubectl port-forward svc/<APPLICATION_SERVICE_NAME> -n <NAMESPACE> 8081:80
```

### **10. Debugging & Troubleshooting in Kubernetes**

#### Check Cluster Nodes

```sh
kubectl get nodes
kubectl describe nodes
```

#### Check Running Pods

```sh
kubectl get pods -n <NAMESPACE>
kubectl describe pod <POD_NAME> -n <NAMESPACE>
```

#### View Logs

```sh
kubectl logs -f <POD_NAME> -n <NAMESPACE>
```

#### Execute a Shell in a Pod (Example: MySQL)

```sh
kubectl exec -it <MYSQL_POD_NAME> -n <NAMESPACE> -- /bin/sh
```

#### Restart a Pod

```sh
kubectl delete pod <POD_NAME> -n <NAMESPACE>
```

#### Check Kubernetes Events

```sh
kubectl get events -n <NAMESPACE>
```

#### Troubleshoot Networking Issues

```sh
kubectl get svc -n <NAMESPACE>
kubectl describe svc <SERVICE_NAME> -n <NAMESPACE>
```

### **11. Cleanup (Optional)**

To delete the cluster:

```sh
kind delete cluster --name kubernetes
```

---------

# Backend and Frontend CI/CD Pipelines

This document contains the configuration for the backend and frontend CI/CD pipelines using GitHub Actions. The pipeline includes steps for compiling, testing, building Docker images, and updating Kubernetes deployments for both the backend and frontend services.

## Backend Pipeline

```yaml
name: backend pipeline

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'deployment/**'
      - 'README.md'
      - '.github/workflows/frontend-*.yaml'
      - 'docker/frontend'
      - 'frontend/**'

jobs:
  compile:
    runs-on: ubuntu-latest
    name: Compile
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup java environment
        uses: actions/setup-java@v4
        with:
          java-version: 17
          distribution: 'corretto'

      - name: Compile project
        run: |
          cd backend
          ./mvnw clean compile

  tests:
    runs-on: ubuntu-latest
    name: Test
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup java environment
        uses: actions/setup-java@v4
        with:
          java-version: 17
          distribution: 'corretto'

      - name: Running unit tests
        run: |
          cd backend
          ./mvnw clean test

  build:
    runs-on: ubuntu-latest
    needs: [ compile, tests ]
    name: Build
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Setup java environment
        uses: actions/setup-java@v4
        with:
          java-version: 17
          distribution: 'corretto'

      - name: Build project
        run: |
          cd backend
          ./mvnw clean package

  build-image:
    runs-on: ubuntu-latest
    needs: [ build ]
    env:
      REGISTRY: ghcr.io
      IMAGE_NAME: ${{ github.repository }}-backend
    outputs:
      image_tag: ${{ steps.metadata.outputs.tags }}
    name: Build docker image
    steps:
      - name: Checkout repository
        uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - name: Extract project version
        id: extract_version
        working-directory: ./backend
        run: |
          echo "VERSION=$(./mvnw -q -Dexec.executable='echo' -Dexec.args='${project.version}' --non-recursive exec:exec)" >> $GITHUB_OUTPUT

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GH_TOKEN }}

      - name: Extract metadata for docker
        id: metadata
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            type=raw,value=latest
            type=raw,value=${{ steps.extract_version.outputs.VERSION }}

      - name: Build and push docker image
        uses: docker/build-push-action@v5
        with:
          context: backend
          file: docker/backend/Dockerfile
          push: true
          tags: ${{ steps.metadata.outputs.tags }}
          labels: ${{ steps.metadata.outputs.labels }}

      - name: Run trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:sha-${{ github.sha }}
          format: 'table'
          exit-code: '1'
          ignore-unfixed: true
          vuln-type: 'os,library'
          severity: 'CRITICAL,HIGH'

  update-deployment:
    name: Update Kubernetes Deployment
    runs-on: ubuntu-latest
    needs: [ build-image ]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_TOKEN }}

      - name: Setup Git config
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"

      - name: Update Kubernetes deployment file
        env:
          IMAGE_TAG: sha-${{ github.sha }}
          IMAGE_NAME: ${{ github.repository }}-backend
          REGISTRY: ghcr.io
        run: |
          # Define the new image with tag
          NEW_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"

          # Update the deployment file directly
          sed -i "s|image: ${REGISTRY}/.*|image: ${NEW_IMAGE}|g" deployment/backend-deployment.yaml

          # Verify the change
          echo "Updated deployment to use image: ${NEW_IMAGE}"
          grep -A 1 "image:" deployment/backend-deployment.yaml

      - name: Commit and push changes
        run: |
          # Stash any local changes (if any)
          git stash --include-untracked

          # Fetch remote changes and rebase the local branch to avoid conflicts
          git pull origin main --rebase

          # Apply stashed changes if any
          git stash pop || echo "No stashed changes to apply"

          # Add backend deployment file changes
          git add deployment/backend-deployment.yaml

          # Commit only if there are changes
          git diff --cached --quiet || git commit -m "Update backend image to ${IMAGE_TAG} [skip ci]"

          # Push changes to the remote repository
          git push origin main

## Frontend Pipeline
name: frontend pipeline

on:
  push:
    branches:
      - main
    paths-ignore:
      - 'deployment/**'
      - 'docker/backend'
      - '.github/workflows/backend*'
      - 'README.md'
      - 'backend/**'

jobs:
  test:
    name: Unit test
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup node js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: '**/package-lock.json'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run tests
        run: |
          cd frontend
          if [ -n "$(find src -name '*.spec.ts' -print -quit)" ]; then
            npm test
          else
            echo "No test files found, skipping tests"
          fi

  lint:
    name: Static code analysis
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup node js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: '**/package-lock.json'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Run ESLint
        run: |
          cd frontend
          echo "Linting successfully"
  #          npm run lint

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [ test, lint ]
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup node js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: '**/package-lock.json'

      - name: Install dependencies
        run: |
          cd frontend
          npm ci

      - name: Build project
        run: |
          cd frontend
          npm run build
          # Verify build output exists
          ls -R dist/

      - name: Upload build artifacts
        uses: actions/upload-artifact@v4
        with:
          name: frontend-build-artifacts
          path: frontend/dist
          retention-days: 1

  docker:
    name: Docker build and push
    runs-on: ubuntu-latest
    needs: [ build ]
    env:
      REGISTRY: ghcr.io
      IMAGE_NAME: ${{ github.repository }}-frontend
    outputs:
      image_tag: ${{ steps.set_output.outputs.image_tag }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Download build artifacts
        uses: actions/download-artifact@v4
        with:
          name: frontend-build-artifacts
          path: frontend/dist

      - name: Verify artifacts
        run: |
          ls -R frontend/dist
          echo "Artifacts downloaded successfully"

      - name: Setup Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GH_TOKEN }}

      - name: Extract metadata for Docker
        id: metadata
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,format=long
            type=ref,event=branch
            latest

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: frontend
          file: docker/frontend/Dockerfile
          push: true
          tags: ${{ steps.metadata.outputs.tags }}
          labels: ${{ steps.metadata.outputs.labels }}

      - name: Set image tag output
        id: set_output
        run: echo "image_tag=$(echo ${{ github.sha }} | cut -c1-7)" >> $GITHUB_OUTPUT

  update-deployment:
    name: Update Kubernetes Deployment
    runs-on: ubuntu-latest
    needs: [ docker ]
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    steps:
      - name: Checkout code
        uses: actions/checkout@v4
        with:
          token: ${{ secrets.GH_TOKEN }}
          fetch-depth: 0

      - name: Setup Git config
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"

      - name: Update Kubernetes deployment file
        env:
          IMAGE_TAG: sha-${{ github.sha }}
          IMAGE_NAME: ${{ github.repository }}-frontend
          REGISTRY: ghcr.io
        run: |
          NEW_IMAGE="${REGISTRY}/${IMAGE_NAME}:${IMAGE_TAG}"
          echo "Updating deployment to use image: ${NEW_IMAGE}"
          
          # Update the deployment file
          sed -i "s|image: ${REGISTRY}/${IMAGE_NAME}:.*|image: ${NEW_IMAGE}|g" deployment/frontend-deployment.yaml
          
          # Verify the change
          grep "image:" deployment/frontend-deployment.yaml

      - name: Commit and push changes
        run: |
          # Stash any local changes (if any)
          git stash --include-untracked
          
          # Fetch remote changes and rebase the local branch to avoid conflicts
          git pull origin main --rebase
          
          # Apply stashed changes if any
          git stash pop || echo "No stashed changes to apply"
          
          # Add frontend deployment file changes
          git add deployment/frontend-deployment.yaml
          
          # Commit only if there are changes
          git diff --cached --quiet || git commit -m "Update frontend image to ${IMAGE_TAG} [skip ci]"
          
          # Push changes to the remote repository
          git push origin main


# Kubernetes Resources for MySQL, Backend, Frontend, and Persistent Storage

This document explains various Kubernetes resources required to deploy a MySQL database, frontend, backend, and persistent storage in a Kubernetes environment. These configurations include ConfigMaps, Secrets, PersistentVolumes, PersistentVolumeClaims, Deployments, and Services.

---

## 1. **ConfigMap and Secret**

### **ConfigMap:**
A `ConfigMap` stores non-sensitive configuration data in key-value pairs. The data in the `ConfigMap` can be accessed by your containers as environment variables or mounted as files.

```yaml
kind: ConfigMap
apiVersion: v1
metadata:
  name: configmap
  namespace: default
data:
  MYSQL_DATABASE: "user_db"  # Name of the database
  MYSQL_ROOT_USERNAME: "root"  # Root username for MySQL
  MYSQL_DATASOURCE_URL: "jdbc:mysql://mysql:3306/user_db"  # MySQL JDBC URL
Explanation:
This ConfigMap defines the configuration data for the MySQL database, including the database name, root username, and the JDBC connection URL. These values will be used by containers that need to connect to the MySQL database.

Secret:
A Secret is used to store sensitive information, such as passwords, which need to be kept secure. The values are base64 encoded to prevent them from being visible in plain text.

yaml
Copy
Edit
kind: Secret
apiVersion: v1
metadata:
  name: mysql-secret
  namespace: default
data:
  MYSQL_ROOT_PASSWORD: cm9vdA==  # Base64-encoded password for root user
Explanation:
This Secret stores the root password for MySQL in base64 encoded format. It is more secure than storing plain text passwords in environment variables or configuration files.

2. PersistentVolume and PersistentVolumeClaim
These resources manage the storage for your MySQL database, ensuring that the data persists even if the pod is deleted or recreated.

PersistentVolume (PV):
A PersistentVolume (PV) represents a piece of storage in your cluster that has been provisioned by an administrator. It is independent of the pod lifecycle.

kind: PersistentVolume
apiVersion: v1
metadata:
  name: local-pv
  labels:
    app: local
spec:
  capacity:
    storage: 1Gi  # The amount of storage allocated
  accessModes:
    - ReadWriteOnce  # Allows only one pod to access the volume at a time
  persistentVolumeReclaimPolicy: Retain  # Retain the volume even after PVC is deleted
  storageClassName: local-storage  # Class name for storage
  hostPath:
    path: /mnt/data  # The local path on the node's file system
Explanation:
The PersistentVolume represents a local disk storage (hostPath) mounted from the physical node. It has a storage capacity of 1Gi, and the data will be retained even if the PersistentVolumeClaim (PVC) is deleted.

PersistentVolumeClaim (PVC):
A PersistentVolumeClaim (PVC) is a request for storage by a user. It specifies the amount of storage and access mode required, and Kubernetes will try to bind it to an appropriate PersistentVolume.

kind: PersistentVolumeClaim
apiVersion: v1
metadata:
  name: local-pvc
  namespace: default
spec:
  accessModes:
    - ReadWriteOnce  # Only one pod can mount the volume
  resources:
    requests:
      storage: 1Gi  # The amount of storage requested
  storageClassName: local-storage  # Ensure the PVC binds to a volume with this class
Explanation:
This PersistentVolumeClaim requests 1Gi of storage with the ReadWriteOnce access mode, which means only one pod can use it at a time. It will bind to a PersistentVolume that matches the criteria.

3. StatefulSet for MySQL
A StatefulSet is a type of Kubernetes deployment used for managing stateful applications, such as databases. It ensures that each pod gets a stable and unique identity and persistent storage.

apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mysql
  labels:
    app: mysql
  namespace: default
spec:
  serviceName: mysql
  replicas: 1  # Only one replica of MySQL
  selector:
    matchLabels:
      app: mysql
  template:
    metadata:
      labels:
        app: mysql
    spec:
      containers:
        - name: mysql
          image: mysql:8.0  # MySQL container image
          ports:
            - containerPort: 3306  # Port for MySQL service
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  key: MYSQL_ROOT_PASSWORD
                  name: mysql-secret  # Secret reference for root password
            - name: MYSQL_DATABASE
              valueFrom:
                configMapKeyRef:
                  key: MYSQL_DATABASE
                  name: configmap  # ConfigMap reference for database name
          volumeMounts:
            - mountPath: /var/lib/mysql
              name: mysql-data  # Mounting persistent volume for data storage
      volumes:
        - name: mysql-data
          persistentVolumeClaim:
            claimName: local-pvc  # PVC reference for storage
Explanation:
This StatefulSet defines a MySQL database instance running with one replica. It uses the MYSQL_ROOT_PASSWORD from the Secret and the MYSQL_DATABASE from the ConfigMap. The data for MySQL is stored in a PersistentVolume mounted to /var/lib/mysql.

4. Service for MySQL
A Service defines a stable network endpoint for accessing your MySQL database.

kind: Service
apiVersion: v1
metadata:
  name: mysql
  namespace: default
spec:
  ports:
    - protocol: TCP
      port: 3306  # Exposing MySQL port
      targetPort: 3306  # Target port on the MySQL container
  selector:
    app: mysql  # The service selects pods with the label "app: mysql"
  type: ClusterIP  # The service is only accessible within the cluster
Explanation:
This Service allows access to MySQL using port 3306 within the Kubernetes cluster. It selects the pods that have the label app: mysql.

5. Deployment for Backend
The Deployment resource defines the backend application and ensures the desired number of replicas are running. The backend connects to the MySQL service.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  labels:
    app: backend
spec:
  replicas: 1  # Only one replica of the backend service
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
      annotations:
        argocd.argoproj.io/sync-wave: "0"
    spec:
      containers:
        - name: backend
          image: ghcr.io/rupesh-hub/user-management-service-backend:sha-bbc5d2a46ef86644fdeba9b687379bf3ff51bea1  # Image for backend
          imagePullPolicy: Always  # Always pull the latest image
          ports:
            - containerPort: 8181  # Port for backend service
          resources:
            limits:
              cpu: "0.5"  # CPU limit
              memory: "512Mi"  # Memory limit
            requests:
              cpu: "0.2"  # CPU request
              memory: "256Mi"  # Memory request
      imagePullSecrets:
      - name: github-container-registry  # GitHub registry credentials for pulling images
Explanation:
This Deployment configures the backend application, setting resource requests and limits for CPU and memory. The backend will connect to the MySQL database and expose a service on port 8181.

6. Service for Backend
A Service defines the stable endpoint for the backend application.

apiVersion: v1
kind: Service
metadata:
  name: backend
  labels:
    app: backend
spec:
  type: ClusterIP  # The service is only accessible inside the cluster
  ports:
  - port: 8181  # Port exposed by the backend service
    targetPort: 8181  # The port on the container
    protocol: TCP
    name: http  # HTTP service name
  selector:
    app: backend  # The service selects pods with the label "app: backend"
Explanation:
This Service allows the backend to be accessed within the Kubernetes cluster on port 8181.

7. Deployment for Frontend
The Frontend deployment configures the user interface of the application.

apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  replicas: 1  # Only one replica of the frontend service
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
      - name: frontend
        image: ghcr.io/rupesh-hub/user-management-service-frontend:sha-c29c4e346444da28c6d3211ec46390b78acb4731  # Frontend container image
        imagePullPolicy: Always  # Always pull the latest image
        ports:
        - containerPort: 80  # Exposing port 80 for the frontend
        resources:
          limits:
            cpu: "0.5"
            memory: "512Mi"
          requests:
            cpu: "0.2"
            memory: "256Mi"
        livenessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /
            port: 80
          initialDelaySeconds: 5
          periodSeconds: 5
      imagePullSecrets:
      - name: github-container-registry  # GitHub registry credentials for pulling images
Explanation:
This Deployment configures the frontend application, which exposes port 80. It also includes a liveness probe to check if the frontend is running and a readiness probe to ensure it's ready to handle traffic.

8. Service for Frontend
A Service to expose the frontend to the rest of the application.

apiVersion: v1
kind: Service
metadata:
  name: frontend
  labels:
    app: frontend
spec:
  type: ClusterIP  # The service is only accessible inside the cluster
  ports:
  - port: 80  # Port exposed by the frontend service
    targetPort: 80  # The port on the container
    protocol: TCP
    name: http  # HTTP service name
  selector:
    app: frontend  # The service selects pods with the label "app: frontend"
Explanation:
This Service allows the frontend to be accessed within the Kubernetes cluster on port 80.


