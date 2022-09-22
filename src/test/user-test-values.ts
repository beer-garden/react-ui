import { RoleAssignment, User } from 'types/backend-types'

const TRole = {
  id: 'role1',
  name: 'testRole',
  permissions: ['admin'],
}

const TRoleAssignment: RoleAssignment = {
  domain: {
    scope: 'System',
    identifiers: {
      serialization_schema_selector: true,
      deserialization_schema_selector: true,
    },
  },
  role: TRole,
}

export const TUser: User = {
  username: 'someUser',
  id: 'usr1',
  role_assignments: [TRoleAssignment],
  permissions: { domain_permissions: {}, global_permissions: ['admin'] },
  sync_status: null,
}
