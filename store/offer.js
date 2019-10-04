export const state = () => ({
  list: {}
})

export const mutations = {
  add: (state, offer) => {
    state.list = {
      ...state.list,
      [offer.id]: offer
    }
  }
}

export const getters = {
  list: (state) => state.list
}

export const actions = {
  fetchAll: async ({ dispatch }) => {
    const count = await dispatch('marketplace/numberOfOffers', null, {
      root: true
    })
    for (let i = 0; i < count; i++) {
      const tokenId = await dispatch('marketplace/offerIds', [i], {
        root: true
      })
      await dispatch('fetchItem', tokenId)
    }
  },
  fetchItem: async ({ commit, dispatch }, id) => {
    const offer = await dispatch('marketplace/offers', [id], { root: true })
    const tokenURI = await dispatch('erc721/tokenURI', [offer.tokenId], {
      root: true
    })
    let item = {}
    if (tokenURI.startsWith('http')) {
      const resp = await fetch(tokenURI)
      item = await resp.json()
    }
    commit('add', {
      ...offer,
      id: offer.id.toHexString(),
      item
    })
  }
}
