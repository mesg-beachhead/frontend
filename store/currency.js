import config from './config'

export const state = () => ({
  list: {
    [config.contracts.erc20]: 'BHD'
  }
})

export const getters = {
  list: (state) => state.list
}
