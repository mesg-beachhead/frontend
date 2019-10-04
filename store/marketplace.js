import contractStore from '../lib/contractStore'

const contract = contractStore(
  '0x92b6c9beDecBEde62C30B531424B784f5eF68c1a',
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
    },
    purchase: async ({ dispatch, getters }, { id, price }) => {
      await dispatch('erc20/approve', [getters.address, price], {
        root: true
      })
      await dispatch('purchaseOffer', [id])
      await dispatch('offer/fetchItem', id, { root: true })
      return id
    }
  }
}
