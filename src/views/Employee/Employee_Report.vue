<template>
  <v-container>
    <div class="fontSarabun fontSize24" align="center">
      <b>Report พนักงาน</b>
    </div>
    <v-row>
      <v-btn @click="$router.push('/employee-admin')" color="red lighten-1" dark dense small fab><v-icon>mdi-arrow-left-bold</v-icon></v-btn>
      <v-spacer></v-spacer>
      <v-btn @click="printEmp()" color="blue" dark dense small fab><v-icon>print</v-icon></v-btn>
    </v-row>
    <v-row>
      <v-col cols="4">
        <v-card class="fontSarabun mt-5">
          <v-data-table
            class="tablePurchase"
            height="620"
            :headers="sectionEmp.headers"
            :items="reportSection"
            hide-default-footer
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [30],
            }"
          >
            <template v-slot:item="{ item }"
              ><tr align="center">
                <td @click="selectSection(item.SectionCode)">
                  {{ item.SectionName }}
                </td>
                <td @click="selectSection(item.SectionCode)">
                  {{ item.EmpQty }}
                </td>
              </tr></template
            >
          </v-data-table>
        </v-card>
      </v-col>
      <v-col
        ><v-card class="fontSarabun mt-5">
          <v-data-table
            class="tablePurchase"
            height="620"
            :headers="dataEmp.headers"
            :items="dataEmp.dataEmpDetail"
            hide-default-footer
            :footer-props="{
              'disable-items-per-page': true,
              'items-per-page-options': [30],
            }"
          >
            <template v-slot:item="{ item, index }">
              <tr align="center" class="fontSarabun">
                <td>
                  <div>{{ index + 1 }}</div>
                </td>
                <td>
                  <div class="fontSize8">
                    <img v-bind:src="`${item.EmpPictConvert}`" height="63" width="70" />
                  </div>
                  <div>
                    {{ item.EmpCode }}
                  </div>
                </td>
                <td>
                  <div>{{ item.EmpFullName }}</div>
                  <div>( {{ item.NickName }} )</div>
                </td>
                <td>
                  <div>{{ item.PositionName }}</div>
                </td>
              </tr>
            </template>
          </v-data-table>
        </v-card></v-col
      >
    </v-row>
  </v-container>
</template>

<script>
import apiEmployee from "../../services/apiEmployee";
export default {
  data() {
    return {
      reportSection: [],

      sectionEmp: {
        headers: [
          {
            text: "แผนก",
            align: "center",
            sortable: false,
          },
          {
            text: "จำนวน",
            align: "center",
            sortable: false,
          },
        ],
      },
      dataEmp: {
        dataEmpDetail: [],
        dataEmpDetail2: [],
        headers: [
          {
            text: "ลำดับที่",
            align: "center",
            sortable: false,
            bold: true,
          },
          {
            text: "รายละเอียด",
            align: "center",
            sortable: false,
          },
          {
            text: "ชื่อ-นามสกุล",
            align: "center",
            sortable: false,
          },
          {
            text: "ตำเเหน่ง",
            align: "center",
            sortable: false,
          },
        ],
      },
    };
  },

  async mounted() {
    this.dataEmp.dataEmpDetail = await apiEmployee.empReport();
    this.dataEmp.dataEmpDetail2 = this.dataEmp.dataEmpDetail;
    this.reportSection = await apiEmployee.reportSection();
  },

  methods: {
    async selectSection(SectionCode) {
      this.dataEmp.dataEmpDetail = this.dataEmp.dataEmpDetail2;
      this.dataEmp.dataEmpDetail = this.dataEmp.dataEmpDetail.filter((obj) => {
        return obj.SectionCode === SectionCode;
      });
    },
    printEmp() {
      console.log('printEmp')
    }
  },
};
</script>

<style>
.tablePurchase table th {
  font-size: 14px !important;
  text-align: center;
  background-color: rgba(141, 245, 236, 0.753);
}
</style>
