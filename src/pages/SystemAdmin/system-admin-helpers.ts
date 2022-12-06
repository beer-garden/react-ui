import { AlertColor } from '@mui/material'
import { Instance, System } from 'types/backend-types'

const alertStyle = {
  '& .MuiAlert-message': {
    padding: '0px',
  },
  '& .MuiAlert-icon': {
    padding: '4px 0',
  },
  py: 0,
  width: '100%',
}

/**
 * Determines what Alert severity the instance should be based on its status
 * @param status Instance status
 * @returns string severity
 */
const getSeverity = (status: string) => {
  switch (status) {
    case 'RUNNING':
      return 'success'
    case 'UNREACHABLE':
    case 'NOT_CONFIGURED':
    case 'UNKNOWN':
    case 'STOPPING':
    case 'UNRESPONSIVE':
      return 'warning'
    case 'STARTING':
    case 'INITIALIZING':
    case 'BLOCKED':
    case 'RELOADING':
      return 'info'
    case 'DEAD':
    case 'ERROR':
    case 'STOPPED':
      return 'error'
    default:
      break
  }
}

/**
 * Processes status of array of systems to determine if there is
 * an error in one of the instances on any of the systems. If
 * there is, the icon should be shown as we only want to show error icons.
 * @param systems Array of systems
 * @returns boolean Show icon?
 */
const systemIcon = (systems: System[]) => {
  let status = false
  systems.forEach((system) => {
    if (!status) {
      status = instanceIcon(system.instances)
    }
  })
  return status
}

/**
 * Processes status of array of instances to determine if there
 * is an error in an instance. If there is, the icon should be
 * shown as we only want to show error icons.
 * @param instances Array of instances
 * @returns boolean Show icon?
 */
const instanceIcon = (instances: Instance[]) => {
  let status = false
  const trueTriggers = [
    'STARTING',
    'INITIALIZING',
    'RELOADING',
    'STOPPING',
    'UNRESPONSIVE',
    'DEAD',
    'STOPPED',
  ]
  trueTriggers.forEach((trigger) => {
    if (!status) {
      status = instances.some(
        (instance: Instance) => instance.status === trigger,
      )
    }
  })
  return status
}

/**
 * Determines what Alert severity the system should be based on the
 * status of every instance in the system: error, warning, info, or success
 * @param systems Array of systems
 * @returns AlertColor | undefined
 */
const systemsSeverity = (systems: System[]) => {
  let status: AlertColor | undefined
  systems.forEach((system: System) => {
    system.instances.forEach((instance: Instance) => {
      if (status !== 'error') {
        switch (instance.status) {
          case 'RUNNING':
            if (!status) status = 'success'
            break
          case 'STOPPING':
          case 'UNRESPONSIVE':
            status = 'warning'
            break
          case 'STARTING':
          case 'INITIALIZING':
          case 'RELOADING':
            if (status !== 'warning') status = 'info'
            break
          case 'DEAD':
          case 'STOPPED':
            status = 'error'
            break
          default:
            break
        }
      }
    })
  })
  return status
}

/**
 * Creates object of System[], keyed by system.name. Each value is an array
 * of identical systems sorted by version number.
 * @param namespaces Array of namespaces to take
 * @param allSystems Array of all systems available
 * @returns object of System[] accessible by systems[system.name]
 */
const sortSystems = (allSystems: System[]): { [key: string]: System[] } => {
  const sortedSystems: { [key: string]: System[] } = {}
  allSystems.forEach((system: System) => {
    // only process each system name once
    if (!(system.name in sortedSystems)) {
      // put all systems into a group
      sortedSystems[system.name] = allSystems.filter(
        (sys: System) => sys.name === system.name,
      )
      // sort system group by version
      sortedSystems[system.name] = sortedSystems[system.name].sort((a, b) =>
        a.version > b.version ? -1 : 1,
      )
    }
  })
  return sortedSystems
}

export {
  alertStyle,
  getSeverity,
  instanceIcon,
  sortSystems,
  systemIcon,
  systemsSeverity,
}
