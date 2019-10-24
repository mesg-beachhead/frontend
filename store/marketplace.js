import { Contract, providers } from 'ethers'

const abi = require('./abi/marketplace.json')
const address = '0x630589690929E9cdEFDeF0734717a9eF3Ec7Fcfe'

export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list
}

export const mutation = {
  insert: (state, offer) => {
    state.list = [...state.list.filter((x) => x.id !== offer.id), offer].sort(
      (a, b) => a.createdAt.localCompare(b.createdAt)
    )
  }
}

export const actions = {
  fetchAll: async ({ dispatch }, { web3provider, page, perPage }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
    const max = contract.numberOfOffers()
    const from = Math.min((page - 1) * perPage, max)
    const to = Math.min(from + perPage, max)
    let offers = []
    for (let i = from; i < to; i++) {
      const id = await contract.offerIds(i)
      offers = [
        ...offers,
        await dispatch('fetch', {
          web3provider,
          id: id.toNumber()
        })
      ]
    }
    return offers
  },
  fetch: async ({ commit }, { web3provider, id }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
    const offer = await contract.offers[id]
    commit('insertItem', offer)
    return offer
  },
  createOffer: async ({ dispatch }, { web3provider, offer }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider).connect(
      provider.getSigner(0)
    )
    debugger
    try {
      const tx = await contract.createOffer(
        offer.store,
        offer.item,
        offer.currency,
        offer.price
      )
      debugger
      const receipt = await tx.wait()
      console.log(receipt.events)
      // dispatch('fetchAll')
    } catch (e) {
      console.log(e)
      debugger
    }
  }
}
