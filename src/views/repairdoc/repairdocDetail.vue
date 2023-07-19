<template>
  <v-container grid-list-xs class="fontPrompt">
    <template>
      <v-row class="borderTop mt-5 ml-5 mr-5">
        <v-col lg="2" md="2" sm="2" class="BGColorWhiteBlue">
          <v-img
            :src="dataBill.ContactPersonPict"
            width="150"
            align="center"
            justify="center"
          />
        </v-col>

        <v-col lg="4" md="4" sm="4" class="BGColorWhiteBlue">
          <span class="fontSize18">
            <b> ผู้แจ้งซ่อม: </b>
            <span class="pl-5 brown--text">{{
              dataBill.ContactPersonName
            }}</span>
          </span>
          <br />

          <span class="fontSize18">
            <b> วันที่แจ้ง : </b>
            <span class="pl-6 brown--text"
              >({{ $moment(dataBill.JobDate).format("dd") }})
              {{ $moment(dataBill.JobDate).format("L") }}
              ({{ $moment(dataBill.JobDate).format("LT") }} น.)</span
            >
          </span>
          <br />

          <span class="fontSize18">
            <b> วันที่ต้องการให้เสร็จ : </b>
            <span class="pl-0 brown--text"
              >({{ $moment(dataBill.DueDate).format("dd") }})
              {{ $moment(dataBill.DueDate).format("L") }}</span
            >
          </span>
          <br />

          <span class="fontSize18">
            <b> เลขที่เอกสาร : </b>
            <span class="pl-0 brown--text">{{ dataBill.BillDoc }}</span>
          </span>
        </v-col>

        <v-col lg="2" md="2" sm="2" class="BGColorWhiteYellow">
          <div align="center">
            <v-img :src="dataBill.NotifierPict" width="150" />
          </div>

          <!-- <v-img :src="$store.getters.dataMouldDetail.NewPict"></v-img> -->
          <!-- <v-img :src="$store.getters.pictDetail"></v-img> -->
          <div class="my-3" align="center">
            <v-btn
              color="#0000FF"
              v-if="dataBill.Status === '0'"
              @click="changeStatus2(item)"
              dark
              small
              width="100"
            >
              <v-icon size="16">mdi-briefcase-download</v-icon>แจ้งซ่อมแล้ว
            </v-btn>
            <v-btn
              color="#f39C12"
              v-if="dataBill.Status === '1'"
              @click="changeStatus2(item)"
              dark
              small
              width="100"
            >
              <v-icon size="16">mdi-wrench</v-icon
              ><span class="ml-1">รอซ่อม</span>
            </v-btn>
            <v-btn
              small
              color="#ff0000"
              full-width
              v-if="dataBill.Status === '2'"
              @click="changeStatus2(item)"
              dark
              width="100"
            >
              <v-icon size="16">mdi-cart-arrow-down</v-icon>รออะไหล่
            </v-btn>

            <v-btn
              small
              color="#00a65a"
              full-width
              v-if="dataBill.Status === '3'"
              @click="changeStatus2(item)"
              dark
              width="100"
            >
              <v-icon size="16">mdi-emoticon-outline</v-icon
              ><span class="ml-1">ซ่อมเสร็จ</span>
            </v-btn>

            <v-btn
              small
              color="grey lighten-1"
              full-width
              v-if="dataBill.Status === '4'"
              @click="changeStatus2(item)"
              dark
              width="100"
            >
              <v-icon size="16">mdi-emoticon-outline</v-icon
              ><span class="">ตรวจสอบแล้ว</span>
            </v-btn>
          </div>
        </v-col>

        <v-col lg="4" md="4" sm="4" align="left" class="BGColorWhiteYellow">
          <span class="fontSize18">
            <b> ชื่อผู้ดำเนินการ : </b>
            <span class="brown--text">
              {{ dataBill.NotifierName }}
            </span>
          </span>
          <br />

          <span class="fontSize18">
            <b> วันที่แก้ไขเสร็จ : </b>
            <span class="brown--text" v-if="dataBill.FinishDate"
              >({{ $moment(dataBill.FinishDate).format("dd") }})
              {{ $moment(dataBill.FinishDate).format("L") }}</span
            >
          </span>
          <br />
          <div class="fontSize18">
            <b> เวลา : </b>
            <span class="brown--text" v-if="dataBill.FinishDate">
              {{ $moment(dataBill.FinishDate).format("LT") }} น.
            </span>
          </div>

          <div class="fontSize18">
            <b> วิธีการแก้ไข : </b>
            <span class="brown--text">
              {{ dataBill.RepairDes }}
            </span>
          </div>
        </v-col>
      </v-row>

      <v-row class="borderBottom ml-5 mr-5 mt-n3">
        <v-col lg="6" md="6" sm="6" align="left" class="BGColorWhiteBlue">
          <span class="fontSize18">
            <b> อุปกรณ์ที่เสีย : </b>
            <span class="brown--text">
              {{ dataBill.CategoryName }}
            </span>
          </span>
          <br />
          <span class="fontSize18">
            <b>
              <!-- เพิ่ม -->
              {{
                dataBill.RepairBillNo !== "" ? "เลขที่บิล : " : "เลขเครื่อง : "
              }}
            </b>
            <!-- เพิ่ม -->
            <span class="pl-6 brown--text">
              {{
                dataBill.RepairBillNo !== ""
                  ? dataBill.RepairBillNo
                  : dataBill.DeviceNo
              }}
            </span>
          </span>
          <br />

          <span class="fontSize18">
            <b> อาการเสีย : </b>
            <span class="pl-6 brown--text">
              {{ dataBill.BrokenDes }}
            </span>
          </span>
          <br />

          <span class="fontSize18">
            <b> ชั้นที่แจ้ง : </b>
            <span class="pl-9 brown--text">
              {{ dataBill.FloorName }}
            </span>
          </span>
          <br />

          <div class="fontSize18">
            <b> ห้องที่แจ้ง : </b>
            <span class="pl-6 brown--text">
              {{ dataBill.RoomName }}
            </span>
          </div>

          <div class="fontSize18">
            <b> เบอร์โทรผู้แจ้ง : </b>
            <span class="pl-5 brown--text">
              {{ dataBill.Tel }}
            </span>
          </div>
        </v-col>

        <v-col lg="6" md="6" sm="6" align="left" class="BGColorWhitePink">
          <v-row>
            <v-checkbox
              label="ข้าพเจ้าได้อ่านเอกสารใบแจ้งแล้ว และข้าพเจ้าอนุมัติใบแจ้งซ่อมนี้"
              v-model="dataBill.ApprovStatus"
              value="1"
              class="ml-10"
              @change="confirmDlg = true"
              :disabled="
                dataBill.ApprovStatus === '1' ||
                  $store.getters.policyAppove !== '1'
              "
            />
          </v-row>
          <v-row>
            <h3 class="ml-10">
              ผู้อนุมัติการแจ้งซ่อม :
              <u class="pl-1">
                {{ dataBill.ApprovName }}
              </u>
            </h3>
          </v-row>
          <v-row>
            <v-col lg="5" md="5" sm="5">
              <v-img :src="dataBill.ApproverPict" width="120" class="ml-10" />
            </v-col>
          </v-row>
        </v-col>
      </v-row>

      <!-- ประวัดิการซ่อม -->

      <v-row class="borderTable mr-5 ml-5">
        <v-col lg="12" md="12" sm="12">
          <v-row align="center" justify="center">
            <h3 class="fontPrompt20"><b>ประวัติการแก้ไขและซ่อมอุปกรณ์</b></h3>
          </v-row>
        </v-col>
        <v-col lg="12" md="12" sm="12">
          <v-row align="center" justify="center">
            <v-simple-table class="border" width="1500">
              <template v-slot:default>
                <thead>
                  <tr align="center" justify="center" class="border BGColor">
                    <th class="text-center" width="80">วันที่แจัง</th>
                    <th class="text-center" width="80">เลขที่เอกสาร</th>
                    <th class="text-center" width="200">ผู้แจ้ง</th>
                    <th class="text-center" width="300">รายละเอียดเสีย</th>
                    <th class="text-center" width="300">รายละเอียดการซ่อม</th>
                    <th class="text-center" width="80">ค่าซ่อม</th>
                    <th class="text-center" width="200">ค่าอะไหล่</th>
                    <th class="text-center" width="200">วันที่แก้ไขเสร็จ</th>
                    <th class="text-center" width="200">ผู้ดำเนินการ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    v-for="item in historyBill"
                    :key="item.ID"
                    align="center"
                    justify="center"
                  >
                    <td>
                      ({{ item.dowJobDate }})_{{
                        item.JobDate | moment("DD/MM/YYYY")
                      }}
                    </td>
                    <td>{{ item.BillDoc }}</td>
                    <td>{{ item.ContactPersonName }}</td>
                    <td>{{ item.BrokenDes }}</td>
                    <td>{{ item.RepairDes }}</td>
                    <td>{{ item.RepairPrice }}</td>
                    <td>{{ item.PartPrice }}</td>
                    <td>
                      ({{ item.dowFinishDate }})_{{
                        item.FinishDate | moment("DD/MM/YYYY")
                      }}
                    </td>
                    <td>{{ item.NotifierName }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-row>
        </v-col>
      </v-row>

      <!-- อนุมัติใบแจ้ง -->
      <v-dialog v-model="confirmDlg" max-width="290">
        <v-card class="fontPrompt">
          <v-card-title primary-title>Comfirm Approve</v-card-title>
          <v-card-text class="body"
            >Are you sure to Approve this Bill?</v-card-text
          >
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelDlgChange">Cancel</v-btn>
            <v-btn text @click="confirmDlgChange" color="error">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </template>

    <v-stepper v-model="timeLine" class="mt-10">
      <v-stepper-header>
        <v-stepper-step
          :complete="timeLine >= 1"
          step="1"
          color="orange"
          complete-icon="done"
        >
          แจ้งซ่อมแล้ว
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="timeLine >= 2"
          step="WAIT"
          color="blue"
          complete-icon="done"
        >
          รอซ่อม
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="timeLine >= 3"
          step="WIP"
          color="pink"
          complete-icon="done"
        >
          รออะไหล่
        </v-stepper-step>

        <v-divider></v-divider>

        <v-stepper-step
          :complete="timeLine >= 4"
          step="OK"
          color="green"
          complete-icon="done"
        >
          ซ่อมเสร็จ
        </v-stepper-step>
      </v-stepper-header>
    </v-stepper>

    <v-row class="ma-5">
      <v-spacer></v-spacer>
      <v-btn color="error" @click="$router.back()">กลับหน้าหลัก</v-btn>
      <!-- เพิ่ม -->
      <v-btn class="ml-5" @click="printRepairDoc()" :loading="loadingBtn"
        >Print</v-btn
      >
    </v-row>
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
                v-model="DataStatuschange.status"
                :items="statusShow"
                item-value="id"
                item-text="Status"
                label="เปลี่ยนสถานะ"
                outlined
                color="blue"
              />
            </v-col>
          </v-row>

          <v-row v-if="DataStatuschange.status == '3'">
            <v-col>
              <v-text-field
                label="ราคาค่าซ่อม"
                type="number"
                v-model="DataStatuschange.repairCost"
                outlined
                required
              ></v-text-field>
            </v-col>
            <v-col>
              <v-text-field
                label="ราคาค่าอะไหล่"
                type="number"
                v-model="DataStatuschange.partsCost"
                outlined
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="DataStatuschange.status == '3'">
            <v-col>
              <v-text-field
                label="วิธีการแก้ไข"
                type="text"
                v-model="DataStatuschange.description"
                outlined
                required
              ></v-text-field>
            </v-col>
          </v-row>

          <v-row v-if="error.length" class="ml-5 mr-5 mt-5">
            <div>
              <b class="red--text">Please correct the following error</b>
              <ul>
                <li v-for="error in error" :key="error.index" class="red--text">
                  {{ error }}
                </li>
              </ul>
            </div>
          </v-row>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn text @click="cancelChangeStatus">Cancel</v-btn>
            <v-btn
              text
              color="error"
              @click="confirmChangeStatus"
              :loading="loadingBtn"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-form>
    </v-dialog>

    <v-snackbar v-model="snackBar.show" :timeout="snackBar.timetout">
      <div class="fontSarabun fontSize16 text-center">
        {{ snackBar.title }}
        <v-icon small class="ml-1" :color="snackBar.color">{{
          snackBar.icon
        }}</v-icon>
      </div>
    </v-snackbar>
  </v-container>
</template>

<script>
import apiRepairDoc from "../../services/apiRepairDoc";
import apiCreatePDF from "../../services/apiCreatePDF";

export default {
  name: "repairdoc-detail",
  data() {
    return {
      loadingBtn: false,
      dataBill: {
        BillID: 0,
        BillDoc: "",
        JobTypeName: "",
        CategoryName: "",
        RoomName: "",
        DeviceNo: "",
        ContactPerson: "",
        ContactPersonName: "",
        BrokenDes: "",
        RepairBillNo: "",
        Status: "",
        FloorName: "",
        PartPrice: 0,
        RepairPrice: 0,
        RepairDes: "",
        Approver: null,
        ApprovStatus: "0",
        ApprovName: null,
        Tel: "",
        JobDate: "",
        DueDate: "",
        FinishDate: null,
        Notifier: null,
        NotifierName: null,
        ContactPersonPict: "",
        NotifierPict: null,
        ApproverPict: null,
        DateWIP: 0,
        WorkinTime: null
      },
      timeLine: 0,
      dataTable: [],
      approveDoc: false,
      confirmDlg: false,
      historyBill: [],
      changeStatusShowPop: false,
      DataStatuschange: {
        BillID: 0,
        status: "",
        repairCost: 0,
        partsCost: 0,
        description: "",
        Notifier: ""
      },
      DataStatuschange2: {
        BillID: 0,
        status: "",
        repairCost: 0,
        partsCost: 0,
        description: "",
        Notifier: ""
      },
      statusShow: [
        {
          id: "0",
          Status: "แจ้งซ่อมแล้ว",
          color: "#0000FF"
        },
        {
          id: "1",
          Status: "รอซ่อม",
          color: "#f39C12"
        },
        {
          id: "2",
          Status: "รออะไหล่",
          color: "#ff0000"
        },
        {
          id: "3",
          Status: "ซ่อมเสร็จ",
          color: "#00a65a"
        },
        {
          id: "4",
          Status: "ตรวจสอบแล้ว",
          color: "#00a65a"
        }
      ],
      error: [],
      snackBar: {
        show: false,
        title: "",
        timetout: 1500,
        icon: "",
        color: ""
      }
    };
  },
  async mounted() {
    // console.log("params", this.$route.params);
    if (this.$route.params.BillID > 1) {
      this.dataBill = this.$route.params;
      this.checktimeLine();
      await this.loadDataHistoryBill();
    } else {
      this.$router.go(-1);
    }
  },
  methods: {
    checktimeLine() {
      if (this.dataBill.Status === "0") {
        this.timeLine = 1;
      } else if (this.dataBill.Status === "1") {
        this.timeLine = 2;
      } else if (this.dataBill.Status === "2") {
        this.timeLine = 3;
      } else if (this.dataBill.Status === "3") {
        this.timeLine = 4;
      }
    },
    async confirmDlgChange() {
      const data = {
        ID: this.dataBill.BillID,
        Approver: this.$store.getters.username
      };
      const result = await apiRepairDoc.updateApprove(data);
      if (result === "ok") {
        await this.loadDataDetailHeader();
        this.confirmDlg = false;
      }
    },
    cancelDlgChange() {
      this.confirmDlg = false;
      this.dataBill.ApprovStatus = "0";
    },
    async loadDataDetailHeader() {
      const result = await apiRepairDoc.getBillRepairDetail(
        this.dataBill.BillID
      );
      // console.log('comeback', result)
      this.dataBill = result[0];
    },
    async loadDataHistoryBill() {
      // console.log(this.dataBill.DeviceNo);
      if (this.dataBill.DeviceNo !== "null" && this.dataBill.DeviceNo !== "") {
        const result = await apiRepairDoc.getHistoryBill(
          this.dataBill.DeviceNo
        );
        this.historyBill = result;
        // this.historyBill2 = result
      }
      // console.log(result);
    },
    async printRepairDoc() {
      this.loadingBtn = true;
      await apiCreatePDF.printRepairDoc(this.dataBill);
      // console.log(result);
      this.loadingBtn = false;
    },
    changeStatus2() {
      if (
        this.$store.getters.policyCode === "02" ||
        this.$store.getters.policyCode === "03" ||
        this.$store.getters.policyCode === "09" // เพิ่ม
      ) {
        //ถ้าเป็น ผู้ดูแล ให้กดเปลี่ยนสถานะได้แต่เปลี่ยนสถานะเสร็จแล้วไม่ได้
        if (
          this.dataBill.Status !== "3" &&
          this.$store.getters.policyCode === "02"
        ) {
          this.changeStatusShowPop = true;
          this.DataStatuschange.BillID = this.dataBill.BillID;
          this.DataStatuschange.status = this.dataBill.Status;
          this.DataStatuschange.repairCost = this.dataBill.RepairPrice;
          this.DataStatuschange.partsCost = this.dataBill.PartPrice;
          this.DataStatuschange.description = this.dataBill.RepairDes;
          // console.log(this.DataStatuschange)
          //ถ้าเป็น SuperUser ให้กดดูได้เลย
        } else if (this.$store.getters.policyCode === "03") {
          this.changeStatusShowPop = true;
          this.DataStatuschange.BillID = this.dataBill.BillID;
          this.DataStatuschange.status = this.dataBill.Status;
          this.DataStatuschange.repairCost = this.dataBill.RepairPrice;
          this.DataStatuschange.partsCost = this.dataBill.PartPrice;
          this.DataStatuschange.description = this.dataBill.RepairDes;
        } else if (
          this.dataBill.Status !== "3" &&
          this.$store.getters.policyCode === "09" &&
          this.dataBill.JobTypeName === "AC"
        ) {
          // เพิ่ม
          this.changeStatusShowPop = true;
          this.DataStatuschange.BillID = this.dataBill.BillID;
          this.DataStatuschange.status = this.dataBill.Status;
          this.DataStatuschange.repairCost = this.dataBill.RepairPrice;
          this.DataStatuschange.partsCost = this.dataBill.PartPrice;
          this.DataStatuschange.description = this.dataBill.RepairDes;
        }
      }
    },
    cancelChangeStatus() {
      this.changeStatusShowPop = false;
      this.DataStatuschange = this.DataStatuschange2;
    },
    async confirmChangeStatus() {
      this.loadingBtn = true;
      //สร้างตัวแปลรับคนเปลี่ยนสถานะ
      this.DataStatuschange.Notifier = this.$store.getters.username;
      if (
        this.DataStatuschange.status === "3" &&
        this.DataStatuschange.description === ""
      ) {
        // alert('กรุณาใส่ข้อมูล')
        this.error = [];
        this.error.push("โปรดระบุวิธีแก้ไข");
        this.loadingBtn = false;
      } else {
        const result = await apiRepairDoc.updateStatus(this.DataStatuschange);
        if (result === "ok") {
          this.showSnackBar(
            "อัพเดทข้อมูลสำเร็จแล้ว",
            "mdi-shield-check",
            "green",
            1500
          );
          await this.loadDataDetailHeader();
          setTimeout(async () => {
            this.error = [];
            this.changeStatusShowPop = false;
            this.DataStatuschange = this.DataStatuschange2;
            this.loadingBtn = false;
          }, 1500);
        } else {
          this.showSnackBar(
            "ไม่สามารถอัพเดทข้อมูลได้",
            "mdi-close",
            "red",
            1500
          );

          setTimeout(async () => {
            this.error = [];
            this.DataStatuschange = this.DataStatuschange2;
            this.changeStatusShowPop = false;
            this.loadingBtn = false;
          }, 1500);
        }
      }
    },
    showSnackBar(title, icon, color, timeout) {
      this.snackBar = {
        show: true,
        title: title,
        timetout: timeout ? timeout : 1500,
        icon: icon,
        color: color
      };
    }
  }
};
</script>

<style>
.borderTop {
  border-top-style: groove;
  border-left-style: groove;
  border-right-style: groove;
}
.borderBottom {
  /* border-bottom-style: groove; */
  border-left-style: groove;
  border-right-style: groove;
}

.borderTable {
  border-bottom-style: groove;
  border-left-style: groove;
  border-right-style: groove;
}

.BGColor {
  background-color: rgba(255, 196, 0, 0.644);
}

.BGColorWhiteBlue {
  background-color: rgb(239, 244, 255);
}

.BGColorWhiteYellow {
  background-color: rgb(241, 250, 207);
}

.BGColorWhitePink {
  background-color: rgb(253, 226, 242);
}
</style>
