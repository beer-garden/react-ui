import axios from 'axios'
import { Garden } from 'types/backend-types'
import { SuccessCallback } from 'types/custom-types'

class GardensService {
  CONNECTION_TYPES = ['HTTP', 'STOMP']
  SCHEMA = {
    type: 'object',
    required: ['connection_type'],
    properties: {
      connection_type: {
        title: 'Connection Type',
        description:
          'The type of connection that is established for the Garden to receive requests and events',
        type: 'string',
        enum: this.CONNECTION_TYPES,
      },
      http: {
        title: ' ',
        type: 'object',
        properties: {
          name: {
            title: 'Garden Name',
            description:
              'This is the globally routing name that Beer Garden utilizes when routing requests and events',
            type: 'string',
          },
          host: {
            title: 'Host Name',
            description: 'Beer-garden hostname',
            type: 'string',
            minLength: 1,
          },
          port: {
            title: 'Port',
            description: 'Beer-garden port',
            type: 'integer',
            minLength: 1,
          },
          url_prefix: {
            title: 'URL Prefix',
            description:
              "URL path that will be used as a prefix when communicating with Beer-garden. Useful if Beer-garden is running on a URL other than '/'.",
            type: 'string',
          },
          ca_cert: {
            title: 'CA Cert Path',
            description:
              'Path to certificate file containing the certificate of the authority that issued the Beer-garden server certificate',
            type: 'string',
          },
          ca_verify: {
            title: 'CA Cert Verify',
            description: 'Whether to verify Beer-garden server certificate',
            type: 'boolean',
          },
          ssl: {
            title: 'SSL Enabled',
            description: 'Whether to connect with provided certifications',
            type: 'boolean',
          },
          client_cert: {
            title: 'Client Cert Path',
            description:
              'Path to client certificate to use when communicating with Beer-garden',
            type: 'string',
          },
        },
      },
      stomp: {
        title: ' ',
        type: 'object',
        properties: {
          host: {
            title: 'Host Name',
            description: 'Beer-garden hostname',
            type: 'string',
            minLength: 1,
          },
          port: {
            title: 'Port',
            description: 'Beer-garden port',
            type: 'integer',
            minLength: 1,
          },
          send_destination: {
            title: 'Send Destination',
            description: 'Destination queue where Stomp will send messages.',
            type: 'string',
          },
          subscribe_destination: {
            title: 'Subscribe Destination',
            description:
              'Destination queue where Stomp will listen for messages.',
            type: 'string',
          },
          username: {
            title: 'Username',
            description: 'Username for Stomp connection.',
            type: 'string',
          },
          password: {
            title: 'Password',
            description: 'Password for Stomp connection.',
            type: 'string',
          },
          ssl: {
            title: ' ',
            type: 'object',
            properties: {
              use_ssl: {
                title: 'SSL Enabled',
                description: 'Whether to connect with provided certifications',
                type: 'boolean',
              },
              ca_cert: {
                title: 'CA Cert',
                description:
                  'Path to certificate file containing the certificate of the authority that issued the message broker certificate',
                type: 'string',
              },
              client_cert: {
                title: 'Client Cert',
                description:
                  'Path to client public certificate to use when communicating with the message broker',
                type: 'string',
              },
              client_key: {
                title: 'Client Key',
                description:
                  'Path to client private key to use when communicating with the message broker',
                type: 'string',
              },
            },
          },
          headers: {
            title: 'Headers',
            description: 'Headers to be sent with message',
            type: 'array',
            items: {
              title: ' ',
              type: 'object',
              properties: {
                key: {
                  title: 'Key',
                  description: '',
                  type: 'string',
                },
                value: {
                  title: 'Value',
                  description: '',
                  type: 'string',
                },
              },
            },
          },
        },
      },
    },
  }
  UISCHEMA = {
    type: 'VerticalLayout',
    elements: [
      {
        type: 'Control',
        scope: '#/properties/connection_type',
      },
      {
        type: 'Categorization',
        elements: [
          {
            type: 'Category',
            label: 'HTTP',
            elements: [
              { type: 'Control', scope: '#/properties/http/properties/host' },
              { type: 'Control', scope: '#/properties/http/properties/port' },
              {
                type: 'Control',
                scope: '#/properties/http/properties/url_prefix',
              },
              { type: 'Control', scope: '#/properties/http/properties/ssl' },
              {
                type: 'Control',
                scope: '#/properties/http/properties/ca_cert',
              },
              {
                type: 'Control',
                scope: '#/properties/http/properties/ca_verify',
              },
              {
                type: 'Control',
                scope: '#/properties/http/properties/client_cert',
              },
            ],
          },
          {
            type: 'Category',
            label: 'STOMP',
            elements: [
              { type: 'Control', scope: '#/properties/stomp/properties/host' },
              { type: 'Control', scope: '#/properties/stomp/properties/port' },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/send_destination',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/subscribe_destination',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/username',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/password',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/ssl/properties/use_ssl',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/ssl/properties/ca_cert',
              },
              {
                type: 'Control',
                scope:
                  '#/properties/stomp/properties/ssl/properties/client_cert',
              },
              {
                type: 'Control',
                scope:
                  '#/properties/stomp/properties/ssl/properties/client_key',
              },
              {
                type: 'Control',
                scope: '#/properties/stomp/properties/headers',
              },
            ],
          },
        ],
      },
    ],
  }

  getGardens(successCallback: SuccessCallback) {
    const url = '/api/v1/gardens'
    axios.get(url).then((response) => {
      successCallback(response)
    })
  }

  getGarden(successCallback: SuccessCallback, garden_name: string) {
    const url = '/api/v1/gardens'
    axios.get(url + '/' + garden_name).then((response) => {
      successCallback(response)
    })
  }

  // syncAllGardens(gardens: Garden[]) {}

  syncGarden(garden_name: string) {
    const url = '/api/v1/gardens'
    axios.patch(url + '/' + garden_name, {
      operation: 'sync',
      path: '',
      value: '',
    })
  }

  updateGardenConfig(garden: Garden) {
    const url = '/api/v1/gardens'
    axios.patch(url + '/' + garden.name, {
      operation: 'config',
      path: '',
      value: garden,
    })
  }

  deleteGarden(garden_name: string) {
    const url = '/api/v1/gardens'
    axios.delete(url + '/' + garden_name)
  }

  serverModelToForm(model: any) {
    const values: any = {}
    const stomp_headers = []
    values['connection_type'] = model['connection_type']
    for (const parameter of Object.keys(model['connection_params'])) {
      if (parameter === 'stomp_headers') {
        for (const key in model['connection_params'][parameter]) {
          stomp_headers[stomp_headers.length] = {
            key: key,
            value: model['connection_params'][parameter][key],
          }
        }
        values[parameter] = stomp_headers
      } else {
        values[parameter] = model['connection_params'][parameter]
      }
    }

    return values
  }

  formToServerModel = function (model: any, form: any) {
    model['connection_type'] = form['connection_type']
    model['connection_params'] = {}
    const stomp_headers: any = {}
    for (const field of Object.keys(form)) {
      if (field === 'stomp_headers') {
        for (const i in form[field]) {
          stomp_headers[form[field][i]['key']] = form[field][i]['value']
        }
        model['connection_params'][field] = stomp_headers
      } else if (field !== 'connection_type') {
        model['connection_params'][field] = form[field]
      }
    }

    return model
  }
}

const item = new GardensService()

export default item
