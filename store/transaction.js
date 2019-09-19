export const state = () => ({
  list: {}
})

export const mutations = {
  add: (state, tx) => {
    state.list = {
      ...state.list,
      [tx.hash]: tx
    }
  }
}

export const getters = {
  list: (state) => state.list
}

export const actions = {
  create: ({ commit }) => {
    const hash = '0x0000000000000000000000000000000000000000'
    commit('add', { hash })
    return hash
  }
}
