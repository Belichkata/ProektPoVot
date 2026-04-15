output "namespace" {
  description = "Namespace created for the application."
  value       = kubernetes_namespace.music_map.metadata[0].name
}

output "alert_webhook_secret_name" {
  description = "Name of the Kubernetes Secret consumed by AlertmanagerConfig."
  value       = kubernetes_secret.alert_webhook.metadata[0].name
}
