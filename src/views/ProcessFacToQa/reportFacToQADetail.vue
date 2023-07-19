<template>
  <v-app v-if="!$store.state.loadingPage">
    <div align="right" class="fontPrompt ma-3">
      <v-btn color="red" dark @click="$router.go(-1)" dense>กลับ</v-btn>
      <v-btn
        :loading="loadingBtn"
        small
        fab
        class="ml-4"
        color="blue"
        dense
        @click="printReportFactoQa_Detail()"
        ><v-icon>print</v-icon></v-btn
      >
    </div>

    <v-card>
      <v-row dense class="">
        <v-col cols="6" class="">
          <div class="fontSize28 fontPrompt" align="left">
            <b>สถานะงานวันที่ : </b>
            {{ $moment(dataMaster.jobDate).format("dd") }}
            {{ $moment(dataMaster.jobDate).format("L") }}
          </div>
        </v-col>
        <v-col cols="6">
          <div class="fontSize28 fontPrompt" align="left">
            <b>ORDER NO:</b> {{ dataMaster.OrderNumber }}
          </div>
        </v-col>
      </v-row>
      <v-row dense class="">
        <v-col cols="6" class="">
          <div class="fontSize28 fontPrompt" align="left">
            <b>Factory : </b>
            {{ dataMaster.ProductionTeam }}
          </div>
        </v-col>
        <v-col cols="6">
          <div class="fontSize28 fontPrompt" align="left">
            <b>QA TEAM :</b>
            {{ dataMaster.SalesTeam === 2 ? "K. Noot" : "K. Klar & K. Nan" }}
          </div>
        </v-col>
      </v-row>
    </v-card>

    <v-toolbar max-height="50" class="mt-5">
      <div class="fontSarabun mb-n3">
        <v-checkbox
          v-model="isFilter"
          label="แสดงเฉพาะทีมีสถานะ"
          @change="filterOnlyData()"
          color="amber"
        />
      </div>
      <div class="fontSarabun mb-n3 ml-3">
        <v-checkbox
          label="แสดงเลขตามใบปะหน้า"
          color="red"
          v-model="isItemNoForFac"
        />
      </div>
      <v-spacer></v-spacer>
    </v-toolbar>

    <v-simple-table class="fontSarabun">
      <thead>
        <tr class="lighten-4">
          <th rowspan="2" class="borderTable">
            <div align="center" class="fontSize16 mx-n3">NO.</div>
          </th>
          <th rowspan="2" class="borderTable" width="80">
            <div align="center" class="fontSize16 mx-n3">รายละเอียดสินค้า</div>
          </th>
          <th rowspan="2" class="borderTable">
            <div align="center" class="fontSize16 mx-n3">จำนวนเต็ม</div>
          </th>
          <th colspan="2" class="BuleTable">
            <div align="center" class="fontSize16 mx-n3">
              จน. ฝ่ายผลิตส่ง QA
            </div>
          </th>
          <th colspan="2" class="GreenTable">
            <div align="center" class="fontSize16 mx-n3">จน. QAตรวจผ่าน</div>
          </th>
          <th colspan="3" class="YellowTable">
            <div align="center" class="fontSize16 mx-n3">จน. QA ส่งซ่อม</div>
          </th>
        </tr>

        <tr class="amber lighten-4">
          <th class="BuleTable">
            <div align="center" class="fontSize16 mx-n3">ผู้ตรวจ(QC)</div>
          </th>
          <th class="BuleTable">
            <div align="center" class="fontSize16 mx-n3">จน. ที่ส่ง</div>
          </th>
          <th class="GreenTable">
            <div align="center" class="fontSize16 mx-n3">ผู้ตรวจ(QA)</div>
          </th>
          <th class="GreenTable">
            <div align="center" class="fontSize16 mx-n3">จน. ผ่าน</div>
          </th>
          <th class="YellowTable">
            <div align="center" class="fontSize16 mx-n3">แผนก</div>
          </th>
          <th class="YellowTable">
            <div align="center" class="fontSize16 mx-n3">อาการ</div>
          </th>
          <th class="YellowTable">
            <div align="center" class="fontSize16 mx-n3">จน. ซ่อม</div>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr class="grey lighten-3">
          <td colspan="2" class="borderTable">
            <div class="blue--text fontSize20 fontPrompt" align="center">
              <b>ผลรวม</b>
            </div>
          </td>
          <td class="borderTable">
            <div class="black--text fontSize20 fontPrompt" align="center">
              {{ dataMaster.TotalQty.toLocaleString() }}
            </div>
          </td>
          <td class="borderTable"></td>
          <td class="borderTable">
            <div class="blue--text fontSize20 fontPrompt" align="center">
              {{ dataMaster.billQty.toLocaleString() }}
            </div>
          </td>
          <td class="borderTable"></td>
          <td class="borderTable">
            <div class="green--text fontSize20 fontPrompt" align="center">
              {{ dataMaster.finishQty.toLocaleString() }}
            </div>
          </td>
          <td class="borderTable"></td>
          <td class="borderTable"></td>
          <td class="borderTable">
            <div class="amber--text fontSize20 fontPrompt" align="center">
              {{ dataMaster.repairQty.toLocaleString() }}
            </div>
          </td>
        </tr>
      </tbody>

      <tbody v-for="(item, index) in dataItem" :key="index">
        <tr v-for="i in item.countRow" :key="i">
          <td class="borderTable" :rowspan="item.countRow" v-if="i === 1">
            <div
              align="center"
              class="fontSize16 mx-n3"
              v-bind:class="{
                'red--text': isItemNoForFac,
              }"
            >
              {{ isItemNoForFac ? item.ItemNoForFac : item.ItemNo }}
            </div>
          </td>
          <td class="borderTable" :rowspan="item.countRow" v-if="i === 1">
            <div align="center">
              <v-img :src="item.NewPict" width="120" />
            </div>
            <div align="center" class="fontSize14 mx-n3" v-if="i === 1">
              {{ item.ProductCode }}
            </div>
          </td>
          <td class="borderTable" :rowspan="item.countRow" v-if="i === 1">
            <div align="center " class="fontSize14 mx-n3">
              <b>{{ item.Qty.toLocaleString() }}</b>
            </div>
          </td>
          <!-- FAC SEND -->
          <td
            :class="
              item.facSend.length > 0 && i <= item.facSend.length
                ? 'BuleTable'
                : 'borderTable'
            "
          >
            <div
              align="left "
              class="fontSize16 mx-n3"
              v-if="item.facSend.length > 0 && i <= item.facSend.length"
            >
              {{ item.facSend[i - 1].QCPerson }}
            </div>
          </td>
          <td
            :class="
              item.facSend.length > 0 && i <= item.facSend.length
                ? 'BuleTable'
                : 'borderTable'
            "
          >
            <div
              align="center "
              class="fontSize16 mx-n3"
              v-if="item.facSend.length > 0 && i <= item.facSend.length"
            >
              {{ item.facSend[i - 1].QtyFac.toLocaleString() }}
            </div>
          </td>

          <!-- QA PASS -->
          <td
            :class="
              item.qaPass.length > 0 && i <= item.qaPass.length
                ? 'GreenTable'
                : 'borderTable'
            "
          >
            <div
              align="left "
              class="fontSize16 mx-n3"
              v-if="item.qaPass.length > 0 && i <= item.qaPass.length"
            >
              {{ item.qaPass[i - 1].QAPerson }}
            </div>
          </td>
          <td
            :class="
              item.qaPass.length > 0 && i <= item.qaPass.length
                ? 'GreenTable'
                : 'borderTable'
            "
          >
            <div
              align="center "
              class="fontSize16 mx-n3"
              v-if="item.qaPass.length > 0 && i <= item.qaPass.length"
            >
              {{ item.qaPass[i - 1].QtyFinish.toLocaleString() }}
            </div>
          </td>

          <!-- REPAIR QA -->
          <td
            :class="
              item.qaRepair.length > 0 && i <= item.qaRepair.length
                ? 'YellowTable'
                : 'borderTable'
            "
          >
            <div
              align="left "
              class="fontSize16 mx-n3"
              v-if="item.qaRepair.length > 0 && i <= item.qaRepair.length"
            >
              {{ item.qaRepair[i - 1].repairType }}
            </div>
          </td>
          <td
            :class="
              item.qaRepair.length > 0 && i <= item.qaRepair.length
                ? 'YellowTable'
                : 'borderTable'
            "
          >
            <div
              align="left "
              class="fontSize16 mx-n3"
              v-if="item.qaRepair.length > 0 && i <= item.qaRepair.length"
            >
              {{ item.qaRepair[i - 1].reasonType }}
            </div>
          </td>
          <td
            :class="
              item.qaRepair.length > 0 && i <= item.qaRepair.length
                ? 'YellowTable'
                : 'borderTable'
            "
          >
            <div
              align="center "
              class="fontSize16 mx-n3"
              v-if="item.qaRepair.length > 0 && i <= item.qaRepair.length"
            >
              {{ item.qaRepair[i - 1].TotalRepair.toLocaleString() }}
            </div>
          </td>
        </tr>
      </tbody>
    </v-simple-table>
  </v-app>
