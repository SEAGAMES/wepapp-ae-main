<template>
  <v-container grid-list-xs class="fontSarabun">
    <div align="right" v-if="isMaterail === ''">
      <v-btn
        color="red lighten-2"
        dark
        @click="$router.back(), ($store.state.mppPage.mppBillIDForPrint = null)"
        class="mr-1"
        >กลับ</v-btn
      >
    </div>
    <v-row v-if="isMaterail === ''" class="mt-16">
      <v-col cols="6">
        <v-card @click="isMaterail = 'stone'">
          <v-img
            src="http://192.168.3.5:3000/picture/PICTURE2/WEB_AE/Gem&part/Gem2.png"
          ></v-img>
          <div class="fontSize22" align="center">รับพลอย</div>
        </v-card>
      </v-col>
      <v-col cols="6">
        <v-card @click="selectedParts()">
          <v-img
            src="http://192.168.3.5:3000/picture/PICTURE2/WEB_AE/Gem&part/Part1.jpg"
          ></v-img>
          <div class="fontSize22" align="center">รับอะไหล่</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- รับงานพลอย -->
    <v-card v-if="isMaterail === 'stone'">
      <v-row>
        <v-col align="end">
          <v-btn
            color="red lighten-2"
            dark
            @click="isMaterail = ''"
            class="mr-1"
            >กลับ</v-btn
          >
          <v-btn
            color="blue lighten-2"
            dark
            @click="$router.push('/mpp-billmaterails')"
            class="mr-2"
            >แสดงรายการบิลทั้งหมด</v-btn
          >
        </v-col>
      </v-row>

      <!-- กล่องยิงบิล -->
      <v-row
        v-if="
          $store.state.mppPage.mppBillIDForPrint === null ||
            $store.state.mppPage.mppBillIDForPrint === undefined
        "
      >
        <v-col class="ml-7 mr-7 mt-10">
          <v-form @submit.prevent="loadDataBill()">
            <v-text-field
              label="กรุณาใส่เลขที่บิล"
              v-model="inputBillID"
              outlined
              autofocus
              append-icon="mdi-barcode"
              color="success"
              type="number"
            ></v-text-field>
          </v-form>
        </v-col>
      </v-row>

      <div v-if="!spinner">
        <v-row class="px-2">
          <!-- ผู้ส่งงาน -->
          <v-col lg="2" md="2" sm="2" align="center">
            <v-img :src="dataBill.EmpPictSender" width="150" />
            <v-btn
              color="blue "
              dark
              small
              class="mt-2"
              @click="printBillMaterial()"
              v-if="dataBill.product.length > 0"
            >
              <v-icon>print</v-icon> พิมพ์บิล
            </v-btn>
          </v-col>

          <v-col lg="4" md="4" sm="4">
            <div class="mx-n3">
              <span class="fontSize18">
                <b> ผู้ส่งบิล: </b>
                <span class="pl-5 brown--text">{{
                  dataBill.EmpNameSender
                }}</span>
              </span>
              <br />

              <span class="fontSize18">
                <b> วันที่ส่งบิล : </b>
                <span
                  class="brown--text"
                  v-if="new Date(dataBill.BillDate) > new Date('2020-01-01')"
                >
                  {{ convertDate(dataBill.BillDate) }}
                  ({{ dataBill.BillTime }} น.)</span
                >
              </span>
              <br />

              <span class="fontSize18">
                <b> เลขที่เอกสาร : </b>
                <span class="pl-0 brown--text">{{ dataBill.BillNumber }}</span>
              </span>
              <br />

              <span class="fontSize18">
                <b> OrderNumber : </b>
                <span class="pl-0 brown--text">{{ dataBill.OrderNumber }}</span>
              </span>
              <br />

              <span class="fontSize18">
                <b> Fac_Team : </b>
                <span class="pl-0 brown--text">{{ dataBill.FactoryTeam }}</span>
              </span>
            </div>
          </v-col>

          <!-- ผู้รับงาน -->
          <v-col lg="2" md="2" sm="2">
            <v-img :src="dataBill.EmpPictReceiver" width="150" />
          </v-col>

          <v-col lg="4" md="4" sm="4">
            <div class="mx-n3">
              <span class="fontSize18">
                <b> ผู้รับบิล: </b>
                <span class="pl-2 brown--text">{{
                  dataBill.EmpNameReceiver
                }}</span>
              </span>
              <br />

              <span class="fontSize18">
                <b> วันที่รับบิล : </b>
                <span
                  class="pl-1 brown--text"
                  v-if="new Date(dataBill.ReceiveDate) > new Date('2020-01-01')"
                >
                  {{ convertDate(dataBill.ReceiveDate) }}
                  ({{ dataBill.ReceiveTime }} น.)</span
                >
              </span>
              <br />

              <br />
              <v-btn
                color="success"
                dark
                :disabled="
                  dataBill.EmpNameReceiver !== '' || dataBill.BillStatus !== '1'
                "
                @click="confirmReceive = true"
                >ยืนยันรับงาน</v-btn
              >
              <v-btn
                color="black"
                dark
                class="fontPrompt"
                @click="confirmReceiveForDev = true"
                v-if="
                  dataBill.product.length > 0 &&
                    $store.state.username === '1372'
                "
                >Receive_For_DEV</v-btn
              >
            </div>
          </v-col>
        </v-row>

        <!-- Sumbill -->
        <v-row v-if="dataBill.product.length > 0">
          <v-col cols="9"> </v-col>
          <v-col cols="3">
            <v-card class="mr-7">
              <table>
                <tr>
                  <th width="300" class="light-blue lighten-4">
                    <div class="fontSize14" align="start">รหัสพลอย</div>
                  </th>
                  <th width="200" class="light-blue lighten-4">
                    <div class="fontSize14" align="center">จำนวนทั้งหมด</div>
                  </th>
                </tr>

                <tr v-for="(Inv, index) in dataBill.sumInv" :key="index">
                  <th width="300">
                    <div class="fontSize12" align="start">
                      {{ Inv.InvCode }}
                    </div>
                  </th>
                  <th width="200">
                    <div class="fontSize12" align="center">
                      <span>{{ Inv.SumQty.toLocaleString() }}</span>
                    </div>
                  </th>
                </tr>
              </table>
            </v-card>
          </v-col>
        </v-row>

        <v-row v-if="dataBill.product.length > 0" class="mt-n5">
          <v-col>
            <v-card class="ma-7">
              <v-simple-table class="border">
                <template v-slot:default>
                  <thead>
                    <tr align="center" class="bgColorHeader">
                      <th class="text-center" width="80">
                        <div class="fontSize16"><b>รายการที่</b></div>
                      </th>
                      <th class="text-center" width="80">
                        <div class="fontSize16"><b>ลำดับใน Checker</b></div>
                      </th>
                      <th class="text-center" width="80">
                        <div class="fontSize16">
                          <b>รหัสสินค้า</b>
                        </div>
                      </th>
                      <th class="text-center" width="200">
                        <div class="fontSize16">
                          <b>รายการพลอย</b>
                        </div>
                      </th>
                      <th class="text-center" width="200">
                        <div class="fontSize16">
                          <b>จำนวนที่ส่ง</b>
                        </div>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="dataMaster in dataBill.product"
                      :key="dataMaster.ItemNo"
                      align="center"
                    >
                      <td>
                        <div class="fontSize18">
                          {{ dataMaster.ItemNo }}
                        </div>
                      </td>

                      <td>
                        <v-chip color="blue" dark
                          ><div class="fontSize14">
                            {{ dataMaster.OrderItemNo }}
                          </div>
                        </v-chip>
                      </td>

                      <!-- รหัสสินค้า -->
                      <td align="center" width="200">
                        <v-img
                          :src="dataMaster.NewPict"
                          width="120"
                          class="mt-1"
                        />

                        <div class="fontSize13">
                          {{ dataMaster.ProductCode }}
                        </div>
                        <div class="fontSize13 grey--text">
                          {{ dataMaster.JobNumber }}
                        </div>
                      </td>

                      <!-- ชื่อพลอย -->
                      <td align="left" width="150">
                        <v-row
                          v-for="(dataStone, index) in dataMaster.inventory"
                          :key="dataStone.MatItemNo"
                          v-bind:class="{
                            'pt-3': index === 0,
                            'pb-3': index + 1 === dataMaster.inventory.length
                          }"
                        >
                          <v-col>
                            <div
                              :class="
                                dataStone.SendQty <= 0
                                  ? 'grey--text'
                                  : 'black--text font-weight-bold'
                              "
                            >
                              {{ dataStone.InvCode }}
                            </div>
                          </v-col>
                        </v-row>
                      </td>

                      <!-- จำนวนที่สั่ง -->
                      <td align="center" width="100">
                        <v-row
                          v-for="(dataStone, index) in dataMaster.inventory"
                          :key="dataStone.MatItemNo"
                          v-bind:class="{
                            'pt-3': index === 0,
                            'pb-3': index + 1 === dataMaster.inventory.length
                          }"
                        >
                          <v-col>
                            <div
                              :class="
                                dataStone.SendQty <= 0
                                  ? 'grey--text'
                                  : 'black--text font-weight-bold'
                              "
                              align="center"
                            >
                              {{ dataStone.SendQty.toLocaleString() }}
                            </div>
                          </v-col>
                        </v-row>
                      </td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <v-col class="ma-5" align="end">
            <v-btn
              color="red"
              dark
              @click="
                $router.back(), ($store.state.mppPage.mppBillIDForPrint = null)
              "
              >กลับ</v-btn
            >
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- รับงานอะไหล่ -->
    <v-card v-if="isMaterail === 'part'">
      <div class="fontSize30 fontPrompt" align="center">รับงานอะไหล่</div>
      <!-- กล่องยิงบิล -->
      <v-row dense class="mt-n5">
        <v-col class="ml-7 mr-7 mt-10">
          <v-form @submit.prevent="getBatchPartsForReceive()">
            <v-text-field
              label="กรุณาใส่เลขที่บิล"
              outlined
              autofocus
              append-icon="mdi-barcode"
              color="success"
              type="number"
              v-model="batchNumber"
            />
          </v-form>
        </v-col>
      </v-row>
      <div v-if="!spinner">
        <div
          class="fontSize30 green"
          align="center"
          v-if="dataBatch.BatchStatus === '2'"
        >
          รับงานไปแล้ว
        </div>
        <v-row dense class="pa-1">
          <v-col cols="5" class="pl-10">
            <div class="borderFull heightDiv" align="center">
              <v-img
                :src="dataBatch.InvPict"
                width="200"
                :lazy-src="$store.state.no_picture"
              />
            </div>

            <div class="fontSize24 fontPrompt" align="center">
              เลขที่ BATCH : {{ dataBatch.BatchNumber }}
            </div>
          </v-col>
          <v-col cols="7">
            <div class="fontSize20 ml-8">
              <div>
                วันที่จัด :
                <span class="fontSize22" v-if="dataBatch.PackDate !== ''"
                  >{{ $moment(dataBatch.PackDate).format("dd") }}
                  {{ $moment(dataBatch.PackDate).format("L") }}</span
                >
              </div>
              <div>
                ORDER :
                <span class="fontSize22">{{ dataBatch.OrderNumber }}</span>
              </div>
              <div>
                CODE : <span class="fontSize22">{{ dataBatch.InvCode }}</span>
              </div>
              <div>
                จำนวน :
                <span class="fontSize22"> {{ dataBatch.BatchQty }} </span>
              </div>
              <div>
                น้ำหนักชิ้นงาน :
                <span class="fontSize22"> {{ dataBatch.NetWeight }} g.</span>
              </div>
              <div>
                น้ำหนักส่งรวม Packet :
                <span class="fontSize22">
                  {{ dataBatch.TotalContainerWg }} g.</span
                >
              </div>
              <div class="red--text">
                โปรดระบุผู้ส่งงาน
                <v-row dense class="mt-2">
                  <v-col cols="4">
                    <v-autocomplete
                      label="รหัสพนักงาน"
                      :items="dataEmp"
                      item-text="EmpCode"
                      item-value="EmpCode"
                      v-model="dataBatch.PurchasePerson"
                      dense
                      outlined
                      :disabled="
                        dataBatch.BatchStatus !== '1' && !dataBatch.Select_A
                      "
                    />
                  </v-col>
                  <v-col cols="8">
                    <v-autocomplete
                      label="ชื่อผู้ส่งงาน"
                      :items="dataEmp"
                      item-text="EmpFullName"
                      item-value="EmpCode"
                      v-model="dataBatch.PurchasePerson"
                      dense
                      outlined
                      :disabled="
                        dataBatch.BatchStatus !== '1' && !dataBatch.Select_A
                      "
                    />
                  </v-col>
                </v-row>
              </div>
            </div>
          </v-col>
        </v-row>
        <v-row dense>
          <v-col cols="12" class="pl-10">
            <div class="red--text">
              *โปรดอ่าน... กรุณาตรวจสอบข้อมูลให้ถูกต้องก่อนกดยืนยันรับ
              หากยืนยันรับแล้วไม่สามารถแก้ไขได้*
            </div>
            <div align="center" class="mt-5 pb-3">
              <v-btn
                color="red"
                dark
                class="mr-16 fontPrompt"
                width="80"
                dense
                @click="cancelBatch()"
                ><span class="fontSize12">ยกเลิก</span>
              </v-btn>
              <v-btn
                color="green"
                class="ml-16 fontPrompt"
                width="80"
                dense
                @click="submitReceiveParts()"
                :disabled="dataBatch.BatchStatus !== '1' && !dataBatch.Select_A"
                :loading="loadingButton"
                ><span class="fontSize12 white--text">ยืนยันรับงาน</span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </div>
    </v-card>

    <!-- Loading -->
    <v-row v-if="spinner" class="mt-16">
      <v-spacer></v-spacer>
      <PulseLoader
        justify="center"
        align="center"
        :loading="spinner"
        class="mt-16"
      />
      <v-spacer></v-spacer>
    </v-row>

    <!-- popup ยืนยันรับงาน -->
    <v-dialog v-model="confirmReceive" max-width="290">
      <v-card class="fontPrompt">
        <v-card-title primary-title>ยืนยันรับงาน</v-card-title>
        <v-card-text class="body"
          >คุณต้องการที่จะรับงานใช่หรือไม่ ?</v-card-text
        >
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmReceive = false">Cancel</v-btn>
          <v-btn text @click="confirmReceiveBill" color="error">Confirm</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- popup ยืนยันรับงาน เฉพาะ DEV -->
    <v-dialog v-model="confirmReceiveForDev" max-width="290">
      <v-card class="fontPrompt">
        <v-card-title primary-title>ยืนยันรับงานเฉพาะ DEV</v-card-title>
        <v-card-text class="body">คุณเป็นใคร ?</v-card-text>
        <v-text-field
          class="ml-3 mr-3"
          dense
          outlined
          v-model="whoareyou"
          type="password"
        ></v-text-field>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="confirmReceiveForDev = false">Cancel</v-btn>
          <v-btn
            text
            @click="receiveBillOnlyDev()"
            color="error"
            :loading="loadingButton"
            >Confirm</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- snackbar ยืนยันรับงาน -->
    <div class="text-center ma-2">
      <v-snackbar v-model="snackBarReceiveSuccess" :timeout="2000" top>
        <div class="fontSarabun fontSize16 text-center">
          ยืนยันรับงานเรียบร้อยแล้ว
          <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
        </div>
      </v-snackbar>

      <v-snackbar v-model="snackBarFalseBill" :timeout="2000" top>
        <div class="fontSarabun fontSize16 text-center">
          ไม่พบเลขที่บิลที่คุณต้องการ
          <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
        </div>
      </v-snackbar>
    </div>
  </v-container>
