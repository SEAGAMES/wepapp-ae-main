<template>
  <div fullscreen class="fontSarabun">
    <div align="right" class="mt-2 mr-2">
      <v-btn
        dark
        color="red lighten-2"
        @click="$router.go(-1)"
        dense
        small
        width="5"
        ><div class="ma-n16 fontSize9" align="center">กลับ</div>
      </v-btn>
    </div>

    <v-card color="grey lighten-5" class="justify-center d-flex align-center">
      <div
        align="center"
        style="font-family: Sarabun; color: darkcyan; font-size: 14px"
      >
        สถานะของวันที่ :
        <span class="darkcyan--text">{{ getDate | moment("LLLL") }}</span
        ><br />
        <span
          >Order NO : <b>{{ orderNumber }}</b>
        </span>
        <br />
        <span>จำนวน : {{ OrderQty.toLocaleString() }}</span>
      </div>
    </v-card>

    <v-card
      v-for="(item, indexProduct) in dataProduct"
      :key="indexProduct"
      class="mt-5"
    >
      <v-simple-table dense class="tableDetail">
        <template v-slot:default>
          <thead>
            <!-- Row1 -->
            <tr>
              <th class="borderLeft" colspan="2">
                <div class="fontSize10 my-2" align="center">
                  <b>Code & PIC</b>
                </div>
              </th>

              <th class="borderLeft">
                <div class="fontSize10 mx-1 my-2" align="center">วัตถุดิบ</div>
              </th>

              <th class="borderLeft">
                <div class="fontSize10 my-2" align="center">สถานะ</div>
              </th>

              <th class="borderLeft">
                <div class="fontSize10 mx-n3 my-2" align="center">แผนก</div>
              </th>

              <th
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R1' + indexProcess"
              >
                <div class="fontSize10 mx-n3 my-2" align="center">
                  {{ process.PDProcessName }}
                </div>
              </th>
            </tr>
          </thead>

          <tbody>
            <!-- Row2 -->
            <tr>
              <td class="borderLeft" rowspan="4" colspan="2">
                <div class="mx-n1" align="center">
                  <v-row>
                    <v-col cols="1">
                      <div align="left" class="fontSize9 mx-n3">
                        {{ item.ItemNo }}
                      </div>
                    </v-col>
                    <v-col cols="11">
                      <v-img
                        :src="item.NewPict"
                        :lazy-src="$store.state.no_picture"
                        width="120"
                        class="mx-n3 mt-n9 mr-n7"
                      ></v-img>
                    </v-col>
                  </v-row>
                </div>
              </td>
              <td
                v-bind:class="{
                  'borderLeft grey lighten-3': item.StatsInv.TotalReq === 0,
                  'borderLeft teal accent-3': item.StatsInv.LateDay > 3,
                  'borderLeft amber lighten-3':
                    item.StatsInv.LateDay <= 3 && item.StatsInv.LateDay >= 0,
                  'borderLeft red lighten-4': item.StatsInv.LateDay < 0
                }"
                rowspan="2"
              >
                <div
                  class="fontSize12 mx-n3 my-3"
                  align="center"
                  @click="
                    showMaterail(item.ItemNo, 'stone', item.StatsInv.TotalReq)
                  "
                >
                  พลอย
                </div>
              </td>
              <td class="borderLeft" rowspan="2">
                <div
                  class="fontSize11 mx-n3 font-weight-bold"
                  v-bind:class="{
                    'red--text': item.StatsInv.LateDay < 0,
                    'orange--text':
                      item.StatsInv.LateDay >= 0 && item.StatsInv.LateDay <= 3,
                    'green--text': item.StatsInv.LateDay > 3
                  }"
                  align="center"
                  v-if="item.StatsInv.TotalReq > 0"
                >
                  {{ item.StatsInv.IsFinish ? "จบ" : item.StatsInv.LateDay }}
                </div>
              </td>
              <td class="borderLeft">
                <div class="fontSize9 mx-n3 my-1" align="center">ขั้นตอน</div>
              </td>

              <td
                width="5"
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R2' + indexProcess"
              >
                <div class="fontSize9 mx-n3 colorTextTitle" align="center">
                  <!-- ยังไม่มี SUB  -->
                </div>
              </td>
            </tr>

            <!-- Row3 -->
            <tr>
              <td class="borderLeft">
                <div class="fontSize9 my-1 mx-n3" align="center">จน. จุด</div>
              </td>
              <td
                width="5"
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R3' + indexProcess"
              >
                <div class="fontSize9 mx-n3 colorTextTitle" align="center">
                  <!-- ยังไม่มี SUB  -->
                </div>
              </td>
            </tr>

            <!-- Row4 -->
            <tr>
              <td
                class="borderLeft grey lighten-3"
                rowspan="2"
                @click="showMaterail(item.ItemNo, 'part', 1)"
              >
                <div class="fontSize12" align="center">อะไหล่</div>
              </td>
              <td class="borderLeft" rowspan="2">
                <div class="fontSize11 mx-n3 font-weight-bold" align="center">
                  <!-- ยังไม่มี -->
                </div>
              </td>
              <td class="borderLeft">
                <div class="fontSize9 mx-n3 my-1" align="center">
                  จน. จุดรวม
                </div>
              </td>
              <td
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R4' + indexProcess"
              >
                <div class="fontSize9 mx-n3 colorTextTitle" align="center">
                  <!-- ยังไม่มี  -->
                </div>
              </td>
            </tr>

            <!-- Row5 -->
            <tr>
              <td class="borderLeft">
                <div class="fontSize9 mx-n4 my-1" align="center">
                  กำหนดเสร็จ
                </div>
              </td>
              <td
                width="5"
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R5' + indexProcess"
              >
                <div class="fontSize9 mx-n3 colorTextTitle" align="center">
                  <!-- ยังไม่มี -->
                </div>
              </td>
            </tr>

            <!-- Row6 -->
            <tr>
              <td class="borderLeft" colspan="2">
                <div class="fontSize10 mx-n3 font-weight-bold" align="center">
                  <span>{{ item.ProductCode }}</span>
                </div>
              </td>
              <td class="borderLeft yellow lighten-2">
                <div class="fontSize11 mx-n4" align="center">เหลือวันทำงาน</div>
              </td>
              <td class="borderLeft">
                <div
                  class="fontSize11 mx-n3 my-2 amber--text font-weight-bold"
                  align="center"
                >
                  <!-- ยังไม่มี -->
                </div>
              </td>
              <td class="borderLeft">
                <div class="fontSize9 mx-n3" align="center">ยอดงาน</div>
              </td>
              <td
                width="5"
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R6' + indexProcess"
              >
                <div
                  :class="
                    process.TotalInProcess > 0
                      ? 'fontSize11 mx-n3 colorTextTitle font-weight-bold'
                      : 'fontSize11 mx-n3 red--text font-weight-bold'
                  "
                  align="center"
                  v-if="process.TotalInProcess > 0"
                >
                  {{ process.TotalInProcess.toLocaleString() }}
                </div>
              </td>
            </tr>

            <!-- Row7 -->
            <tr>
              <td class="borderLeft">
                <div class="fontSize9 mx-n1" align="center">จำนวน :</div>
              </td>
              <td class="borderLeft">
                <div
                  class="fontSize10 mx-5 font-weight-bold py-1"
                  align="center"
                >
                  {{ item.JobQty.toLocaleString() }}
                </div>
              </td>
              <td class="borderLeft yellow lighten-2">
                <div class="fontSize11 mx-n4" align="center">
                  เหลือวันทั้งหมด
                </div>
              </td>
              <td class="borderLeft font-weight-bold">
                <div class="fontSize11 mx-n3 green--text" align="center">
                  <!-- ยังไม่มี -->
                </div>
              </td>
              <td class="borderLeft">
                <div class="fontSize9" align="center">เลทแผนก</div>
              </td>
              <td
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R7' + indexProcess"
              >
                <div
                  align="center"
                  :class="
                    process.LateProcess > 0
                      ? 'fontSize9 mx-n3 colorTextTitle'
                      : 'fontSize11 mx-n3 red--text font-weight-bold'
                  "
                >
                  <!-- ยังไม่มี -->
                </div>
              </td>
            </tr>

            <!-- Row8 -->
            <tr>
              <td class="borderLeft" colspan="1">
                <div class="fontSize9 mx-n3 py-2" align="center">QA SPEC :</div>
              </td>

              <td
                class="borderLeft"
                colspan="3"
                @click="inputDes(indexProduct)"
              >
                <div class="fontSize9 py-2" align="left">
                  {{ item.QaSpec }}
                </div>
              </td>

              <td class="borderLeft">
                <div class="fontSize9 mx-n3 py-2" align="center">
                  ข้อมูลการผลิต
                </div>
              </td>
              <td
                class="borderLeft"
                v-for="(process, indexProcess) in item.PDProcess"
                :key="'R8' + indexProcess"
              >
                <div class="fontSize9 mx-n3" align="center">
                  <!-- ยังไม่มี -->
                </div>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>
    </v-card>

    <!-- POPUP Product For Inv  -->
    <v-dialog
      v-model="showDialogMaterail.showDialog"
      persistent
      :overlay="false"
      width="900"
    >
      <v-card>
        <div align="right" class="pt-2 mr-2">
          <v-btn color="red" dark @click="showDialogMaterail.showDialog = false"
            >close</v-btn
          >
        </div>
        <div align="center">
          <ProductForInvNew
            :dataInput="showDialogMaterail"
            v-if="showDialogMaterail.showDialog"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- ใส่ Des -->
    <v-dialog
      v-model="dialogInputDes.showDialog"
      :overlay="false"
      max-width="500px"
    >
      <v-card class="fontSarabun">
        <div class="px-5 pt-5">
          <div class="fontSize18">{{ dialogInputDes.showLabel }}</div>
          <v-row>
            <v-col cols="11">
              <v-textarea
                solo
                :label="'กรุณาใส่' + dialogInputDes.showLabel"
                v-model="dialogInputDes.valueDialog"
                outlined
                :disabled="!dialogInputDes.IsEditDes"
              ></v-textarea>
            </v-col>
            <v-col cols="1"
              ><v-btn
                color="success"
                icon
                class="ml-n5"
                @click="dialogInputDes.IsEditDes = !dialogInputDes.IsEditDes"
                ><v-icon>edit</v-icon></v-btn
              ></v-col
            >
          </v-row>
        </div>
        <div align="right" class="pb-2 pr-16" v-if="dialogInputDes.IsEditDes">
          <v-btn color="red" outlined dense class="mr-2">cancel</v-btn>
          <v-btn
            color="success"
            dense
            @click="confirmDes()"
            :loading="loadingBtn"
            >Submit</v-btn
          >
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import apiFacWipStatus from "../services/apiFacWipStatus";
// import InvForProductNewVue from "./OrderStatus/InvForProductNew.vue";
import ProductForInvNew from "./OrderStatus/ProductForInv.vue";

