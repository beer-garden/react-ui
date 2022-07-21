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
  Collapse,
  Divider,
  FormControl,
  Grid,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Toolbar,
  Typography,
} from '@mui/material'
import SystemCardInstances from 'components/SystemCardInstances'
import useSystems from 'hooks/useSystems'
import {
  alertStyle,
  instanceIcon,
  systemIcon,
  systemsSeverity,
} from 'pages/SystemAdmin'
import { useState } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import { System } from 'types/custom_types'

const SystemAdminCard = ({ systems }: { systems: System[] }) => {
  const systemClient = useSystems()
  const [expanded, setExpanded] = useState(false)
  const [systemIndex, setSystemIndex] = useState(0)

  const handleChange = (event: SelectChangeEvent) => {
    setSystemIndex(parseInt(event.target.value))
  }
  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Card sx={{ width: 200 }}>
      <Alert
        variant="outlined"
        sx={{ ...alertStyle, background: 'lightgray' }}
        icon={instanceIcon(systems[systemIndex].instances) ? undefined : false}
        severity={systemsSeverity(systems)}
        onClick={handleExpandClick}
      >
        <Typography variant="h6" sx={{ py: 0 }} color="inherit">
          {systems[systemIndex].name}
        </Typography>
      </Alert>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
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
                <IconButton
                  size="small"
                  onClick={() => systemClient.startSystem(systems[systemIndex])}
                  aria-label="start"
                >
                  <PlayCircleFilledIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() => systemClient.stopSystem(systems[systemIndex])}
                  aria-label="stop"
                >
                  <StopIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    systemClient.reloadSystem(systems[systemIndex].id)
                  }
                  aria-label="reload"
                >
                  <CachedIcon />
                </IconButton>
                <IconButton
                  size="small"
                  onClick={() =>
                    systemClient.deleteSystem(systems[systemIndex].id)
                  }
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
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
        <Divider key="divider" variant="middle" />
        <SystemCardInstances instances={systems[systemIndex].instances} />
      </Collapse>
    </Card>
  )
}

export default SystemAdminCard
