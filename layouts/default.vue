<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-list>
        <v-list-item nuxt to="/offers">
          <v-list-item-content>
            <v-list-item-title>Offers</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item nuxt to="/stores">
          <v-list-item-content>
            <v-list-item-title>Stores</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      dark
      color="blue darken-3"
    >
      <v-toolbar-title>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <span class="hidden-sm-and-down">Beachhead</span>
      </v-toolbar-title>
    </v-app-bar>

    <v-content>
      <v-container>
        <nuxt />
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true
    }
  }
}
</script>