export default {
  name: "facwipstatus-detail",
  data: () => ({
    orderNumber: "",
    OrderQty: 0,
    getDate: new Date(),
    dataProduct: [],
    dataPDSubProcess: [],
    showDialogMaterail: {
      showDialog: false,
      orderNumber: "",
      orderItemNo: "",
      select: ""
    },
    dialogInputDes: {
      showDialog: false,
      IsEditDes: false,
      valueDialog: "",
      choseIndex: 0,
      showLabel: "",
      dataInput: {
        orderNumber: "",
        orderItemNo: "",
        QaSpec: "",
        EmpCode: ""
      }
    },
    loadingBtn: false
  }),
  computed: {},
  components: {
    // InvForProductNewVue,
    ProductForInvNew
  },
  async mounted() {
    // console.log(this.$route.params.orderNumber);
    this.orderNumber = this.$route.params.orderNumber;
    this.OrderQty = this.$route.params.OrderQty;
    await this.loadDataProduct();
    // this.mapSubProcess();
    // orderNumber
  },
  methods: {
    async loadDataProduct() {
      // const res = await apiOrderStatus.getProduct(this.orderNumber);
      // this.dataProduct = res;
      const response = await apiFacWipStatus.getProductStatusNew({
        orderNumber: this.orderNumber
      });
      this.dataProduct = response;
      // console.log(response);
    },
    mapSubProcess() {
      let aa = this.dataInProcess;
      this.dataPDSubProcess = [];
      aa.forEach(i => {
        this.dataPDSubProcess = this.dataPDSubProcess.concat(i.PDSubProcess);
      });
    },
    showMaterail(orderItemNo, select, isCheck) {
      if (isCheck > 0) {
        this.showDialogMaterail.orderItemNo = orderItemNo;
        this.showDialogMaterail.select = select;
        this.showDialogMaterail.orderNumber = this.orderNumber;
        this.showDialogMaterail.showDialog = true;
      }
    },
    inputDes(index) {
      this.dialogInputDes.showLabel = "QA SPEC";
      this.dialogInputDes.showDialog = true;
      this.dialogInputDes.choseIndex = index;
      this.dialogInputDes.valueDialog = this.dataProduct[index].QaSpec;
    },
    async confirmDes() {
      this.dataProduct[
        this.dialogInputDes.choseIndex
      ].QaSpec = this.dialogInputDes.valueDialog;
      this.dialogInputDes.dataInput = {
        orderNumber: this.orderNumber,
        orderItemNo: this.dataProduct[this.dialogInputDes.choseIndex].ItemNo,
        QaSpec: this.dataProduct[this.dialogInputDes.choseIndex].QaSpec,
        EmpCode: this.$store.state.username
      };
      this.loadingBtn = true;
      const { result } = await apiFacWipStatus.insertOrderItemDes(
        this.dialogInputDes.dataInput
      );
      setTimeout(() => {
        if (result === "ok") {
          //CLEAR DATA
          this.loadingBtn = false;
          this.dialogInputDes = {
            showDialog: false,
            IsEditDes: false,
            valueDialog: "",
            choseIndex: 0,
            showLabel: "",
            dataInput: {
              orderNumber: "",
              orderItemNo: "",
              QaSpec: "",
              EmpCode: ""
            }
          };
        } else {
          this.loadingBtn = false;
          alert("ข้อมูลผิดพลาด");
        }
      }, 500);
    }
  }
};
</script>

<style lang="scss">
.borderLeft {
  border-left: 1px solid rgb(214, 214, 214);
}

.borderRight {
  border-right: 1px solid rgb(214, 214, 214);
}
.borderHeaderTopLine {
  border-top: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.borderBottom {
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.v-data-table > .v-data-table__wrapper > table > thead > tr > th,
td {
  width: 1px !important;
  height: 1px !important;
}

.colorTextTitle {
  color: rgb(110, 108, 108);
}

.tableDetail table th {
  font-size: 14px !important;
  text-align: center;
  background-color: rgba(233, 233, 233, 0.644);
  height: 50px !important;
}
</style>
