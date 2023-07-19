<template>
  <v-app>
    <div v-if="!loadingChart" class="fontPrompt my-5">
      <div class="fontSize22" align="center">FAC ส่งงานให้ QA ในแต่ละวัน</div>
      <v-row>
        <v-col cols="6" v-for="(i, index) in dataLineChart" :key="index">
          <div align="center" class="grey--text">{{ i.datasets[0].label }}</div>
          <div class="mx-n1">
            <LineChart
              :chart-data="i"
              :options="options"
              style="height: 200px"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="fontSarabun">
      <v-card>
        <!-- :search="dataTable.dataFilter.search" -->
        <v-data-table
          :items="dataTable.dataBody"
          class="tableReport"
          multi-sort
          :items-per-page="15"
          :headers="dataTable.headers"
        >
          <template v-slot:top>
            <v-form @submit.prevent="loadDataReport()">
              <v-toolbar flat color="white" class="fontSarabun fontSize12">
                <v-text-field
                  v-model="dataTable.dataFilter.search"
                  append-icon="search"
                  label="ค้นหาจากORDER"
                  single-line
                  hide-details
                  outlined
                  dense
                  class="mr-1"
                ></v-text-field>
                <v-spacer />
                <div>
                  <v-select
                    label="FACTORY"
                    outlined
                    hide-details
                    color="amber"
                    dense
                    class="mr-1"
                    v-model="dataTable.dataFilter.valueFactory"
                    :items="
                      $store.state.FacToQa.filterQaBill.factory.factoryShow
                    "
                    item-text="name"
                    item-value="value"
                    multiple
                  />
                </div>

                <v-spacer />
                <div>
                  <v-btn color="success" dense width="60" type="submit"
                    >ค้นหา</v-btn
                  >
                </div>
              </v-toolbar>

              <v-toolbar flat color="white" class="fontSarabun fontSize12">
                <v-text-field
                  label="ค้นหาจากวันที่ส่ง"
                  outlined
                  hide-details
                  color="amber"
                  readonly
                  append-icon="mdi-calendar-month"
                  dense
                  class="mr-1"
                  v-model="dataTable.dataFilter.dateBetween.showDate"
                  @click="
                    dataTable.dataFilter.dateBetween.showDialog = !dataTable
                      .dataFilter.dateBetween.showDialog
                  "
                />
                <v-spacer />
                <v-select
                  label="SalesTeam"
                  outlined
                  hide-details
                  color="amber"
                  dense
                  class="mr-1"
                  v-model="dataTable.dataFilter.valueSalesTeam"
                  :items="
                    $store.state.FacToQa.filterQaBill.teamSales.customerShow
                  "
                  item-text="name"
                  item-value="value"
                  multiple
                />

                <v-spacer />
                <div>
                  <v-btn
                    @click="printReport()"
                    color="blue"
                    dark
                    dense
                    small
                    fab
                  >
                    <v-icon>print</v-icon>
                  </v-btn>
                </div>
                <!-- :style="'width: 220px'" -->
                <v-spacer />
                <div>
                  <v-btn color="red" @click="$router.go(-1)" dark width="60"
                    >กลับ</v-btn
                  >
                </div>
              </v-toolbar>
            </v-form>
          </template>
          <template v-slot:item="{ item }">
            <!-- <tr class="color: grey and myImg"> v-bind:class="{ active: isActive, 'text-danger': hasError }" -->
            <tr
              v-bind:class="{ 'color: amber lighten-4': item.Status === '3' }"
            >
              <td align="center" @click="gotoDetail(item)">
                <div class="fontSize16 mx-n3">
                  {{ $moment(item.jobDate).format("dd") }}
                  {{ $moment(item.jobDate).format("L") }}
                </div>
              </td>
              <td align="left" @click="gotoDetail(item)">
                <div class="fontSize16 mx-n2">
                  <b>{{ item.OrderNumber }}</b>
                  <div class="grey--text">
                    Factory : {{ item.ProductionTeam }}
                  </div>
                </div>
              </td>
              <td align="center" @click="gotoDetail(item)">
                <div class="fontSize16 mx-n3">
                  {{ item.TotalQty.toLocaleString() }}
                </div>
              </td>
              <td align="center" @click="gotoDetail(item)">
                <div class="fontSize16 mx-n3">
                  {{ item.billQty.toLocaleString() }}
                </div>
                <div class="fontSize16 mx-n3 grey--text">
                  {{ ((item.billQty * 100) / item.TotalQty).toFixed(2) }} %
                </div>
              </td>
              <td align="center" @click="gotoDetail(item)">
                <div class="fontSize16 mx-n3">
                  {{ item.finishQty.toLocaleString() }}
                </div>
                <div class="fontSize16 grey--text">
                  {{ ((item.finishQty * 100) / item.TotalQty).toFixed(2) }} %
                </div>
              </td>
              <td align="center" @click="gotoDetail(item)">
                <div class="mx-n3">
                  <div class="fontSize18">
                    {{ item.repairQty.toLocaleString() }}
                  </div>
                  <div class="fontSize16 grey--text">
                    {{ ((item.repairQty * 100) / item.TotalQty).toFixed(2) }} %
                  </div>
                </div>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-card>
    </div>

    <div v-if="!loadingChart" class="fontPrompt my-5">
      <div class="fontSize22" align="center">QA ตรวจงานเสร็จในแต่ละวัน</div>
      <v-row>
        <v-col cols="6" v-for="(i, index) in dataQaLineChart" :key="index">
          <div align="center" class="grey--text">{{ i.datasets[0].label }}</div>
          <div class="mx-n1">
            <LineChart
              :chart-data="i"
              :options="options"
              style="height: 250px"
            />
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="fontPrompt mt-2">
      <div align="center" class="fontSize22">
        เปอร์เซนต์การส่งงานรวมแต่ละ ORDER
      </div>
      <div align="right">
        <v-btn
          color="success"
          @click="loadingBarchart()"
          small
          :loading="!reloadBarChart"
          >Refresh</v-btn
        >
      </div>

      <BarChart_Horiz
        :chartData="dataBarChart.chartData"
        v-if="reloadBarChart"
        :style="
          `height: ${
            dataBarChart.chartData.labels.length <= 10
              ? 250
              : dataBarChart.chartData.labels.length * 25
          }px`
        "
      />
    </div>

    <!-- POPUP ปฎิทิน -->
    <v-dialog
      v-model="dataTable.dataFilter.dateBetween.showDialog"
      max-height="300"
      max-width="300"
      class="fontSarabun"
    >
      <v-date-picker
        v-model="dataTable.dataFilter.dateBetween.valuesDate"
        range
        color="blue-grey lighten-2"
        @change="filterDate()"
      ></v-date-picker>
    </v-dialog>
  </v-app>
