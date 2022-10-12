export interface ServerConfig {
  application_name: string
  auth_enabled: boolean
  trusted_header_auth_enabled: boolean
  icon_default: string
  debug_mode: boolean
  execute_javascript: boolean
  garden_name: string
  metrics_url: string
  url_prefix: string
}

export interface VersionConfig {
  beer_garden_version: string
  current_api_version: string
  supported_api_versions: [string]
}

export interface DebugSettings {
  LOGIN?: boolean
  AUTH?: boolean
  LOCAL_STORAGE?: boolean
  PERMISSION?: boolean
  SOCKET?: boolean
}
