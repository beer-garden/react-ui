import { DateTrigger, Request } from 'types/backend-types'

export const serverConfig = {
  application_name: 'testApp',
  auth_enabled: false,
  trusted_header_auth_enabled: false,
  icon_default: 'none',
  debug_mode: false,
  execute_javascript: false,
  garden_name: 'testGarden',
  metrics_url: '/metrics',
  url_prefix: '/',
}

export const versionConfig = {
  beer_garden_version: '1.0.0',
  current_api_version: '1.0.1',
  supported_api_versions: ['1.0.0', '1.0.1'],
}

export const job = {
  coalesce: false,
  error_count: 0,
  id: '123test',
  max_instances: 1,
  misfire_grace_time: null,
  name: 'testjob',
  next_run_time: 1,
  request_template: {} as Request,
  status: 'RUNNING',
  success_count: 1,
  timeout: null,
  trigger: {} as DateTrigger,
  trigger_type: 'DateTrigger',
}
