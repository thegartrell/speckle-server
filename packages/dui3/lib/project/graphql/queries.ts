import { graphql } from '~~/lib/common/generated/gql'

export const projectPageQuery = graphql(`
  query ProjectPageQuery($id: String!, $token: String) {
    project(id: $id) {
      ...ProjectPageProject
    }
    projectInvite(projectId: $id, token: $token) {
      ...ProjectsInviteBanner
    }
  }
`)
