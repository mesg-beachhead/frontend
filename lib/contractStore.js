import { Contract, providers } from 'ethers'

export default (address, abi) => {
  const contract = new Contract(
    address,
    abi,
    new providers.Web3Provider(
      window.web3.currentProvider,
      'ropsten'
    ).getSigner(0)
  )
  const functions = abi.filter((x) => x.type === 'function')
  // const events = abi.filter((x) => x.type === 'event')
  const constants = abi.filter((x) => x.constant && !x.inputs.length)
  return {
    state: () => ({
      constants: constants.reduce(
        (prev, constant) => ({
          ...prev,
          [constant.name]: null
        }),
        {}
      ),
      transactions: []
    }),
    getters: constants.reduce(
      (prev, constant) => ({
        ...prev,
        [constant.name]: (state) => state.constants[constant.name]
      }),
      {}
    ),
    mutations: {
      updateConstant(state, { name, data }) {
        state.constants = {
          ...state.constants,
          [name]: data
        }
      },
      addTransaction(state, transaction) {
        state.transactions = [...state.transactions, transaction]
      }
    },
    actions: functions.reduce(
      (prev, func) => ({
        ...prev,
        [func.name]: async ({ commit }, inputs) => {
          console.log(func.name, inputs)
          const res = await contract[func.name](...inputs)
          if (func.constant) {
            if (!func.inputs.length) {
              commit('updateConstant', { name: func.name, data: res })
            }
          } else {
            commit('addTransaction', res)
          }
          return res
        }
      }),
      {}
    )
  }
}
