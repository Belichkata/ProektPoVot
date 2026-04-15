variable "kubeconfig_path" {
  description = "Path to the kubeconfig used by Terraform."
  type        = string
  default     = "~/.kube/config"
}

variable "namespace" {
  description = "Kubernetes namespace for the Music Map application."
  type        = string
  default     = "music-map"
}

variable "alert_webhook_url" {
  description = "Webhook URL used by Alertmanager. Pass this from a secret manager or CI secret."
  type        = string
  sensitive   = true
}

variable "dockerhub_username" {
  description = "Docker Hub username used by CI/CD image tags."
  type        = string
}
