import { Box, Button } from '@mui/material'
import { Component } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import Divider from '../components/divider'
import PageHeader from '../components/page_header'
import Table from '../components/table'
import { System, TableState } from '../custom_types/custom_types'

type MyProps = {
  systems: System[]
}

function exploreButton(system: System) {
  return (
    <Button
      size="small"
      component={RouterLink}
      to={['/systems', system.namespace, system.name, system.version].join('/')}
      variant="contained"
      color="primary"
    >
      Explore
    </Button>
  )
}

class SystemsApp extends Component<MyProps, TableState> {
  state: TableState = {
    completeDataSet: this.props.systems,
    formatData: this.formatData,
    cacheKey: `lastKnown_${window.location.href}`,
    includePageNav: true,
    disableSearch: false,
    tableHeads: [
      'Namespace',
      'System',
      'Version',
      'Description',
      'Commands',
      'Instances',
      '',
    ],
  }

  title = 'Systems'

  formatData(systems: System[]): (string | JSX.Element | number)[][] {
    const tempData: (string | JSX.Element | number)[][] = []
    for (const i in systems) {
      tempData[i] = [
        systems[i].namespace,
        systems[i].name,
        systems[i].version,
        systems[i].description,
        systems[i].commands.length,
        systems[i].instances.length,
        exploreButton(systems[i]),
      ]
    }
    return tempData
  }

  render(): JSX.Element {
    return (
      <div>
        <PageHeader title={this.title} description={''} />
        <Divider />
        <Box pt={1}>
          <Table parentState={this.state} />
        </Box>
      </div>
    )
  }
}

export default SystemsApp