</template>

<script>
import BarChart_Horiz from "../../components/charts/BarChart_Horiz.vue";
import apiFacToQa from "../../services/apiFacToQa";
import LineChart from "../../components/charts/LineChart.vue";
import apiCreatePDF from "../../services/apiCreatePDF";

const randomCode = () => {
  let colors = Math.floor(Math.random() * 16777215).toString(16);
  colors = "#" + colors;
  return colors;
};

export default {
  name: "report-factoqa",
  components: { BarChart_Horiz, LineChart },
  data() {
    return {
      reloadBarChart: false,
      loadingChart: true,
      getDate: new Date(),
      dataBarChart: {
        chartData: {
          labels: [],
          datasets: [
            {
              label: "Actual",
              axis: "y",
              fill: false,
              pointBackgroundColor: "white",
              borderWidth: 1,
              pointBorderColor: "#A52A2A",
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 9],
              borderColor: ["#8A2BE2"],
              backgroundColor: "#84FFFF",
            },
          ],
          options: {
            plugins: {
              datalabels: {
                anchor: "end",
                align: "end",
                formatter: (val) => "$" + val,
              },
            },
          },
        },
      },
      options: {
        legend: {
          display: false,
        },
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          animateRotate: false,
        },
      },
      dataLineChart: [],
      dataQaLineChart: [],
      dataTable: {
        headers: [
          {
            text: "วันที่ส่ง",
            align: "center",
            sortable: true,
            value: "billDate",
            width: 120,
          },
          {
            text: "ORDER NO",
            align: "center",
            sortable: true,
            value: "OrderNumber",
            width: 250,
          },
          {
            text: "จำนวนทั้งORDER",
            align: "center",
            sortable: true,
            value: "TotalQty",
            width: 80,
          },
          {
            text: "จำนวนที่ FAC ส่ง",
            align: "center",
            sortable: true,
            value: "Qty",
            width: 80,
          },
          {
            text: "จำนวน QA ตรวจ",
            align: "center",
            sortable: true,
            value: "Qty",
            width: 80,
          },
          {
            text: "จำนวนส่งซ่อม",
            align: "center",
            sortable: true,
            value: "Qty",
            width: 80,
          },
        ],
        dataFilter: {
          search: "",
          dateBetween: {
            showDialog: false,
            valuesDate: [],
            showDate: "",
          },
          valueFactory: [],
          valueSalesTeam: [],
        },
        dataBody: [],
      },
    };
  },
  async mounted() {
    this.loadingChart = true;
    // const a = 23.45678;
    // console.log(a % a.toFixed(0));
    if (this.$store.state.FacToQa.reportFactoQa.filterMaster) {
      this.dataTable.dataFilter = this.$store.state.FacToQa.reportFactoQa.filterMaster;
    } else {
      const beforeDate = new Date().setDate(new Date().getDate() - 9);
      this.dataTable.dataFilter.valueSalesTeam = [1, 2, 3];
      this.dataTable.dataFilter.valueFactory = ["1", "2", "3", "4"];
      this.dataTable.dataFilter.dateBetween.valuesDate = [
        apiCreatePDF.convertDate_JS_TO_SQL(beforeDate),
        apiCreatePDF.convertDate_JS_TO_SQL(this.getDate),
      ];
      this.dataTable.dataFilter.dateBetween.showDate = this.dataTable.dataFilter.dateBetween.showDate = `${this.dataTable.dataFilter.dateBetween.valuesDate[0]} ~ ${this.dataTable.dataFilter.dateBetween.valuesDate[1]}`;
    }
    await this.loadDataReport();
  },
  methods: {
    async loadDataReport() {
      const {
        dataDate,
        dataChart,
        dataLineChart,
        dataQa,
      } = await apiFacToQa.reportFactoQa({
        orderFilter: this.dataTable.dataFilter.search,
        billDate: this.dataTable.dataFilter.dateBetween.valuesDate,
        ProductionTeam: this.dataTable.dataFilter.valueFactory,
        salesTeam: this.dataTable.dataFilter.valueSalesTeam,
      });
      // console.log(dataDate, dataChart, dataLineChart, );
      this.dataTable.dataBody = dataDate;
      // console.log(dataQa);
      this.dataBarChart.chartData.labels = dataChart.map(
        ({ OrderNumber }) => OrderNumber
      );
      // this.dataBarChart.chartData.datasets[0].data = dataChart.map(
      //   ({ TotalQty }) => 100
      // );
      this.dataBarChart.chartData.datasets[0].data = dataChart.map(
        ({ TotalQty, Qty }) => (Qty * 100) / TotalQty
      );
      const FactTeamForLineChart = [
        ...new Set(dataLineChart.map(({ ProductionTeam }) => ProductionTeam)),
      ];
      // console.log(FactTeamForLineChart);
      this.dataLineChart = [];
      FactTeamForLineChart.forEach((FactTeam) => {
        const valuesLineChart = {
          labels: dataLineChart
            .filter(({ ProductionTeam }) => ProductionTeam === FactTeam)
            .sort((a, b) =>
              a.billDate > b.billDate ? 1 : b.billDate > a.billDate ? -1 : 0
            )
            .map(
              (
                { billDate } //this.$moment(billDate).format("L")),
              ) =>
                `${this.$moment(billDate).format("dd")} ${this.$moment(
                  billDate
                ).format("DD")}/${this.$moment(billDate).format("MM")}`
            ),
          datasets: [
            {
              label: `FACTORY ${FactTeam}`,
              data: dataLineChart
                .filter(({ ProductionTeam }) => ProductionTeam === FactTeam)
                .sort((a, b) =>
                  a.billDate > b.billDate ? 1 : b.billDate > a.billDate ? -1 : 0
                )
                .map(({ TotalQty }) => TotalQty),
              pointBackgroundColor: "white",
              pointBorderColor: randomCode(),
              backgroundColor:
                FactTeam === "1"
                  ? "#FFCDD2"
                  : FactTeam === "2"
                  ? "#B3E5FC"
                  : FactTeam === "3"
                  ? "#FFECB3"
                  : "#B9F6CA",
              borderColor: randomCode(),
            },
          ],
        };
        this.dataLineChart.push(valuesLineChart);
      });
      this.dataQaLineChart = [];
      for (let i = 1; i <= 2; i++) {
        if (i === 1) {
          const valuesQaLineChart = {
            labels: dataQa
              .filter(({ SalesTeam }) => SalesTeam === 1 || SalesTeam === 3)
              .sort((a, b) =>
                a.finishDate > b.finishDate
                  ? 1
                  : b.finishDate > a.finishDate
                  ? -1
                  : 0
              )
              .map(
                ({ finishDate }) =>
                  `${this.$moment(finishDate).format("dd")} ${this.$moment(
                    finishDate
                  ).format("DD")}/${this.$moment(finishDate).format("MM")}`
              ),
            datasets: [
              {
                label: `QA Team K.หน่อย`,
                data: dataQa
                  .filter(({ SalesTeam }) => SalesTeam === 1)
                  .sort((a, b) =>
                    a.finishDate > b.finishDate
                      ? 1
                      : b.finishDate > a.finishDate
                      ? -1
                      : 0
                  )
                  .map(({ Qty }) => Qty),
                pointBackgroundColor: "white",
                pointBorderColor: randomCode(),
                backgroundColor: "#FFFF8D",
                borderColor: "#FBC02D",
              },
            ],
          };
          // console.log(valuesQaLineChart);
          this.dataQaLineChart.push(valuesQaLineChart);
        } else {
          const valuesQaLineChart = {
            labels: dataQa
              .filter(({ SalesTeam }) => SalesTeam === 2)
              .sort((a, b) =>
                a.finishDate > b.finishDate
                  ? 1
                  : b.finishDate > a.finishDate
                  ? -1
                  : 0
              )
              .map(
                ({ finishDate }) =>
                  `${this.$moment(finishDate).format("dd")} ${this.$moment(
                    finishDate
                  ).format("DD")}/${this.$moment(finishDate).format("MM")}`
              ),
            datasets: [
              {
                label: `QA Team K.วุ้น & K.แอม`,
                data: dataQa
                  .filter(({ SalesTeam }) => SalesTeam === 2)
                  .sort((a, b) =>
                    a.finishDate > b.finishDate
                      ? 1
                      : b.finishDate > a.finishDate
                      ? -1
                      : 0
                  )
                  .map(({ Qty }) => Qty),
                pointBackgroundColor: "white",
                pointBorderColor: "#880E4F",
                backgroundColor: "#F8BBD0",
                borderColor: "#EC407A",
              },
            ],
          };
          // console.log(valuesQaLineChart);
          this.dataQaLineChart.push(valuesQaLineChart);
        }
        // console.log(this.dataQaLineChart);
      }

      setTimeout(() => {
        // console.log(this.dataBarChart);
        // console.log(this.dataQaLineChart);
        this.loadingChart = false;
        this.loadingBarchart();
      }, 500);
    },
    filterDate() {
      this.dataTable.dataFilter.dateBetween.valuesDate.sort((a, b) =>
        a > b ? 1 : b > a ? -1 : 0
      );
      this.dataTable.dataFilter.dateBetween.showDate = `${this.dataTable.dataFilter.dateBetween.valuesDate[0]} ~ ${this.dataTable.dataFilter.dateBetween.valuesDate[1]}`;
      this.dataTable.dataFilter.dateBetween.showDialog = false;
    },
    loadingBarchart() {
      this.reloadBarChart = false;
      setTimeout(() => {
        this.reloadBarChart = true;
      }, 500);
    },
    gotoDetail(item) {
      this.$store.state.FacToQa.reportFactoQa.filterMaster = this.dataTable.dataFilter;
      //console.log(item);
      this.$router.push({
        name: "report-factoqa-detail",
        params: item,
      });
    },
    async printReport() {
      await apiCreatePDF.printReportFactoQa(this.dataTable.dataFilter.dateBetween.valuesDate, this.dataTable.dataBody);
    },
  },
};
</script>

<style>
.tableReport table th {
  font-size: 16px !important;
  background-color: rgba(130, 230, 255, 0.644);
}

/* .widthFact {
  width: 325px;
}
.widthFact {
  width: 325px;
} */
</style>
