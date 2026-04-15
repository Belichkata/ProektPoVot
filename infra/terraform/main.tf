resource "kubernetes_namespace" "music_map" {
  metadata {
    name = var.namespace
    labels = {
      "app.kubernetes.io/name"       = "music-map"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }
}

resource "kubernetes_secret" "alert_webhook" {
  metadata {
    name      = "alert-webhook"
    namespace = kubernetes_namespace.music_map.metadata[0].name
    labels = {
      "app.kubernetes.io/name"       = "music-map"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }

  data = {
    url = var.alert_webhook_url
  }

  type = "Opaque"
}

resource "kubernetes_config_map" "deployment_config" {
  metadata {
    name      = "music-map-deployment-config"
    namespace = kubernetes_namespace.music_map.metadata[0].name
    labels = {
      "app.kubernetes.io/name"       = "music-map"
      "app.kubernetes.io/managed-by" = "terraform"
    }
  }

  data = {
    dockerhub_username = var.dockerhub_username
    deployment_tool    = "github-actions-kubectl"
    observability      = "prometheus-alertmanager"
  }
}
