# GitOps Multi-Environment Deployment

A hands-on DevOps project demonstrating application containerization, CI automation, infrastructure as code, configuration management, Kubernetes deployment, and application monitoring.

## Project Overview

This project demonstrates a complete DevOps workflow for deploying a Node.js application across development environments.

The project combines:

* Git and GitHub for source-code management
* GitHub Actions for continuous integration
* Docker for application containerization
* Terraform for infrastructure as code
* Ansible for configuration management and deployment automation
* Kubernetes for container orchestration
* Kustomize for environment-specific Kubernetes configuration
* Prometheus for application monitoring

The application was successfully built, tested, containerized, and deployed to a local Kubernetes cluster using Docker Desktop Kubernetes.

AWS infrastructure configuration was also developed using Terraform and Ansible. The final AWS deployment was not completed because of AWS account/quota limitations.

---

## Architecture

```text
                    Developer
                       |
                       v
                  Git / GitHub
                       |
                       v
               GitHub Actions CI
                       |
              +--------+--------+
              |                 |
          npm tests         Docker build
              |                 |
              +--------+--------+
                       |
                       v
              Container Image
                       |
                       v
             Local Kubernetes
                       |
                 +-----+-----+
                 |           |
              Service     Deployment
                 |           |
                 +-----+-----+
                       |
                       v
                 Node.js App
                       |
                       v
                 /metrics
                       |
                       v
                  Prometheus
```

Terraform and Ansible are included for infrastructure provisioning and server configuration:

```text
Terraform
    |
    v
AWS Infrastructure
    |
    v
EC2

Ansible
    |
    v
Server Configuration
    |
    v
Docker Application
```

---

## Technologies Used

| Technology     | Purpose                                   |
| -------------- | ----------------------------------------- |
| Git            | Version control                           |
| GitHub         | Source-code repository                    |
| GitHub Actions | Continuous integration                    |
| Node.js        | Application runtime                       |
| Express.js     | Web application framework                 |
| npm            | Dependency management and testing         |
| Docker         | Containerization                          |
| Kubernetes     | Container orchestration                   |
| Kustomize      | Kubernetes environment configuration      |
| Terraform      | Infrastructure as code                    |
| Ansible        | Configuration management                  |
| Prometheus     | Application monitoring                    |
| Linux / WSL    | Development environment                   |
| AWS            | Target cloud infrastructure configuration |

---

## Project Structure

```text
GitOps-Multi-Environment-Deployment/
│
├── app/
│   ├── server.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .dockerignore
│   └── test/
│       └── app.test.js
│
├── ansible/
│   ├── inventory/
│   │   ├── dev.ini
│   │   ├── staging.ini
│   │   └── prod.ini
│   └── playbook.yml
│
├── terraform/
│   ├── environments/
│   │   └── dev/
│   └── modules/
│       └── infra/
│
├── k8s/
│   ├── base/
│   │   ├── deployment.yaml
│   │   ├── service.yaml
│   │   └── kustomization.yaml
│   │
│   └── overlays/
│       └── dev/
│           └── kustomization.yaml
│
├── monitoring/
│   ├── prometheus.yml
│   └── docker-compose.yml
│
├── scripts/
│   └── deploy-dev.sh
│
├── .github/
│   └── workflows/
│       └── ci.yml
│
├── .gitignore
├── .dockerignore
└── README.md
```

---

# Application

The application is a Node.js and Express.js REST API.

### Available endpoints

```text
GET /
GET /health
GET /todos
POST /todos
GET /metrics
```

### Health endpoint

```bash
curl http://localhost:3000/health
```

Example response:

```json
{
  "status": "healthy",
  "environment": "dev",
  "uptime_seconds": 10
}
```

### Application metrics

```bash
curl http://localhost:3000/metrics
```

The application exposes a Prometheus-compatible metric:

```text
app_requests_total
```

---

# Automated Testing

The project uses Node.js built-in testing.

Run tests locally:

```bash
cd app
npm install
npm test
```

The test suite validates:

* Health endpoint
* Application root endpoint
* Todos endpoint
* Prometheus metrics endpoint

The project currently has **4 automated tests**, all passing.

---

# Docker

The application is containerized using Docker.

Build the image:

```bash
docker build -t gitops-sample-app:local ./app
```

Run the container:

```bash
docker run -d \
  --name gitops-sample-app \
  -p 3000:3000 \
  -e ENVIRONMENT=dev \
  gitops-sample-app:local
```

Check the container:

```bash
docker ps
```

Test the application:

```bash
curl http://localhost:3000/health
```

The Docker image includes:

* Node.js 20 Alpine
* Non-root application user
* Application health check
* Production dependency installation
* Port 3000

---

# Kubernetes

The application is deployed to Kubernetes using a Deployment and Service.

Apply the development environment:

```bash
kubectl apply -k k8s/overlays/dev
```

Check the deployment:

```bash
kubectl get deployments -n dev
```

Check pods:

```bash
kubectl get pods -n dev
```

Check services:

```bash
kubectl get service -n dev
```

Check deployment status:

```bash
kubectl rollout status deployment/sample-app -n dev
```

---

# Kustomize

Kustomize is used to maintain Kubernetes configuration without duplicating the base manifests.

The project contains:

```text
k8s/base/
```

for common Kubernetes configuration and:

```text
k8s/overlays/dev/
```

for development-specific configuration.

