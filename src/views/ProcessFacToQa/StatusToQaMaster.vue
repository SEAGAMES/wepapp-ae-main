<template>
  <v-app v-if="!$store.state.loadingPage">
    <div class="fontSarabun fontSize26" align="center">
      <b>สถานะ ORDER</b>
    </div>
    <v-card class="fontSarabun">
      <v-form @submit.prevent="submit">
        <v-row class="mt-2" dense>
          <v-col cols="2">
            <div>
              <v-text-field
                label="ORDER NO."
                v-model="
                  $store.state.FacToQa.StatusMaster.filterValuesMaster
                    .orderFilter
                "
                required
                outlined
                dense
              />
            </div>
          </v-col>
          <v-col cols="2">
            <div>
              <v-select
                name="salesteam"
                label="SalesTeam"
                outlined
                dense
                item-text="name"
                item-value="value"
                multiple
                v-model="
                  $store.state.FacToQa.StatusMaster.filterValuesMaster
                    .valuesTeamSales
                "
                :items="
                  $store.state.FacToQa.filterQaBill.teamSales.customerShow
                "
              />
            </div>
          </v-col>
          <v-col cols="4">
            <div class="mr-10">
              <v-text-field
                v-model="
                  $store.state.FacToQa.StatusMaster.filterValuesMaster
                    .salesDateBetween
                "
                outlined
                label="วันที่ส่งฝ่ายขาย"
                readonly
                append-icon="mdi-calendar-month"
                @click="dataFilter.dateBetween.showDialog = true"
                dense
              />
            </div>
            <!-- @change="filterStatus()" -->
            <div class="mt-n4 mr-10">
              <v-select
                label="สถานะ"
                outlined
                dense
                v-model="dataFilter.status.statusValues"
                multiple
                :items="dataFilter.status.statusShow"
              />
            </div>
          </v-col>
          <v-col cols="3">
            <div class="ml-n9 mb-n5">
              <v-select
                name="factory"
                label="FACTORY"
                multiple
                outlined
                dense
                v-model="
                  $store.state.FacToQa.StatusMaster.filterValuesMaster
                    .valuesFactory
                "
                :items="$store.state.FacToQa.filterQaBill.factory.factoryShow"
                item-text="name"
                item-value="value"
              />
            </div>
          </v-col>
          <v-col cols="1">
            <div align="center">
              <v-btn
                color="success"
                type="submit"
                :loading="loadingBtn"
                small
                dense
                width="70"
                >ค้นหา</v-btn
              >
            </div>

            <div class="mt-2" align="center">
              <v-btn
                color="red"
                :loading="loadingBtn"
                small
                dense
                dark
                width="70"
                @click="$router.push('/home')"
              >
                <div class="fontSize10">กลับหน้าแรก</div>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-toolbar max-height="60" color="grey lighten-4" class="fontPrompt mt-n3">
      <div class="mb-n5 ml-n3">
        <v-form @submit.prevent="findOrderByJob()">
          <v-text-field
            label="ค้นหาจาก Job"
            v-model="valueJob"
            outlined
            dense
            append-icon="mdi-barcode"
            class="mr-n16"
          />
        </v-form>
      </div>
      <v-spacer></v-spacer>
      <div align="center">
        <div><b>จำนวนรวมทั้งหมด</b></div>
        <div>{{ sumOrder.totalQty.toLocaleString() }}</div>
      </div>
      <v-spacer></v-spacer>
      <div align="center" class="amber--text">
        <div><b>QA ผ่าน</b></div>
        <div>{{ sumOrder.qaFinish.toLocaleString() }}</div>
      </div>
      <v-spacer></v-spacer>
      <div align="center" class="amber--text">
        <div><b>รอตรวจ</b></div>
        <div>
          {{
            (
              sumOrder.qaTotalBill -
              sumOrder.qaFinish -
              sumOrder.qaRepair
            ).toLocaleString()
          }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <div align="center" class="blue--text">
        <div><b>ยังไม่ส่ง QA</b></div>
        <div>
          {{ (sumOrder.totalQty - sumOrder.qaTotalBill).toLocaleString() }}
        </div>
      </div>
      <v-spacer></v-spacer>
      <div align="center" class="blue--text">
        <div><b>กำลังซ่อม</b></div>
        <div>{{ sumOrder.qaRepair.toLocaleString() }}</div>
      </div>
      <v-spacer></v-spacer>
      <div class="mt-n2">
        <v-btn
          color="grey lighten-1"
          @click="$router.push('/factoqa/report-factoqa')"
          >REPORT</v-btn
        >
      </div>
    </v-toolbar>

    <v-card class="fontSarabun" v-if="!loadingPage">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr v-for="(Hrow, indexRow) in header" :key="indexRow">
              <th
                v-for="(Hcol, indexCol) in Hrow"
                :key="indexCol"
                :colspan="Hcol.colSpan"
                :rowspan="Hcol.rowSpan"
                :class="Hcol.css"
              >
                <div align="center" class="mx-n2">
                  {{ Hcol.title }}
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="fontSize8">
            <tr
              v-for="(Body, indexBody) in dataMaster"
              :key="indexBody"
              @click="gotoDetail(indexBody)"
              :class="Body.Status === 'ส่งQAครบ' ? 'yellow lighten-5' : ''"
            >
              <!-- เหลือวันส่งออก  -->
              <td width="20" class="borderLeftPink borderRightGrey">
                <div
                  align="center"
                  class="mx-n2 fontSize12"
                  v-bind:class="{
                    'green--text': Body.CusDueDateDiff >= 7,
                    'orange--text':
                      Body.CusDueDateDiff >= 0 && Body.CusDueDateDiff < 7,
                    'red--text': Body.CusDueDateDiff < 0
                  }"
                >
                  {{ Body.CusDueDateDiff > 0 ? Body.CusDueDateDiff : "" }}
                </div>
              </td>

              <!-- วันที่ส่งออก -->
              <td width="20" class="borderRightPink">
                <div align="center" class="mx-n3 fontSize11">
                  <span class="fontSize11 grey--text">
                    {{
                      Body.CusDueDateDiff > 0
                        ? $moment(Body.CusDueDate).format("dd")
                        : ""
                    }}</span
                  >
                  {{
                    Body.CusDueDateDiff > 0
                      ? $moment(Body.CusDueDate).format("L")
                      : ""
                  }}
                </div>
              </td>

              <!-- Order No -->
              <td width="200">
                <div align="left" class="mx-n2 fontSize12">
                  {{ Body.OrderNumber }}
                </div>
              </td>

              <!-- จำนวน Order -->
              <td width="20" class="borderLeftGrey">
                <div align="center" class="mx-n2 fontSize12">
                  <b>{{ Body.TotalOrderQty.toLocaleString() }}</b>
                </div>
              </td>

              <!-- Factory -->
              <td width="20" class="borderLeftGrey">
                <div align="center" class="mx-n2 fontSize12">
                  Fac {{ Body.ProductionTeam }}
                </div>
              </td>

              <!-- เหลือวันส่งฝ่ายขาย -->
              <td width="20" class="borderLeftGrey">
                <div
                  align="center"
                  class="mx-n2 fontSize12"
                  v-bind:class="{
                    'green--text': Body.SalesDueDateDiff >= 7,
                    'orange--text':
                      Body.SalesDueDateDiff >= 0 && Body.SalesDueDateDiff < 7,
                    'red--text': Body.SalesDueDateDiff < 0
                  }"
                >
                  {{ Body.SalesDueDateDiff }}
                </div>
              </td>

              <!-- วันที่ส่งฝ่ายขาย -->
              <td width="100" class="borderLeftGrey">
                <div align="center" class="mx-n2 fontSize11">
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.SalesDueDate).format("dd") }}
                  </span>
                  {{ $moment(Body.SalesDueDate).format("L") }}
                </div>
              </td>

              <!-- QA ผ่าน -->
              <td width="20" class="borderLeftYellow">
                <div align="center" class="mx-n2 fontSize12">
                  {{ Body.TotalQaFinish.toLocaleString() }}
                </div>
              </td>

              <!-- จำนวน QA -->
              <td width="20">
                <div align="center" class="mx-n2 fontSize12">
                  {{
                    (
                      Body.TotalBillQA -
                      Body.TotalQaFinish -
                      Body.InRepair
                    ).toLocaleString()
                  }}
                </div>
              </td>
              <!-- จำนวนบิล QA -->
              <td width="20" class="borderRightYellow">
                <div align="center" class="mx-n3 fontSize12">
                  {{ Body.CountBill }}
                  <span class="fontSarabun fontSize10 grey--text">บิล</span>
                </div>
              </td>

              <!-- ยังไม่ส่ง QA -->
              <td width="20" class="borderLeftBlue">
                <div align="center" class="mx-n2 fontSize12">
                  <b>{{
                    (Body.TotalOrderQty - Body.TotalBillQA).toLocaleString()
                  }}</b>
                </div>
              </td>

              <!-- ค้างซ่อม -->
              <td width="20">
                <div align="center" class="mx-n2 fontSize12">
                  {{ Body.InRepair.toLocaleString() }}
                </div>
              </td>

              <!-- 1 -->
              <td width="20" class="borderLeftGreen">
                <div
                  align="center"
                  class="mx-n3 fontSize10"
                  v-if="Body.dueFacToQa.length > 0"
                  v-bind:class="{
                    BGGreen:
                      Body.dueFacToQa[0].QtyBill >=
                      Body.dueFacToQa[0].CurrentQty,
                    BGOrange:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) >=
                        convertDate_JS_TO_SQL(getDate),
                    BGRed:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) <
                        convertDate_JS_TO_SQL(getDate)
                  }"
                >
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.dueFacToQa[0].DueDate).format("dd") }}</span
                  >
                  {{ $moment(Body.dueFacToQa[0].DueDate).format("L") }}
                  <div>
                    <b>{{ Body.dueFacToQa[0].Qty.toLocaleString() }}</b>
                  </div>
                </div>
              </td>

              <!-- 2 -->
              <td width="20" class="borderLeftGrey">
                <div
                  align="center"
                  class="mx-n3 fontSize10"
                  v-if="Body.dueFacToQa.length > 1"
                  v-bind:class="{
                    BGGreen:
                      Body.dueFacToQa[0].QtyBill >=
                      Body.dueFacToQa[0].CurrentQty,
                    BGOrange:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) >=
                        convertDate_JS_TO_SQL(getDate),
                    BGRed:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) <
                        convertDate_JS_TO_SQL(getDate)
                  }"
                >
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.dueFacToQa[1].DueDate).format("dd") }}</span
                  >
                  {{ $moment(Body.dueFacToQa[1].DueDate).format("L") }}
                  <div>
                    <b>{{ Body.dueFacToQa[1].Qty.toLocaleString() }}</b>
                  </div>
                </div>
              </td>

              <!-- 3 -->
              <td width="20" class="borderLeftGrey">
                <div
                  align="center"
                  class="mx-n3 fontSize10"
                  v-if="Body.dueFacToQa.length > 2"
                  v-bind:class="{
                    BGGreen:
                      Body.dueFacToQa[0].QtyBill >=
                      Body.dueFacToQa[0].CurrentQty,
                    BGOrange:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) >=
                        convertDate_JS_TO_SQL(getDate),
                    BGRed:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) <
                        convertDate_JS_TO_SQL(getDate)
                  }"
                >
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.dueFacToQa[2].DueDate).format("dd") }}</span
                  >
                  {{ $moment(Body.dueFacToQa[2].DueDate).format("L") }}
                  <div>
                    <b>{{ Body.dueFacToQa[2].Qty.toLocaleString() }}</b>
                  </div>
                </div>
              </td>

              <!-- 4 -->
              <td width="20" class="borderLeftGrey">
                <div
                  align="center"
                  class="mx-n3 fontSize10"
                  v-if="Body.dueFacToQa.length > 3"
                  v-bind:class="{
                    BGGreen:
                      Body.dueFacToQa[0].QtyBill >=
                      Body.dueFacToQa[0].CurrentQty,
                    BGOrange:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) >=
                        convertDate_JS_TO_SQL(getDate),
                    BGRed:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) <
                        convertDate_JS_TO_SQL(getDate)
                  }"
                >
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.dueFacToQa[3].DueDate).format("dd") }}</span
                  >
                  {{ $moment(Body.dueFacToQa[3].DueDate).format("L") }}
                  <div>
                    <b>{{ Body.dueFacToQa[3].Qty.toLocaleString() }}</b>
                  </div>
                </div>
              </td>

              <!-- 5 -->
              <td width="20" class="borderLeftGrey borderRightGreen">
                <div
                  align="center"
                  class="mx-n3 fontSize10"
                  v-if="Body.dueFacToQa.length > 4"
                  v-bind:class="{
                    BGGreen:
                      Body.dueFacToQa[0].QtyBill >=
                      Body.dueFacToQa[0].CurrentQty,
                    BGOrange:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) >=
                        convertDate_JS_TO_SQL(getDate),
                    BGRed:
                      Body.dueFacToQa[0].QtyBill <
                        Body.dueFacToQa[0].CurrentQty &&
                      convertDate_JS_TO_SQL(Body.dueFacToQa[0].DueDate) <
                        convertDate_JS_TO_SQL(getDate)
                  }"
                >
                  <span class="fontSize11 grey--text">
                    {{ $moment(Body.dueFacToQa[4].DueDate).format("dd") }}</span
                  >
                  {{ $moment(Body.dueFacToQa[4].DueDate).format("L") }}
                  <div>
                    <b>{{ Body.dueFacToQa[4].Qty.toLocaleString() }}</b>
                  </div>
                </div>
              </td>

              <!-- สถานะ -->
              <td width="20" class="borderLeftGrey borderRightGreen">
                <div class="mx-n3 fontSize12" align="center">
                  <v-btn
                    width="60"
                    :color="
                      Body.Status === 'กำลังผลิต'
                        ? 'blue lighten-5'
                        : 'yellow lighten-3'
                    "
                    dense
                    small
                  >
                    {{ Body.Status }}
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <div align="center">
      <Loading v-if="loadingPage" />
    </div>

    <!-- POPUP ปฎิทิน -->
    <v-dialog
      v-model="dataFilter.dateBetween.showDialog"
      max-height="300"
      max-width="300"
      class="fontSarabun"
    >
      <v-date-picker
        v-model="
          $store.state.FacToQa.StatusMaster.filterValuesMaster.salesDateBetween
        "
        range
        color="blue-grey lighten-2"
        @change="filterDateBetween()"
      ></v-date-picker>
    </v-dialog>
  </v-app>
