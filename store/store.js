import ipfs from 'ipfs-http-client'
import { Contract, providers } from 'ethers'

const abi = require('./abi/erc721.json')
const client = ipfs('localhost', '5001', { protocol: 'http' })
const ipfsPath = (hash) => `http://localhost:8080/ipfs/${hash}`

const getContract = (web3provider, address) => {
  const provider = new providers.Web3Provider(web3provider)
  return new Contract(address, abi, provider) // .connect(provider.getSigner(0))
}

export const state = () => ({
  list: {},
  addresses: [],
  items: {}
})

export const getters = {
  list: (state) => state.list,
  addresses: (state) => state.addresses,
  items: (state) => state.items
}

export const mutations = {
  insert: (state, store) => {
    state.addresses = [...state.addresses, store.address]
    state.list[store.address] = store
  },
  insertItem: (state, item) => (state.items[`${item.store}-${item.id}`] = item)
}

export const actions = {
  add: async ({ commit }, { address, web3provider }) => {
    const contract = getContract(web3provider, address)
    if (await contract.paused()) {
      throw new Error('this contract is paused')
    }
    const store = {
      address,
      name: await contract.name(),
      symbol: await contract.symbol(),
      totalSupply: await contract.totalSupply(),
      items: []
    }
    commit('insert', store)
    return store
  },
  fetchItems: async (
    { getters, dispatch },
    { store, web3provider, page, perPage }
  ) => {
    const { totalSupply, address } = getters.list[store]
    const contract = getContract(web3provider, address)
    const from = Math.min((page - 1) * perPage, totalSupply)
    const to = Math.min(from + perPage, totalSupply)
    let items = []
    for (let i = from; i < to; i++) {
      const id = await contract.tokenByIndex(i)
      items = [
        ...items,
        await dispatch('fetchItem', {
          web3provider,
          store,
          id: id.toNumber()
        })
      ]
    }
    return items
  },
  fetchItem: async ({ commit }, { store, web3provider, id }) => {
    const contract = getContract(web3provider, store)
    const tokenURI = await contract.tokenURI(id)
    const item = {
      id,
      store,
      tokenURI,
      owner: await contract.ownerOf(id),
      data: await (await fetch(tokenURI)).json()
    }
    commit('insertItem', item)
    return item
  },
  createItem: async ({ dispatch }, { web3provider, item }) => {
    if (item.image) {
      const [image] = await client.add(await item.image.arrayBuffer(), {
        pin: true
      })
      item.image = ipfsPath(image.hash)
    }
    const [{ hash }] = await client.add(
      ipfs.Buffer.from(
        JSON.stringify({
          ...item,
          store: item.store.address
        })
      ),
      { pin: true }
    )

    const contract = getContract(web3provider, item.store.address)
    const tokenID = parseInt(await contract.totalSupply()) + 1
    const [to] = await contract.provider.listAccounts()
    await contract.mintWithTokenURI(to, tokenID, ipfsPath(hash))
    await dispatch('fetchItem', {
      store: item.store.address,
      id: tokenID
    })
    return tokenID
  }
}
