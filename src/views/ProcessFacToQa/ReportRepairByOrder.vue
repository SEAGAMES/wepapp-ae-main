<template>
  <v-app v-if="!$store.state.loadingPage">
    <div align="right" class="fontSarabun ma-3">
      <v-btn color="red" dark @click="$router.go(-1)" dense>กลับ</v-btn>
    </div>
    <div class="fontSize28 fontSarabun" align="center">
      <b>สรุป QA ส่งซ่อมของ ORDER :</b> {{ orderNumber }}
    </div>
    <v-toolbar max-height="50" class="mt-5">
      <div class="fontSarabun mb-n3">
        <v-checkbox
          v-model="isFilter"
          label="แสดงเฉพาะที่ส่งซ่อม"
          @change="filterOnlyRepair()"
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
      <div class="mt-n2">
        <v-btn
          @click="printReportRepairByOrder()"
          color="blue"
          dense
          small
          fab
          dark
          :loading="loadingBtn"
        >
          <v-icon>print</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-simple-table class="fontSarabun">
      <thead>
        <tr class="amber lighten-4">
          <th rowspan="2" class="HeaderOther">
            <div align="center" class="fontSize16">NO.</div>
          </th>
          <th rowspan="2" class="HeaderOther">
            <div align="center" class="fontSize16">รายละเอียดสินค้า</div>
          </th>
          <th rowspan="2" class="HeaderOther">
            <div align="center" class="fontSize16">จำนวนเต็ม</div>
          </th>
          <th colspan="3" class="HeaderOther">
            <div align="center" class="fontSize16">รายละเอียดส่งซ่อม</div>
          </th>
          <th rowspan="2" class="HeaderOther">
            <div align="center" class="fontSize16">รวมซ่อม</div>
          </th>
        </tr>
        <tr class="amber lighten-4">
          <th class="HeaderOther">
            <div align="center" class="fontSize16">แผนก</div>
          </th>
          <th class="HeaderOther">
            <div align="center" class="fontSize16">อาการเสีย</div>
          </th>
          <th class="HeaderOther">
            <div align="center" class="fontSize16">จำนวน</div>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td></td>
        </tr>
        <tr v-for="(i, index) in dataItem" :key="index">
          <td class="HeaderOther">
            <div
              align="center"
              class="fontSize16"
              v-bind:class="{
                'red--text': isItemNoForFac
              }"
            >
              {{ isItemNoForFac ? i.ItemNoForFac : i.OrderItemNo }}
            </div>
          </td>
          <td class="HeaderOther">
            <div align="center">
              <v-img :src="i.NewPict" width="120" />
            </div>
            <div align="center" class="fontSize16 mx-n3">
              {{ i.ProductCode }}
            </div>
          </td>
          <td class="HeaderOther">
            <div align="center " class="fontSize16">
              <b>{{ i.TotalQty.toLocaleString() }}</b>
            </div>
          </td>
          <td class="HeaderOther">
            <tr v-for="(r, indexR) in i.reason" :key="indexR">
              <td>
                {{ r.repairType }}
              </td>
            </tr>
          </td>

          <td class="HeaderOther">
            <tr v-for="(r, indexR) in i.reason" :key="indexR">
              <td>
                {{ r.reasonType }}
              </td>
            </tr>
          </td>

          <td class="HeaderOther">
            <tr v-for="(r, indexR) in i.reason" :key="indexR">
              <td>
                <div class="" align="center">
                  {{ r.Qty }}
                </div>
              </td>
            </tr>
          </td>

          <td class="HeaderOther">
            <div align="center" class="fontSize16">
              <b>{{ i.SumRepair.toLocaleString() }}</b>
            </div>
            <div align="center" class="fontSize14 grey--text">
              ( {{ ((i.SumRepair / i.TotalQty) * 100).toFixed() }}% )
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
export default {
  name: "report-repair-byorder",
  data() {
    return {
      loadingBtn: false,
      orderNumber: "",
      dataItem: [],
      dataItem2: [],
      isFilter: false,
      isItemNoForFac: false
    };
  },
  async mounted() {
    this.$store.state.loadingPage = true;
    // console.log(this.$route.params);
    if (!this.$route.params.orderNumber) {
      this.$store.state.loadingPage = false;
      this.$router.go(-1);
    } else {
      this.orderNumber = this.$route.params.orderNumber;
      this.dataItem = this.$route.params.dataItem;
      await this.loadData();
      setTimeout(() => {
        this.$store.state.loadingPage = false;
      }, 500);
    }
  },
  methods: {
    async loadData() {
      const res = await apiFacToQa.reportRepairByOrder({
        orderNumber: this.orderNumber
      });
      this.dataItem.forEach(obj => {
        obj.reason = res.filter(objR => objR.OrderItemNo === obj.OrderItemNo);
      });
      console.log(this.dataItem);
    },
    filterOnlyRepair() {
      if (this.isFilter) {
        this.dataItem2 = this.dataItem;
        this.dataItem = this.dataItem.filter(({ reason }) => reason.length > 0);
      } else {
        this.dataItem = this.dataItem2;
      }
    },

    async printReportRepairByOrder() {
      this.loadingBtn = true;
      const data = this.dataItem.filter(({ reason }) => reason.length > 0);
      await apiCreatePDF.printReportRepairByOrder(data, this.orderNumber);
      this.loadingBtn = false;
    }
  }
};
</script>

<style></style>
