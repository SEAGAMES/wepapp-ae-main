<template>
  <v-container class="fontSarabun">
    <template>
      <v-row>
        <v-spacer></v-spacer>
        <h1 class="text-bold mt-5">ใบเเจ้งซื้อ Purchase Request</h1>
        <v-spacer></v-spacer>
      </v-row>
      <v-row>
        <!-- EmpPict -->
        <v-col cols="2" class="ml-3">
          <img v-bind:src="`${EmpPict}`" width="120" />
        </v-col>
        <v-col cols="8" class="mt-3">
          <span>
            <b> ผู้ขอสั่งซื้อ : </b>
            <span class="pl-4 brown--text">{{
              dataMaster.Request_FullName
            }}</span>
          </span>
          <br />
          <span>
            <b> เเผนก : </b>
            <span class="pl-11 brown--text">{{ dataMaster.SectionName }}</span>
          </span>
          <br />

          <!-- เพิ่มมาใหม่ดึงไม่เหมือนชาวบ้าน จากที่พี่จีให้เพิ่มตอนหลังเพื่อดึงข้อมูลฝ่ายมาเเสดง 19/10/2564 -->
          <span>
            <b> ฝ่าย : </b>
            <span class="pl-14 brown--text">{{
              dataMaster.position_name
            }}</span>
          </span>
          <br />

          <span>
            <b> เบอร์ภายใน : </b>
            <span class="pl-2 brown--text">{{ dataMaster.Phone_Number }}</span>
          </span>
          <br />

          <span>
            <b> เลขที่บิล : </b>
            <span class="pl-7 brown--text">{{
              dataMaster.Purchase_Bill_Doc
            }}</span>
          </span>
          <br />
          <span>
            <b> วันที่ขอซื้อ : </b>
            <span class="pl-4 brown--text">{{
              dataMaster.Bill_Date | moment("L")
            }}</span>
          </span>
        </v-col>
        <v-col>
          <td align="center">
            <v-btn
              color="#f39C12"
              v-if="statusCode === '0'"
              dark
              small
              width="120"
            >
              <v-icon size="15">mdi-alarm</v-icon>รอการอนุมัติ
            </v-btn>
            <v-btn
              color="#40C4FF"
              align="center"
              v-if="statusCode === '1'"
              @click="changeStatus2()"
              dark
              smallv
              width="120"
            >
              <v-icon size="15">mdi-clipboard-check</v-icon
              ><span class="ml-1">อนุมัติเเล้ว</span>
            </v-btn>
            <v-btn
              color="#FF7043"
              align="center"
              v-if="statusCode === '2'"
              @click="changeStatus2()"
              dark
              small
              width="120"
            >
              <v-icon size="15">mdi-clipboard-check</v-icon
              ><span class="ml-1">รอจัดซื้อ</span>
            </v-btn>
            <v-btn
              small
              color="#0000FF"
              align="center"
              full-width
              v-if="statusCode === '3'"
              @click="changeStatus2()"
              dark
              width="120"
            >
              <v-icon size="15">mdi-cart-arrow-down</v-icon>จัดเตรียมสินค้า
            </v-btn>
            <v-btn
              color="#64DD17"
              align="center"
              v-if="statusCode === '4'"
              @click="changeStatus2()"
              dark
              small
              width="120"
            >
              <v-icon size="15">mdi-package-variant-closed</v-icon
              ><span class="ml-1">สินค้าพร้อมรับ</span>
            </v-btn>
            <v-btn
              color="#00a65a"
              align="center"
              v-if="statusCode === '5'"
              @click="changeStatus2()"
              dark
              small
              width="120"
            >
              <v-icon size="15">mdi-account-check</v-icon
              ><span class="ml-1">รับสินค้าเเล้ว</span>
            </v-btn>
            <v-btn
              color="#F44336"
              align="center"
              v-if="statusCode === '6'"
              @click="changeStatus2()"
              dark
              small
              width="120"
            >
              <v-icon size="15">mdi-window-close</v-icon
              ><span class="ml-1">ไม่อนุมัติ</span>
            </v-btn>
          </td>
          <td v-if="$store.getters.policyCode === '03' ||  $store.getters.policyCode === '08'">
            <v-icon class="ml-2" color="orange" @click="editItem()"
                  >edit</v-icon
                >
          </td>
        </v-col>
      </v-row>
      <v-col>
        <v-card>
          <v-simple-table class="border" width="1500">
            <template v-slot:default>
              <thead>
                <tr align="center" justify="center" class="border BGColor">
                  <th class="text-center" width="80">รายการ</th>
                  <th class="text-center" width="200">ชื่อ</th>
                  <th class="text-center" width="150">Remark</th>
                  <th class="text-center" width="80">จำนวน</th>
                  <th class="text-center" width="100">หน่วย</th>
                  <th class="text-center" width="80">ราคารวม(บ.)</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(item, index) in billOrder"
                  :key="item.ITEM_NO"
                  align="center"
                  justify="center"
                >
                  <td>{{ item.ITEM_NO }}</td>
                  <td>{{ item.ITEM_NAME }}</td>
                  <td>{{ item.Remark }}</td>
                  <td>{{ item.ITEM_Qty }}</td>
                  <td v-if="index + 1 < billOrder.length">
                    {{ item.UNIT_NAME }}
                  </td>
                  <td v-if="index + 1 >= billOrder.length">
                    <h3>{{ item.UNIT_NAME }}</h3>
                  </td>
                  <td v-if="index + 1 < billOrder.length">
                    {{ Number(item.PRICE).toLocaleString() }}
                  </td>
                  <td v-if="index + 1 >= billOrder.length">
                    <h3>{{ Number(item.PRICE).toLocaleString() }}</h3>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
        <v-row>
          <v-col cols="1" class="ml-3 mt-7">
            <img v-bind:src="`${Inspactor_Pict}`" width="100" />
          </v-col>
          <v-col cols="4">
            <v-card height="110" class="mt-4 ml-3" color="blue lighten-5">
              <v-checkbox
                v-model="appove"
                color="amber lighten-1"
                class="mt-7"
                label="ข้าพเจ้าได้อ่านเอกสารใบสั่งซื้อเเล้ว เเละข้าพเจ้าอนุมัติการสั่งซื้อนี้"
                @change="changeStatusAppove()"
                :disabled="
                  dataMaster.Inspactor_ID != null ||
                    $store.getters.policyAppove !== '1'
                "
              ></v-checkbox>
              <b>ผู้อนุมัติการสั่งซื้อ : {{ Inspactor_ID }} </b>
            </v-card>
          </v-col>
        </v-row>
        <v-card-actions class="mt-2">
          <v-spacer></v-spacer>
          <v-btn color="error" @click="$router.back()">กลับหน้าหลัก</v-btn>
          <v-btn class="ml-5" @click="printSelect()">Print</v-btn>
        </v-card-actions>
      </v-col>

      <!-- Popup เปลี่ยนสถานะ -->
      <v-dialog
        v-model="changeStatusShowPop"
        max-height="600"
        max-width="600"
        class="fontPrompt"
      >
        <v-form class="fontPrompt">
          <v-card class="pa-5">
            <v-row>
              <v-col>
                <v-select
                  v-model="DataStatuschange.Status_Code"
                  :items="statusShow"
                  item-value="id"
                  item-text="Status"
                  label="เปลี่ยนสถานะ"
                  outlined
                  color="blue"
                />
              </v-col>
            </v-row>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn @click="changeStatusShowPop = false">Cancle</v-btn>
              <v-btn color="error" @click="confirmChangeStatus()"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-form>
      </v-dialog>

      <!-- snackSuccessUpdate  -->
      <div class="text-center ma-2">
        <v-snackbar
          v-model="snackBarUpdate.snackSuccessUpdate"
          :timeout="3400"
          top
        >
          <div class="fontSarabun fontSize16 text-center">
            เปลี่ยนสถานะสำเร็จ
            <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
          </div>
        </v-snackbar>

        <v-snackbar
          v-model="snackBarUpdate.snackFailUpdate"
          :timeout="3400"
          top
        >
          <div class="fontSarabun fontSize16 text-center">
            เปลี่ยนสถานะไม่สำเร็จ
            <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
          </div>
        </v-snackbar>
      </div>
    </template>
  </v-container>
