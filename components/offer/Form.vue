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
        <el-input v-model="item.picture" type="file" />
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
        <el-button type="primary" @click="submit">Publish</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  data() {
    return {
      allowed: true,
      item: {
        name: null,
        description: null,
        picture: null
      },
      offer: {
        price: 0,
        currency: 'BHD'
      }
    }
  },
  async mounted() {
    this.allowed = await this.isMinter([
      window.web3.currentProvider.selectedAddress
    ])
  },
  methods: {
    ...mapActions({
      createItem: 'erc721/mintWithTokenURI',
      isMinter: 'erc721/isMinter',
      createOffer: 'marketplace/createOffer'
    }),
    async submit() {
      const item = await this.createItem([
        '0x0000000000000000000000000000000000000001', // to
        0, // tokenId
        'ipfs://xxxxxx' // tokenURI
      ])
      console.log(item)
      const offer = await this.createOffer([
        '0xc58d3e5A609BdeCD913cEf6996CDd8355bdE933c', // store
        0, // tokenId
        this.offer.currency, // currency
        this.offer.price // price
      ])
      console.log(offer)
    }
  }
}
</script>
