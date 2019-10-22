import ipfs from 'ipfs-http-client'
import { Contract, providers } from 'ethers'

const abi = require('./abi/erc721.json')
const client = ipfs('localhost', '5001', { protocol: 'http' })
const ipfsPath = (hash) => `http://localhost:8080/ipfs/${hash}`

export const state = () => ({
  list: {},
  addresses: []
})

export const getters = {
  list: (state) => state.list,
  addresses: (state) => state.addresses
}

export const mutations = {
  insert: (state, store) => {
    state.list[store.address] = store
    if (!state.addresses.find((x) => x === store.address)) {
      state.addresses = [...state.addresses, store.address]
    }
  },
  insertItem: (state, item) => {
    state.list[item.store].items = {
      ...(state.list[item.store].items || {}),
      [item.id]: item
    }
  }
}

export const actions = {
  add: async ({ commit, getters }, { address, web3provider }) => {
    if (getters.list[address]) {
      return getters.list[address]
    }
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
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
  fetchItems: async ({ dispatch }, { store, web3provider, page, perPage }) => {
    const { totalSupply, address } = await dispatch('add', {
      address: store,
      web3provider
    })
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
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
  fetchItem: async (
    { dispatch, commit, getters },
    { store, web3provider, id }
  ) => {
    if (((getters.list[store] || {}).items || {})[id]) {
      return getters.list[store].items[id]
    }
    await dispatch('add', { address: store, web3provider })
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(store, abi, provider)
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

    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(item.store.address, abi, provider).connect(
      provider.getSigner(0)
    )
    const tokenID = parseInt(await contract.totalSupply()) + 1
    const [to] = await contract.provider.listAccounts()
    await contract.mintWithTokenURI(to, tokenID, ipfsPath(hash))
    await dispatch('fetchItem', {
      web3provider,
      store: item.store.address,
      id: tokenID
    })
    return tokenID
  },
  transferItem: async ({ dispatch }, { store, web3provider, id, to }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(store, abi, provider).connect(
      provider.getSigner(0)
    )
    const [from] = await contract.provider.listAccounts()
    await contract.transferFrom(from, to, id)
    await dispatch('fetchItem', { web3provider, store, id })
  }
}
