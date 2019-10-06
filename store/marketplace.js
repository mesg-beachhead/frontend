import contractStore from '../lib/contractStore'
import config from './config'

const contract = contractStore(
  config.contracts.marketplace,
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
