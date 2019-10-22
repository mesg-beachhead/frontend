import ipfs from 'ipfs-http-client'
import { Contract, providers } from 'ethers'

const abi = require('./abi/erc721.json')
const client = ipfs('localhost', '5001', { protocol: 'http' })
const ipfsPath = (hash) => `http://localhost:8080/ipfs/${hash}`

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
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
    if (await contract.paused()) {
      throw new Error('this contract is paused')
    }
    const store = {
      contract,
      address,
      name: await contract.name(),
      symbol: await contract.symbol(),
      totalSupply: await contract.totalSupply(),
      items: []
    }
    commit('insert', store)
    return store
  },
  fetchItems: async ({ getters, dispatch }, { store, page, perPage }) => {
    const { contract, totalSupply } = getters.list[store]
    const from = Math.min((page - 1) * perPage, totalSupply)
    const to = Math.min(from + perPage, totalSupply)
    let items = []
    for (let i = from; i < to; i++) {
      const id = await contract.tokenByIndex(i)
      items = [
        ...items,
        await dispatch('fetchItem', {
          store,
          id: id.toNumber()
        })
      ]
    }
    return items
  },
  fetchItem: async ({ commit, getters }, { store, id }) => {
    const { contract } = getters.list[store]
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
  createItem: async ({ dispatch }, data) => {
    if (data.image) {
      const [image] = await client.add(await data.image.arrayBuffer(), {
        pin: true
      })
      data.image = ipfsPath(image.hash)
    }
    const [{ hash }] = await client.add(
      ipfs.Buffer.from(
        JSON.stringify({
          ...data,
          store: data.store.address
        })
      ),
      { pin: true }
    )
    const contract = data.store.contract.connect(
      data.store.contract.provider.getSigner(0)
    )
    const tokenID = parseInt(await contract.totalSupply()) + 1
    const [to] = await contract.provider.listAccounts()
    await contract.mintWithTokenURI(to, tokenID, ipfsPath(hash))
    await dispatch('fetchItem', {
      store: data.store.address,
      id: tokenID
    })
    return tokenID
  }
}
