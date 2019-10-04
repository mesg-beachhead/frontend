import ipfs from 'ipfs-http-client'
import contractStore from '../lib/contractStore'

const client = ipfs('ipfs.app.mesg.com', '5001', { protocol: 'http' })
const ipfsPath = (hash) => `http://ipfs.app.mesg.com:8080/ipfs/${hash}`

const contract = contractStore(
  '0xb34EEE566C59506F26c1E73F4EcAb3f0fCD178Fd',
  require('./erc721.abi.json')
)

export default {
  ...contract,
  actions: {
    ...contract.actions,
    create: async ({ dispatch, getters }, item) => {
      if (item.image) {
        const [image] = await client.add(await item.image.arrayBuffer(), {
          pin: true
        })
        item.image = ipfsPath(image.hash)
      }
      const [{ hash }] = await client.add(
        ipfs.Buffer.from(JSON.stringify(item)),
        { pin: true }
      )
      const total = parseInt(await dispatch('totalSupply'), 10)
      const tokenID = total + 1
      const [to] = await getters.provider.listAccounts()
      await dispatch('mintWithTokenURI', [to, tokenID, ipfsPath(hash)])
      return tokenID
    }
  }
}
