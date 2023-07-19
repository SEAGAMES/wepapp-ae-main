<template>
  <v-app v-if="!$store.state.loadingPage">
    <div class="fontPrompt fontSize28" align="center">
      <b>รายการบิลส่งซ่อม</b>
    </div>

    <v-card class="fontSarabun">
      <v-form @submit.prevent="submit">
        <v-row class="mt-2 mx-n2 px-3" dense>
          <v-col cols="2">
            <div>
              <v-text-field
                name="orderNumber"
                label="ORDER NO."
                v-model="
                  $store.state.FacToQa.qaRepairBill.filterValuesMaster
                    .orderFilter
                "
                required
                outlined
                dense
              />
            </div>
          </v-col>
          <v-col cols="3">
            <div class="mr-5">
              <v-select
                label="Sales Team"
                multiple
                outlined
                dense
                v-model="
                  $store.state.FacToQa.qaRepairBill.filterValuesMaster
                    .valuesTeamSales
                "
                :items="
                  $store.state.FacToQa.filterQaBill.teamSales.customerShow
                "
                item-text="name"
                item-value="value"
              />
            </div>
          </v-col>
          <v-col cols="3">
            <div class="ml-n5">
              <v-text-field
                v-model="
                  $store.state.FacToQa.qaRepairBill.filterValuesMaster.showDate
                "
                outlined
                label="วันที่ส่งซ่อม"
                readonly
                append-icon="mdi-calendar-month"
                @click="dataFilter.dateBetween.showDialog = true"
                dense
              />
            </div>
          </v-col>
          <v-col cols="3">
            <div>
              <v-select
                label="FACTORY"
                multiple
                outlined
                dense
                v-model="
                  $store.state.FacToQa.qaRepairBill.filterValuesMaster
                    .valuesFactory
                "
                :items="$store.state.FacToQa.filterQaBill.factory.factoryShow"
                item-text="name"
                item-value="value"
              />
            </div>
          </v-col>

          <v-col cols="1">
            <div align="center" class="ml-1">
              <v-btn
                color="success"
                type="submit"
                :loading="loadingBtn"
                small
                dense
                width="50"
                >ค้นหา</v-btn
              >
            </div>
            <!-- <div align="center" class="ml-1 mt-2">
              <v-btn
                color="red"
                :loading="loadingBtn"
                small
                dense
                dark
                @click="$router.go(-1)"
                >กลับ</v-btn
              >
            </div> -->
          </v-col>
        </v-row>
      </v-form>
    </v-card>

    <v-toolbar max-height="60" class="fontSarabun amber lighten-3 mt-n4">
      <div class="pt-6 ml-10">
        <v-form @submit.prevent="findBillByJob()">
          <v-text-field
            label="QRCODE SCAN"
            required
            outlined
            dense
            append-icon="mdi-barcode"
            class="mx-n11"
            v-model="
              $store.state.FacToQa.qaRepairBill.filterValuesMaster.jobScan
            "
          />
        </v-form>
      </div>
      <div>
        <div align="center" class="black--text fontSarabun">
          จำนวนซ่อมทั้งหมด
        </div>
        <div align="center" class="black--text">
          {{ sumBill.TotalQty.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="blue--text fontSarabun">ซ่อมเสร็จแล้ว</div>
        <div align="center" class="blue--text">
          {{ sumBill.TotalFinishQty.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="orange--text fontSarabun">กำลังซ่อม</div>
        <div align="center" class="orange--text">
          {{
            (
              sumBill.TotalQty -
              sumBill.TotalFinishQty -
              sumBill.ToQa
            ).toLocaleString()
          }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="red--text fontSarabun">รอรับ</div>
        <div align="center" class="red--text">
          {{ sumBill.ToQa.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <v-badge
          :color="
            dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === ''
            ).length
              ? 'red'
              : ''
          "
          :content="
            dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === ''
            ).length
          "
          overlap
        >
          <v-btn
            color="green"
            small
            dense
            @click="actionToolBar(1)"
            :disabled="
              dataFilter.isPrint ||
                dataFilter.isQAReceive ||
                dataMaster.filter(
                  ({ qaRepairStatus }) => qaRepairStatus.trim() === ''
                ).length <= 0
            "
            class="white--text"
            width="70"
            >Facรับงาน</v-btn
          >
        </v-badge>
      </div>
      <v-Spacer />
      <div>
        <v-badge
          :color="
            dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === '2'
            ).length
              ? 'red'
              : ''
          "
          :content="
            dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === '2'
            ).length
          "
          overlap
        >
          <v-btn
            color="blue"
            small
            dense
            @click="actionToolBar(2)"
            :disabled="
              dataFilter.isPrint ||
                dataFilter.isFacReceive ||
                dataMaster.filter(
                  ({ qaRepairStatus }) => qaRepairStatus.trim() === '2'
                ).length <= 0
            "
            class="white--text"
            width="70"
            >QAรับงาน</v-btn
          >
        </v-badge>
      </div>
      <v-Spacer />
      <div>
        <v-btn
          color="blue"
          dense
          small
          fab
          @click="actionToolBar(3)"
          :disabled="dataFilter.isFacReceive || dataFilter.isQAReceive"
          dark
        >
          <v-icon>print</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-card class="fontSarabun" v-if="!loadingPage">
      <v-simple-table>
        <template v-slot:default>
          <thead>
            <tr>
              <th width="350" class="HeaderQA">
                <div align="center" class="mx-n2 fontSize14">
                  <b>รายละเอียดบิล</b>
                </div>
              </th>
              <th width="80" class="HeaderQA">
                <div align="center" class="mx-n2 fontSize14">
                  <b>จำนวนรวม</b>
                </div>
              </th>
              <th width="700" class="HeaderQA">
                <div align="center" class="mx-n2 fontSize14"><b>รายการ</b></div>
              </th>
              <!-- เพิ่ม -->
              <th width="80" class="HeaderQA">
                <div align="center" class="mx-n2 fontSize14">
                  <b>ผู้รับงานซ่อม</b>
                </div>
              </th>
              <th width="80" class="HeaderQA">
                <div align="center" class="mx-n2 fontSize14">
                  <b>{{
                    !dataFilter.isFacReceive && !dataFilter.isPrint
                      ? "สถานะ"
                      : dataFilter.isFacReceive
                      ? "รับงาน"
                      : "Print Bill"
                  }}</b>
                </div>
              </th>
            </tr>
          </thead>
          <!-- v-bind:class"{ tableRecieveBillRepair: i }" -->
          <tbody class="fontSize8">
            <tr
              v-for="(bill, billIndex) in dataMaster"
              :key="billIndex"
              v-bind:class="{
                isToFact: bill.qaRepairStatus.trim() === '',
                isToQa: bill.qaRepairStatus === '2',
                billFinish: bill.qaRepairStatus === '3'
              }"
            >
              <td
                class="borderRightGrey borderTopGrey borderLeftGrey"
                @click="gotoDetail(bill)"
              >
                <div class="mx-n3 mt-n1">
                  <div align="left">
                    <b>{{ bill.OrderNumber }}</b>
                  </div>
                  <div class="fontSize12">
                    เลขบิลซ่อม: <b>{{ bill.repairDocNumber }}</b>
                  </div>
                  <div class="fontSize12">
                    วันที่ส่งซ่อม:<b>
                      {{ $moment(bill.repairDate).format("dd") }}
                      {{ $moment(bill.repairDate).format("L") }}</b
                    >
                  </div>
                  <div class="fontSize12 mr-n2" v-if="bill.receiveDate">
                    วันที่รับบิลซ่อม:
                    <b>
                      {{ $moment(bill.receiveDate).format("dd") }}
                      {{ $moment(bill.receiveDate).format("L") }}</b
                    >
                  </div>
                  <div class="fontSize12 grey--text">
                    BILL QA: <b>{{ bill.qaDocNumber }}</b>
                  </div>
                  <div class="fontSize12">
                    FACTORY : <b>{{ bill.ProductionTeam }}</b>
                  </div>
                </div>
              </td>
              <td
                class="borderRightGrey borderTopGrey"
                @click="gotoDetail(bill)"
              >
                <div align="center">
                  {{ bill.TotalQty }}
                </div>
              </td>
              <td
                class="borderRightGrey borderTopGrey"
                @click="gotoDetail(bill)"
              >
                <div class="mr-n16 ml-n4" align="right">
                  <v-row dense class="pa-1">
                    <!-- :cols="12 / Math.ceil(bill.ItemBill.length)" -->
                    <v-col
                      :cols="2"
                      v-for="(item, indexItem) in bill.ItemBill"
                      :key="indexItem"
                      class="mx-1"
                      v-bind:class="{
                        'myImg isFinish': item.RepairFinish === item.Qty
                      }"
                    >
                      <div>
                        <v-img :src="item.NewPict">
                          <div
                            align="left"
                            class="fontSarabun fontSize10 grey--text"
                          >
                            {{ item.OrderItemNo }}
                          </div>
                        </v-img>
                      </div>
                      <div align="center" class="fontSize10 mx-n1 textInLine">
                        {{ item.ProductCode }}
                      </div>
                      <div align="center" class="fontSize10 mx-n1 textInLine">
                        ซ่อม :
                        <b class="fontSize12 mx-1">{{
                          item.Qty.toLocaleString()
                        }}</b>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </td>

              <!-- เพิ่ม -->
              <td
                class="borderRightGrey borderTopGrey"
                @click="gotoDetail(bill)"
              >
                <div class="fontSarabun fontSize12 mx-n4" align="center">
                  {{ bill.Receiver }}
                </div>
              </td>
              <td class="borderRightGrey borderTopGrey">
                <div align="center">
                  <!-- สถานะ -->
                  <div
                    v-if="
                      !dataFilter.isFacReceive &&
                        !dataFilter.isPrint &&
                        !dataFilter.isQAReceive
                    "
                    class="mx-n3"
                  >
                    <v-btn
                      dense
                      small
                      width="80"
                      dark
                      v-bind:class="{
                        'teal ': bill.qaRepairStatus.trim() === '',
                        amber: bill.qaRepairStatus.trim() === '1',
                        blue: bill.qaRepairStatus.trim() === '2',
                        grey: bill.qaRepairStatus.trim() === '3'
                      }"
                      >{{ bill.statusShow }}</v-btn
                    >
                  </div>
                  <!-- Fac รับ -->
                  <div
                    v-if="
                      dataFilter.isFacReceive &&
                        bill.qaRepairStatus.trim() === ''
                    "
                    class="mx-n3"
                    align="center"
                  >
                    <v-btn
                      @click="facReceiveRepairBill(bill)"
                      color="success"
                      dense
                      small
                      :disabled="
                        $store.state.levelUser.isFacTeam.filter(
                          obj =>
                            obj.FacTeam === bill.ProductionTeam &&
                            obj.isReceive === true
                        ).length <= 0
                      "
                      :loading="loadingBtn"
                      >ยืนยันรับ</v-btn
                    >
                  </div>
                  <!-- QA รับ -->
                  <div
                    v-if="
                      dataFilter.isQAReceive &&
                        bill.qaRepairStatus.trim() === '2'
                    "
                    class="mx-n3"
                    align="center"
                  >
                    <v-btn
                      @click="QaReceiveRepairBill(bill)"
                      color="blue"
                      dense
                      small
                      dark
                      :disabled="
                        $store.state.levelUser.isQATeam.filter(
                          obj =>
                            obj.QATeam === bill.cusStatus &&
                            obj.isReceive === true
                        ).length <= 0
                      "
                      :loading="loadingBtn"
                      >ยืนยันรับ</v-btn
                    >
                  </div>
                  <!-- Print เพิ่มการปริ้นท์ -->
                  <div
                    v-if="
                      dataFilter.isPrint &&
                        !dataFilter.isFacReceive &&
                        !dataFilter.isQAReceive
                    "
                    class="mx-n3"
                    align="center"
                  >
                    <v-btn
                      @click="printBillRepair(bill)"
                      color="blue"
                      dense
                      small
                      fab
                      dark
                      ><v-icon>print</v-icon></v-btn
                    >
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <!-- ยืนยันรับงาน Status "" -->
    <v-dialog v-model="receiveShowPop" max-width="290">
      <v-card class="fontSarabun">
        <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
        <v-card-text class="body"
          >Order : {{ dataForReceive.OrderNumber }}</v-card-text
        ><v-card-text class="body"
          >เลขที่บิลซ่อม : {{ dataForReceive.repairDocNumber }}
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="receiveShowPop = false">Cancel</v-btn>
          <v-btn
            text
            @click="FacReceiveConfirm()"
            color="error"
            :loading="loadingBtn"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- POPUP ปฎิทิน -->
    <v-dialog
      v-model="dataFilter.dateBetween.showDialog"
      max-height="300"
      max-width="300"
      class="fontSarabun"
    >
      <v-date-picker
        v-model="
          $store.state.FacToQa.qaRepairBill.filterValuesMaster.billDateBetween
        "
        range
        color="blue-grey lighten-2"
        @change="filterDateBetween()"
      ></v-date-picker>
    </v-dialog>

    <!-- Qa ยืนยันรับงานกลับจาก Fac -->
    <v-dialog v-model="qaReceiveShowPop" max-width="290">
      <v-card class="fontSarabun">
        <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
        <v-card-text class="body"
          >Order : {{ dataForReceive.OrderNumber }}</v-card-text
        >
        <v-card-text class="body"
          >เลขที่บิลซ่อม : {{ dataForReceive.repairDocNumber }}</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="qaReceiveShowPop = false">Cancel</v-btn>
          <v-btn text @click="qaReceiveconfirm()" color="error">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout === 0 ? 1500 : snackbar.timeout"
      top
    >
      <div class="fontSarabun fontSize16 text-center">
        {{ snackbar.title }}
        <v-icon small class="ml-1" :color="snackbar.color">{{
          snackbar.icon
        }}</v-icon>
      </div>
    </v-snackbar>
  </v-app>
