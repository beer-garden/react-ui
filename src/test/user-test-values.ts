import { RoleAssignment, User } from 'types/backend-types'

const TRole = {
  id: 'role1',
  name: 'testRole',
  permissions: ['basic'],
}

const TRoleAssignment: RoleAssignment = {
  domain: {
    scope: 'System',
    identifiers: {
      namespace: 'child',
    },
  },
  role: TRole,
}

const TAdminRole = {
  id: 'role1',
  name: 'testRole',
  permissions: ['admin'],
}

const TAdminRoleAssignment: RoleAssignment = {
  domain: {
    scope: 'System',
    identifiers: {
      name: 'default',
    },
  },
  role: TAdminRole,
}

export const TUser: User = {
  username: 'someUser',
  id: 'usr1',
  role_assignments: [TRoleAssignment],
  permissions: { domain_permissions: {}, global_permissions: ['basic'] },
  sync_status: null,
}

export const TAdmin: User = {
  username: 'adminUser',
  id: 'usr2',
  role_assignments: [TAdminRoleAssignment],
  permissions: { domain_permissions: {}, global_permissions: ['admin'] },
  sync_status: null,
}
