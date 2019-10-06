import contractStore from '../lib/contractStore'
import config from './config'

export default contractStore(
  config.contracts.erc20,
  require('./erc20.abi.json')
)
