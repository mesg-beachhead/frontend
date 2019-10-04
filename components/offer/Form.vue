<template>
  <div>
    <el-alert
      v-if="!allowed"
      title="Invalid account"
      type="error"
      description="Please switch to an account with the authotization to create a new offer."
      show-icon
    />
    <el-form :model="item" label-position="left" label-width="100px">
      <el-form-item label="Name">
        <el-input v-model="item.name" />
      </el-form-item>
      <el-form-item label="Description">
        <el-input v-model="item.description" />
      </el-form-item>
      <el-form-item label="Image">
        <input @change="(e) => fileChanged(e, 'image')" type="file" />
      </el-form-item>
      <el-form-item label="Price">
        <el-col :span="20">
          <el-input v-model="offer.price" type="number" />
        </el-col>
        <el-col :span="4">
          <el-select v-model="offer.currency">
            <el-option
              label="BHD"
              value="0x51c683a707D6EE96369bdF89AE96181773e40c07"
            ></el-option>
          </el-select>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">Create Offer</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
export default {
  data() {
    return {
      allowed: true,
      item: {
        name: null,
        description: null,
        image: null
      },
      offer: {
        price: 0,
        currency: null
      },
      tokenId: null
    }
  },
  computed: mapGetters({
    erc721Store: 'erc721/address',
    currency: 'erc20/address'
  }),
  async mounted() {
    this.allowed = await this.isMinter([
      window.web3.currentProvider.selectedAddress
    ])
    this.offer.currency = this.currency
  },
  methods: {
    ...mapActions({
      createToken: 'erc721/create',
      isMinter: 'erc721/isMinter',
      createOffer: 'marketplace/create'
    }),
    async submit() {
      const tokenId = await this.createToken(this.item)
      debugger
      const offer = await this.createOffer({
        store: this.erc721Store,
        tokenId,
        currency: this.offer.currency,
        price: this.offer.price
      })
      return offer
    },
    fileChanged(event, value) {
      this.item[value] = event.srcElement.files[0]
    }
  }
}
</script>
