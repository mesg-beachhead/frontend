import { providers } from 'ethers'
import contractStore from '../lib/contractStore'

const store = contractStore(
  '0x420167d87d35c3a249b32ef6225872fbd9ab85d2',
  require('./erc20.abi.json'),
  new providers.InfuraProvider('mainnet')
)

export const state = store.state
export const mutations = store.mutations
export const getters = store.getters
export const actions = store.actions
