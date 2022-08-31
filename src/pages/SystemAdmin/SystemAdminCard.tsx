import {
  Cached as CachedIcon,
  Delete as DeleteIcon,
  Link as LinkIcon,
  PlayCircleFilled as PlayCircleFilledIcon,
  Stop as StopIcon,
} from '@mui/icons-material'
import {
  Alert,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import OverflowTooltip from 'components/overflowTooltip'
import useSystems from 'hooks/useSystems'
import {
  alertStyle,
  instanceIcon,
  systemIcon,
  systemsSeverity,
} from 'pages/SystemAdmin'
import SystemCardInstances from 'pages/SystemAdmin/SystemCardInstances'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { System } from 'types/backend-types'

const SystemAdminCard = ({ systems }: { systems: System[] }) => {
  const systemClient = useSystems()
  const [systemIndex, setSystemIndex] = useState(0)

  const handleChange = (event: SelectChangeEvent) => {
    setSystemIndex(parseInt(event.target.value))
  }

  return (
    <Card sx={{ width: 200 }}>
      <Alert
        variant="outlined"
        sx={{
          ...alertStyle,
          backgroundColor: 'primary.main',
        }}
        icon={instanceIcon(systems[systemIndex].instances) ? undefined : false}
        severity={systemsSeverity(systems)}
      >
        <OverflowTooltip
          color="common.white"
          variant="h6"
          tooltip={systems[systemIndex].name}
          text={systems[systemIndex].name}
          css={{ py: 0 }}
        />
      </Alert>
      <CardContent>
        <Grid justifyContent="center" container>
          <Grid item key="selector">
            <FormControl sx={{ m: 0.1, py: 0.1 }} size="small">
              <Select
                variant="outlined"
                error={systemIcon(systems)}
                value={systemIndex.toString()}
                onChange={handleChange}
                sx={{ py: 0.1 }}
              >
                {systems.map((system, index) => (
                  <MenuItem key={system.version} value={index} dense divider>
                    <Alert
                      sx={{ ...alertStyle, py: 0.1 }}
                      severity={systemsSeverity([system])}
                      icon={false}
                    >
                      {system.version}
                    </Alert>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item key={`${systems[systemIndex]}Actions`}>
            <Toolbar variant="dense" disableGutters sx={{ minHeight: 36 }}>
              <Tooltip
                arrow
                title="View instance commands"
                placement="bottom-start"
              >
                <IconButton
                  size="small"
                  component={RouterLink}
                  to={[
                    '/systems',
                    systems[systemIndex].namespace,
                    systems[systemIndex].name,
                    systems[systemIndex].version,
                  ].join('/')}
                >
                  <LinkIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                arrow
                title="Start all instances"
                placement="bottom-start"
              >
                <IconButton
                  size="small"
                  onClick={() => systemClient.startSystem(systems[systemIndex])}
                  aria-label="start"
                >
                  <PlayCircleFilledIcon />
                </IconButton>
              </Tooltip>
              <Tooltip
                arrow
                title="Stop all instances"
                placement="bottom-start"
              >
                <IconButton
                  size="small"
                  onClick={() => systemClient.stopSystem(systems[systemIndex])}
                  aria-label="stop"
                >
                  <StopIcon />
                </IconButton>
              </Tooltip>
              <Tooltip arrow title="Reload system" placement="bottom-start">
                <IconButton
                  size="small"
                  onClick={() =>
                    systemClient.reloadSystem(systems[systemIndex].id)
                  }
                  aria-label="reload"
                >
                  <CachedIcon />
                </IconButton>
              </Tooltip>
              <Tooltip arrow title="Delete system" placement="bottom-start">
                <IconButton
                  size="small"
                  onClick={() =>
                    systemClient.deleteSystem(systems[systemIndex].id)
                  }
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Toolbar>
          </Grid>
          <Grid item key="description">
            <Typography
              variant="body2"
              color="textSecondary"
              gutterBottom={false}
              sx={{ fontSize: '13px' }}
            >
              {systems[systemIndex].description}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
      <Divider variant="middle" />
      <SystemCardInstances
        instances={systems[systemIndex].instances}
        fileHeader={`${systems[systemIndex].name}[${systems[systemIndex].version}]`}
      />
    </Card>
  )
}

export default SystemAdminCard
