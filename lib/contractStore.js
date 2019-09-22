import { Contract } from 'ethers'

export default (address, abi, provider) => {
  const contract = new Contract(address, abi, provider)
  const functions = abi.filter((x) => x.type === 'function')
  // const events = abi.filter((x) => x.type === 'event')
  const constants = abi.filter((x) => x.constant && !x.inputs.length)
  console.log(constants)
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
          const res = await contract[func.name](inputs)
          if (func.constant) {
            commit('updateConstant', { name: func.name, data: res })
          } else {
            commit('addTransaction', res)
          }
        }
      }),
      {}
    )
  }
}