The development overlay changes the application image to:

```text
gitops-sample-app:local
```

This allows the application to run on the local Docker Desktop Kubernetes cluster.

---

# Local Kubernetes Access

The Kubernetes service uses a NodePort.

To access the application locally, port-forward the service:

```bash
kubectl port-forward -n dev service/sample-app 8080:3000
```

Then, in another terminal:

```bash
curl http://localhost:8080/health
```

The port-forward can be stopped with:

```text
Ctrl + C
```

---

# Automated Local Deployment

A deployment script is provided:

```bash
./scripts/deploy-dev.sh
```

The script:

1. Applies the Kubernetes Kustomize configuration
2. Waits for the deployment to become ready
3. Displays the running pods
4. Displays the Kubernetes service

---

# GitHub Actions

The project uses GitHub Actions for continuous integration.

Workflow:

```text
Git Push
   |
   v
GitHub Actions
   |
   +--> Checkout repository
   |
   +--> Setup Node.js
   |
   +--> Install dependencies
   |
   +--> Run automated tests
   |
   +--> Build Docker image
```

The workflow runs for:

```text
dev
staging
main
```

branches and pull requests targeting these branches.

The CI pipeline successfully runs the application's automated tests and Docker build.

---

# Terraform

Terraform is used to define AWS infrastructure as code.

The Terraform configuration includes resources for:

* AWS EC2
* Security groups
* IAM roles
* IAM instance profiles
* Amazon Linux AMI selection
* Public IP configuration
* Environment-specific infrastructure

The project uses a reusable Terraform module:

```text
terraform/modules/infra/
```

with an environment configuration:

```text
terraform/environments/dev/
```

Typical Terraform commands:

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
```

AWS deployment is currently not being executed because of AWS account/quota and billing limitations.

---

# Ansible

Ansible is used for server configuration and application deployment.

The playbook performs tasks such as:

* Installing Docker
* Starting Docker
* Creating environment configuration
* Creating application directories
* Copying application files
* Building the Docker image
* Removing an existing application container
* Starting the application container
* Checking application health

Example command:

```bash
ansible-playbook -i ansible/inventory/dev.ini ansible/playbook.yml
```

The AWS EC2 target is currently unavailable, so the Ansible deployment is not being executed against AWS.

---

# Prometheus Monitoring

Prometheus is used to monitor the application.

Start Prometheus:

```bash
docker compose -f monitoring/docker-compose.yml up -d
```

Check the Prometheus container:

```bash
docker ps
```

Prometheus runs on:

```text
http://localhost:9090
```

Health check:

```bash
curl http://localhost:9090/-/healthy
```

The Prometheus configuration scrapes:

```text
http://host.docker.internal:3000/metrics
```

The application exposes:

```text
app_requests_total
```

Prometheus successfully collects this metric from the application.

---

# Git Workflow

The project uses separate branches for environments:

```text
main
staging
dev
```

Development work is performed on the `dev` branch.

Example workflow:

```bash
git checkout dev
git add .
git commit -m "Describe your change"
git push origin dev
```

---

# Useful Commands

### Check Git status

```bash
git status
```

### View branches

```bash
git branch -a
```

### Run application tests

```bash
cd app
npm test
```

### Build Docker image

```bash
docker build -t gitops-sample-app:local ./app
```

### Check Docker containers

```bash
docker ps
```

### Check Kubernetes pods

```bash
kubectl get pods -n dev
```

### Check Kubernetes services

```bash
kubectl get services -n dev
```

### Deploy to local Kubernetes

```bash
./scripts/deploy-dev.sh
```

### Start Prometheus

```bash
docker compose -f monitoring/docker-compose.yml up -d
```

---

# Current Project Status

## Completed

* Git repository and branching strategy
* Node.js application
* REST API endpoints
* Automated application tests
* Docker containerization
* GitHub Actions CI
* Kubernetes deployment
* Kustomize configuration
* Local Kubernetes deployment
* Deployment automation script
* Prometheus monitoring
* Prometheus metrics collection
* Terraform infrastructure configuration
* Ansible configuration
* Project documentation

## AWS Status

The Terraform and Ansible configurations for AWS are included in the project.

However, the final AWS deployment is currently blocked by AWS account/quota and billing limitations.

Therefore, this repository does **not** claim that the application is currently running in AWS.

The application has instead been successfully tested locally using Docker and Docker Desktop Kubernetes.

---

# Future Improvements

Possible future improvements include:

* Deploying the application to AWS EKS
* Implementing a complete GitOps CD workflow
* Adding Argo CD
* Adding staging and production Kubernetes overlays
* Adding Grafana dashboards
* Adding container image publishing to Amazon ECR
* Adding security scanning to the CI pipeline
* Adding automated infrastructure deployment
* Adding centralized logging
* Adding Kubernetes autoscaling

---

# Learning Outcomes

This project provided hands-on experience with:

* Linux command-line operations
* Git and GitHub
* CI/CD concepts
* Docker
* Kubernetes
* Kustomize
* Terraform
* Ansible
* AWS infrastructure concepts
* Prometheus monitoring
* REST APIs
* Infrastructure as Code
* Configuration management
* Application health checks
* Environment-specific deployments

---

# Author

**Chandana Priya**

DevOps / Cloud Engineer

GitHub:

```text
https://github.com/chandhu7711/GitOps-Multi-Environment-Deployment
```
