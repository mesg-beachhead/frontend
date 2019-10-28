import { Contract, providers } from 'ethers'

const abi = require('./abi/marketplace.json')
const address = process.env.MARKETPLACE

export const state = () => ({
  list: []
})

export const getters = {
  list: (state) => state.list
}

export const mutations = {
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
    const max = (await contract.numberOfOffers()).toNumber()
    const from = Math.min((page - 1) * perPage, max)
    const to = Math.min(from + perPage, max)
    let offers = []
    for (let i = from; i < to; i++) {
      const id = await contract.offerIds(i)
      offers = [
        ...offers,
        await dispatch('fetch', {
          web3provider,
          id: id.toHexString()
        })
      ]
    }
    return offers
  },
  fetch: async ({ commit }, { web3provider, id }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider)
    const offer = await contract.offers(id)
    commit('insert', offer)
    return offer
  },
  createOffer: async ({ dispatch }, { web3provider, offer }) => {
    const provider = new providers.Web3Provider(web3provider)
    const contract = new Contract(address, abi, provider).connect(
      provider.getSigner(0)
    )
    await dispatch(
      'store/approveItem',
      {
        web3provider,
        store: offer.store,
        id: offer.item,
        to: address
      },
      { root: true }
    )
    const tx = await contract.createOffer(
      offer.store,
      offer.item,
      offer.currency,
      offer.price
    )
    const receipt = await tx.wait()
    const event = receipt.events.find((e) => e.event === 'OfferCreated')
    return dispatch('fetch', { web3provider, id: event.args.id })
  }
}
