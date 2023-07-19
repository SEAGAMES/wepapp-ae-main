<template>
  <v-container>
    <v-card class="fontSarabun">
      <v-simple-table>
        <thead>
          <tr>
            <th class="text-left orange lighten-5">
              <div align="center" class="black--text py-1">ครั้งที่</div>
            </th>
            <th class="text-left orange lighten-5">
              <div align="center" class="black--text">วันที่เลื่อน</div>
            </th>
            <th class="text-left orange lighten-5">
              <div align="center" class="black--text">ผู้เลื่อน</div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in dataDueQa" :key="item.name" align="center">
            <td align="center">
              {{ item.HistoryNo }}
            </td>
            <td align="center">
              ({{ $moment(item.HistoryDate).format("dd") }})
              {{ item.HistoryDate | moment("L") }} <br />
              <span class="grey--text"> (เวลา {{ item.HistoryTime }} น.) </span>
            </td>
            <td align="center">
              {{ item.EmpName }}
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
  </v-container>
</template>

<script>
import apiFacWipStatus from "../services/apiFacWipStatus";

export default {
  props: ["dataInput"],
  data() {
    return {
      orderNumber: "",
      dataDueQa: []
    };
  },

  async mounted() {
    this.orderNumber = this.dataInput.orderNumber;
    await this.getHistoryDueQa();
  },

  methods: {
    async getHistoryDueQa() {
      const response = await apiFacWipStatus.getHistoryDueQa({
        orderNumber: this.orderNumber
      });
      this.dataDueQa = response;
    }
  }
};
</script>

<style></style>
