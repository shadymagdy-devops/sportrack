# 🏟️ SportTrack — Full-Stack DevOps Practice Project

A sports scoreboard & tracking app built with **React + .NET 8 + PostgreSQL**,
designed to teach you the complete DevOps flow from zero to production on AWS.

```
React (TypeScript)  ──►  .NET 8 Minimal API  ──►  PostgreSQL 16
     nginx                  MediatR / EF Core
```

---

## 📁 Project Structure

```
sportrack/
├── frontend/                   # React TypeScript app
│   ├── src/
│   │   ├── components/         # Reusable UI (Navbar, MatchCard)
│   │   ├── pages/              # Dashboard, Matches, Standings, Players
│   │   ├── services/api.ts     # Axios API client
│   │   └── types/index.ts      # Shared TypeScript interfaces
│   ├── Dockerfile              # Multi-stage: build → nginx
│   └── nginx.conf              # SPA routing config
│
├── backend/SportTrack.Api/     # ASP.NET Core 8 Minimal API
│   ├── Domain/Entities/        # Match, Player, Team (clean domain)
│   ├── Features/               # Vertical slice: each feature self-contained
│   │   ├── Matches/            # GetMatches, CreateMatch, UpdateScore, etc.
│   │   ├── Players/            # GetPlayers, CreatePlayer
│   │   └── Teams/              # GetStandings, CreateTeam
│   ├── Infrastructure/
│   │   └── Persistence/        # EF Core DbContext + entity configurations
│   ├── Common/                 # GlobalExceptionHandler, ValidationBehavior
│   ├── Program.cs              # App bootstrap + endpoint registration
│   └── Dockerfile              # Multi-stage: sdk → aspnet runtime
│
├── database/
│   ├── init.sql                # Schema + seed data (manual init option)
│   └── README.md               # Migration guide
│
├── .github/workflows/
│   └── ci-cd.yml               # GitHub Actions: Test → Build → Push → Deploy
│
├── k8s/
│   ├── base/                   # Core manifests (namespace, postgres, api, frontend, hpa)
│   └── overlays/prod/          # Production overrides via Kustomize
│
├── ansible/
│   ├── site.yml                # Master playbook (provision + deploy)
│   ├── inventory.ini           # Target hosts
│   ├── group_vars/all.yml      # Shared variables
│   └── roles/
│       ├── common/             # System baseline, swap off, sysctl
│       ├── docker/             # Docker Engine + containerd
│       └── k8s/                # kubeadm, kubelet, kubectl
│
├── terraform/
│   ├── main.tf                 # VPC, EC2 (t2.micro free tier), Security Groups
│   ├── variables.tf            # Input variables
│   ├── outputs.tf              # IPs, SSH commands, inventory hints
│   └── terraform.tfvars.example
│
└── docker-compose.yml          # Full local stack (postgres + api + frontend)
```

---

## 🚀 Learning Path — Do These Steps In Order

### STEP 1 — Git

```bash
git init
git add .
git commit -m "feat: initial SportTrack project"
git remote add origin https://github.com/YOUR_USER/sportrack.git
git push -u origin main
```

**What to learn:** branching strategy, conventional commits, PR workflow.
**Practice:** create a `develop` branch, make a small change, open a PR to `main`.

---

### STEP 2 — Run Locally (no Docker)

**PostgreSQL:**
```bash
# Install locally or use Docker for just the DB:
docker run -d --name pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:16-alpine
psql -h localhost -U postgres -f database/init.sql
```

**Backend:**
```bash
cd backend/SportTrack.Api
dotnet restore
dotnet run
# API available at http://localhost:5000
# Swagger UI at http://localhost:5000/swagger
```

**Frontend:**
```bash
cd frontend
npm install
REACT_APP_API_URL=http://localhost:5000/api/v1 npm start
# Opens at http://localhost:3000
```

---

### STEP 3 — Docker

**Build images manually:**
```bash
# Backend
docker build -t sporttrack-api ./backend/SportTrack.Api
docker run -d -p 5000:5000 \
  -e ConnectionStrings__DefaultConnection="Host=host.docker.internal;..." \
  sporttrack-api

# Frontend
docker build -t sporttrack-frontend ./frontend
docker run -d -p 80:80 sporttrack-frontend
```

**Run full stack with Compose:**
```bash
docker compose up --build
# Frontend → http://localhost
# API      → http://localhost:5000
# Swagger  → http://localhost:5000/swagger
```

**What to learn:** multi-stage builds, layer caching, environment variables,
health checks, named volumes, bridge networks.

---

### STEP 4 — CI/CD with GitHub Actions

1. Push to GitHub
2. Go to **Settings → Secrets and variables → Actions**, add:
   - `DOCKERHUB_USERNAME` — your Docker Hub username
   - `DOCKERHUB_TOKEN` — Docker Hub access token (Settings → Security)
   - `API_URL` — your eventual production API URL

3. The pipeline runs automatically on every push to `main`:
   - Tests .NET API (with a real PostgreSQL service container)
   - Tests and builds React app
   - Builds and pushes Docker images to Docker Hub
   - Deploys to Kubernetes (add AWS secrets to enable)

**What to learn:** jobs, steps, secrets, service containers, caching,
environment protection rules, matrix builds.

---

### STEP 5 — Kubernetes (local with minikube first)

