<template>
  <v-app class="px-1" v-if="!$store.state.loadingPage">
    <div class="fontPrompt fontSize26" align="center"><b>สถานะบิลโอน</b></div>
    <v-card class="fontSarabun">
      <v-form @submit.prevent="submit">
        <v-simple-table dense>
          <tr>
            <td width="150">
              <div class="mt-2 mx-2">
                <v-text-field
                  label="ORDER NO."
                  v-model="$store.state.FacToQa.filterQaBill.orderFilter"
                  required
                  outlined
                  dense
                />
              </div>
            </td>
            <td width="200">
              <div class="mt-2">
                <v-text-field label="รหัสลูกค้า" required outlined dense />
              </div>
            </td>
            <td width="400" colspan="2">
              <div class="mt-2 mx-3">
                <v-select
                  label="FACTORY"
                  multiple
                  outlined
                  dense
                  v-model="$store.state.FacToQa.filterQaBill.factory.values"
                  :items="$store.state.FacToQa.filterQaBill.factory.factoryShow"
                  item-text="name"
                  item-value="value"
                />
              </div>
            </td>
            <td width="80" rowspan="2">
              <div align="center">
                <v-btn
                  color="success"
                  type="submit"
                  :loading="loadingBtn"
                  dense
                  small
                  width="40"
                  class="mt-n8"
                  ><div class="fontSize14">ค้นหา</div>
                </v-btn>
              </div>
              <!-- <div align="center" class="mt-1">
                <v-btn
                  color="red"
                  dark
                  :loading="loadingBtn"
                  dense
                  small
                  width="40"
                  @click="$router.go(-1)"
                  ><div class="fontSize14">กลับ</div>
                </v-btn>
              </div> -->
            </td>
          </tr>
          <tr>
            <td>
              <div class="mx-2 mt-n3">
                <v-select
                  label="SalesTeam"
                  required
                  outlined
                  dense
                  item-text="name"
                  item-value="value"
                  multiple
                  v-model="$store.state.FacToQa.filterQaBill.teamSales.values"
                  :items="
                    $store.state.FacToQa.filterQaBill.teamSales.customerShow
                  "
                />
              </div>
            </td>
            <td colspan="1">
              <div class="mt-n3">
                <v-select
                  label="สถานะงาน"
                  multiple
                  outlined
                  dense
                  v-model="$store.state.FacToQa.filterQaBill.statusBill.values"
                  :items="
                    $store.state.FacToQa.filterQaBill.statusBill.statusShow
                  "
                  item-text="name"
                  item-value="value"
                />
              </div>
            </td>
            <td colspan="1" width="250">
              <div class="ml-3 mt-n3">
                <v-text-field
                  v-model="
                    $store.state.FacToQa.filterQaBill.dateBetween.showDate
                  "
                  outlined
                  label="วันที่Facส่งงาน"
                  readonly
                  append-icon="mdi-calendar-month"
                  @click="showDialogDate = true"
                  dense
                />
              </div>
            </td>
            <td colspan="1" width="150">
              <div class="mb-7 mt-n3" align="center">
                <v-btn color="grey lighten-2" small dense>
                  <div class="fontSize16">REPORT</div>
                </v-btn>
              </div>
            </td>
          </tr>
        </v-simple-table>
      </v-form>
    </v-card>
    <v-toolbar max-height="60" class="fontPrompt black mt-n4">
      <div class="pt-6 ml-10">
        <v-form @submit.prevent="getBillByJob()">
          <v-text-field
            label="QRCODE SCAN"
            v-model="qrcodeScan"
            required
            outlined
            dense
            dark
            append-icon="mdi-barcode"
            class="mx-n11"
          />
        </v-form>
      </div>
      <div class="ml-n7">
        <div align="center" class="yellow--text fontSarabun">
          จำนวนรวมทั้งหมด
        </div>
        <div align="center" class="yellow--text">
          {{ sumBill.TotalQty.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="blue--text fontSarabun">ผ่าน QA</div>
        <div align="center" class="blue--text">
          {{ sumBill.QAFinish.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="red--text fontSarabun">รอตรวจ</div>
        <div align="center" class="red--text">
          {{
            (
              sumBill.TotalQty -
              sumBill.QAFinish -
              sumBill.Repair
            ).toLocaleString()
          }}
        </div>
      </div>
      <v-Spacer />
      <div>
        <div align="center" class="orange--text fontSarabun">ส่งซ่อม</div>
        <div align="center" class="orange--text">
          {{ sumBill.Repair.toLocaleString() }}
        </div>
      </div>
      <v-Spacer />
      <div class="">
        <v-btn
          color="blue"
          dark
          @click="
            $store.state.FacToQa.filterQaBill.isShowStatus = !$store.state
              .FacToQa.filterQaBill.isShowStatus
          "
          dense
          small
          width="110"
          ><div class="fontSize14">แสดงสถานะงาน</div>
        </v-btn>
      </div>
      <v-Spacer />
      <div>
        <v-badge
          :color="countReceiveBill() ? 'red' : ''"
          :content="countReceiveBill()"
          overlap
        >
          <v-btn
            color="green"
            dense
            small
            @click="receiveBill()"
            :disabled="$store.state.FacToQa.filterQaBill.isPrint"
            dark
            >รับงาน</v-btn
          >
        </v-badge>
      </div>
      <v-Spacer />
      <div>
        <v-btn
          color="blue"
          dark
          dense
          small
          fab
          @click="
            $store.state.FacToQa.filterQaBill.isPrint = !$store.state.FacToQa
              .filterQaBill.isPrint
          "
          :disabled="$store.state.FacToQa.filterQaBill.isReceive"
        >
          <v-icon>print</v-icon>
        </v-btn>
      </div>
    </v-toolbar>

    <v-card class="fontSarabun pb-16" v-if="!loadingPage">
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
              <th
                width="700"
                class="HeaderQA"
                v-if="!$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14"><b>รายการ</b></div>
              </th>

              <th
                width="80"
                class="HeaderQA"
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14">
                  <b>QA ผ่าน</b>
                </div>
              </th>
              <th
                width="80"
                class="HeaderQA"
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14"><b>รอตรวจ</b></div>
              </th>
              <th
                width="80"
                class="HeaderQA"
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14">
                  <b>กำลังซ่อม</b>
                </div>
              </th>
              <th
                width="80"
                class="HeaderQA"
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14">
                  <b>ซ่อมสะสม</b>
                </div>
              </th>
              <th
                width="100"
                class="HeaderQA"
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div align="center" class="mx-n2 fontSize14">
                  <b>ผู้โอน FAC</b>
                </div>
              </th>

              <th
                width="80"
                class="HeaderQA"
                v-if="
                  $store.state.FacToQa.filterQaBill.isReceive ||
                    $store.state.FacToQa.filterQaBill.isPrint
                "
              >
                <div align="center" class="mx-n2 fontSize14">
                  <b>{{
                    $store.state.FacToQa.filterQaBill.isReceive
                      ? "รับงานจากFAC"
                      : "Print Bill"
                  }}</b>
                </div>
              </th>
            </tr>
          </thead>

          <tbody class="fontSize8">
            <tr
              v-for="(bill, billIndex) in dataMaster"
              :key="billIndex"
              v-bind:class="{
                waitReceive: bill.qaBillStatus.trim() === '',
                isReceived:
                  bill.qaBillStatus.trim() !== '' &&
                  $store.state.FacToQa.filterQaBill.isReceive
              }"
            >
              <td
                class="borderRightGrey borderTopGrey borderLeftGrey"
                @click="gotoDetail(billIndex)"
              >
                <div class="mx-n3">
                  <div align="left" class="fontSize16">
                    <b>{{ bill.OrderNumber }}</b>
                  </div>
                  <div class="fontSize12">
                    เลขบิล: <b>{{ bill.qaDocNumber }}</b>
                  </div>
                  <div class="fontSize12">
                    วันที่ส่งบิล: {{ $moment(bill.billDate).format("dd") }}
                    {{ $moment(bill.billDate).format("L") }}
                  </div>
                  <div
                    class="fontSize12 mr-n2"
                    v-bind:class="{
                      'green--text': bill.LateCusDate >= 7,
                      'orange--text':
                        bill.LateCusDate >= 0 && bill.LateCusDate < 7,
                      'red--text': bill.LateCusDate < 0
                    }"
                  >
                    กำหนดส่งออก:
                    <span v-if="bill.LateCusDate > -2000">
                      {{ $moment(bill.CusDueDate).format("dd") }}
                      {{ $moment(bill.CusDueDate).format("L") }}
                      <b>
                        (
                        <span class="fontSize14">{{ bill.LateCusDate }}</span>
                        วัน)</b
                      >
                    </span>
                    <span v-if="bill.LateCusDate <= -2000">ไม่มีข้อมูล </span>
                  </div>
                </div>
              </td>
              <td
                :class="
                  $store.state.FacToQa.filterQaBill.isShowStatus
                    ? 'borderTopGrey'
                    : 'borderTopGrey borderRightGrey'
                "
                @click="gotoDetail(billIndex)"
              >
                <div class="mx-n2 fontSize16" align="center">
                  <b>{{ bill.TotalQty.toLocaleString() }}</b>
                </div>
              </td>
              <td
                class="borderRightGrey borderTopGrey"
                @click="gotoDetail(billIndex)"
                v-if="!$store.state.FacToQa.filterQaBill.isShowStatus"
              >
                <div class="ml-n4" align="right">
                  <v-row dense>
                    <!-- :cols="12 / Math.ceil(bill.ItemBill.length)" -->
                    <v-col
                      :cols="2"
                      v-for="(item, indexItem) in bill.ItemBill"
                      :key="indexItem"
                      class="mx-1"
                    >
                      <v-img :src="item.NewPict"
                        ><div
                          align="left"
                          class="fontPrompt fontSize10 grey--text"
                        >
                          {{ item.OrderItemNo }}
                        </div>
                      </v-img>
                      <div align="center" class="fontSize10 mx-n1 textInLine">
                        {{ item.ProductCode }}
                      </div>
                      <div align="center" class="fontSize12">
                        <b>{{ item.QtyItem.toLocaleString() }}</b>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </td>

              <td
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
                class="mx-n2 borderLeftYellow borderRightGrey borderTopGrey"
                align="center"
                @click="gotoDetail(billIndex)"
              >
                <div class="fontSize16">
                  {{ bill.TotalFinishQty.toLocaleString() }}
                </div>
              </td>
              <td
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
                class="mx-n2 borderRightYellow borderTopGrey"
                align="center"
                @click="gotoDetail(billIndex)"
              >
                <div class="fontSize16">
                  {{
                    (
                      bill.TotalQty -
                      bill.TotalFinishQty -
                      (bill.TotalRepairQty - bill.TotalRepairFinish)
                    ).toLocaleString()
                  }}
                </div>
              </td>
              <td
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
                class="mx-n2 borderRightGrey borderTopGrey"
                align="center"
                @click="gotoDetail(billIndex)"
              >
                <div class="fontSize16">
                  {{
                    (
                      bill.TotalRepairQty - bill.TotalRepairFinish
                    ).toLocaleString()
                  }}
                </div>
              </td>
              <td
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
                class="mx-n2 borderRightBlue borderTopGrey"
                align="center"
                @click="gotoDetail(billIndex)"
              >
                <div class="fontSize16">
                  {{ bill.TotalRepairQty.toLocaleString() }}
                </div>
              </td>
              <td
                v-if="$store.state.FacToQa.filterQaBill.isShowStatus"
                class="mx-n2 borderRightGrey borderTopGrey"
                align="center"
                @click="gotoDetail(billIndex)"
              >
                <div class="fontSize14">
                  {{ bill.Sender }}
                </div>
              </td>

              <td
                class="borderRightGrey borderTopGrey"
                v-if="
                  $store.state.FacToQa.filterQaBill.isReceive ||
                    $store.state.FacToQa.filterQaBill.isPrint
                "
              >
                <div class="mx-n5" align="center">
                  <v-btn
                    color="success"
                    small
                    dense
                    v-if="
                      $store.state.FacToQa.filterQaBill.isReceive &&
                        bill.qaBillStatus.trim() === '' &&
                        bill.senderCode !== $store.state.username &&
                        $store.state.levelUser.isQATeam.filter(
                          obj =>
                            obj.QATeam === bill.saleManager &&
                            obj.isReceive === true
                        ).length > 0
                    "
                    :loading="loadingBtn"
                    ><div
                      class="fontSize10 mx-n3"
                      @click="showDialogReceive(billIndex)"
                    >
                      ยืนยัน<br />รับงาน
                    </div>
                  </v-btn>
                  <v-btn
                    color="blue"
                    dark
                    dense
                    small
                    fab
                    @click="printBillQa(bill)"
                    v-if="$store.state.FacToQa.filterQaBill.isPrint"
                  >
                    <v-icon>print</v-icon>
                  </v-btn>
                </div>
                <div
                  align="center"
                  v-if="
                    $store.state.FacToQa.filterQaBill.isReceive &&
                      bill.qaBillStatus.trim() === '' &&
                      bill.senderCode === $store.state.username
                  "
                >
                  <v-btn
                    color="red"
                    dark
                    small
                    dense
                    @click="deleteBill(billIndex)"
                    ><div class="fontSize10 mx-n3">ลบบิล</div>
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <!-- POPUP ปฎิทิน -->
    <v-dialog
      v-model="showDialogDate"
      max-height="300"
      max-width="300"
      class="fontSarabun"
    >
      <v-date-picker
        v-model="$store.state.FacToQa.filterQaBill.dateBetween.values"
        range
        color="blue-grey lighten-2"
        @change="filterDateBetween()"
      ></v-date-picker>
    </v-dialog>

    <!-- Popup ยืนยันรับ -->
    <v-dialog v-model="dialogConfirmReceive.showDialog" max-width="400">
      <v-card class="fontPrompt">
        <v-card-title primary-title class="px-n3">กรุณายืนยัน</v-card-title>
        <v-card-text class="body px-n3"
          >{{ `คุณ ${$store.getters.fullName} ต้องการรับบิลนี้ใช่หรือไม่ ?` }}
        </v-card-text>
        <v-card-actions class="mt-n3">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              (dialogConfirmReceive.showDialog = false),
                (dialogConfirmReceive.indexReceive = null)
            "
            >Cancel</v-btn
          >
          <v-btn
            text
            color="green"
            @click="confirmReceive()"
            :loading="loadingBtn"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Popup ลบ -->
    <v-dialog v-model="dialogDeleteBill.showDialog" max-width="400">
      <v-card class="fontPrompt">
        <v-card-title primary-title class="px-n3">กรุณายืนยัน</v-card-title>
        <v-card-text class="body px-n3"
          >{{ `คุณ ${$store.getters.fullName} ต้องการลบบิลนี้ใช่หรือไม่ ?` }}
        </v-card-text>
        <v-card-actions class="mt-n3">
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="
              (dialogDeleteBill.showDialog = false),
                (dialogDeleteBill.indexReceive = null)
            "
            >Cancel</v-btn
          >
          <v-btn text color="red" @click="confirmDelete()" :loading="loadingBtn"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout === 0 ? 1500 : snackbar.timeout"
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
  name: "qabill-master",
  components: {},
  data() {
    return {
      loadingBtn: false,
      loadingPage: false,
      snackbar: {
        show: false,
        title: "",
        icon: "",
        color: "",
        timeout: 0
      },
      showDialogDate: false,
      dataMaster: [],
      sumBill: {
        TotalQty: 0,
        QAFinish: 0,
        Repair: 0
      },
      dialogConfirmReceive: {
        showDialog: false,
        indexReceive: null
      },
      dialogDeleteBill: {
        showDialog: false,
        indexReceive: null
      },
      qrcodeScan: ""
    };
  },
  async mounted() {
    this.$store.state.loadingPage = true;
    setTimeout(async () => {
      this.loadingBtn = true;
      if (this.$store.state.FacToQa.qaBillMaster.isDataFilterPage) {
        await this.$store.dispatch({
          type: "SET_filterQaBillMaster",
          setDefault: false,
          //TEMPLATE Filter Values
          valuesFilter: {
            orderFilter: null,
            valuesFact: null,
            valuesStatus: null,
            valuesTeamSales: null,
            valuesBillDate: null,
            isReceive: null,
            isPrint: null,
            isShowStatus: null
          }
        });
      } else {
        await this.$store.dispatch({
          type: "SET_filterQaBillMaster",
          setDefault: true,
          valuesFilter: {}
        });
      }
      await this.loadDataMaster();
      setTimeout(() => {
        this.$store.state.loadingPage = false;
        this.loadingBtn = false;
      }, 500);
    }, 1200);
  },
  methods: {
    async loadDataMaster() {
      this.dataMaster = await apiFacToQa.getQaBill({
        filterOrder: this.$store.state.FacToQa.filterQaBill.orderFilter,
        ProductionTeam: this.$store.state.FacToQa.filterQaBill.factory.values,
        billDate: this.$store.state.FacToQa.filterQaBill.dateBetween.values,
        statusBill: this.$store.state.FacToQa.filterQaBill.statusBill.values,
        salesTeam: this.$store.state.FacToQa.filterQaBill.teamSales.values
      });
      // console.log(this.dataMaster);
      this.sumBill.TotalQty = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalQty,
        0
      );
      this.sumBill.QAFinish = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalFinishQty,
        0
      );
      this.sumBill.Repair = this.dataMaster.reduce(
        (pv, cv) => pv + cv.TotalRepairQty,
        0
      );
    },
    filterDateBetween() {
      this.showDialogDate = false;
      this.$store.state.FacToQa.filterQaBill.dateBetween.values.sort((a, b) =>
        a > b ? 1 : b > a ? -1 : 0
      );
      this.$store.state.FacToQa.filterQaBill.dateBetween.showDate = `${this.$store.state.FacToQa.filterQaBill.dateBetween.values[0]} ~ ${this.$store.state.FacToQa.filterQaBill.dateBetween.values[1]}`;
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
      await this.$router.push({
        name: "qabill-detail",
        params: {
          data: this.dataMaster[index]
        }
      });
    },
    countReceiveBill() {
      const count = this.dataMaster.filter(
        ({ qaBillStatus }) => qaBillStatus.trim() === ""
      );
      return count.length;
    },
    receiveBill() {
      this.$store.state.FacToQa.filterQaBill.isReceive = !this.$store.state
        .FacToQa.filterQaBill.isReceive;
      if (this.$store.state.FacToQa.filterQaBill.isReceive) {
        this.dataMaster.sort((a, b) =>
          a.qaBillStatus > b.qaBillStatus
            ? 1
            : b.qaBillStatus > a.qaBillStatus
            ? -1
            : 0
        );
      } else {
        this.dataMaster.sort((a, b) =>
          a.billDate > b.billDate ? 1 : b.billDate > a.billDate ? -1 : 0
        );
      }
    },
    showDialogReceive(index) {
      this.dialogConfirmReceive.showDialog = true;
      this.dialogConfirmReceive.indexReceive = index;
      // console.log(this.dataMaster[index]);
    },
    async confirmReceive() {
      this.loadingBtn = true;
      const data = {
        qaBill_ID: this.dataMaster[this.dialogConfirmReceive.indexReceive]
          .qaBill_ID,
        receiver: this.$store.state.username
      };
      // console.log(data);
      const { result } = await apiFacToQa.receiveBillFacToQa(data);
      if (result === "ok") {
        this.dataMaster[this.dialogConfirmReceive.indexReceive].qaBillStatus =
          "1";
        this.dialogConfirmReceive.showDialog = false;
        this.dialogConfirmReceive.indexReceive = null;
        this.snackbar = {
          show: true,
          title: "บันทึกข้อมูลสำเร็จแล้ว",
          icon: "mdi-shield-check",
          color: "green",
          timeout: 1500
        };
        this.loadingBtn = false;
      } else {
        this.dialogConfirmReceive.showDialog = false;
        this.dialogConfirmReceive.indexReceive = null;
        this.snackbar = {
          show: true,
          title: "ไม่สามารถรับได้",
          icon: "mdi-close",
          color: "red",
          timeout: 3000
        };
        this.loadingBtn = false;
      }
    },

    async getBillByJob() {
      // const a = "BQ22000026";
      // console.log(this.qrcodeScan);
      let isJob = 0;

      if (
        this.qrcodeScan.length === 10 &&
        this.qrcodeScan.substring(0, 2) === "BQ"
      ) {
        isJob = 1;
        const { result, data } = await apiFacToQa.getBillByJob({
          qaJobNumber: this.qrcodeScan,
          isJob: isJob
        });
        if (result === "ok") {
          await this.$router.push({
            name: "qabill-detail",
            params: {
              data: data
            }
          });
        } else {
          this.snackbar = {
            show: true,
            title: "ไม่พบข้อมูล",
            icon: "mdi-close",
            color: "red",
            timeout: 3000
          };
        }
      } else if (
        this.qrcodeScan.length === 11 &&
        this.qrcodeScan.substring(0, 2) === "QA"
      ) {
        isJob = 2;
        const { result, data } = await apiFacToQa.getBillByJob({
          qaJobNumber: this.qrcodeScan,
          isJob: isJob
        });
        if (result === "ok") {
          await this.$router.push({
            name: "qabill-detail",
            params: {
              data: data
            }
          });
        } else {
          this.snackbar = {
            show: true,
            title: "ไม่พบข้อมูล",
            icon: "mdi-close",
            color: "red",
            timeout: 3000
          };
        }
      } else {
        this.snackbar = {
          show: true,
          title: "ข้อมูลไม่ถูกต้อง",
          icon: "mdi-close",
          color: "red",
          timeout: 3000
        };
      }
    },
    deleteBill(billIndex) {
      // console.log(this.dataMaster[billIndex].qaDocNumber);
      this.dialogDeleteBill.showDialog = true;
      this.dialogDeleteBill.indexReceive = billIndex;
      // console.log(billIndex);
    },
    async confirmDelete() {
      // console.log(
      //   this.dataMaster[this.dialogDeleteBill.indexReceive].qaBill_ID
      // );
      const { result } = await apiFacToQa.deleteBillQA({
        qaBill_ID: this.dataMaster[this.dialogDeleteBill.indexReceive].qaBill_ID
      });
      if (result === "ok") {
        this.dataMaster.splice(this.dialogDeleteBill.indexReceive, 1);
        this.snackbar = {
          show: true,
          title: "ลบข้อมูลสำเร็จแล้ว",
          icon: "mdi-shield-check",
          color: "green",
          timeout: 1500
        };
        this.dialogDeleteBill.showDialog = false;
        this.dialogDeleteBill.indexReceive = null;
      }
    },
    // เพิ่มปริ้น printBillQa
    async printBillQa(data) {
      await apiCreatePDF.printBillQa(data);
    }
  }
};
</script>

<style>
.isReceived {
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

.borderRightYellow {
  border-right: 1px solid rgb(218, 221, 40);
}
.borderLeftYellow {
  border-left: 1px solid rgb(218, 221, 40);
}
.borderTopYellow {
  border-top: 1px solid rgb(245, 247, 148);
}
.borderButtomYellow {
  border-bottom: 1px solid rgb(245, 247, 148);
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

.textInLine {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: clip;
}

.waitReceive {
  background-color: #f3fdc8;
}

.HeaderQA {
  background-color: #dadada;
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
}
</style>
