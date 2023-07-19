<template>
  <v-app>
    <v-card class="fontSarabun ma-2">
      <div align="right" class="mr-2">
        <v-img :src="barCodeShow" width="120" />
      </div>
      <div class="fontSize24 mt-n2 mb-7" align="center">
        <b>กรุณาตรวจสอบและยืนยันบิล</b>
      </div>
      <v-row>
        <v-col>
          <b class="fontSize16">ผู้ทำรายการบิล :</b>
          {{ $store.state.fullName }} ({{ $store.state.username }})</v-col
        >
        <v-col>
          <b class="fontSize16">โอนจาก :</b>
          {{
            $store.state.FacToQa.StatusDetail.dataMaster.ProductionTeam
              ? $store.state.FacToQa.StatusDetail.dataMaster.ProductionTeam
              : ""
          }}</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <b class="fontSize16">วันที่ :</b>
          {{ $moment(BillDate).format("L") }} เวลา :
          {{ $moment(BillDate).format("LTS") }}
        </v-col>
        <v-col>
          <b class="fontSize16">โอนไป :</b>
          {{ "QA" }}</v-col
        >
      </v-row>
      <v-row>
        <v-col>
          <b class="fontSize16">เลขที่บิล :</b> {{ DocNumber + "00XXX" }}
        </v-col>
        <v-col>
          <b class="fontSize16">OrderNumber :</b>
          {{
            $store.state.FacToQa.StatusDetail.dataMaster.OrderNumber
              ? $store.state.FacToQa.StatusDetail.dataMaster.OrderNumber
              : ""
          }}</v-col
        >
      </v-row>
      <v-row>
        <v-col cols="6">
          <v-checkbox
            v-model="checkbox"
            label="ระบุผู้ตรวจสอบงานทั้ง Order :"
            class="mt-n1"
            @change="checkBoxChange()"
          />
        </v-col>

        <v-col cols="6">
          <b>ผู้รับ :</b> _________________
          <b>วันที่รับ :</b> _________________</v-col
        >
      </v-row>
      <v-row>
        <v-col cols="2">
          <v-autocomplete
            label="รหัสพนักงาน"
            :items="$store.state.FacToQa.StatusDetail.employeeQC"
            item-text="EmpCode"
            item-value="EmpCode"
            v-model="EmpQCBill"
            dense
            outlined
            class="mt-n6"
            :disabled="!checkbox"
            @change="reviseEmpQCAllItem()"
          />
        </v-col>
        <v-col cols="4">
          <v-autocomplete
            label="ชื่อผู้ตรวจสอบ"
            :items="$store.state.FacToQa.StatusDetail.employeeQC"
            item-text="EmpFullName"
            item-value="EmpCode"
            v-model="EmpQCBill"
            dense
            outlined
            class="mt-n6"
            :disabled="!checkbox"
            @change="reviseEmpQCAllItem()"
          />
        </v-col>
        <v-col cols="6">
          <div class="mt-n9">
            <v-checkbox
              label="แสดงเลขตามใบปะหน้า"
              color="red"
              v-model="isItemNoForFac"
            /></div
        ></v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-simple-table class="border" width="1500">
            <template v-slot:default>
              <thead>
                <tr align="center" justify="center" class="yellow">
                  <th class="text-center" width="100">
                    <div class="fontSize14"><b>รายการที่</b></div>
                  </th>
                  <th class="text-center">
                    <div class="fontSize14"><b>รายการสินค้า</b></div>
                  </th>
                  <th class="text-center" width="350">
                    <div class="fontSize14"><b>ผู้ตรวจงาน (Fac)</b></div>
                  </th>
                  <th class="text-center" width="100">
                    <div class="fontSize14"><b>จำนวนที่ส่ง</b></div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr
                  align="center"
                  v-for="(item, index) in dataTable"
                  :key="index"
                >
                  <td>
                    <div>
                      {{ index + 1 }}
                    </div>
                  </td>
                  <td align="center">
                    <v-img
                      :src="item.NewPict"
                      :lazy-src="$store.state.no_picture"
                      width="120"
                      class="text-left"
                    >
                      <v-chip
                        :color="isItemNoForFac ? 'red' : 'blue'"
                        dark
                        small
                      >
                        <span class="">{{
                          isItemNoForFac ? item.ItemNoForFac : item.OrderItemNo
                        }}</span></v-chip
                      >
                    </v-img>
                    <div>{{ item.ProductCode }}</div>
                    <!-- <div class="grey--text">{{ 2223521 }}</div> -->
                  </td>
                  <td class="text-center">
                    <v-row class="px-n1 mt-3">
                      <v-col cols="5">
                        <v-autocomplete
                          label="รหัสพนักงาน"
                          :items="$store.state.FacToQa.StatusDetail.employeeQC"
                          item-text="EmpCode"
                          item-value="EmpCode"
                          v-model="item.EmpQCItem"
                          dense
                          outlined
                          class="px-n1"
                        />
                      </v-col>
                      <v-col cols="7">
                        <v-autocomplete
                          label="ชื่อผู้ตรวจสอบ"
                          :items="$store.state.FacToQa.StatusDetail.employeeQC"
                          item-text="EmpFullName"
                          item-value="EmpCode"
                          v-model="item.EmpQCItem"
                          dense
                          outlined
                          class="px-n1"
                        />
                      </v-col>
                    </v-row>
                  </td>
                  <td class="text-center">
                    <div class="fontSize18">
                      <b>{{ item.QtySend.toLocaleString() }}</b>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>

      <v-row class="pb-4">
        <v-col align="center">
          <v-btn color="white" light @click="backtoStatus()">ยกเลิก</v-btn>
        </v-col>
        <v-col align="center">
          <v-btn color="success" @click="submitBill()" :loading="submitBtn"
            >ยืนยันบิล</v-btn
          ></v-col
        >
      </v-row>
    </v-card>
    <v-dialog
      v-model="dialogResult.showDialog"
      persistent
      :overlay="false"
      max-width="450px"
      transition="dialog-transition"
    >
      <v-card class="fontSarabun">
        <div align="right" class="pr-2">
          <v-btn color="blue" icon @click="successed(4)" :loading="loadingbtn">
            <v-icon large color="blue">mdi-printer</v-icon></v-btn
          >
        </div>

        <div align="center" class="pt-2">
          <div class="">
            <v-btn
              :color="dialogResult.success ? 'success' : 'red'"
              large
              outlined
              icon
              readonly
              height="80"
              width="80"
              ><v-icon large>{{ dialogResult.icon }}</v-icon></v-btn
            >
            <v-icon large height="100" width="100"></v-icon>
          </div>
          <div class="fontSize20 mt-2">
            <b>{{ dialogResult.title }}</b>
          </div>
          <div class="fontSize18 mt-2">
            {{ dialogResult.subtitle }}
          </div>

          <div class="fontSize18 py-5" v-if="dialogResult.success">
            <v-btn
              class="mx-2"
              color="green"
              width="80"
              @click="successed(1)"
              :loading="loadingbtn"
              ><div>
                <b>
                  โอน <br />
                  Orderอื่น</b
                >
              </div></v-btn
            >
            <v-btn
              class="mx-2"
              color="yellow"
              width="80"
              @click="successed(2)"
              :loading="loadingbtn"
              ><div><b>ดูบิลค้าง</b></div>
            </v-btn>
            <v-btn
              class="mx-2"
              color="grey lighten-3"
              width="80"
              @click="successed(3)"
              :loading="loadingbtn"
              ><div>
                <b
                  >ดูสถานะ <br />
                  Order</b
                >
              </div></v-btn
            >
            <v-btn
              class="mx-2"
              color="blue"
              width="100"
              @click="successed(5)"
              :loading="loadingbtn"
            >
              <v-icon color="">mdi-printer</v-icon><b>พิมพ์บิลสลิป</b>
            </v-btn>
          </div>
        </div>
      </v-card>
    </v-dialog>
  </v-app>
