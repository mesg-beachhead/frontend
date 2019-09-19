const data = new Array(10).fill(null).map((x, i) => ({
  id: i + 1,
  seller: '0x0000000000000000000000000000000000000000',
  price: 10,
  currency: 'BHD',
  item: {
    name: 'Beachhead 2020',
    description: 'Best place in the city...',
    image:
      'https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.0-9/64653627_1243816002444527_8385945614197719040_n.jpg?_nc_cat=100&_nc_oc=AQl7dWCeRXECJC5cijbwqG_Kc7HCi90HecSOCPRVwjxro3xheqg_nNeo3-_7sysYi-s&_nc_ht=scontent.fcnx2-1.fna&oh=f24005ea5e645df34bbb05dd892456ac&oe=5E086D58',
    attributes: [
      { traitType: 'dimension', value: 100, unit: 'm2' },
      { traitType: 'location', value: 'Zone 1 - Apt 3' },
      {
        traitType: 'pictures',
        value: [
          'https://scontent.fcnx2-1.fna.fbcdn.net/v/t1.0-9/64653627_1243816002444527_8385945614197719040_n.jpg?_nc_cat=100&_nc_oc=AQl7dWCeRXECJC5cijbwqG_Kc7HCi90HecSOCPRVwjxro3xheqg_nNeo3-_7sysYi-s&_nc_ht=scontent.fcnx2-1.fna&oh=f24005ea5e645df34bbb05dd892456ac&oe=5E086D58',
          'https://beachhead.com/media/com_easysocial/photos/93/182/main-leaf-whatsapp-image-2018-10-27-at-21-48-181_large.jpg',
          'https://beachhead.com/media/com_easysocial/photos/94/197/015g-bunker-train-pepe-moreno-beachhead-2020_large.jpg'
        ]
      }
    ]
  }
}))

export const state = () => ({
  items: {}
})

export const mutations = {
  insert: (state, offer) => {
    state.items = {
      ...state.items,
      [offer.id]: offer
    }
  }
}

export const getters = {
  items: (state) => state.items
}

export const actions = {
  fetch: ({ commit }) => {
    data.forEach((x) => commit('insert', x))
  },
  fetchItem: ({ commit }, { id }) => {
    const item = data.find((x) => parseInt(x.id, 10) === parseInt(id, 10))
    commit('insert', item)
  }
}
