<template>
  <v-app>
    <v-card class="fontPrompt">
      <v-simple-table>
        <thead>
          <tr>
            <th v-for="(h, indexH) in dataTable.header" :key="indexH">
              <div align="center" class="fontSize16 mx-n3" :width="h.width">
                {{ h.title }}
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="b in dataTable.body" :key="b.PDProcessCode">
            <td width="80" align="center">
              <div align="center" class="mx-n3">
                <v-checkbox v-model="b.checkbox" color="green" class="pl-5" />
              </div>
            </td>
            <td width="120">
              <div align="center" class="mx-n3">{{ b.PDProcessCode }}</div>
            </td>
            <td width="200">
              <div align="center" class="mx-n3">{{ b.PDProcessName }}</div>
            </td>
          </tr>
        </tbody>
      </v-simple-table>
    </v-card>
    <div align="right" class="pa-2">
      <v-btn
        class="mr-2"
        color="red"
        @click="returnValues(false)"
        dark
        width="80"
        :loading="loadingBtn"
        >Cancel</v-btn
      >
      <v-btn
        class="mx-1"
        color="success"
        @click="returnValues(true)"
        width="80"
        :loading="loadingBtn"
        >Confirm</v-btn
      >
    </div>
  </v-app>
</template>

<script>
import apiEmployee from "../../services/apiEmployee";
export default {
  name: "emp-process",
  props: ["empCode"],
  data: () => ({
    loadingBtn: false,
    dataTable: {
      header: [
        {
          title: "เปิดสิทธิ์",
          width: 10
        },
        {
          title: "รหัส",
          width: 50
        },
        {
          title: "ขั้นตอน",
          width: 50
        }
      ],
      body: []
    }
  }),
  async mounted() {
    await this.loadData();
  },
  methods: {
    async loadData() {
      const { data } = await apiEmployee.getEmpProcess({
        EmpCode: this.empCode
      });
      this.dataTable.body = data;
    },
    returnValues(values) {
      this.loadingBtn = true;
      this.$emit("closePage", {
        isChange: values,
        EmpCode: this.empCode,
        dataReturn: this.dataTable.body
      });
    }
  }
};
</script>

<style></style>
