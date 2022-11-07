import { render, screen, waitFor } from '@testing-library/react'
import { Routes } from 'components/Routes'
import { Suspense } from 'react'
import { mockAxios } from 'test/axios-mock'
import { TServerAuthConfig } from 'test/test-values'
import { AllProviders, LoggedInProviders } from 'test/testMocks'

import { NavigationBar } from './NavigationBar'

describe('NavigationBar', () => {
  test('renders title bar', async () => {
    render(
      <AllProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </AllProviders>,
    )
    // alternate fix to 'code that causes React state updates should be wrapped into act(...):' error
    const header = await screen.findByRole('heading')
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Beer Garden')
  })

  describe('url manipulation workaround', () => {
    let warnSpy: jest.SpyInstance

    beforeAll(() => {
      const realLocation = window.location
      window.location = { ...realLocation, assign: jest.fn() }
      // hides page does not exist warning log we don't really care about
      // since Router handles redirect
      warnSpy = jest.spyOn(console, 'warn')
    })

    afterEach(() => {
      window.location.hash = '/'
      window.location.pathname = '/'
    })

    afterAll(() => {
      warnSpy.mockClear()
    })

    test('redirects to correct page if given', async () => {
      window.location.hash = '#first/requests'
      render(
        <AllProviders>
          <NavigationBar
            setMarginLeft={() => {
              // do nothing
            }}
          />
        </AllProviders>,
      )
      await waitFor(() => expect(window.location.hash).toEqual('#/requests'))
    })

    test.each(['#first/systems', '#second/', '#/other', '#again/bad'])(
      'redirects to systems page on bad hash %s',
      async (url) => {
        window.location.hash = url
        render(
          <AllProviders>
            <>
              <NavigationBar
                setMarginLeft={() => {
                  // do nothing
                }}
              />
              <Suspense fallback={'loading'}>
                <Routes />
              </Suspense>
            </>
          </AllProviders>,
        )
        await waitFor(() => expect(window.location.hash).toEqual('#/systems'))
      },
    )

    test.each(['something', 'other/', '/test/'])(
      'removes bad pathname %s',
      async (url) => {
        render(
          <AllProviders>
            <NavigationBar
              setMarginLeft={() => {
                // do nothing
              }}
            />
          </AllProviders>,
        )
        await waitFor(() => expect(window.location.pathname).toEqual('/'))
      },
    )
  })

  test('no user welcome when not logged in', async () => {
    render(
      <AllProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </AllProviders>,
    )
    await waitFor(() =>
      expect(screen.queryByText('Hello, admin!')).not.toBeInTheDocument(),
    )
  })

  test('adds user welcome when logged in', async () => {
    // change return to enable auth
    mockAxios.onGet('/config').reply(200, TServerAuthConfig)

    render(
      <LoggedInProviders>
        <NavigationBar
          setMarginLeft={() => {
            // do nothing
          }}
        />
      </LoggedInProviders>,
    )
    const header = await screen.findByRole('heading', { name: 'Hello, admin!' })
    expect(header).toBeInTheDocument()
    expect(header.textContent).toEqual('Hello, admin!')
  })
})
