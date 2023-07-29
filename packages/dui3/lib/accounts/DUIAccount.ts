import { ApolloClient } from '@apollo/client'
import { Account } from 'lib/accounts/Account'

export type DUIAccount = {
  /** account info coming from the host app */
  accountInfo: Account
  /** the graphql client; a bit superflous */
  client?: ApolloClient<unknown>
  /** whether an intial serverinfo query succeeded. */
  isValid: boolean
}
