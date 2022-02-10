import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import Box from '@material-ui/core/Box'
import {
  Link as RouterLink,
  match as Match,
  RouteComponentProps,
} from 'react-router-dom'

import PageHeader from '../components/page_header'
import Divider from '../components/divider'
import Breadcrumbs from '../components/breadcrumbs'
import SystemsService from '../services/system_service'
import Table from '../components/table'
import {
  Command,
  CommandParams,
  System,
  TableState,
} from '../custom_types/custom_types'

interface MyProps extends RouteComponentProps<CommandParams> {
  systems: System[]
  match: Match<CommandParams>
}

function makeItHappenButton(command: Command) {
  return (
    <Button
      component={RouterLink}
      to={[
        '/systems',
        command.namespace,
        command.systemName,
        command.systemVersion,
        'commands',
        command.name,
      ].join('/')}
      size="small"
      variant="contained"
      color="primary"
    >
      Make it Happen
    </Button>
  )
}

class CommandsApp extends Component<MyProps, TableState> {
  state: TableState = {
    completeDataSet: this.getCommands(),
    formatData: this.formatData,
    cacheKey: `lastKnownCommandIndex`,
    includePageNav: true,
    disableSearch: false,
    tableHeads: [
      'Namespace',
      'System',
      'Version',
      'Command',
      'Description',
      '',
    ],
  }
  title = 'Commands'

  getCommands(): Command[] {
    const { namespace, system_name, version } = this.props.match.params
    const systems = SystemsService.filterSystems(this.props.systems, {
      namespace: namespace,
      name: system_name,
      version: version,
    })
    let commands: Command[] = []
    for (const i in systems) {
      for (const k in systems[i].commands) {
        systems[i].commands[k]['namespace'] = systems[i].namespace
        systems[i].commands[k]['systemName'] = systems[i].name
        systems[i].commands[k]['systemVersion'] = systems[i].version
      }
      commands = commands.concat(systems[i].commands)
    }
    return commands
  }

  formatData(data: Command[]): (string | JSX.Element)[][] {
    const tempData: (string | JSX.Element)[][] = []
    for (const i in data) {
      tempData[i] = [
        data[i].namespace,
        data[i].systemName,
        data[i].systemVersion,
        data[i].name,
        data[i].description || 'No Description Provided',
        makeItHappenButton(data[i]),
      ]
    }
    return tempData
  }

  render(): JSX.Element {
    const { namespace, system_name, version } = this.props.match.params
    const breadcrumbs = [namespace, system_name, version].filter(function (x) {
      return x !== undefined
    })
    return (
      <Box>
        <PageHeader title={this.title} description={''} />
        <Divider />
        <Breadcrumbs breadcrumbs={breadcrumbs} />
        <Table parentState={this.state} />
      </Box>
    )
  }
}

export default CommandsApp
