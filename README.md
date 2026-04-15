# Music Map

Music Map е web приложение за интерактивно разглеждане на музикални жанрове. Проектът визуализира голяма графова карта с над 300 жанра, връзки между тях и примерна песен/preview за избрания жанр.

## Архитектура

```mermaid
flowchart LR
  dev[Developer] --> git[GitHub Repository]
  git --> hooks[Pre-commit Hooks]
  git --> ci[GitHub Actions CI/CD]
  ci --> tests[Tests + Secret Scan]
  ci --> images[Docker Build + Push]
  images --> hub[Docker Hub]
  ci --> k8s[Kubernetes Deploy]
  terraform[Terraform IaC] --> k8s
  k8s --> frontend[Frontend Pods]
  k8s --> backend[Backend API Pods]
  frontend --> browser[Browser]
  browser --> backend
  backend --> metrics[/metrics]
  metrics --> prometheus[Prometheus]
  prometheus --> alertmanager[Alertmanager]
  alertmanager --> webhook[Webhook Notification]
```

Отделен файл с диаграмата има в [docs/infrastructure.md](docs/infrastructure.md), а Mermaid source е в [docs/infrastructure-diagram.mmd](docs/infrastructure-diagram.mmd).

## Стартиране локално

1. Инсталирай dependencies:

```powershell
cd backend
npm install
cd ..\frontend
npm install
```

2. Стартирай backend:

```powershell
cd backend
npm start
```

Backend API:

```text
http://localhost:5000
http://localhost:5000/genres
http://localhost:5000/metrics
```

3. Стартирай frontend в друг terminal:

```powershell
cd frontend
npm start
```

Frontend:

```text
http://localhost:3000
```

## Стартиране с Docker Compose

От root папката:

```powershell
docker compose up --build
```

След това отвори:

```text
http://localhost:3000
```

Backend API остава достъпен на:

```text
http://localhost:5000
```

## Tests

```powershell
cd backend
npm test
```

```powershell
cd frontend
npm test -- --watchAll=false --runInBand
```

## Pre-commit hooks

Проектът има hook в `.githooks/pre-commit`, който:

- блокира staged `.env`, `tfvars`, kubeconfig и secret файлове;
- търси очевидни hard-coded secrets в staged diff;
- пуска backend и frontend тестовете.

Активиране:

```powershell
git config core.hooksPath .githooks
```

## CI/CD

Pipeline-ът е в [.github/workflows/ci-cd.yml](.github/workflows/ci-cd.yml).

CI изпълнява:

- checkout;
- secret scan чрез Gitleaks;
- backend install + tests;
- frontend install + tests;
- frontend production build.

CD изпълнява при push към `main`:

- Docker login;
- build + push на backend image към Docker Hub;
- build + push на frontend image към Docker Hub;
- deploy към Kubernetes чрез `kubectl apply`;
- webhook notification.

Необходими GitHub Secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`
- `KUBE_CONFIG_B64` - base64 encoded kubeconfig за Kubernetes cluster;
- `NOTIFICATION_WEBHOOK_URL` - Discord/Slack/Teams webhook.

Optional GitHub Variable:

- `REACT_APP_API_URL` - frontend build-time API URL.

## Kubernetes

Kubernetes manifests са в [k8s/base](k8s/base):

- Namespace;
- backend Deployment + Service;
- frontend Deployment + Service;
- HPA за backend и frontend.

Примерно ръчно apply, ако искаш да тестваш без CI/CD:

```powershell
kubectl apply -f k8s/base
```

Преди ръчно apply замени placeholders в YAML файловете:

- `DOCKERHUB_USERNAME`
- `IMAGE_TAG`

## Observability и Alerting

Backend-ът пише JSON логове за HTTP requests и expose-ва Prometheus metrics на:

```text
/metrics
```

Monitoring manifests са в [k8s/monitoring](k8s/monitoring):

- `ServiceMonitor` за Prometheus scrape;
- `PrometheusRule` с alert-и;
- `AlertmanagerConfig` за webhook notifications;
- примерен webhook Secret template.

Alert webhook URL не се commit-ва. Подай го през Terraform variable или Kubernetes Secret от secret manager.

## Infrastructure as Code

Terraform файловете са в [infra/terraform](infra/terraform). Те управляват:

- Kubernetes namespace;
- Alertmanager webhook Secret;
- deployment ConfigMap с operational metadata.

Пример:

```powershell
cd infra/terraform
terraform init
terraform plan -var-file=terraform.tfvars
terraform apply -var-file=terraform.tfvars
```

Не качвай реален `terraform.tfvars` в Git. Използвай [infra/terraform/terraform.tfvars.example](infra/terraform/terraform.tfvars.example) като шаблон.

## Configuration & Secrets Management

Локално:

- `.env.example` показва нужните променливи;
- реални `.env` файлове са в `.gitignore`.

CI/CD:

- Docker Hub credentials, kubeconfig и webhook URL се пазят като GitHub Secrets;
- Kubernetes alert webhook се създава през Terraform като Kubernetes Secret.

## Технологии и версии

- Node.js 20 за Docker images;
- Backend: Express 5.2.1, CORS 2.8.6;
- Frontend: React 19.2.5, React Scripts 5.0.1, Axios 1.15.0, react-force-graph-2d 1.29.1;
- Docker + Docker Compose;
- GitHub Actions;
- Docker Hub;
- Kubernetes;
- Terraform >= 1.6;
- Prometheus + Alertmanager.

## Структура на проекта

```text
backend/             Express API, genre catalog, metrics, backend tests
frontend/            React UI with interactive music graph
docs/                Infrastructure documentation and diagram
k8s/base/            Kubernetes app manifests
k8s/monitoring/      Prometheus and Alertmanager manifests
infra/terraform/     Terraform IaC for namespace and secrets
.github/workflows/   CI/CD pipeline
.githooks/           Git pre-commit hook
docker-compose.yml   Local Docker Compose setup
```

## Git repo

Ако още не е създаден root Git repository:

```powershell
git init
git config core.hooksPath .githooks
git add .
git commit -m "Initial Music Map project"
```

След това създай GitHub repo и го закачи:

```powershell
git remote add origin https://github.com/<your-user>/<your-repo>.git
git branch -M main
git push -u origin main
```
