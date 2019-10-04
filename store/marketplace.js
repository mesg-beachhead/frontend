import contractStore from '../lib/contractStore'

const contract = contractStore(
  '0xDcbA375C9ACaa1961F2Ca19d801f749250384e1B',
  require('./marketplace.abi.json')
)

export default {
  ...contract,
  actions: {
    ...contract.actions,
    create: async (
      { dispatch, getters },
      { store, tokenId, currency, price }
    ) => {
      await dispatch('erc721/approve', [getters.address, tokenId], {
        root: true
      })
      const offer = await dispatch('createOffer', [
        store,
        tokenId,
        currency,
        parseInt(price, 10)
      ])
      return offer
    }
  }
}
