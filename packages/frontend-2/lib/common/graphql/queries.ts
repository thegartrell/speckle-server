import { graphql } from '~~/lib/common/generated/gql'

export const mentionsUserSearchQuery = graphql(`
  query MentionsUserSearch($query: String!) {
    userSearch(query: $query, limit: 5, cursor: null, archived: false) {
      items {
        id
        name
        company
      }
    }
  }
`)

export const userSearchQuery = graphql(`
  query UserSearch($query: String!, $limit: Int, $cursor: String, $archived: Boolean) {
    userSearch(query: $query, limit: $limit, cursor: $cursor, archived: $archived) {
      cursor
      items {
        id
        name
        bio
        company
        avatar
        verified
      }
    }
  }
`)

export const serverInfoBlobSizeLimitQuery = graphql(`
  query ServerInfoBlobSizeLimit {
    serverInfo {
      blobSizeLimitBytes
    }
  }
`)