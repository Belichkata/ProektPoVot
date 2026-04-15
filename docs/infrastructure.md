# Infrastructure Diagram

```mermaid
flowchart LR
  dev[Developer] --> git[GitHub Repository]
  git --> hook[Pre-commit Hooks]
  git --> gha[GitHub Actions CI/CD]

  gha --> tests[Backend + Frontend Tests]
  gha --> scan[Secret Scan]
  gha --> build[Docker Build]
  build --> hub[Docker Hub]
  gha --> notify[Webhook Notifications]

  gha --> k8s[Kubernetes Cluster]
  tf[Terraform IaC] --> k8s
  k8s --> be[Backend API Pods]
  k8s --> fe[Frontend Pods]
  fe --> user[Browser]
  user --> be

  be --> metrics[/metrics]
  be --> logs[JSON Logs]
  metrics --> prom[Prometheus]
  logs --> kubelogs[Kubernetes Logs]
  prom --> alerts[Alertmanager]
  alerts --> notify
```

## Flow

1. Developer commits code through the configured pre-commit hook.
2. GitHub Actions runs tests, secret scanning, Docker builds, and notifications.
3. On `main`, images are pushed to Docker Hub.
4. CD applies Kubernetes manifests with the new image tag.
5. Backend exposes `/metrics`; Prometheus scrapes it and Alertmanager sends webhook alerts.
6. Terraform manages infrastructure configuration such as namespace and alert webhook secret.
