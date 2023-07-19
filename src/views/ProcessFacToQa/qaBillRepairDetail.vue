<template>
  <v-app v-if="!$store.state.loadingPage">
    <v-card class="mt-5 fontSarabun fontSize20">
      <div class="fontSize26" align="center">
        <b>รายละเอียดบิลซ่อม</b>
      </div>

      <v-row class="ml-1 mt-4">
        <v-col>
          <div>
            <span> <b>ผู้ส่งซ่อม : </b>{{ dataItemRepair.Sender }} </span>
          </div>
          <div class="mt-2">
            <b>วันที่ส่งซ่อม : </b>
            {{ $moment(dataItemRepair.repairDate).format("L") }} (เวลา
            {{ $moment(dataItemRepair.repairDate).format("LT") }} น.)
          </div>
          <div class="mt-2">
            <b>เลขที่บิลซ่อม : </b> {{ dataItemRepair.repairDocNumber }}
          </div>
          <div class="mt-2">
            <b>เลขที่บิล : </b>{{ dataItemRepair.qaDocNumber }}
          </div>
          <div
            class=""
            v-if="
              (dataItemRepair.qaRepairStatus.trim() === '1' ||
                dataItemRepair.qaRepairStatus.trim() === '2') &&
                $store.state.levelUser.isFacTeam.filter(
                  obj =>
                    obj.FacTeam === dataItemRepair.ProductionTeam &&
                    obj.isReceive === true
                ).length > 0
            "
          >
            <v-checkbox
              label="ส่งงานทั้งหมด"
              v-model="checkBoxSentAll"
              @click="sentAll()"
              color="blue"
            ></v-checkbox>
          </div>
        </v-col>
        <v-col>
          <div><b>OrderNumber : </b>{{ dataItemRepair.OrderNumber }}</div>
          <div class="mt-2">
            <b>โอนจาก QA Team : </b
            >{{
              $store.state.FacToQa.filterQaBill.teamSales.customerShow
                .filter(({ value }) => +value === +dataItemRepair.cusStatus)
                .map(({ name }) => name)[0]
            }}
          </div>
          <div class="mt-2">
            <b>โอนไป Factory : </b>{{ dataItemRepair.ProductionTeam }}
          </div>
          <div class="mt-2">
            <b>ผู้รับ :</b>
            {{ dataItemRepair.Receiver ? dataItemRepair.Receiver : "________" }}
          </div>
          <div class="mt-2">
            <b>วันที่รับ : </b
            >{{
              dataItemRepair.receiveDate
                ? $moment(dataItemRepair.receiveDate).format("L")
                : "________"
            }}
            (เวลา
            {{
              dataItemRepair.receiveDate
                ? $moment(dataItemRepair.receiveDate).format("LT")
                : "________"
            }}
            น.)
          </div>
        </v-col>
      </v-row>

      <v-simple-table dense style="width: 100%" class="mt-5">
        <template v-slot:default>
          <thead>
            <tr class="amber lighten-4">
              <th class="borderHeaderTopLine" width="20" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">NO.</div>
              </th>
              <th class="borderHeaderTopLine" width="120" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">รูปสินค้า</div>
              </th>
              <th class="borderHeaderTopLine" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">รายละเอียด</div>
              </th>
              <th class="borderHeaderTopLine" width="200" colspan="3">
                <div align="center" class="fontSize16 mx-n3">อาการเสีย</div>
              </th>
              <th class="borderHeaderTopLine" width="20" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">
                  ส่งซ่อมทั้งหมด
                </div>
              </th>
              <th class="borderHeaderTopLine" width="20" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">ซ่อมเสร็จ</div>
              </th>
              <th class="borderHeaderTopLine" width="20" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">ค้างซ่อม</div>
              </th>
              <th class="borderHeaderTopLine" width="60" rowspan="2">
                <div align="center" class="fontSize16 mx-n3">ส่งคืนให้ QA</div>
              </th>
            </tr>

            <tr class="amber lighten-4">
              <th class="borderHeaderTopLine" width="100">
                <div align="center" class="fontSize16 mx-n3">แผนก</div>
              </th>
              <th class="borderHeaderTopLine" width="130">
                <div align="center" class="fontSize16 mx-n3">อาการ</div>
              </th>
              <th class="borderHeaderTopLine" width="30">
                <div align="center" class="fontSize16">จน.</div>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr class="grey lighten-3">
              <td colspan="6">
                <div class="fontPrompt fontSize22" align="center">
                  <b>ยอดรวม :</b>
                </div>
              </td>
              <td>
                <div class="fontPrompt fontSize20" align="center">
                  <b>{{
                    dataItemRepair.ItemBill
                      ? dataItemRepair.ItemBill.reduce(
                          (pv, cv) => pv + cv.Qty,
                          0
                        ).toLocaleString()
                      : ""
                  }}</b>
                </div>
              </td>
              <td>
                <div class="fontPrompt fontSize20 blue--text" align="center">
                  <b>{{
                    dataItemRepair.ItemBill
                      ? dataItemRepair.ItemBill.reduce(
                          (pv, cv) => pv + cv.RepairFinish,
                          0
                        ).toLocaleString()
                      : ""
                  }}</b>
                </div>
              </td>
              <td>
                <div class="fontPrompt fontSize20 red--text" align="center">
                  <b>{{
                    dataItemRepair.ItemBill
                      ? dataItemRepair.ItemBill.reduce(
                          (pv, cv) => pv + (cv.Qty - cv.ToQa - cv.RepairFinish),
                          0
                        ).toLocaleString()
                      : ""
                  }}</b>
                </div>
              </td>
              <td>
                <div class="fontPrompt fontSize20 blue--text" align="center">
                  <b>{{
                    dataItemRepair.ItemBill
                      ? dataItemRepair.ItemBill.reduce(
                          (pv, cv) => pv + cv.sentRepair,
                          0
                        ).toLocaleString()
                      : ""
                  }}</b>
                </div>
              </td>
            </tr>
            <!-- loop -->
            <tr
              v-for="(data, index) in dataItemRepair.ItemBill"
              :key="index"
              v-bind:class="{
                finishAllItem: data.RepairFinish === data.Qty,
                isSendItem: data.ToQa > 0
              }"
            >
              <td class="borderHeaderTopLine">
                <div align="center" class="fontSize18">
                  {{ data.repair_Item }}
                </div>
              </td>
              <td class="borderHeaderTopLine">
                <div
                  class="mx-n7"
                  align="center"
                  v-bind:class="{
                    myImg: data.RepairFinish === data.Qty
                  }"
                >
                  <img v-bind:src="`${data.NewPict}`" width="120" />
                </div>
              </td>

              <td class="borderHeaderTopLine" @click="reasonDetail(data)">
                <div align="left" class="fontSize16 mx-n2">
                  <div>
                    <b>{{ data.ProductCode }}</b>
                  </div>
                  <div class="fontSize14">
                    <b>QC FAC :</b> {{ data.QCPerson }}
                  </div>
                  <div class="fontSize14">
                    <b>Job NO :</b> {{ data.qaJobNumber }}
                  </div>
                </div>
              </td>

              <td class="borderHeaderTopLine">
                <div
                  v-for="(r, indexR) in data.reason"
                  :key="indexR"
                  align="left"
                  class="grey--text"
                >
                  {{ r.repairType }}
                </div>
              </td>

              <td class="borderHeaderTopLine">
                <div
                  v-for="(r, indexR) in data.reason"
                  :key="indexR"
                  align="left"
                  class="grey--text"
                >
                  {{ r.reasonType }}
                </div>
              </td>
              <td class="borderHeaderTopLine">
                <div
                  v-for="(r, indexR) in data.reason"
                  :key="indexR"
                  class="mx-n3 grey--text"
                  align="center"
                >
                  {{ r.Qty.toLocaleString() }}
                </div>
              </td>

              <td class="borderHeaderTopLine">
                <div align="center" class="fontSize18 mx-n3">
                  <b>{{ data.Qty.toLocaleString() }}</b>
                </div>
              </td>
              <td class="borderHeaderTopLine">
                <div align="center" class="blue--text fontSize18">
                  {{ data.RepairFinish.toLocaleString() }}
                </div>
              </td>
              <td class="borderHeaderTopLine">
                <div align="center" class="red--text fontSize18 mx-n3">
                  {{
                    (data.Qty - data.ToQa - data.RepairFinish).toLocaleString()
                  }}
                </div>
              </td>
              <td
                class="borderHeaderTopLine"
                v-bind:class="{ isSendItem: data.sentRepair > 0 }"
              >
                <div
                  align="center"
                  class="text-xs-center fontSize18 mx-n3 my-n2"
                  v-if="
                    dataItemRepair.qaRepairStatus.trim() === '1' &&
                      $store.state.levelUser.isFacTeam.filter(
                        obj =>
                          obj.FacTeam === dataItemRepair.ProductionTeam &&
                          obj.isReceive === true
                      ).length > 0
                  "
                >
                  <v-text-field
                    class="mt-5"
                    @click="sentAllItem(data)"
                    v-model="data.sentRepair"
                    type="number"
                    outlined
                    readonly
                    dense
                  >
                  </v-text-field>
                </div>

                <div
                  class="fontSize24 orange--text"
                  align="center"
                  v-if="
                    dataItemRepair.qaRepairStatus.trim() === '2' &&
                      data.ToQa > 0 &&
                      $store.state.levelUser.isFacTeam.filter(
                        obj =>
                          obj.FacTeam === dataItemRepair.ProductionTeam &&
                          obj.isReceive === true
                      ).length > 0
                  "
                >
                  <b>{{ data.ToQa.toLocaleString() }}</b>
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

      <!-- snackbar check ว่ามีการเปลี่ยนเเปลงไหม-->
      <div class="text-center ma-2">
        <v-snackbar
          v-model="snackBarWarning"
          top
          width="1000"
          align="center"
          :timeout="7000"
        >
          <div class="fontSarabun fontSize16 text-center">
            ข้อมูลไม่มีการเปลี่ยนแปลง
            <v-icon small class="ml-1" color="yellow">mdi-shield-check</v-icon>
          </div>
        </v-snackbar>
      </div>

      <!-- ยืนยันรับงาน Status "" -->
      <v-dialog v-model="receiveShowPop" max-width="290">
        <v-card class="fontSarabun">
          <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
          <v-card-text class="body"
            >Order : {{ dataItemRepair.OrderNumber }}</v-card-text
          >
          <v-card-text class="body"
            >เลขที่บิลซ่อม : {{ dataItemRepair.repairDocNumber }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="receiveShowPop = false">Cancel</v-btn>
            <v-btn text @click="receiveconfirm()" color="error">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- ยืนยันส่งงาน Status 1 -->
      <v-dialog v-model="sentRepairItemShowPop" max-width="290">
        <v-card class="fontSarabun">
          <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
          <v-card-text class="body"
            >Order : {{ dataItemRepair.OrderNumber }}</v-card-text
          >
          <v-card-text class="body"
            >เลขที่บิลซ่อม : {{ dataItemRepair.repairDocNumber }}
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="sentRepairItemShowPop = false"
              :loading="loadingBtn"
              >Cancel</v-btn
            >
            <v-btn
              text
              @click="confirmSentItemRepair()"
              color="error"
              :loading="loadingBtn"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Qa ยืนยันรับงานกลับจาก Fac Status 2-->
      <v-dialog v-model="qaReceiveShowPop" max-width="290">
        <v-card class="fontSarabun">
          <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
          <v-card-text class="body"
            >Order : {{ dataItemRepair.OrderNumber }}</v-card-text
          >
          <v-card-text class="body"
            >เลขที่บิลซ่อม : {{ dataItemRepair.repairDocNumber }}</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="qaReceiveShowPop = false">Cancel</v-btn>
            <v-btn text @click="qaReceiveconfirm()" color="green"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-card-actions class="pt-10 mr-n4">
        <v-spacer></v-spacer><v-spacer></v-spacer>
        <v-btn class="mr-4 red" @click="cancel()" dark><div>กลับ</div></v-btn>
        <v-btn
          v-if="
            dataItemRepair.qaRepairStatus.trim() === '' &&
              $store.state.levelUser.isFacTeam.filter(
                obj =>
                  obj.FacTeam === dataItemRepair.ProductionTeam &&
                  obj.isReceive === true
              ).length > 0
          "
          class="mr-7"
          color="success"
          @click="receiveBillRepair(dataItemRepair)"
          >รับงาน</v-btn
        >

        <!--ปุ่มสำหรับ Qa กดรับงาน -->
        <!-- <v-btn
          v-if="
            dataItemRepair.qaRepairStatus.trim() === '2' &&
            $store.state.levelUser.isFacTeam.filter(
              (obj) =>
                obj.FacTeam === dataItemRepair.ProductionTeam &&
                obj.isReceive === true
            ).length <= 0
          "
          class="mr-7"
          color="success"
          @click="receiveBillRepair(dataItemRepair)"
          >รับงานซ่อม</v-btn
        > -->
        <v-btn
          v-if="
            dataItemRepair.qaRepairStatus.trim() !== '' &&
              $store.state.levelUser.isFacTeam.filter(
                obj =>
                  obj.FacTeam === dataItemRepair.ProductionTeam &&
                  obj.isReceive === true
              ).length > 0
          "
          class="mr-7"
          color="success"
          @click="sentItemRepair()"
          :disabled="
            dataItemRepair.ItemBill.reduce(
              (pv, cv) => pv + +cv.sentRepair,
              0
            ) <= 0
          "
          >Confirm</v-btn
        >
      </v-card-actions>
    </v-card>
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
export default {
  props: ["dataInput"],
  data: () => ({
    loadingBtn: false,
    dataItemRepair: {
      qaRepairStatus: ""
    },
    dataSubmit: [],
    dataInputBackUp: [],
    itemProductCode: "",
    checkBeforeUpdate: 0,
    sentRepairItemShowPop: false,
    qaReceiveShowPop: false,
    checkBoxSentAll: false,
    snackBarWarning: false,
    receiveShowPop: false,
    snackbar: {
      show: false,
      title: "",
      icon: "",
      color: "",
      timeout: 0
    }
  }),
  async mounted() {
    this.$store.state.loadingPage = true;
    //this.dataItemRepair = this.dataInput.ItemBill;

    if (this.$route.params.data) {
      this.dataItemRepair = this.$route.params.data;
    } else {
      this.$router.go(-1);
    }
    setTimeout(() => {
      // console.log(this.dataItemRepair.ItemBill);
      this.$store.state.loadingPage = false;
    }, 700);
  },
  methods: {
    sentAll() {
      this.dataItemRepair.ItemBill.forEach(data => {
        if (
          this.checkBoxSentAll &&
          data.Qty > data.RepairFinish &&
          data.ToQa === 0 &&
          data.sentRepair === 0
        ) {
          this.checkBeforeUpdate = 1;
          data.sentRepair = data.Qty - data.RepairFinish - data.ToQa;
        } else if (!this.checkBoxSentAll && data.Qty !== data.RepairFinish) {
          data.sentRepair = 0;
          this.checkBeforeUpdate = 0;
        }
      });
    },
    sentAllItem(data) {
      if (
        //data.Qty != data.RepairFinish &&
        data.ToQa === 0 &&
        data.sentRepair === 0
      ) {
        data.sentRepair = data.Qty - data.RepairFinish - data.ToQa;
      } else if (data.sentRepair !== 0) {
        data.sentRepair = 0;
      }
    },
    cancel() {
      if (this.$route.params.data) {
        this.$router.go(-1);
      } else {
        this.$store.state.facBillRepair.ShowPopupRepair = false;
        this.dataItemRepair = this.$store.state.facBillRepair.billRepairItems;
      }
    },
    async sentItemRepair() {
      this.sentRepairItemShowPop = true;
    },
    async confirmSentItemRepair() {
      this.loadingBtn = true;
      if (
        this.dataItemRepair.ItemBill.reduce(
          (pv, cv) => +pv + +cv.sentRepair,
          0
        ) > 0
      ) {
        const { result } = await apiFacToQa.updateBillRepair(
          this.dataItemRepair.ItemBill
        );
        if (result === "ok") {
          this.snackbar = {
            show: true,
            title: "สำเร็จ",
            icon: "mdi-shield-check",
            color: "success",
            timeout: 2500
          };
          setTimeout(() => {
            this.loadingBtn = false;
            this.sentRepairItemShowPop = false;
            this.$router.go(-1);
          }, 1000);
        } else {
          this.loadingBtn = false;
          this.snackbar = {
            show: true,
            title: "ไม่สำเร็จ",
            icon: "mdi-shield-check",
            color: "orange",
            timeout: 2500
          };
        }
      } else {
        this.loadingBtn = false;
        this.snackBarWarning = true;
      }
    },

    async receiveBillRepair() {
      this.receiveShowPop = true;
    },
    async receiveconfirm() {
      const { result } = await apiFacToQa.receiveBillRepair({
        qaRepair_ID: this.dataItemRepair.qaRepair_ID,
        empCode: localStorage.getItem("username")
      });

      if (result === "ok") {
        this.snackbar = {
          show: true,
          title: "สำเร็จ",
          icon: "mdi-shield-check",
          color: "success",
          timeout: 2500
        };
        if (this.$route.params.data) {
          this.$router.go(-1);
        } else {
          this.$store.state.facBillRepair.ShowPopupReceiveBill = false;
        }
      } else {
        this.snackbar = {
          show: true,
          title: "ไม่สำเร็จ",
          icon: "mdi-shield-check",
          color: "orange",
          timeout: 2500
        };
      }
    },
    //qa รับงานซ่อม
    qaReceiveconfirm() {
      this.qaReceiveShowPop = true;
    }
  }
};
</script>

<style>
.borderHeaderTopLine {
  border-top: 1px solid rgb(214, 214, 214);
  border-right: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.isSendItem {
  background-color: rgb(194, 238, 255);
}

.finishAllItem {
  background-color: rgb(161, 158, 158);
}
.myImg {
  filter: brightness(62%);
}
</style>