</template>

<script>
import apiCreatePDF from "../../services/apiCreatePDF";
import apiFacToQa from "../../services/apiFacToQa";
import { convertDate_JS_TO_SQL } from "../../services/constants";
export default {
  name: "report-factoqa-detail",
  data() {
    return {
      dataMaster: {
        OrderNumber: "",
        ProductionTeam: "",
        TotalQty: 0,
        billQty: 0,
        finishQty: 0,
        repairQty: 0,
        jobDate: null,
      },
      loadingBtn: false,
      dataItem: [],
      dataItem2: [],
      isFilter: false,
      isItemNoForFac: false,
    };
  },
  async mounted() {
    this.$store.state.loadingPage = true;
    if (this.$route.params.OrderNumber && this.$route.params.jobDate) {
      this.dataMaster = this.$route.params;
      //console.log(this.dataMaster);
      await this.loadData();
      setTimeout(() => {
        this.$store.state.loadingPage = false;
      }, 500);
    } else {
      this.$store.state.loadingPage = false;
      this.$router.go(-1);
    }
  },
  methods: {
    async loadData() {
      const res = await apiFacToQa.reportfactoqaDetail({
        orderNumber: this.dataMaster.OrderNumber,
        billDate: convertDate_JS_TO_SQL(this.dataMaster.jobDate),
      });
      //console.log(res);
      this.dataItem = res;
    },

    filterOnlyData() {
      if (this.isFilter) {
        this.dataItem2 = this.dataItem;
        this.dataItem = this.dataItem.filter(
          ({ facSend, qaPass, qaRepair }) =>
            facSend.length > 0 || qaPass.length > 0 || qaRepair.length > 0
        );
      } else {
        this.dataItem = this.dataItem2;
      }
    },

    async printReportFactoQa_Detail() {
      this.loadingBtn = true;
      await apiCreatePDF.printReportFactoQa_Detail(
          this.dataMaster,
          this.dataItem,
          this.isItemNoForFac
        );
        this.loadingBtn = false;
      //console.log(this.dataItem)
    },
  },
};
</script>

<style>
.borderTable {
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
.YellowTable {
  background-color: #eff7c3;
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
.GreenTable {
  background-color: #c1d8c1;
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
.BuleTable {
  background-color: #ccebfa;
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
</style>