```bash
# Install minikube
minikube start --driver=docker --cpus=2 --memory=4g

# Apply manifests
kubectl apply -k k8s/base/

# Watch pods come up
kubectl get pods -n sporttrack -w

# Access the app
minikube service sporttrack-frontend-svc -n sporttrack
```

**What to learn:** Pods, Deployments, Services, ConfigMaps, Secrets,
Ingress, PVCs, HPA, rolling updates, kubectl commands.

**Key kubectl commands to master:**
```bash
kubectl get all -n sporttrack
kubectl describe pod <name> -n sporttrack
kubectl logs <pod-name> -n sporttrack -f
kubectl exec -it <pod-name> -n sporttrack -- sh
kubectl rollout history deployment/sporttrack-api -n sporttrack
kubectl rollout undo deployment/sporttrack-api -n sporttrack
kubectl top pods -n sporttrack
```

---

### STEP 6 — Ansible (provision EC2 nodes)

```bash
# Install Ansible
pip install ansible

# Test connection to your servers
ansible all -i ansible/inventory.ini -m ping

# Run full provisioning (common + docker + k8s install + deploy)
ansible-playbook -i ansible/inventory.ini ansible/site.yml

# Run only a specific role
ansible-playbook -i ansible/inventory.ini ansible/site.yml --tags docker

# Dry run (check mode — no changes made)
ansible-playbook -i ansible/inventory.ini ansible/site.yml --check
```

**What to learn:** inventory, playbooks, roles, tasks, handlers,
variables, templates, vault for secrets, idempotency.

---

### STEP 7 — AWS (Free Tier)

**Free tier budget plan:**
- 2x `t2.micro` EC2 instances = **free** (750 hrs/month included)
- 20 GB EBS each = **free**
- Elastic IP (1 free while attached)
- Data transfer first 100GB = **free**

**Setup:**
```bash
# 1. Create SSH key pair
ssh-keygen -t ed25519 -f ~/.ssh/sporttrack-key -C "sporttrack"

# 2. Install Terraform
brew install terraform    # macOS
# or download from https://terraform.io

# 3. Configure AWS credentials
aws configure
# Enter: Access Key ID, Secret Access Key, region (us-east-1), output (json)

# 4. Copy and fill in tfvars
cp terraform/terraform.tfvars.example terraform/terraform.tfvars
# Edit: set my_ip_cidr to $(curl -s ifconfig.me)/32

# 5. Provision infrastructure
cd terraform
terraform init
terraform plan          # review what will be created
terraform apply         # type 'yes' to confirm

# 6. Note the output IPs, update ansible/inventory.ini

# 7. Run Ansible to configure nodes + deploy app
cd ansible
ansible-playbook -i inventory.ini site.yml
```

**What to learn:** VPC, subnets, security groups, EC2, EBS, EIP,
IAM roles, AWS CLI, Terraform state management.

---

## 🔌 API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/v1/matches | List all matches (filter: ?sport=Football&status=live) |
| POST   | /api/v1/matches | Create a new match |
| PATCH  | /api/v1/matches/{id}/score | Update score |
| PATCH  | /api/v1/matches/{id}/status | Update status (scheduled/live/finished) |
| DELETE | /api/v1/matches/{id} | Delete a match |
| GET    | /api/v1/players | List players (filter: ?team=Arsenal) |
| POST   | /api/v1/players | Create a player |
| GET    | /api/v1/teams/standings | League table (filter: ?sport=Football) |
| POST   | /api/v1/teams | Create a team |
| GET    | /health | Health check |

Full interactive docs at `/swagger` when running in development.

---

## 🔐 GitHub Actions Secrets Required

| Secret | Where to get it |
|--------|----------------|
| `DOCKERHUB_USERNAME` | Your Docker Hub username |
| `DOCKERHUB_TOKEN` | Docker Hub → Account Settings → Security → New Access Token |
| `API_URL` | Your production API URL |
| `AWS_ACCESS_KEY_ID` | AWS IAM → Users → Your user → Security credentials |
| `AWS_SECRET_ACCESS_KEY` | Same as above (shown only once on creation) |
| `AWS_REGION` | e.g. `us-east-1` |

---

## 📚 Concepts You'll Master

| Area | Concepts |
|------|----------|
| **Git** | Branching, PRs, conventional commits, tags |
| **Docker** | Multi-stage builds, layer caching, compose, volumes, networks |
| **CI/CD** | Jobs, steps, secrets, service containers, artifacts, environments |
| **Kubernetes** | Pods, Deployments, Services, Ingress, HPA, PVCs, Kustomize |
| **Ansible** | Inventory, playbooks, roles, handlers, vault, idempotency |
| **AWS** | VPC, EC2, EBS, EIP, Security Groups, IAM, CLI, free tier |
| **Terraform** | Providers, resources, variables, outputs, state, plan/apply |

---

## ⚠️ Cost Warnings

- `t2.micro` EC2: **FREE** (first 12 months, 750 hrs/month)
- EKS control plane: **$0.10/hr = ~$72/month** — NOT free. Use kubeadm on EC2 for free k8s.
- RDS: **FREE** (db.t3.micro, 750 hrs/month) — use Docker postgres to stay free
- Always run `terraform destroy` when done practicing to avoid surprise bills
- Set up AWS billing alerts at $1 and $5 as safety nets

```bash
# When done — destroy all AWS resources
cd terraform
terraform destroy
```
