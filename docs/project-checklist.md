# Project Requirement Checklist

| Изискване | Статус | Къде е покрито |
| --- | --- | --- |
| Git repo | Частично | Root repo е инициализирано. Има nested `frontend/.git`, който трябва да се махне или да стане submodule. |
| Web приложение | Готово | `frontend/`, `backend/` |
| Инфраструктурна диаграма | Готово | `docs/infrastructure.md`, `docs/infrastructure-diagram.mmd` |
| Pre-commit hooks | Готово | `.githooks/pre-commit`, `git config core.hooksPath .githooks` |
| CI Pipeline с тестове | Готово | `.github/workflows/ci-cd.yml` |
| Webhook notifications | Готово | `.github/workflows/ci-cd.yml`, `NOTIFICATION_WEBHOOK_URL` |
| Docker build + push | Готово | `.github/workflows/ci-cd.yml`, Dockerfiles |
| CD | Готово | GitHub Actions + `kubectl apply` към Kubernetes |
| Observability: метрики | Готово | Backend `/metrics`, `k8s/monitoring/service-monitor.yaml` |
| Observability: логове | Готово | Backend JSON request logs |
| Alerting | Готово | `k8s/monitoring/prometheus-rules.yaml`, `alertmanager-config.yaml` |
| Оркестратор | Готово | Kubernetes manifests в `k8s/` |
| IaC | Готово | `infra/terraform/` + Kubernetes YAML |
| Configuration & Secrets Management | Готово | GitHub Secrets, Terraform sensitive variables, `.gitignore`, `.env.example` |
| Документация README | Готово | `README.md` |

## Оставащи ръчни стъпки

1. Реши какво да правиш с nested `frontend/.git`.
2. Създай GitHub repository и push-ни root repo-то.
3. Създай Docker Hub repositories:
   - `music-map-backend`
   - `music-map-frontend`
4. Добави GitHub Secrets:
   - `DOCKERHUB_USERNAME`
   - `DOCKERHUB_TOKEN`
   - `KUBE_CONFIG_B64`
   - `NOTIFICATION_WEBHOOK_URL`
5. Осигури Kubernetes cluster и Prometheus/Alertmanager stack, ако ще демонстрираш production-like CD и alerting.