</template>

<script>
import apiFacToQa from "../../services/apiFacToQa";
import apiCreatePDF from "../../services/apiCreatePDF";

export default {
  name: "qabillrepair-master",
  data() {
    return {
      loadingBtn: false,
      loadingPage: false,
      //เพิ่ม
      qaReceiveShowPop: false,
      receiveShowPop: false,
      dataForReceive: {
        qaRepair_ID: 0,
        OrderNumber: "",
        DocNumber: "",
        ItemBill: []
      },
      dataReceive: [],
      dataMaster: [],
      dataMaster2: [],
      filterqaJobNumber: [],
      dataFilter: {
        dateBetween: {
          showDialog: false
        },
        isFacReceive: false,
        isPrint: false,
        isQAReceive: false,
        billRepairFac: false,
        reasonShowPop: false,
        dataReason: []
      },
      sumBill: {
        TotalQty: 0,
        TotalFinishQty: 0,
        ToQa: 0,
        Repair: 0
      },
      dataInput: [],
      dataprop: {
        ItemBill: ""
      },
      snackbar: {
        show: false,
        title: "",
        icon: "",
        color: "",
        timeout: 0
      }
    };
  },
  async mounted() {
    this.$store.state.loadingPage = true;
    setTimeout(async () => {
      if (this.$store.state.FacToQa.qaRepairBill.isDataFilterPage) {
        await this.$store.dispatch({
          type: "SET_filterQARepairMaster",
          setDefault: false,
          //TEMPLATE Filter Values
          valuesFilter: {
            orderFilter: null,
            valuesFactory: null,
            valuesTeamSales: null,
            billDateBetween: null,
            showDate: null
          }
        });
      } else {
        await this.$store.dispatch({
          type: "SET_filterQARepairMaster",
          setDefault: true,
          valuesFilter: {}
        });
      }
      await this.loadDataMaster();
      setTimeout(() => {
        this.$store.state.loadingPage = false;
      }, 500);
    }, 1000);
  },
  methods: {
    async loadDataMaster() {
      this.dataMaster = await apiFacToQa.getQaBillRepair({
        orderFilter: this.$store.state.FacToQa.qaRepairBill.filterValuesMaster
          .orderFilter,
        salesTeam: this.$store.state.FacToQa.qaRepairBill.filterValuesMaster
          .valuesTeamSales,
        ProductionTeam: this.$store.state.FacToQa.qaRepairBill
          .filterValuesMaster.valuesFactory,
        billDate: this.$store.state.FacToQa.qaRepairBill.filterValuesMaster
          .billDateBetween
      });
      this.sumDataMaster();
    },
    sumDataMaster() {
      this.sumBill.TotalQty = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalQty,
        0
      );
      this.sumBill.TotalFinishQty = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalFinishQty,
        0
      );
      this.sumBill.ToQa = this.dataMaster.reduce((pv, cv) => pv + cv.ToQa, 0);
    },
    filterDateBetween() {
      this.dataFilter.dateBetween.showDialog = false;
      this.$store.state.FacToQa.qaRepairBill.filterValuesMaster.billDateBetween.sort(
        (a, b) => (a > b ? 1 : b > a ? -1 : 0)
      );
      this.$store.state.FacToQa.qaRepairBill.filterValuesMaster.showDate = `${this.$store.state.FacToQa.qaRepairBill.filterValuesMaster.billDateBetween[0]} ~ ${this.$store.state.FacToQa.qaRepairBill.filterValuesMaster.billDateBetween[1]}`;
    },

    // เพิ่ม ไปหน้า qabillrepair-detail
    async gotoDetail(data) {
      await this.$router.push({
        name: "qabillrepair-detail",
        params: {
          data: data
        }
      });
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

    // เพิ่ม
    async receiveBillRepair(index, checkButton) {
      this.dataReceive = this.dataMaster[index];
      if (checkButton === 0) {
        this.$store.state.facBillRepair.ShowPopupReceiveBill = true;
      } else if (checkButton === 1) {
        this.dataprop.ItemBill = this.dataMaster[index];
        this.$store.state.facBillRepair.billRepairItems = this.dataMaster[
          index
        ];
        this.$store.state.facBillRepair.ShowPopupRepair = true;
      } else if (checkButton === 2) {
        // console.log("รอ QA กดรับ");
      } else if (checkButton === 3) {
        // console.log("QA กดรับ");

        this.qaReceiveShowPop = true;
      }
    },

    facReceiveRepairBill({
      qaRepair_ID,
      OrderNumber,
      repairDocNumber,
      ItemBill
    }) {
      this.dataForReceive = {
        qaRepair_ID: qaRepair_ID,
        OrderNumber: OrderNumber,
        repairDocNumber: repairDocNumber,
        ItemBill: ItemBill
      };
      this.receiveShowPop = true;
    },
    async FacReceiveConfirm() {
      this.loadingBtn = true;
      const { result } = await apiFacToQa.receiveBillRepair({
        qaRepair_ID: this.dataForReceive.qaRepair_ID,
        empCode: this.$store.state.username
      });
      if (result === "ok") {
        this.snackbar = {
          show: true,
          title: "สำเร็จ",
          icon: "mdi-shield-check",
          color: "success",
          timeout: 2500
        };
        setTimeout(async () => {
          await this.loadDataMaster();
          this.dataMaster2 = this.dataMaster;
          const dataFilter = this.dataMaster.filter(
            ({ qaRepairStatus }) => qaRepairStatus.trim() === ""
          );
          if (dataFilter.length > 0) {
            this.dataMaster = dataFilter;
          } else {
            this.dataMaster2 = [];
            this.dataFilter.isQAReceive = !this.dataFilter.isQAReceive;
          }
          this.loadingBtn = false;
          this.receiveShowPop = false;
        }, 1000);
      } else {
        this.snackbar = {
          show: true,
          title: "ไม่สำเร็จ",
          icon: "mdi-shield-check",
          color: "orange",
          timeout: 2500
        };
        this.loadingBtn = false;
      }
    },

    QaReceiveRepairBill({ OrderNumber, repairDocNumber, ItemBill }) {
      this.dataForReceive = {
        OrderNumber: OrderNumber,
        repairDocNumber: repairDocNumber,
        ItemBill: ItemBill
      };
      this.qaReceiveShowPop = true;
      // console.log(this.dataForReceive);
    },

    async qaReceiveconfirm() {
      this.loadingBtn = true;
      const { result } = await apiFacToQa.qaReceiveBillReapair({
        ItemBill: this.dataForReceive.ItemBill
      });
      if (result === "ok") {
        this.snackbar = {
          show: true,
          title: "สำเร็จ",
          icon: "mdi-shield-check",
          color: "success",
          timeout: 2500
        };
        setTimeout(async () => {
          await this.loadDataMaster();
          this.dataMaster2 = this.dataMaster;
          const dataFilter = this.dataMaster.filter(
            ({ qaRepairStatus }) => qaRepairStatus.trim() === "2"
          );
          if (dataFilter.length > 0) {
            this.dataMaster = dataFilter;
          } else {
            this.dataMaster2 = [];
            this.dataFilter.isQAReceive = !this.dataFilter.isQAReceive;
          }
          this.loadingBtn = false;
          this.qaReceiveShowPop = false;
        }, 1000);
      } else {
        this.snackbar = {
          show: true,
          title: "ไม่สำเร็จ",
          icon: "mdi-shield-check",
          color: "orange",
          timeout: 2500
        };
        //this.loadingBtn = false;
      }
      this.qaReceiveShowPop = false;
    },

    reasonDetail(item) {
      this.dataReason = item;
      this.$store.state.facBillRepair.reasonShowPop = true;
    },

    async printBillRepair(data) {
      this.$store.state.loadingPage = true;
      await apiCreatePDF.printBillRepairFac(data);
      setTimeout(() => {
        this.$store.state.loadingPage = false;
      }, 1000);
    },

    async cancelSentQa(data) {
      if (data.qaRepairStatus.trim() === "") {
        //
      } else if (data.qaRepairStatus === "2") {
        //cancelBillRepairFromFac
        await apiFacToQa.cancelBillRepairFromFac({
          qaRepair_ID: data.qaRepair_ID
        });
      }
    },
    actionToolBar(value) {
      switch (value) {
        case 1:
          this.dataFilter.isFacReceive = !this.dataFilter.isFacReceive;
          if (this.dataFilter.isFacReceive) {
            this.dataMaster2 = this.dataMaster;
            this.dataMaster = this.dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === ""
            );
          } else {
            this.dataMaster = this.dataMaster2;
            this.dataMaster2 = [];
          }
          break;
        case 2:
          this.dataFilter.isQAReceive = !this.dataFilter.isQAReceive;
          if (this.dataFilter.isQAReceive) {
            this.dataMaster2 = this.dataMaster;
            this.dataMaster = this.dataMaster.filter(
              ({ qaRepairStatus }) => qaRepairStatus.trim() === "2"
            );
          } else {
            this.dataMaster = this.dataMaster2;
            this.dataMaster2 = [];
          }
          break;
        case 3:
          this.dataFilter.isPrint = !this.dataFilter.isPrint;
          break;

        default:
          break;
      }
    },
    async findBillByJob() {
      this.loadingBtn = true;
      const docPrefix = this.$store.state.FacToQa.qaRepairBill.filterValuesMaster.jobScan.substring(
        0,
        2
      );
      let isJob = 0;
      if (docPrefix === "BQ") {
        isJob = 1;
      } else if (docPrefix === "QA") {
        isJob = 2;
      } else if (docPrefix === "RP") {
        isJob = 3;
      }
      setTimeout(async () => {
        if (isJob !== 0 && docPrefix) {
          const res = await apiFacToQa.findRepairBillByJob({
            DocPrefix: this.$store.state.FacToQa.qaRepairBill.filterValuesMaster
              .jobScan,
            isJob: isJob
          });
          if (res.length > 0) {
            this.dataMaster = res;
            this.sumDataMaster();
          } else {
            this.snackbar = {
              show: true,
              title: "ไม่พบข้อมูล",
              icon: "mdi-shield-check",
              color: "orange",
              timeout: 2500
            };
          }
        } else {
          this.snackbar = {
            show: true,
            title: "ไม่พบข้อมูล",
            icon: "mdi-shield-check",
            color: "orange",
            timeout: 2500
          };
        }
        this.loadingBtn = false;
      }, 200);
    }
  }
};
</script>

<style>
.textInLine {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.isFinish {
  filter: brightness(70%);
  background-color: #ffffff;
}

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
.HeaderQA {
  background-color: #f3fdc8;
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
}
.isToFact {
  background-color: rgb(207, 240, 189);
}
.isToQa {
  background-color: rgb(217, 237, 255);
}
.billWaitQa {
  background-color: rgba(159, 243, 222, 0.575);
}
.billFinish {
  background-color: rgba(46, 209, 120, 0.575);
}
.myImg {
  filter: brightness(62%);
}
</style>