</template>

<script>
import apiFacToQa from "../../services/apiFacToQa";
import Loading from "../../components/Loadings/PulseLoader.vue";
export default {
  name: "status-toqamaster",
  components: {
    Loading
  },
  data() {
    return {
      getDate: new Date(),
      loadingBtn: false,
      loadingPage: false,
      valueJob: "",
      header: [
        [
          {
            title: "ส่งออก",
            colSpan: 2,
            rowSpan: 1,
            colorsBorder: "grey",
            width: 50,
            css: "HeaderPink"
          },
          {
            title: "Order NO.",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "grey",
            width: 50,
            css: "HeaderOther"
          },
          {
            title: "จำนวน \n ชิ้น",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderOther"
          },
          {
            title: "FAC",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderOther"
          },
          {
            title: "เหลือวันส่ง ฝ.ขาย",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderOther"
          },
          {
            title: "วันที่ส่ง ฝ.ขาย",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderOther"
          },
          {
            title: "สถานะ QA",
            colSpan: 3,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 150,
            css: "HeaderYellow"
          },
          {
            title: "สถานะ Factory",
            colSpan: 2,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 150,
            css: "HeaderBlue"
          },
          {
            title: "นัดหมายการปิดงานจาก FAC",
            colSpan: 5,
            rowSpan: 1,
            colorsBorder: "green",
            width: 200,
            css: "HeaderGreen"
          },
          {
            title: "สถานะ",
            colSpan: 1,
            rowSpan: 2,
            colorsBorder: "green",
            width: 20,
            css: "HeaderOther"
          }
        ],
        [
          {
            title: "เหลือวันส่งออก",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderPink"
          },
          {
            title: "วันที่ส่งออก",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderPink"
          },
          {
            title: "QA ผ่าน",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "grey",
            width: 20,
            css: "HeaderYellow"
          },
          {
            title: "จน QA",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 20,
            css: "HeaderYellow"
          },
          {
            title: "จำนวนบิลค้าง",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 20,
            css: "HeaderYellow"
          },
          {
            title: "ยังไม่ส่ง QA",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 20,
            css: "HeaderBlue"
          },
          {
            title: "ค้างซ่อม QA",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "yellow",
            width: 20,
            css: "HeaderBlue"
          },
          {
            title: "ครั้งที่ 1",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "green",
            width: 20,
            css: "HeaderGreen"
          },
          {
            title: "ครั้งที่ 2",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "green",
            width: 20,
            css: "HeaderGreen"
          },
          {
            title: "ครั้งที่ 3",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "green",
            width: 20,
            css: "HeaderGreen"
          },
          {
            title: "ครั้งที่ 4",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "green",
            width: 20,
            css: "HeaderGreen"
          },
          {
            title: "ครั้งที่ 5",
            colSpan: 1,
            rowSpan: 1,
            colorsBorder: "green",
            width: 20,
            css: "HeaderGreen"
          }
        ]
      ],
      dataMaster: [],
      dataMaster2: [],
      dataFilter: {
        dateBetween: {
          showDialog: false,
          showDate: ""
        },
        status: {
          statusShow: ["กำลังผลิต", "ส่งQAครบ"],
          statusValues: ["กำลังผลิต", "ส่งQAครบ"]
        }
      },
      sumOrder: {
        totalQty: 0,
        qaFinish: 0,
        qaRepair: 0,
        qaTotalBill: 0
      }
    };
  },
  async mounted() {
    this.$store.state.loadingPage = true;
    setTimeout(async () => {
      if (this.$store.state.FacToQa.StatusMaster.isDataFilterPage) {
        await this.$store.dispatch({
          type: "SET_filterQAStatusMaster",
          setDefault: false,
          //TEMPLATE FILTER
          valuesFilter: {
            orderFilter: null,
            valuesFactory: null,
            valuesTeamSales: null,
            salesDateBetween: null
          }
        });
      } else {
        await this.$store.dispatch({
          type: "SET_filterQAStatusMaster",
          setDefault: true,
          valuesFilter: {}
        });
      }
      await this.loadDataMaster();
      setTimeout(() => {
        this.dataMaster = this.dataMaster.filter(({ Status }) =>
          this.dataFilter.status.statusValues.includes(Status)
        );
        this.$store.state.loadingPage = false;
      }, 500);
    }, 1500);
  },
  methods: {
    async loadDataMaster() {
      this.dataMaster = await apiFacToQa.getStatusMaster({
        orderFilter: this.$store.state.FacToQa.StatusMaster.filterValuesMaster
          .orderFilter,
        Factory: this.$store.state.FacToQa.StatusMaster.filterValuesMaster
          .valuesFactory,
        dateBetween: this.$store.state.FacToQa.StatusMaster.filterValuesMaster
          .salesDateBetween,
        salesTeam: this.$store.state.FacToQa.StatusMaster.filterValuesMaster
          .valuesTeamSales
      });
      // console.log(this.dataMaster);
      this.filterStatus();
      this.sumOrder.totalQty = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalOrderQty,
        0
      );
      this.sumOrder.qaFinish = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalQaFinish,
        0
      );
      this.sumOrder.qaRepair = this.dataMaster.reduce(
        (pv, cv) => pv + cv.InRepair,
        0
      );
      this.sumOrder.qaTotalBill = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalBillQA,
        0
      );
    },
    filterDateBetween() {
      this.dataFilter.dateBetween.showDialog = false;
      this.$store.state.FacToQa.StatusMaster.filterValuesMaster.salesDateBetween.sort(
        (a, b) => (a > b ? 1 : b > a ? -1 : 0)
      );
      this.dataFilter.dateBetween.showDate = `${this.$store.state.FacToQa.StatusMaster.filterValuesMaster.salesDateBetween[0]} ~ ${this.$store.state.FacToQa.StatusMaster.filterValuesMaster.salesDateBetween[1]}`;
    },
    async submit() {
      this.loadingBtn = true;
      this.loadingPage = true;
      await this.loadDataMaster();
      setTimeout(() => {
        this.loadingBtn = false;
        this.loadingPage = false;
      }, 1000);
    },
    async gotoDetail(index) {
      // console.log(index);
      // console.log(this.dataMaster[index].OrderNumber);
      // CLEAR DATA ก่อนเข้า
      this.$store.state.FacToQa.StatusDetail = {
        dataMaster: null,
        valuesCart: [],
        employeeQC: []
      };
      await this.$router.push({
        name: "statustoqa-detail",
        params: { dataMaster: this.dataMaster[index] }
      });
    },
    convertDate_JS_TO_SQL(date) {
      const valueDate = `${this.$moment(date).format("YYYY")}-${this.$moment(
        date
      ).format("MM")}-${this.$moment(date).format("DD")}`;
      return valueDate;
    },
    async findOrderByJob() {
      let isCheckJob = 0; //ไว้สำหรับเช็ค Job * 1 = JobOrder 2 = QAJob *
      if (
        this.valueJob.length === 7 &&
        +this.valueJob.substring(0, 2) <=
          +this.$moment(this.getDate).format("YY")
      ) {
        // console.log("JobN");
        isCheckJob = 1;
      } else if (
        this.valueJob.length === 10 &&
        this.valueJob.substring(0, 2) === "BQ"
      ) {
        // console.log("JobQA");
        isCheckJob = 2;
      }
      if (isCheckJob > 0) {
        const { result, data } = await apiFacToQa.getOrderStatusByJob({
          JobNumber: this.valueJob,
          isJob: isCheckJob
        });
        // console.log(result, data);
        if (result === "ok") {
          this.$store.state.FacToQa.StatusDetail = {
            dataMaster: null,
            valuesCart: [],
            employeeQC: []
          };
          await this.$router.push({
            name: "statustoqa-detail",
            params: { dataMaster: data }
          });
        }
      }
    },
    filterStatus() {
      this.dataMaster = this.dataMaster.filter(({ Status }) =>
        this.dataFilter.status.statusValues.includes(Status)
      );
    }
  }
};
</script>