</template>

<script>
import apiCreatePDF from "../../services/apiCreatePDF";
import apiFacToQa from "../../services/apiFacToQa";

export default {
  name: "createbill-factoqa",
  data() {
    return {
      loadingbtn: false,
      isItemNoForFac: true,
      EmpQCBill: "",
      orderNumber: "",
      factory: "",
      checkbox: false,
      dataTable: [],
      dataCartInsert: [],
      BillDate: new Date(),
      barCodeShow: "",
      dialogSuccess: {},
      DocNumber: `QA${this.$moment(new Date()).format("YY")}${this.$moment(
        new Date()
      ).format("MM")}`,
      dialogResult: {
        showDialog: false,
        icon: "",
        title: "",
        subtitle: "",
        success: false,
        billNumber: ""
      },
      // employee: [],
      submitBtn: false
    };
  },
  async mounted() {
    if (this.$route.params.dataInput) {
      this.dataTable = this.$route.params.dataInput;
      this.dataTable.sort((a, b) =>
        a.OrderItemNo > b.OrderItemNo
          ? 1
          : b.OrderItemNo > a.OrderItemNo
          ? -1
          : 0
      );
      // this.propsValuesCart.forEach((item, index) => {
      //   this.dataCartInsert.push({
      //     itemNo: index + 1,
      //     JobNumber: item.JobNumber.trim(),
      //     QtySend: item.QtySend,
      //     WeightSend: item.WeightSend,
      //   });
      // });
      this.barCodeShow = apiCreatePDF.textToBase64Barcode(this.DocNumber);
    } else {
      await this.$router.push({
        name: "status-toqamaster"
      });
    }
  },
  methods: {
    reviseEmpQCAllItem() {
      // if (
      //   this.$store.state.FacToQa.StatusDetail.employeeQC
      //     .map(({ EmpCode }) => EmpCode)
      //     .includes(this.EmpQCBill)
      // ) {
      this.dataTable.forEach(obj => {
        obj.EmpQCItem = this.EmpQCBill;
      });
      // }
    },
    backtoStatus() {
      // this.$store.state.
      this.$router.go(-1);
    },
    checkBoxChange() {
      if (this.checkbox) {
        // console.log("Y");
        // this.$store.state.FacToQa.StatusDetail.valuesCart = this.dataTable;
        // console.log(this.$store.state.FacToQa.StatusDetail.valuesCart);
      } else {
        // console.log("N");
        // console.log(this.dataTable);
        // console.log(this.$store.state.FacToQa.StatusDetail.valuesCart);
        // this.dataTable = this.$store.state.FacToQa.StatusDetail.valuesCart;
        // console.log(this.$store.state.FacToQa.StatusDetail.valuesCart);
      }
    },
    async submitBill() {
      this.submitBtn = true;
      // console.log(this.$store.state.FacToQa.StatusDetail);
      // console.log(this.dataTable);
      const dataCreate = {
        orderNumber: this.$store.state.FacToQa.StatusDetail.dataMaster
          .OrderNumber,
        docPrefix: this.DocNumber,
        sender: this.$store.state.username,
        billItem: this.dataTable.map((obj, index) => {
          return {
            bill_item: index + 1,
            OrderItemNo: obj.OrderItemNo,
            ProductID: obj.ProductID,
            QtySend: obj.QtySend,
            QCPerson: obj.EmpQCItem
          };
        })
      };
      // console.log(dataCreate);
      const { result, billNumber } = await apiFacToQa.createBill(dataCreate);
      if (result === "ok") {
        this.submitBtn = false;
        this.dialogResult = {
          showDialog: true,
          icon: "mdi-check-bold",
          title: `เลขที่บิล : ${billNumber}`,
          subtitle: `บันทึกข้อมูลเรียบร้อยแล้ว กรุณาเลือกเมนูเพื่อดำเนินการต่อ`,
          success: true,
          billNumber: billNumber
        };
      } else {
        this.submitBtn = false;
        this.dialogResult = {
          showDialog: true,
          icon: "mdi-close-circle",
          title: `ไม่สามารถบันทึกข้อมูลได้`,
          subtitle: `กรุณาลองใหม่อีกครั้งหรือติดต่อแผนก IT`,
          success: false
        };
      }
    },
    async successed(action) {
      // console.log(action);
      const { result, data } = await apiFacToQa.getBillByJob({
        qaJobNumber: this.dialogResult.billNumber,
        isJob: 2
      });

      switch (action) {
        case 1:
          this.$store.state.FacToQa.StatusDetail.dataMaster = null;
          this.$store.state.FacToQa.StatusDetail.valuesCart = [];
          await this.$router.push({
            name: "status-toqamaster"
          });
          this.dialogResult.billNumber = "";
          this.$store.state.FacToQa.tab = "tab-1";
          break;
        case 2:
          // this.$store.state.FacToQa.filterQaBill = {
          //   orderFilter: "",
          //   statusBill: ["", "1"],
          //   isReceive: false,
          // };
          this.$store.state.FacToQa.StatusDetail.dataMaster = null;
          this.$store.state.FacToQa.StatusDetail.valuesCart = [];
          this.$store.state.FacToQa.StatusDetail.gotoqaBill = true;
          await this.$router.push({
            name: "qabill-master"
          });
          this.dialogResult.billNumber = "";
          this.$store.state.FacToQa.tab = "tab-2";
          break;
        case 3:
          this.$store.state.FacToQa.StatusDetail.valuesCart = [];
          this.$router.go(-1);
          this.dialogResult.billNumber = "";
          this.$store.state.FacToQa.tab = "tab-1";
          break;
        case 4:
          this.loadingbtn = true;
          if (result === "ok") {
            await apiCreatePDF.printBillQa(data);
            this.$store.state.FacToQa.StatusDetail.valuesCart = [];
            setTimeout(() => {
              this.$router.go(-1);
              this.$store.state.FacToQa.tab = "tab-1";
              this.loadingbtn = false;
            }, 1000);
          }
          break;
        case 5:
          this.loadingbtn = true;
          if (result === "ok") {
            await apiCreatePDF.printFacToQaBillSlip(data);
            this.$store.state.FacToQa.StatusDetail.valuesCart = [];
            setTimeout(() => {
              this.$router.go(-1);
              this.$store.state.FacToQa.tab = "tab-1";
              this.loadingbtn = false;
            }, 1000);
          }
          break;

        default:
          break;
      }
    }
  }
};
</script>

<style></style>