</template>

<script>
import apiMpp from "../../services/apiMpp";
import moment from "moment";
import PulseLoader from "../../components/Loadings/PulseLoader.vue";
import apiCreatePDF from "../../services/apiCreatePDF";
import apiDevice from "../../services/apiDevice";

export default {
  name: "MPP_ReceiveBill",
  data() {
    return {
      isMaterail: "",
      spinner: true,
      inputBillID: "",
      orderNumber: "",
      dataBill: {
        product: []
      },
      snackBarReceiveSuccess: false,
      snackBarFalseBill: false,
      confirmReceive: false,
      confirmReceiveForDev: false,
      whoareyou: "",
      loadingButton: false,
      batchNumber: null,
      dataBatch: {
        BatchNumber: "",
        BatchQty: 0,
        BatchStatus: "",
        InvCode: "",
        InvPict: "",
        NetWeight: 0,
        OrderNumber: "",
        PackDate: "",
        Select_A: null,
        TotalContainerWg: 0,
        PurchasePerson: ""
      },
      dataEmp: []
    };
  },
  components: {
    PulseLoader
  },
  async mounted() {
    // await this.checkinRoute();
    this.orderNumber = this.$store.state.mppPage.mppSelectOrderToDetail.OrderNumber;
    // this.orderNumber = "CH-K&K001/2022";
    // console.log(this.$store.state.mppPage.mppBillIDForPrint);
    // this.orderNumber = "CH-DGP002/2022";
    // this.inputBillID = "14";
    if (
      this.$store.state.mppPage.mppBillIDForPrint !== null &&
      this.$store.state.mppPage.mppBillIDForPrint !== undefined
    ) {
      // console.log("++");
      this.inputBillID = this.$store.state.mppPage.mppBillIDForPrint;
    }
    await this.loadDataBill();
  },
  methods: {
    async checkinRoute() {
      // console.log('params',this.$route.path);
      await apiMpp.CheckinProgram(this.$store.state.username, this.$route.path);
    },
    async loadDataBill() {
      try {
        this.spinner = true;
        if (
          this.inputBillID !== "" &&
          this.inputBillID !== 0 &&
          this.inputBillID !== null &&
          this.inputBillID !== undefined
        ) {
          const result = await apiMpp.getBillForReceive(
            this.orderNumber,
            +this.inputBillID,
            this.$store.getters.Factory
          );
          if (result.message === "nok") {
            this.snackBarFalseBill = true;
            this.dataBill = { product: [] };
            setTimeout(() => {
              this.snackBarFalseBill = false;
            }, 1500);
          } else {
            this.dataBill = result;
            this.dataBill.product.sort((a, b) =>
              a.ItemNo > b.ItemNo ? 1 : b.ItemNo > a.ItemNo ? -1 : 0
            );
            // this.dataBill.product.inventory.sort((a,b) => (a.MatItemNo > b.MatItemNo) ? 1 : ((b.MatItemNo > a.MatItemNo) ? -1 : 0));
          }
        }
      } catch (error) {
        alert(error);
      } finally {
        this.spinner = false;
      }

      // console.log(result);
    },
    convertDate(date) {
      moment.locale("th");
      const dateParse = new Date(date);
      return `${moment(dateParse)
        .add(543, "year")
        .format("L")}`;
    },
    async confirmReceiveBill() {
      const result = await apiMpp.confirmReceiveBill(
        +this.inputBillID,
        this.$store.getters.username,
        (this.confirmReceive = false)
      );
      if (result.message === "ok") {
        this.snackBarReceiveSuccess = true;
        setTimeout(async () => {
          await this.loadDataBill();
          this.snackBarReceiveSuccess = false;
        }, 1500);
      }
    },
    async printBillMaterial() {
      if (this.dataBill.product.length > 0) {
        await apiCreatePDF.printBillMaterial(this.dataBill);
      }
    },
    async receiveBillOnlyDev() {
      this.loadingButton = true;
      if (this.whoareyou === "superton") {
        await apiMpp.receiveBillOnlyDev(
          +this.inputBillID,
          this.$store.getters.username
        );
        // console.log(res);
        this.confirmReceiveForDev = false;
        this.loadingButton = false;
        this.whoareyou = "";
      } else {
        alert("คุณไม่ใช้ผู้ที่แก้ไขได้");
        this.loadingButton = false;
      }
    },
    async getBatchPartsForReceive() {
      this.spinner = true;
      if (this.batchNumber.length >= 8) {
        try {
          const res = await apiMpp.getBatchPartsForReceive({
            batchNumber: this.batchNumber
          });
          // console.log(res);
          if (res.length > 0) {
            this.dataBatch = res[0];
          } else {
            this.snackBarFalseBill = true;
            this.defualtValuesDataBatch();
          }
        } catch (error) {
          alert(error);
        } finally {
          this.spinner = false;
          setTimeout(() => {
            this.batchNumber = "";
          }, 2000);
        }
      } else {
        this.defualtValuesDataBatch();
        this.snackBarFalseBill = true;
        this.spinner = false;
      }
    },
    defualtValuesDataBatch() {
      this.dataBatch = {
        BatchNumber: "",
        BatchQty: 0,
        BatchStatus: "",
        InvCode: "",
        InvPict: this.$store.state.no_picture,
        NetWeight: 0,
        OrderNumber: "",
        PackDate: "",
        Select_A: null,
        TotalContainerWg: 0,
        PurchasePerson: ""
      };
    },
    cancelBatch() {
      this.defualtValuesDataBatch;
      this.isMaterail = "";
    },
    async loadDataEmp() {
      if (this.dataEmp.length === 0) {
        this.dataEmp = await apiDevice.getemployee();
      }
    },
    async selectedParts() {
      this.isMaterail = "part";
      await this.loadDataEmp();
    },
    async submitReceiveParts() {
      this.loadingButton = true;
      const { result } = await apiMpp.confirmReceiveParts({
        BatchNumber: this.dataBatch.BatchNumber,
        PurchasePerson: this.dataBatch.PurchasePerson,
        FactoryReceivePerson: this.$store.state.username
      });
      // console.log(result);
      if (result === "ok") {
        this.dataBatch.BatchStatus = "2";
        this.dataBatch.Select_A = false;
        this.snackBarReceiveSuccess = true;
        this.loadingButton = false;
      }
    }
  }
};
</script>

<style scope>
.bgColorHeader {
  background-color: rgb(150, 186, 255);
}

.heightDiv {
  height: 220px;
}

.borderFull {
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-right: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
</style>
