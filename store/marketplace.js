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
      const tx = await dispatch('createOffer', [
        store,
        tokenId,
        currency,
        parseInt(price, 10)
      ])
      const id = tx.events
        .find((x) => x.event === 'OfferCreated')
        .args.id.toHexString()
      await dispatch('offer/fetchItem', id, { root: true })
      return id
    }
  }
}