<style>
.borderRightPink {
  border-right: 1px solid rgb(255, 160, 234);
}
.borderLeftPink {
  border-left: 1px solid rgb(255, 160, 234);
}
.borderTopPink {
  border-top: 1px solid rgb(255, 160, 234);
}
.borderButtomPink {
  border-bottom: 1px solid rgb(255, 160, 234);
}

.borderRightGrey {
  border-right: 1px solid rgb(214, 214, 214);
}
.borderLeftGrey {
  border-left: 1px solid rgb(214, 214, 214);
}
.borderTopGrey {
  border-top: 1px solid rgb(214, 214, 214);
}
.borderbottomGrey {
  border-bottom: 1px solid rgb(214, 214, 214);
}
.borderFullGrey {
  border-bottom: 1px solid rgb(214, 214, 214);
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-right: 1px solid rgb(214, 214, 214);
}

.borderRightYellow {
  border-right: 1px solid rgb(245, 247, 148);
}
.borderLeftYellow {
  border-left: 1px solid rgb(245, 247, 148);
}
.borderTopYellow {
  border-top: 1px solid rgb(245, 247, 148);
}
.borderButtomYellow {
  border-bottom: 1px solid rgb(245, 247, 148);
}

.borderRightGreen {
  border-right: 1px solid rgb(54, 163, 99);
}
.borderLeftGreen {
  border-left: 1px solid rgb(54, 163, 99);
}
.borderTopGreen {
  border-top: 1px solid rgb(54, 163, 99);
}
.borderButtomGreen {
  border-bottom: 1px solid rgb(54, 163, 99);
}

.borderRightBlue {
  border-right: 1px solid rgb(84, 172, 255);
}
.borderLeftBlue {
  border-left: 1px solid rgb(84, 172, 255);
}
.borderTopBlue {
  border-top: 1px solid rgb(84, 172, 255);
}
.borderButtomBlue {
  border-bottom: 1px solid rgb(84, 172, 255);
}
</style>
