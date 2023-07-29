import { DUIAccount } from 'lib/accounts/DUIAccount'

export type DUIAccountsState = {
  accounts: Ref<DUIAccount[]>
  validAccounts: ComputedRef<DUIAccount[]>
  refreshAccounts: () => Promise<void>
  defaultAccount: ComputedRef<DUIAccount | undefined>
  loading: Ref<boolean>
}
