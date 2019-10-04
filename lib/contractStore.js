import { Contract, providers } from 'ethers'

export default (address, abi) => {
  const provider = new providers.Web3Provider(
    window.web3.currentProvider,
    'ropsten'
  )
  const signer = provider.getSigner(0)
  const contract = new Contract(address, abi, signer)
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
    getters: {
      ...constants.reduce(
        (prev, constant) => ({
          ...prev,
          [constant.name]: (state) => state.constants[constant.name]
        }),
        {}
      ),
      transactions: (state) => state.transactions,
      address: () => address,
      provider: () => provider
    },
    mutations: {
      updateConstant(state, { name, data }) {
        state.constants = {
          ...state.constants,
          [name]: data
        }
      },
      addTransaction(state, transaction) {
        state.transactions = [...state.transactions, transaction]
      },
      removeTransaction(state, transactionHash) {
        state.transactions = state.transactions.filter(
          (x) => x.hash !== transactionHash
        )
      }
    },
    actions: functions.reduce(
      (prev, func) => ({
        ...prev,
        [func.name]: async ({ commit }, inputs) => {
          const res = await contract[func.name](...(inputs || []))
          if (func.constant) {
            if (!func.inputs.length) {
              commit('updateConstant', { name: func.name, data: res })
            }
            return res
          }
          commit('addTransaction', res)
          const receipt = await res.wait()
          commit('removeTransaction', receipt.transactionHash)
          return receipt
        }
      }),
      {}
    )
  }
}
