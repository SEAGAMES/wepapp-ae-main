<template>
  <v-app>
    <v-sheet elevation="6" class="fontPrompt">
      <v-tabs
        fixed-tabs
        background-color="red lighten-3"
        next-icon="mdi-arrow-right-bold-box-outline"
        prev-icon="mdi-arrow-left-bold-box-outline"
        show-arrows
        slider-color="black"
        v-model="$store.state.FacToQa.tab"
      >
        <v-spacer></v-spacer>
        <v-tab @click="routeGo(1)" href="#tab-1">
          <div class="fontSize16"><b>สถานะ Order</b></div>
        </v-tab>
        <v-spacer></v-spacer>
        <v-tab @click="routeGo(2)" href="#tab-2">
          <div class="fontSize16"><b>บิล QA</b></div>
        </v-tab>
        <v-spacer></v-spacer>
        <v-tab @click="routeGo(3)" href="#tab-3">
          <div class="fontSize16"><b>บิลซ่อม</b></div>
        </v-tab>
        <v-spacer></v-spacer>
      </v-tabs>
    </v-sheet>

    <div v-if="$store.state.loadingPage" align="center">
      <PulseLoader
        justify="center"
        align="center"
        :loading="$store.state.loadingPage"
        class="mt-16"
      />
    </div>
    <router-view v-if="$store.state.isLogged"></router-view>
  </v-app>
</template>

<script>
import PulseLoader from "../../components/Loadings/SpinnerLoading.vue";

export default {
  name: "process-factoqa",
  components: {
    PulseLoader
  },
  data() {
    return {
      tab: 0
    };
  },
  async mounted() {
    // console.log(this.$store.state.isLogged);
  },
  methods: {
    async routeGo(value) {
      // console.log(this.$store.state.FacToQa.tab);
      switch (value) {
        case 1:
          await this.$store.dispatch({
            type: "SET_filterQAStatusMaster",
            setDefault: false,
            valuesFilter: {}
          });
          await this.$router
            .push({
              name: "status-toqamaster"
            })
            .catch(() => {
              //to do
            });

          break;
        case 2:
          await this.$store.dispatch({
            type: "SET_filterQaBillMaster",
            setDefault: false,
            valuesFilter: {}
          });
          await this.$router
            .push({
              name: "qabill-master"
            })
            .catch(() => {
              // to do
            });
          break;
        case 3:
          await this.$store.dispatch({
            type: "SET_filterQARepairMaster",
            setDefault: false,
            valuesFilter: {}
          });
          await this.$router
            .push({
              name: "qabillrepair-master"
            })
            .catch(() => {
              // to do
            });
          break;
        default:
          console.log("ไม่เข้าเงื่อนไข");
          break;
      }
    }
  }
};
</script>

<style></style>
