import { render, screen } from '@testing-library/react'
import { DefaultCellRenderer } from 'components/Table/defaults'
import {
  DateRangeColumnFilter,
  NumberRangeColumnFilter,
} from 'components/Table/filters'
import { Column } from 'react-table'
import { DebugProvider } from 'test/testMocks'
import { ObjectWithStringKeys } from 'types/custom-types'

import { Table } from './Table'

interface TestData extends ObjectWithStringKeys {
  name: string
  secondValue: string | JSX.Element | number
}

let tableColumns: Column<TestData>[], tableData: TestData[]

describe('Table', () => {
  beforeEach(() => {
    tableColumns = [
      {
        Header: 'Name',
        accessor: 'name',
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
      {
        Header: 'Grade',
        accessor: 'secondValue',
        Cell: undefined,
        minWidth: 120,
        maxWidth: 180,
        width: 130,
      },
    ]
    tableData = [{ name: 'TestTable', secondValue: 'pass' }]
  })

  test('renders a table', async () => {
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getByRole('table')).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Name' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Grade' }),
    ).toBeInTheDocument()
  })

  test('no filter if disabled', async () => {
    tableColumns[1].disableFilters = true
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getAllByRole('textbox').length).toEqual(1)
  })

  test('renders string table data', () => {
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getByText(tableData[0].name)).toBeInTheDocument()
    expect(
      screen.getByText(tableData[0].secondValue as string),
    ).toBeInTheDocument()
  })

  test('renders string inline filter', async () => {
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getAllByRole('textbox').length).toEqual(2)
  })

  test('renders JSX table data', async () => {
    // @ts-expect-error Cell is not defined but its just a test
    tableColumns[1].Cell = DefaultCellRenderer
    tableData[0].secondValue = <>{'I am JSX'}</>
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getByText(tableData[0].name)).toBeInTheDocument()
    expect(screen.getByText('I am JSX')).toBeInTheDocument()
  })

  test('renders JSX inline filter', async () => {
    // @ts-expect-error Cell is not defined but its just a test
    tableColumns[1].Cell = DefaultCellRenderer
    tableData[0].secondValue = <>{'I am JSX'}</>
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getAllByRole('textbox').length).toEqual(2)
  })

  test('renders number table data', async () => {
    tableColumns[1].Filter = NumberRangeColumnFilter
    tableColumns[1].filter = 'between'
    tableData[0].secondValue = 42
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getByText(tableData[0].name)).toBeInTheDocument()
    expect(
      screen.getByText(tableData[0].secondValue as number),
    ).toBeInTheDocument()
  })

  test('renders number inline filter', async () => {
    tableColumns[1].Filter = NumberRangeColumnFilter
    tableColumns[1].filter = 'between'
    tableData[0].secondValue = 42
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getAllByRole('textbox').length).toEqual(1)
    expect(screen.getAllByRole('spinbutton').length).toEqual(2)
  })

  test('renders date table data', async () => {
    tableColumns[1].Filter = DateRangeColumnFilter
    tableColumns[1].filter = 'betweenDates'
    tableData[0].secondValue = new Date().toISOString()
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getByText(tableData[0].name)).toBeInTheDocument()
    expect(
      screen.getByText(tableData[0].secondValue as string),
    ).toBeInTheDocument()
  })

  test('renders date inline filter', async () => {
    tableColumns[1].Filter = DateRangeColumnFilter
    tableColumns[1].filter = 'betweenDates'
    tableData[0].secondValue = new Date().toISOString()
    render(
      <DebugProvider>
        <Table
          tableKey="Test"
          data={tableData}
          columns={tableColumns}
          hideToolbar
        />
      </DebugProvider>,
    )
    expect(screen.getAllByRole('textbox').length).toEqual(1)
    // todo: test better
    expect(screen.getByText('to')).toBeInTheDocument()
  })
})