</template>

<script>
import apiPurchaseRequest from "../../services/apiPurchaseRequest";
import apiCreatePDF from "../../services/apiCreatePDF";
import apiRepairDoc from "../../services/apiRepairDoc";
import moment from "moment";
export default {
  data() {
    return {
      SectionSelect: [],
      statusCode: "",
      getPurchaseBillMaster: [],
      dataMaster: [],
      Inspactor_ID: "",
      billOrder: [],
      billByID: [],
      inSpacter_ID: "",
      Request_ID: "",
      EmpPict: [],
      Inspactor_Pict: [],
      PdfDate: "",
      appove: null,
      date: "",
      time: "",

      DataStatuschange: [],
      changeStatusShowPop: false,
      snackBarUpdate: {
        snackSuccessUpdate: false,
        snackFailUpdate: false,
      },
      headers: [
        {
          text: "รายการ",
          value: "order_nuber",
          sortable: false,
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
        },
        {
          text: "ชื่อ",
          align: "center",
          justify: "center",
          value: "ITEM_NAME",
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
          sortable: false,
        },
        {
          text: "Remark",
          align: "center",
          justify: "center",
          value: "Remark",
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
          sortable: false,
        },
        {
          text: "จำนวน",
          value: "Qty",
          sortable: false,
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
        },
        {
          text: "หน่วย",
          value: "UNIT_NAME",
          sortable: false,
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
        },
        {
          text: "ราคา(บ.)",
          value: "PRICE",
          sortable: false,
          align: "center",
          justify: "center",
          class: "light-blue lighten-4",
        },
      ],
      statusShow: [
        {
          id: "0",
          Status: "รอการอนุมัติ",
        },
        {
          id: "1",
          Status: "อนุมัติเเล้ว",
        },
        {
          id: "2",
          Status: "รอจัดซื้อ",
        },
        {
          id: "3",
          Status: "กำลังจัดเตรียมสินค้า",
        },
        {
          id: "4",
          Status: "สินค้าพร้อมรับ",
        },
        {
          id: "5",
          Status: "รับสินค้าเเล้ว",
        },
        {
          id: "6",
          Status: "ไม่อนุมัติ",
        },
      ],
      statusShow2: [
        {
          id: "0",
          Status: "รอการอนุมัติ",
        },
        {
          id: "1",
          Status: "อนุมัติเเล้ว",
        },
        {
          id: "2",
          Status: "รอจัดซื้อ",
        },
        {
          id: "3",
          Status: "กำลังจัดเตรียมสินค้า",
        },
        {
          id: "4",
          Status: "สินค้าพร้อมรับ",
        },
        {
          id: "5",
          Status: "รับสินค้าเเล้ว",
        },
        {
          id: "6",
          Status: "ไม่อนุมัติ",
        },
      ],
    };
  },

  async mounted() {
    if (
      this.$store.state.purchaseDetail.dataHeader == null ||
      this.$store.state.purchaseDetail.dataHeader == undefined
    ) {
      this.$store.state.purchaseDetail.dataHeader = {};
    } else {
      this.dataMaster = this.$store.getters.dataPurchaseDetail;

      await this.getBillOrder(this.dataMaster.Purchase_Bill_ID);
      this.EmpPict = this.dataMaster.Request_EmpPict;

      if (this.dataMaster.Inspactor_ID != null) {
        this.Inspactor_ID = this.dataMaster.Inspactor_FullName;
        this.Inspactor_Pict = this.dataMaster.Inspactor_EmpPict;
        this.appove = true;
      }
    }
    this.statusCode = this.$store.state.purchaseDetail.dataHeader.Status_Code;
  },
  methods: {
    async getBillOrder(Bill_ID) {
      this.billOrder = await apiPurchaseRequest.getBillOrder(Bill_ID);
    },

    async updateStatus_Code(Status_Code, bill_ID) {
      const result = await apiPurchaseRequest.updateStatus(
        Status_Code,
        bill_ID
      );
    },

    async updateInspactor(Emp_Code, bill_ID) {
      const result = await apiPurchaseRequest.updateInspactor(
        Emp_Code,
        bill_ID
      );
    },

    async changeStatusAppove() {
      if (this.dataMaster.Status_Code >= 0) {
        if (this.$store.getters.policyAppove === "1") {
          if (this.dataMaster.Status_Code == 0) {
            if (confirm("คุณต้องอนุมัติใบเเจ้งซื้อนี้ใช่หรือไม่ ?")) {
              //เมื่อติ๊กอนุมัติจะเปลี่ยนสถานะรออนุมัติ(0) เป็นอนุมัติเเล้ว(1)
              this.appove = true;
              this.updateStatus_Code(1, this.dataMaster.Purchase_Bill_ID);
              this.inSpacter_ID = localStorage.getItem("username");
              this.updateInspactor(
                this.inSpacter_ID,
                this.dataMaster.Purchase_Bill_ID
              );
              const result = await apiPurchaseRequest.getEmployee(
                this.inSpacter_ID
              );
              this.Inspactor_ID = result[0].EmpFullName;
              this.Inspactor_Pict = result[0].EmpPict;
            } else {
              this.appove = false;
            }
          } else {
            this.appove = true;
            this.updateStatus_Code(
              this.dataMaster.Status_Code,
              this.dataMaster.Purchase_Bill_ID
            );
            this.inSpacter_ID = localStorage.getItem("username");
            this.updateInspactor(
              this.inSpacter_ID,
              this.dataMaster.Purchase_Bill_ID
            );
          }
        }
        if (this.appove == true) {
        }
      }
    },

    changeStatus2() {
      //this.statusShow = this.statusShow2;
      if (
        this.$store.getters.policyCode === "03" ||
        this.$store.getters.policyCode === "08"
      ) {
        //ถ้าเป็นพี่จี ให้กดเปลี่ยนสถานะได้แต่เปลี่ยนสถานะเสร็จแล้วไม่ได้
        if (
          this.statusCode !== "5" &&
          this.$store.getters.policyCode === "08"
        ) {
          this.statusShow = this.statusShow2;
          if (this.statusCode === "1") {
            this.changeStatusShowPop = true;
            this.DataStatuschange.Status_Code = "2";
            this.DataStatuschange.Purchase_Bill_ID = this.dataMaster.Purchase_Bill_ID;
            this.statusShow = this.statusShow.filter((i) => {
              return i.id === "2" || i.id === "3" || i.id === "6";
            });
          } else if (this.statusCode === "2") {
            this.changeStatusShowPop = true;
            this.DataStatuschange.Status_Code = "3";
            this.DataStatuschange.Purchase_Bill_ID = this.dataMaster.Purchase_Bill_ID;
            this.statusShow = this.statusShow.filter((i) => {
              return i.id === "3";
            });
          } else if (this.statusCode === "3") {
            this.changeStatusShowPop = true;
            this.DataStatuschange.Status_Code = "4";
            this.DataStatuschange.Purchase_Bill_ID = this.dataMaster.Purchase_Bill_ID;
            this.statusShow = this.statusShow.filter((i) => {
              return i.id === "4";
            });
          }

          //ถ้าเป็น SuperUser ให้กดดูได้เลย
        } else if (this.$store.getters.policyCode === "03") {
          this.changeStatusShowPop = true;
          this.DataStatuschange.Status_Code = this.statusCode;
          this.DataStatuschange.Purchase_Bill_ID = this.dataMaster.Purchase_Bill_ID;
        }
      }
      if (
        this.$store.state.username === item.Request_ID &&
        this.statusCode === "4"
      ) {
        this.changeStatusShowPop = true;
        this.DataStatuschange.Status_Code = "5";
        this.DataStatuschange.Purchase_Bill_ID = this.dataMaster.Purchase_Bill_ID;
        this.statusShow = this.statusShow.filter((i) => {
          return i.id === "5";
        });
      }
    },

    async confirmChangeStatus() {
      if (this.DataStatuschange.Status_Code !== null) {
        this.statusCode = this.DataStatuschange.Status_Code;
        const result = await apiPurchaseRequest.updateStatus(
          this.statusCode,
          this.DataStatuschange.Purchase_Bill_ID
        );
        if (result.statusText === "OK") {
          this.snackBarUpdate.snackSuccessUpdate = true;
          this.changeStatusShowPop = false;
        } else {
          this.snackBarUpdate.snackFailUpdate = true;
          this.changeStatusShowPop = false;
        }
      }
    },

    async editItem() {
      if (this.$store.getters.policyCode === "03" || this.$store.getters.policyCode === "08") {
          localStorage.setItem(
            "Purchase_Bill_ID",
            JSON.stringify(this.billOrder[0].Purchase_Bill_ID)
          );
          this.$router.push("/purchase-edit").catch(() => {})
        }
    },

    printSelect() {
      if (this.dataMaster.Status_Code == 5) {
        this.testPrint();
      } else {
        this.testPrint();
      }
    },
    async testPrint() {
      //loadImg
      const logoHeader = await this.convertImg(
        "http://192.168.3.5:3000/picture/PICTURE2/Art%20Event%20Logo2.jpg"
      );

      var rows = [];
      rows.push(["ลำดับ", "รหัสสินค้า", "รายการ", "จำนวน", "หน่วย", "ราคารวม"]);
      this.billOrder.forEach((data, index) => {
        var x = data.ITEM_NAME;
        if (data.ITEM_ID == undefined) {
          data.ITEM_ID = " ";
        }
        if (data.ITEM_NAME == undefined) {
          data.ITEM_NAME = " ";
        }
        if (data.ITEM_Qty == undefined) {
          data.ITEM_Qty = " ";
        }
        if (data.ITEM_UNIT_ID == 0) {
          data.ITEM_NAME = data.Remark;
        }

        //จัดการกับลำดับเเละให้บรรทัดสุดท้ายว่าง
        index = index + 1;
        if (index == this.billOrder.length) {
          index = " ";
        }

        rows.push([
          index,
          data.ITEM_ID,
          data.ITEM_NAME,
          data.ITEM_Qty,
          data.UNIT_NAME,
          Number(data.PRICE).toLocaleString(),
        ]);
      });

      const docDefinition = {
        pageSize: "A4",
        content: [
          {
            columns: [
              {
                image: logoHeader,
                width: 150,
                alignment: "center",
              },
            ],
          },
          " ",
          " ",
          {
            text: "ใบเเจ้งซื้อ Purchase Request ",
            alignment: "center",
            fontSize: 23,
            bold: true,
          },
          " ",
          " ",
          {
            columns: [
              {
                text: `ผู้ขอสั่งซื้อ :  ${this.dataMaster.Request_FullName}  `,
                width: 225,
              },
              {
                text: "",
                width: 150,
              },
              {
                text: `วันที่เเจ้งซื้อ :  ${moment(
                  this.dataMaster.Bill_Date
                ).format("L")}  `,
                width: 225,
              },
            ],
          },
          {
            columns: [
              {
                text: `เเผนก :  ${this.dataMaster.SectionName} / ${this.dataMaster.position_name}  `,
                width: 225,
              },
              {
                text: "",
                width: 150,
              },
              {
                text: `เวลา :  ${moment(this.dataMaster.Bill_Date).format(
                  "LT"
                )} น. `,
                width: 225,
              },
            ],
          },
          {
            columns: [
              {
                text: `เบอร์ภายใน :  ${this.dataMaster.Phone_Number}  `,
              },
            ],
          },
          {
            columns: [
              {
                text: `เลขที่บิล :  ${this.dataMaster.Purchase_Bill_Doc}  `,
              },
            ],
          },

          " ",
          {
            width: "*",
            table: {
              widths: [30, 100, 200, 35, 45, 80],
              body: rows,
            },
          },
          " ",
          " ",
          {
            columns: [
              {
                text:
                  "ผู้อนุมัติ : .................................................",
                style: "textAlign",
              },
              { text: "", width: 60 },
              {
                text:
                  "ผู้รับสินค้า : .................................................",
                style: "textAlign",
              },
            ],
            margin: [0, 25, 0, 0],
          },
          {
            columns: [
              {
                text: "",
                style: "textAlign",
              },
              { text: "", width: 150 },
              {
                text: "วันที่ : _________/_________/____________",
                style: "textAlign",
              },
            ],
            margin: [0, 25, 0, 0],
          },
        ],

        defaultStyle: {
          font: "Sarabun",
        },
      };
      await apiCreatePDF.createPDF(docDefinition);
    },
    async testPrint2() {
      //loadImg
      const logoHeader = await this.convertImg(
        "http://192.168.3.5:3000/picture/PICTURE2/Art%20Event%20Logo2.jpg"
      );

      var rows = [];
      rows.push(["ลำดับ", "รหัสสินค้า", "รายการ", "จำนวน", "หน่วย", "ราคารวม"]);
      this.billOrder.forEach((data, index) => {
        var x = data.ITEM_NAME;
        if (data.ITEM_ID == undefined) {
          data.ITEM_ID = " ";
        }
        if (data.ITEM_NAME == undefined) {
          data.ITEM_NAME = " ";
        }
        if (data.ITEM_Qty == undefined) {
          data.ITEM_Qty = " ";
        }
        if (data.ITEM_UNIT_ID == 0) {
          data.ITEM_NAME = data.Remark;
        }

        //จัดการกับลำดับเเละให้บรรทัดสุดท้ายว่าง
        index = index + 1;
        if (index == this.billOrder.length) {
          index = " ";
        }

        rows.push([
          index,
          data.ITEM_ID,
          data.ITEM_NAME,
          data.ITEM_Qty,
          data.UNIT_NAME,
          Number(data.PRICE).toLocaleString(),
        ]);
      });

      if (this.dataMaster.Receive_Date == null) {
        this.date = " ";
      } else {
        this.date = moment(this.dataMaster.Receive_Date).format("L");
        this.time = moment(this.dataMaster.Receive_Date).format("LT");
      }

      const docDefinition = {
        pageSize: A4,
        content: [
          {
            columns: [
              {
                image: logoHeader,
                width: 150,
                alignment: "center",
              },
            ],
          },
          " ",
          " ",
          {
            text: "ใบเเจ้งซื้อ Purchase Request ",
            alignment: "center",
            fontSize: 23,
            bold: true,
          },
          " ",
          " ",
          {
            columns: [
              {
                text: `ผู้ขอสั่งซื้อ :  ${this.dataMaster.Request_FullName}  `,
                width: 225,
              },
              {
                text: "",
                width: 150,
              },
              {
                text: `วันที่เเจ้งซื้อ :  ${moment(
                  this.dataMaster.Bill_Date
                ).format("L")}  `,
                width: 225,
              },
            ],
          },
          {
            columns: [
              {
                text: `เเผนก :  ${this.dataMaster.SectionName} / ${this.dataMaster.position_name}  `,
                width: 225,
              },
              {
                text: "",
                width: 150,
              },
              {
                text: `เวลา :  ${moment(this.dataMaster.Bill_Date).format(
                  "LT"
                )} น. `,
                width: 225,
              },
            ],
          },
          {
            columns: [
              {
                text: `เบอร์ภายใน :  ${this.dataMaster.Phone_Number}  `,
              },
            ],
          },
          {
            columns: [
              {
                text: `เลขที่บิล :  ${this.dataMaster.Purchase_Bill_Doc}  `,
              },
            ],
          },
          " ",
          {
            width: "*",
            table: {
              widths: [30, 100, 200, 35, 45, 80],
              body: rows,
            },
          },
          " ",
          " ",
          " ",
          " ",
          {
            columns: [
              {
                text: `ผู้อนุมัติ : .................................................`,
                width: 225,
              },
              {
                text: ``,
                width: 80,
              },
              {
                text: `ผู้รับสินค้า : ...............................................`,
                width: 230,
              },
            ],
          },
          " ",
          {
            columns: [
              {
                text: ``,
                width: 215,
              },
              {
                text: ``,
                width: 90,
              },
              {
                text: `วันที่รับสินค้า :  ${this.date}`,
                width: 220,
              },
            ],
          },
          {
            columns: [
              {
                text: ``,
                width: 215,
              },
              {
                text: ``,
                width: 92,
              },
              {
                text: `เวลา : ${this.time} น.`,
                width: 235,
              },
            ],
          },
        ],

        defaultStyle: {
          font: "Sarabun",
        },
      };
      await apiCreatePDF.createPDF(docDefinition);
    },
    async convertImg(Url) {
      const result = await apiRepairDoc.convertImg(Url);
      return result;
    },
  },
};
</script>

<style></style>
