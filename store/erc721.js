import ipfs from 'ipfs-http-client'
import contractStore from '../lib/contractStore'

const client = ipfs('ipfs.app.mesg.com', '5001', { protocol: 'http' })

const contract = contractStore(
  '0xc58d3e5A609BdeCD913cEf6996CDd8355bdE933c',
  require('./erc721.abi.json')
)

export default {
  ...contract,
  actions: {
    ...contract.actions,
    create: async ({ dispatch, getters }, item) => {
      const total = parseInt(await dispatch('totalSupply'), 10)
      const tokenID = total + 1
      const [to] = await getters.provider.listAccounts()
      const [{ hash }] = await client.add(
        ipfs.Buffer.from(JSON.stringify(item)),
        { pin: true }
      )
      await dispatch('mintWithTokenURI', [to, tokenID, hash])
      return tokenID
    }
  }
}
