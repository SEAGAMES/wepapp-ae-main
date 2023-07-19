<template>
  <v-app>
    <v-toolbar class="fontPrompt" max-height="50px">
      <div class="ml-n3 mr-n5 mb-n5">
        <v-checkbox
          label="แสดงเลขตามใบปะหน้า"
          color="red"
          v-model="isItemNoForFac"
        />
      </div>
      <v-spacer></v-spacer>
      <div
        class="fontSize28 blue--text mr-n5"
        @click="showDialogQaBillByOrderItem()"
      >
        <b>{{ dataMaster.OrderNumber }}</b>
      </div>
      <v-spacer></v-spacer>
      <v-btn color="red" dark dense small @click="$router.go(-1)">กลับ</v-btn>
    </v-toolbar>
    <!-- Header  -->
    <v-card class="fontSarabun pa-3">
      <v-row>
        <v-col lg="1" md="1" sm="1" class="HeaderBlue">
          <div class="my-n2 mx-n3">
            <div align="center" class="fontSize12">Factory</div>
            <div align="center" class="fontSize22">
              <b>{{ dataMaster.ProductionTeam }}</b>
            </div>
          </div>
        </v-col>

        <v-col lg="2" md="2" sm="2" class="borderFullGrey">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">กำหนดส่งฝ่ายขาย</div>
            <div
              align="center"
              class="fontSize16"
              v-bind:class="{
                'green--text': dataMaster.SalesDueDateDiff >= 7,
                'orange--text':
                  dataMaster.SalesDueDateDiff >= 0 &&
                  dataMaster.SalesDueDateDiff < 7,
                'red--text': dataMaster.SalesDueDateDiff < 0
              }"
            >
              <span class="fontSize14"
                >{{ $moment(dataMaster.SalesDueDate).format("dd") }}
              </span>
              <b class="ml-1">{{
                $moment(dataMaster.SalesDueDate).format("L")
              }}</b>
            </div>
          </div>
          <div class="mt-2 mx-n4 mb-n3">
            <div
              align="center"
              class="fontSize14"
              v-bind:class="{
                'green--text': dataMaster.SalesDueDateDiff >= 7,
                'orange--text':
                  dataMaster.SalesDueDateDiff >= 0 &&
                  dataMaster.SalesDueDateDiff < 7,
                'red--text': dataMaster.SalesDueDateDiff < 0
              }"
            >
              <span class="fontSize12 grey--text">เหลือ</span>
              <b class="ml-2">{{ dataMaster.SalesDueDateDiff }} วัน</b>
            </div>
          </div>
        </v-col>
        <!-- <v-col lg="1" md="1" sm="1" class="borderFullGrey">
          <div class="my-n2 mx-n4">
            <div align="center" class="fontSize10">เหลือวันส่งฝ่ายขาย</div>
            <div
              align="center"
              class="fontSize16"
              v-bind:class="{
                'green--text': dataMaster.SalesDueDateDiff >= 7,
                'orange--text':
                  dataMaster.SalesDueDateDiff >= 0 &&
                  dataMaster.SalesDueDateDiff < 7,
                'red--text': dataMaster.SalesDueDateDiff < 0,
              }"
            >
              <b>{{ dataMaster.SalesDueDateDiff }} วัน</b>
            </div>
          </div>
        </v-col> -->
        <v-col lg="2" md="2" sm="2" class="borderFullGrey">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">กำหนดส่งออก</div>
            <div
              align="center"
              class="fontSize16"
              v-bind:class="{
                'green--text': dataMaster.CusDueDateDiff >= 7,
                'orange--text':
                  dataMaster.CusDueDateDiff >= 0 &&
                  dataMaster.CusDueDateDiff < 7,
                'red--text': dataMaster.CusDueDateDiff < 0
              }"
            >
              <div v-if="dataMaster.CusDueDateDiff > -1000">
                <span class="fontSize14"
                  >{{ $moment(dataMaster.CusDueDate).format("dd") }}
                </span>
                <b class="ml-1">{{
                  $moment(dataMaster.CusDueDate).format("L")
                }}</b>
              </div>
              <div v-if="dataMaster.CusDueDateDiff < -1000"><b>ไม่ระบุ</b></div>
            </div>
          </div>
          <div
            class="mt-2 mb-n3 mx-n2"
            v-if="dataMaster.CusDueDateDiff > -1000"
          >
            <div
              align="center"
              class="fontSize14"
              v-bind:class="{
                'green--text': dataMaster.CusDueDateDiff >= 7,
                'orange--text':
                  dataMaster.CusDueDateDiff >= 0 &&
                  dataMaster.CusDueDateDiff < 7,
                'red--text': dataMaster.CusDueDateDiff < 0
              }"
            >
              <span class="fontSize12 grey--text">เหลือ</span>
              <b class="ml-2"
                >{{
                  -1000 > dataMaster.CusDueDateDiff
                    ? "ไม่ระบุ"
                    : `${dataMaster.CusDueDateDiff} วัน`
                }}
              </b>
            </div>
          </div>
        </v-col>
        <!-- <v-col lg="1" md="1" sm="1.5" class="borderFullGrey">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize10">เหลือวันส่งออก</div>
            <div
              align="center"
              class="fontSize16"
              v-bind:class="{
                'green--text': dataMaster.CusDueDateDiff >= 7,
                'orange--text':
                  dataMaster.CusDueDateDiff >= 0 &&
                  dataMaster.CusDueDateDiff < 7,
                'red--text': dataMaster.CusDueDateDiff < 0,
              }"
            >
              <b
                >{{
                  -1000 > dataMaster.CusDueDateDiff
                    ? "ไม่ระบุ"
                    : `${dataMaster.CusDueDateDiff} วัน`
                }}
              </b>
            </div>
          </div>
        </v-col> -->

        <v-col lg="1" md="1" sm="1" class="borderFullGrey">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">จำนวน</div>
            <div align="center" class="fontSize16 mt-1">
              <b>{{ dataMaster.TotalOrderQty.toLocaleString() }}</b>
            </div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderYellow">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">ผ่าน QA</div>
            <div align="center" class="fontSize16 mt-1">
              <b>{{ dataMaster.TotalQaFinish.toLocaleString() }}</b>
            </div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderYellow">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">รอตรวจ</div>
            <div align="center" class="fontSize16 mt-1">
              <b>{{
                (
                  dataMaster.TotalBillQA -
                  dataMaster.TotalQaFinish -
                  dataMaster.InRepair
                ).toLocaleString()
              }}</b>
            </div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderBlue">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">ซ่อม QA</div>
            <div align="center" class="fontSize16 mt-1">
              <b>
                {{ dataMaster.InRepair.toLocaleString() }}
              </b>
            </div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderBlue">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">ยังไม่ส่ง QA</div>
            <div align="center" class="fontSize16 mt-1">
              <b>{{
                (
                  dataMaster.TotalOrderQty - dataMaster.TotalBillQA
                ).toLocaleString()
              }}</b>
            </div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderRed">
          <div class="my-n2 mx-n2">
            <div align="center" class="fontSize12">ซ่อมสะสม</div>
            <div align="center" class="fontSize16 mt-1"><b>100</b></div>
          </div>
        </v-col>
        <v-col lg="1" md="1" sm="1" class="HeaderRed">
          <div class="my-n2 mx-n3">
            <div align="center" class="fontSize12">%ซ่อมสะสม</div>
            <div align="center" class="fontSize16 mt-1"><b>20%</b></div>
          </div>
        </v-col>
      </v-row>
    </v-card>

    <!-- Task Action -->
    <v-card class="fontPrompt">
      <v-toolbar class="pt-2 black mb-n2">
        <v-btn
          color="blue lighten-4"
          class="mb-6 mx-1 ml-n3"
          small
          dense
          dark
          :loading="loadingBtn"
          @click="openTransfer()"
          :disabled="isWatchQaBill"
        >
          <div
            :class="
              $store.state.levelUser.isFacTeam
                .map(({ FacTeam }) => FacTeam)
                .includes(dataMaster.ProductionTeam) && !isWatchQaBill
                ? 'black--text'
                : ''
            "
          >
            โอนงานไปQA
          </div></v-btn
        >
        <v-spacer />
        <v-badge
          :color="sumBillForReceiveQa ? 'red' : ''"
          :content="sumBillForReceiveQa"
          overlap
          class="mx-1"
        >
          <v-btn
            color="yellow lighten-4"
            class="mb-6"
            small
            dense
            :loading="loadingBtn"
            :disabled="
              actionTransfer.isTransfer || !sumBillForReceiveQa || isWatchQaBill
            "
            dark
            @click="gotoqaBill(2)"
            ><div
              :class="
                actionTransfer.isTransfer ||
                !sumBillForReceiveQa ||
                isWatchQaBill
                  ? ''
                  : 'black--text'
              "
            >
              รับงานจากFAC
            </div>
          </v-btn>
        </v-badge>

        <v-spacer />
        <v-btn
          color="green lighten-4"
          class="mb-6 mx-1"
          small
          dense
          :loading="loadingBtn"
          :disabled="actionTransfer.isTransfer"
          @click="gotoqaBill(3)"
          dark
          ><div :class="actionTransfer.isTransfer ? '' : 'black--text'">
            ดูบิลค้าง
          </div>
        </v-btn>
        <v-spacer />
        <v-badge
          :color="sumBillForReceiveRepair ? 'red' : ''"
          :content="sumBillForReceiveRepair"
          overlap
          class="mx-1"
        >
          <v-btn
            color="red lighten-4"
            class="mb-6"
            small
            dense
            :loading="loadingBtn"
            :disabled="actionTransfer.isTransfer || isWatchQaBill"
            dark
            @click="gotoqaBill(4)"
            ><div
              :class="
                actionTransfer.isTransfer || isWatchQaBill ? '' : 'black--text'
              "
            >
              ดูบิลซ่อม
            </div></v-btn
          >
        </v-badge>
        <v-spacer />
        <v-btn
          color="orange lighten-4"
          class="mb-6 mx-1 mr-n2"
          small
          dense
          :loading="loadingBtn"
          :disabled="actionTransfer.isTransfer || isWatchQaBill"
          dark
          @click="gotoReportRepair()"
          ><div
            :class="
              actionTransfer.isTransfer || isWatchQaBill ? '' : 'black--text'
            "
          >
            สรุปงานซ่อม
          </div></v-btn
        >
        <v-spacer />
        <div class="mx-3">
          <v-text-field
            label="ค้นหาสินค้า"
            outlined
            dense
            append-icon="mdi-barcode"
            class="BGWhite"
            type="number"
            :disabled="!actionTransfer.isTransfer"
            v-model="valueJobNumber"
            @change="findOnJob()"
          />
        </div>

        <v-spacer />
        <v-badge
          :color="actionTransfer.valuesInCart.length > 0 ? 'red' : ''"
          :content="actionTransfer.valuesInCart.length"
          overlap
          v-if="actionTransfer.isTransfer"
        >
          <v-menu bottom offset-y width="80">
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                large
                v-bind="attrs"
                v-on="on"
                class="mb-6 ml-2 mr-n2"
                dark
                >mdi-cart</v-icon
              >
            </template>
            <v-list
              style="max-height: 500px"
              width="300"
              class="overflow-y-auto fontPrompt"
            >
              <v-list-item
                align="center"
                @click="() => {}"
                v-for="(item, indexCart) in actionTransfer.valuesInCart"
                :key="indexCart"
              >
                <div class="fontSize12 fontPrompt">
                  {{ isItemNoForFac ? item.ItemNoForFac : item.OrderItemNo }}
                </div>
                <v-list-item-avatar width="70" height="40" class="ml-1">
                  <v-img :src="item.NewPict" />
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>
                    <div class="fontSize11">
                      <b>{{ item.ProductCode }}</b>
                    </div>
                  </v-list-item-title>
                  <div class="fontSize12">
                    จำนวน :
                    <b>{{ item.QtySend.toLocaleString() }} ชิ้น</b>
                  </div>
                  <div
                    class="grey--text fontSize11"
                    v-if="item.EmpQCItem !== ''"
                  >
                    ผู้ตรวจงาน :{{ showNameEmpQC(item.EmpQCItem) }}
                  </div>
                </v-list-item-content>

                <v-icon @click="deleteItemInCart(indexCart)" class="mr-n4 mt-n2"
                  >mdi-close</v-icon
                >
              </v-list-item>
              <v-divider></v-divider>
              <v-list align="center" class="fontSarabun">
                <div class="fontSize14">
                  จำนวนที่ต้องการส่งทั้งหมด :
                  <b class="fontSize16">{{
                    actionTransfer.valuesInCart
                      .reduce((pv, cv) => pv + cv.QtySend, 0)
                      .toLocaleString()
                  }}</b>
                  ชิ้น
                  <v-btn
                    color="success"
                    small
                    dense
                    class="mb-1 ml-2 mr-n2"
                    @click="gotoCreateBill()"
                    >เปิดบิล</v-btn
                  >
                </div>
              </v-list>
            </v-list>
          </v-menu>
        </v-badge>
      </v-toolbar>
    </v-card>

    <div align="center">
      <Loading v-if="loadingPage" />
    </div>

    <v-card class="fontSarabun mb-16" v-if="!loadingPage">
      <v-simple-table>
        <tr v-for="(rows, indexRows) in dataRow" :key="indexRows">
          <td
            v-for="(cols, indexCols) in rows"
            :key="indexCols"
            class="HeaderOther"
            v-bind:class="{
              'grey lighten-5': indexCols === 0,
              'FinishItem HeaderOther':
                (actionTransfer.isTransfer && cols.FacQty <= 0) ||
                (cols.QaFinish >= cols.TotalQty && indexCols !== 0),
              borderSelected: actionTransfer.isTransfer && cols.Selected
            }"
            @click="selectedItem(indexRows, indexCols)"
          >
            <div align="center" class="">
              <v-img :src="cols.NewPict" width="100" height="80">
                <div
                  align="left"
                  class="fontSize12"
                  v-bind:class="{
                    'red--text': isItemNoForFac
                  }"
                  v-if="cols.OrderItemNo"
                >
                  {{ isItemNoForFac ? cols.ItemNoForFac : cols.OrderItemNo }}
                </div></v-img
              >
              <div
                :class="
                  indexCols === 0
                    ? 'divHeaderH30 pt-2 borderTopGrey'
                    : 'divTitleH30 borderTopGrey'
                "
              >
                {{ cols.ProductCode }}
              </div>
              <div
                :class="
                  indexCols === 0
                    ? 'divHeader borderTopGrey grey lighten-3'
                    : 'divHeader borderTopGrey grey lighten-3'
                "
              >
                {{ cols.TotalQty.toLocaleString() }}
              </div>
              <div
                :class="
                  indexCols === 0 || cols.QaFinish > 0
                    ? 'divHeader HeaderYellow'
                    : 'divTitle borderTopYellow'
                "
              >
                {{ cols.QaFinish.toLocaleString() }}
              </div>
              <div
                :class="
                  indexCols === 0 || cols.QaWait > 0
                    ? 'divHeader HeaderYellow'
                    : 'divTitle borderBottomYellow borderTopGrey'
                "
              >
                {{ cols.QaWait.toLocaleString() }}
              </div>
              <div
                :class="
                  indexCols === 0 || cols.QaRepair > 0
                    ? 'divHeader HeaderBlue'
                    : 'divTitle borderTopBlue'
                "
              >
                {{ cols.QaRepair.toLocaleString() }}
              </div>
              <div
                :class="
                  indexCols === 0 || cols.FacQty > 0
                    ? 'divHeader HeaderBlue'
                    : 'divTitle borderBottomBlue borderTopGrey'
                "
              >
                {{ cols.FacQty.toLocaleString() }}
              </div>
              <div
                :class="
                  indexCols === 0
                    ? 'divHeader HeaderOther'
                    : 'divTitle HeaderOther'
                "
              >
                {{ cols.SumRepair.toLocaleString() }}
              </div>
              <div class="fontSize12" v-if="actionTransfer.isTransfer">
                <b>{{ cols.QtySend.toLocaleString() }}</b>
              </div>
            </div>
          </td>
        </tr>
      </v-simple-table>
    </v-card>

    <v-dialog v-model="dialogSelectedItem.isShow" width="400">
      <v-card width="400" class="fontSarabun">
        <v-form @submit.prevent="confirmSelectedItem()">
          <div align="center">
            <div align="left" class="pa-2">
              {{ dialogSelectedItem.OrderItemNo }}
            </div>
            <v-img :src="dialogSelectedItem.img" width="200" class="mt-n5" />
            <div class="fontSize16">
              <b>{{ dialogSelectedItem.titleName }}</b>
            </div>
            <div class="fontSize16">
              จำนวนเต็ม :
              <b>{{ dialogSelectedItem.TotalQty.toLocaleString() }}</b>
            </div>
            <div class="px-10 mt-2">
              <v-text-field
                label="ใส่จำนวนโอน"
                v-model="dialogSelectedItem.QtySend"
                autofocus
                type="number"
                dense
                outlined
              />
            </div>
            <div align="left" class="ml-12 mt-n6 red--text fontSize12">
              <b>{{ dialogSelectedItem.error[0] }}</b>
            </div>

            <div class="mt-3 mb-3 pl-10" align="left"><b>ผู้ตรวจงาน</b></div>
            <v-row class="px-10 mt-5">
              <v-col cols="4">
                <v-autocomplete
                  label="รหัสพนักงาน"
                  :items="$store.state.FacToQa.StatusDetail.employeeQC"
                  item-text="EmpCode"
                  item-value="EmpCode"
                  v-model="dialogSelectedItem.EmpQCItem"
                  dense
                  outlined
                  class="mt-n6"
                />
              </v-col>
              <v-col cols="8">
                <v-autocomplete
                  label="ชื่อผู้ตรวจสอบ"
                  :items="$store.state.FacToQa.StatusDetail.employeeQC"
                  item-text="EmpFullName"
                  item-value="EmpCode"
                  v-model="dialogSelectedItem.EmpQCItem"
                  dense
                  outlined
                  class="mt-n6"
                />
              </v-col>
            </v-row>
            <div class="pb-2 mt-n3">
              <v-btn
                color="success"
                type="submit"
                :disabled="
                  dialogSelectedItem.QtySend > dialogSelectedItem.checkQty
                "
                >ยืนยัน</v-btn
              >
            </div>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <v-dialog v-model="dialogShowQaBill.isShow" width="500">
      <v-card width="500" class="fontSarabun">
        <div align="center">
          <div align="left" class="pa-2">
            {{ dialogShowQaBill.OrderItemNo }}
          </div>
          <v-img :src="dialogShowQaBill.img" width="200" class="mt-n5" />
          <div class="fontSize16">
            <b>{{ dialogShowQaBill.titleName }}</b>
          </div>
          <div class="fontSize16">
            จำนวนเต็ม :
            <b>{{ dialogShowQaBill.TotalQty.toLocaleString() }}</b>
          </div>
        </div>
        <div>
          <v-simple-table>
            <thead>
              <tr class="grey lighten-2">
                <th class="HeaderOther">
                  <div align="center" class="mx-n3 fontSize14">
                    วันที่สร้างบิล
                  </div>
                </th>
                <th class="HeaderOther">
                  <div align="center" class="mx-n3 fontSize14">เลขที่บิล</div>
                </th>
                <th class="HeaderOther">
                  <div align="center" class="mx-n3 fontSize14">รายละเอียด</div>
                </th>
                <th class="HeaderOther">
                  <div align="center" class="mx-n3 fontSize14">จำนวน</div>
                </th>
              </tr>
            </thead>
            <tbody v-if="dialogShowQaBill.qaBill.length > 0">
              <tr
                v-for="(b, index) in dialogShowQaBill.qaBill"
                :key="index"
                @click="goqaBillDetailByJob(b.qaDocNumber, b.qaJobNumber)"
              >
                <td width="110" class="HeaderOther">
                  <div class="mx-n3 fontSize13" align="center">
                    {{ $moment(b.billDate).format("dd") }}
                    {{ $moment(b.billDate).format("L") }}
                  </div>
                  <div class="mx-n3 fontSize12 grey--text" align="center">
                    เวลา : {{ $moment(b.billDate).format("LT") }} น.
                  </div>
                </td>
                <td class="HeaderOther" width="120">
                  <div class="mx-n3 fontSize13" align="left">
                    <b>{{ b.qaDocNumber }}</b>
                  </div>
                  <div class="mx-n3 fontSize12" align="left">
                    ผู้ส่ง : {{ b.Sender }}
                  </div>
                </td>
                <td class="HeaderOther" width="120">
                  <div class="mx-n3 fontSize12" align="left">
                    CODE : {{ b.qaJobNumber }}
                  </div>
                  <div class="mx-n3 fontSize12" align="left">
                    QCFAC : {{ b.Sender }}
                  </div>
                </td>
                <td class="HeaderOther" width="60">
                  <div class="mx-n3" align="center">
                    {{ b.Qty.toLocaleString() }}
                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="dialogShowQaBill.qaBill.length <= 0">
              <tr>
                <td colspan="4">
                  <div class="fontSize16" align="center">ไม่มีข้อมูล</div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
        </div>
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
import Loading from "../../components/Loadings/PulseLoader.vue";
import apiDevice from "../../services/apiDevice";

export default {
  name: "statustoqa-detail",
  props: ["dataInput"],
  components: {
    Loading
  },
  data() {
    return {
      loadingBtn: false,
      loadingPage: false,
      isItemNoForFac: true,
      dataMaster: {
        CountBill: 0,
        CusDueDate: "",
        CusDueDateDiff: 0,
        InRepair: 0,
        OrderNumber: "",
        ProductionTeam: "",
        SalesDueDate: "",
        SalesDueDateDiff: 0,
        TotalBillQA: 0,
        TotalOrderQty: 0,
        TotalQaFinish: 0,
        dueFacToQa: []
      },
      blankImg: "http://192.168.3.5:3000/picture/PICTURE2/WEB_AE/blankImg.jpg",
      dataItem: [],
      dataRow: [],
      colsItem: 6,
      actionTransfer: {
        isTransfer: false,
        valuesInCart: []
      },
      dialogSelectedItem: {
        isShow: false,
        OrderItemNo: null,
        img: "",
        titleName: "",
        TotalQty: 0,
        QtySend: 0,
        indexRow: null,
        indexCol: null,
        checkQty: 0,
        error: [],
        EmpQCItem: ""
      },
      isWatchQaBill: false,
      dialogShowQaBill: {
        isShow: false,
        OrderItemNo: null,
        img: "",
        titleName: "",
        TotalQty: 0,
        qaBill: []
      },
      sumBillForReceiveQa: 0,
      sumBillForReceiveRepair: 0,
      valueJobNumber: "",
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
    if (
      this.$route.params.dataMaster ||
      this.$store.state.FacToQa.StatusDetail.dataMaster
    ) {
      this.dataMaster = this.$route.params.dataMaster
        ? this.$route.params.dataMaster
        : this.$store.state.FacToQa.StatusDetail.dataMaster;
      this.actionTransfer.valuesInCart = this.$store.state.FacToQa.StatusDetail
        .dataMaster
        ? this.$store.state.FacToQa.StatusDetail.valuesCart
        : [];
      this.actionTransfer.isTransfer =
        this.$store.state.FacToQa.StatusDetail.dataMaster &&
        !this.$store.state.FacToQa.StatusDetail.gotoqaBill
          ? true
          : false;
      this.loadingBtn = true;
      this.loadingPage = true;
      await this.loadData();
      await this.loadTotalBillForReceive();
      setTimeout(() => {
        this.loadingPage = false;
        this.loadingBtn = false;
        // console.log(this.dataRow[0]);
      }, 500);
    } else {
      await this.$router.push("/factoqa/");
    }
  },
  methods: {
    async loadData() {
      // console.log(this.dataMaster.OrderNumber);
      this.dataItem = await apiFacToQa.getStatusDetail({
        orderNumber: this.dataMaster.OrderNumber
      });
      // console.log(this.dataItem);
      const CalItem = Math.ceil(this.dataItem.length / this.colsItem);
      // console.log(CalItem);

      for (let i = 0; i < CalItem; i++) {
        // INSERT TITLE LEFT
        this.dataRow.push([
          {
            OrderItemNo: 0,
            ProductCode: "ProductCode",
            TotalQty: "จำนวนเต็ม",
            QaFinish: "ผ่าน QA",
            QaWait: "รอตรวจ",
            QaRepair: "ซ่อม QA",
            FacQty: "ยังไม่ส่ง QA",
            SumRepair: "สถิติซ่อม",
            NewPict: "",
            Selected: false,
            QtySend: "จำนวนที่จะโอน",
            EmpQCItem: ""
          }
        ]);
      }
      // console.log(this.dataRow);
      this.dataItem.forEach((obj, index) => {
        const indexForInsertArray = Math.ceil((index + 1) / this.colsItem) - 1;
        // console.log("count", indexForInsertArray);
        this.dataRow[indexForInsertArray].push({
          OrderItemNo: obj.ItemNo,
          ItemNoForFac: obj.ItemNoForFac,
          ProductCode: obj.ProductCode,
          TotalQty: obj.TotalQty,
          QaFinish: obj.TotalFinish,
          QaWait: obj.TotalQA - obj.TotalFinish - obj.TotalRepair,
          QaRepair: obj.TotalRepair,
          FacQty: obj.TotalQty - obj.TotalQA,
          SumRepair: obj.SumRepair,
          NewPict: obj.NewPict,
          Selected: false,
          QtySend: 0,
          EmpQCItem: "",
          JobNumber: obj.JobNumber.trim(),
          ProductID: obj.ProductID
        });
        if (this.$store.state.FacToQa.StatusDetail.dataMaster) {
          if (
            this.actionTransfer.valuesInCart
              .map(({ OrderItemNo }) => OrderItemNo)
              .includes(obj.ItemNo)
          ) {
            const returnData = this.actionTransfer.valuesInCart.filter(
              ({ OrderItemNo }) => OrderItemNo === obj.ItemNo
            );
            this.dataRow[indexForInsertArray][
              this.dataRow[indexForInsertArray].length - 1
            ].Selected = true;
            this.dataRow[indexForInsertArray][
              this.dataRow[indexForInsertArray].length - 1
            ].QtySend =
              returnData[0].QtySend <= obj.TotalQty - obj.TotalQA
                ? returnData[0].QtySend
                : obj.TotalQty - obj.TotalQA;
            this.dataRow[indexForInsertArray][
              this.dataRow[indexForInsertArray].length - 1
            ].EmpQCItem = returnData[0].EmpQCItem;
            // console.log(
            //   this.dataRow[indexForInsertArray][
            //     this.dataRow[indexForInsertArray].length - 1
            //   ]
            // );
          }
        }
      });
    },
    async loadEmpCode() {
      this.$store.state.FacToQa.StatusDetail.employeeQC = await apiDevice.getemployee();
      // console.log(this.employee);
    },
    async loadTotalBillForReceive() {
      const {
        resBillQa,
        resBillRepair
      } = await apiFacToQa.getTotalBillForReceive({
        orderNumber: this.dataMaster.OrderNumber
      });
      this.sumBillForReceiveQa = resBillQa;
      this.sumBillForReceiveRepair = resBillRepair;
      // console.log(resBillQa, resBillRepair);
      // console.log(this.sumBillForReceiveQa);
    },
    async selectedItem(indexRow, indexCol) {
      // console.log("ทำ");
      if (indexCol !== 0) {
        if (this.actionTransfer.isTransfer) {
          // console.log(
          //   this.dataRow[indexRow][indexCol].QtySend,
          //   this.dialogSelectedItem.checkQty
          // );
          if (
            this.$store.state.levelUser.isFacTeam.filter(
              obj =>
                obj.FacTeam === this.dataMaster.ProductionTeam &&
                obj.isReceive === true
            ).length > 0 &&
            this.dataRow[indexRow][indexCol].FacQty > 0
          ) {
            this.dialogSelectedItem = {
              isShow: true,
              OrderItemNo: this.isItemNoForFac
                ? this.dataRow[indexRow][indexCol].ItemNoForFac
                : this.dataRow[indexRow][indexCol].OrderItemNo,
              img: this.dataRow[indexRow][indexCol].NewPict,
              titleName: this.dataRow[indexRow][indexCol].ProductCode,
              TotalQty: this.dataRow[indexRow][indexCol].TotalQty,
              QtySend:
                this.dataRow[indexRow][indexCol].QtySend === 0
                  ? this.dataRow[indexRow][indexCol].FacQty
                  : this.dataRow[indexRow][indexCol].QtySend,
              indexRow: indexRow,
              indexCol: indexCol,
              checkQty: this.dataRow[indexRow][indexCol].FacQty,
              error: [],
              EmpQCItem: this.dataRow[indexRow][indexCol].EmpQCItem
            };
          } else {
            this.snackbar = {
              show: true,
              title: "ไม่สามารถโอนรายการนี้ได้",
              icon: "mdi-shield-check",
              color: "orange",
              timeout: 2500
            };
          }
        } else if (this.isWatchQaBill && !this.actionTransfer.isTransfer) {
          // console.log(this.dataRow[indexRow][indexCol]);
          await this.showDialogQaBillByOrderItem(
            this.dataRow[indexRow][indexCol]
          );
        } else {
          this.snackbar = {
            show: true,
            title: "กรุณาเลือกเมนู",
            icon: "mdi-shield-check",
            color: "orange",
            timeout: 2500
          };
        }
      }
    },
    confirmSelectedItem() {
      // console.log(this.dialogSelectedItem.QtySend);
      if (
        +this.dialogSelectedItem.QtySend > 0 &&
        this.dialogSelectedItem.QtySend <= this.dialogSelectedItem.checkQty
      ) {
        // console.log(this.dialogSelectedItem.QtySend);
        //เช็ค Item ใน CART
        if (
          this.actionTransfer.valuesInCart
            .map(({ OrderItemNo }) => OrderItemNo)
            .includes(
              this.dataRow[this.dialogSelectedItem.indexRow][
                this.dialogSelectedItem.indexCol
              ].OrderItemNo
            )
        ) {
          // console.log("Y");
          const IndexForUpdate = this.actionTransfer.valuesInCart.findIndex(
            ({ OrderItemNo }) =>
              OrderItemNo ===
              this.dataRow[this.dialogSelectedItem.indexRow][
                this.dialogSelectedItem.indexCol
              ].OrderItemNo
          );
          this.dataRow[this.dialogSelectedItem.indexRow][
            this.dialogSelectedItem.indexCol
          ].QtySend = Number(this.dialogSelectedItem.QtySend);
          this.actionTransfer.valuesInCart[IndexForUpdate].QtySend = Number(
            this.dialogSelectedItem.QtySend
          );
          this.actionTransfer.valuesInCart[
            IndexForUpdate
          ].EmpQCItem = this.dialogSelectedItem.EmpQCItem;
        } else {
          // console.log("N");
          this.dataRow[this.dialogSelectedItem.indexRow][
            this.dialogSelectedItem.indexCol
          ].Selected = true;
          this.dataRow[this.dialogSelectedItem.indexRow][
            this.dialogSelectedItem.indexCol
          ].QtySend = Number(this.dialogSelectedItem.QtySend);
          this.dataRow[this.dialogSelectedItem.indexRow][
            this.dialogSelectedItem.indexCol
          ].EmpQCItem = this.dialogSelectedItem.EmpQCItem;
          this.actionTransfer.valuesInCart.push(
            this.dataRow[this.dialogSelectedItem.indexRow][
              this.dialogSelectedItem.indexCol
            ]
          );
        }
        this.actionTransfer.valuesInCart.sort((a, b) =>
          a.OrderItemNo > b.OrderItemNo
            ? 1
            : b.OrderItemNo > a.OrderItemNo
            ? -1
            : 0
        );
        this.clearDataDialogSelectItem();
      } else if (
        this.dialogSelectedItem.QtySend <= 0 &&
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].Selected
      ) {
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].Selected = false;
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].QtySend = 0;
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].EmpQCItem = "";
        const IndexForDeleteCart = this.actionTransfer.valuesInCart.findIndex(
          ({ OrderItemNo }) =>
            OrderItemNo ===
            this.dataRow[this.dialogSelectedItem.indexRow][
              this.dialogSelectedItem.indexCol
            ].OrderItemNo
        );
        this.actionTransfer.valuesInCart.splice(IndexForDeleteCart, 1);
        // console.log(IndexFordeleteCart);
        this.clearDataDialogSelectItem();
      } else if (
        this.dialogSelectedItem.QtySend > this.dialogSelectedItem.checkQty
      ) {
        this.dialogSelectedItem.error.push("เกินจำนวน");
      } else {
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].Selected = false;
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].QtySend = 0;
        this.dataRow[this.dialogSelectedItem.indexRow][
          this.dialogSelectedItem.indexCol
        ].EmpQCItem = "";
        this.clearDataDialogSelectItem();
      }
    },

    deleteItemInCart(indexCart) {
      // console.log(this.actionTransfer.valuesInCart[indexCart].OrderItemNo);
      const findIndex = this.dataItem.findIndex(
        ({ ItemNo }) =>
          ItemNo === this.actionTransfer.valuesInCart[indexCart].OrderItemNo
      );
      const row = Math.ceil((findIndex + 1) / this.colsItem) - 1;
      const col = this.dataRow[row].findIndex(
        ({ OrderItemNo }) =>
          OrderItemNo ===
          this.actionTransfer.valuesInCart[indexCart].OrderItemNo
      );
      // console.log(row, col);
      this.actionTransfer.valuesInCart.splice(indexCart, 1);
      this.dataRow[row][col].Selected = false;
      this.dataRow[row][col].QtySend = 0;
    },
    clearDataDialogSelectItem() {
      //CLEAR DATA
      this.dialogSelectedItem = {
        isShow: false,
        OrderItemNo: null,
        img: "",
        titleName: "",
        TotalQty: 0,
        QtySend: 0,
        indexRow: null,
        indexCol: null,
        checkQty: 0,
        error: [],
        EmpQCItem: ""
      };
    },
    async gotoCreateBill() {
      // console.log(this.actionTransfer.valuesInCart);
      if (this.actionTransfer.valuesInCart.length) {
        this.$store.state.FacToQa.StatusDetail.valuesCart = this.actionTransfer.valuesInCart;
        this.$store.state.FacToQa.StatusDetail.dataMaster = this.dataMaster;
        this.$store.state.FacToQa.StatusDetail.gotoqaBill = false;
        await this.$router.push({
          name: "createbill-factoqa",
          params: { dataInput: this.actionTransfer.valuesInCart }
        });
      }
    },
    async openTransfer() {
      if (this.$store.state.FacToQa.StatusDetail.employeeQC.length <= 0) {
        // console.log("Load");
        await this.loadEmpCode();
      }
      this.actionTransfer.isTransfer = !this.actionTransfer.isTransfer;
      // console.log(this.$store.state.FacToQa.StatusDetail.employeeQC);
    },
    showNameEmpQC(EmpQCItem) {
      const [name] = this.$store.state.FacToQa.StatusDetail.employeeQC
        .filter(({ EmpCode }) => EmpCode === EmpQCItem)
        .map(({ EmpFullName }) => EmpFullName);
      return name === undefined ? "" : name;
    },
    async gotoqaBill(values) {
      this.$store.state.FacToQa.StatusDetail.valuesCart = this.actionTransfer.valuesInCart;
      this.$store.state.FacToQa.StatusDetail.dataMaster = this.dataMaster;
      this.$store.state.FacToQa.StatusDetail.gotoqaBill = true;
      if (values === 3) {
        //เก่าก่อนเปลี่ยนเป็นดูบิล By OrderItem
        // await this.$store.dispatch({
        //   type: "SET_filterQaBillMaster",
        //   setDefault: false,
        //   valuesFilter: {
        //     orderFilter: this.dataMaster.OrderNumber,
        //     valuesStatus: ["", "1"],
        //     isReceive: false,
        //   },
        // });
        // await this.$router.push({
        //   name: "qabill-master",
        // });
        this.isWatchQaBill = !this.isWatchQaBill;
      } else if (values === 2) {
        await this.$store.dispatch({
          type: "SET_filterQaBillMaster",
          setDefault: false,
          valuesFilter: {
            orderFilter: this.dataMaster.OrderNumber,
            valuesStatus: [""],
            isReceive: true
          }
        });
        await this.$router.push({
          name: "qabill-master"
        });
        this.$store.state.FacToQa.tab = "tab-2";
      } else if (values === 4) {
        await this.$store.dispatch({
          type: "SET_filterQARepairMaster",
          setDefault: false,
          //TEMPLATE Filter Values
          valuesFilter: {
            orderFilter: this.dataMaster.OrderNumber
          }
        });
        await this.$router.push({
          name: "qabillrepair-master"
        });
        this.$store.state.FacToQa.tab = "tab-3";
      }
    },
    findOnJob() {
      if (this.valueJobNumber.length === 7) {
        const indexRow =
          Math.ceil(
            (this.dataItem.findIndex(
              ({ JobNumber }) => JobNumber.trim() === this.valueJobNumber.trim()
            ) +
              1) /
              this.colsItem
          ) - 1;
        const indexCol =
          indexRow >= 0
            ? this.dataRow[indexRow].findIndex(
                ({ JobNumber }) => JobNumber === this.valueJobNumber
              )
            : -1;
        if (indexRow >= 0 && indexCol >= 0) {
          if (this.dataRow[indexRow][indexCol].FacQty > 0) {
            this.selectedItem(indexRow, indexCol);
          } else {
            alert("รายการนี้ครบแล้ว");
          }
        }
      }
      setTimeout(() => {
        this.valueJobNumber = "";
      }, 500);
      // console.log(indexRow, indexCol);
      // console.log(this.dataRow[indexRow]);
    },
    async gotoReportRepair() {
      await this.$router.push({
        name: "report-repair-byorder",
        params: {
          orderNumber: this.dataMaster.OrderNumber,
          dataItem: this.dataItem.map(obj => {
            return {
              OrderItemNo: obj.ItemNo,
              ItemNoForFac: obj.ItemNoForFac,
              ProductCode: obj.ProductCode,
              TotalQty: obj.TotalQty,
              SumRepair: obj.SumRepair,
              NewPict: obj.NewPict,
              ProductID: obj.ProductID
            };
          })
        }
      });
    },
    async showDialogQaBillByOrderItem({
      OrderItemNo,
      ProductCode,
      NewPict,
      TotalQty,
      ItemNoForFac
    }) {
      // console.log(this.dataMaster.OrderNumber);
      const res = await apiFacToQa.getQaBillByOrderItem({
        orderNumber: this.dataMaster.OrderNumber,
        OrderItemNo: OrderItemNo
      });
      // console.log(res);
      this.dialogShowQaBill = {
        isShow: true,
        OrderItemNo: this.isItemNoForFac ? ItemNoForFac : OrderItemNo,
        img: NewPict,
        titleName: ProductCode,
        TotalQty: TotalQty,
        qaBill: res
      };
    },
    async goqaBillDetailByJob(qaDocNumber, qaJobNumber) {
      if (qaJobNumber) {
        const { /*result,*/ data } = await apiFacToQa.getBillByJob({
          qaJobNumber: qaJobNumber,
          isJob: 1 // 1 คือ Query SQL ด้วย qaJobNumber
        });
        await this.$router.push({
          name: "qabill-detail",
          params: {
            data: data
          }
        });
      } else {
        const { result, data } = await apiFacToQa.getBillByJob({
          qaJobNumber: qaDocNumber,
          isJob: 2
        });
        if (result === "ok") {
          await this.$router.push({
            name: "qabill-detail",
            params: {
              data: data
            }
          });
        }
      }
    }
  }
};
</script>

<style>
.divTitle {
  height: 20px;
  font-size: 11px;
  /* border-top: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
  border-left: 1px solid rgb(214, 214, 214);
  border-right: 1px solid rgb(214, 214, 214); */
}
.FinishItem {
  filter: brightness(70%);
  background-color: #ffffff;
}

.divHeader {
  height: 20px;
  font-weight: bold;
  font-size: 11px;
}

.divHeaderH30 {
  height: 35px;
  font-weight: bold;
  font-size: 11px;
}

.divTitleH30 {
  height: 35px;
  font-size: 11px;
}

.borderTopGrey {
  border-top: 1px solid rgb(238, 237, 237);
}

.borderTopYellow {
  border-top: 1px solid rgb(245, 247, 148);
  border-left: 1px solid rgb(245, 247, 148);
}

.borderBottomYellow {
  border-bottom: 1px solid rgb(245, 247, 148);
  border-left: 1px solid rgb(245, 247, 148);
}

.borderTopBlue {
  border-top: 1px solid rgb(148, 183, 247);
  border-left: 1px solid rgb(148, 183, 247);
}

.borderBottomBlue {
  border-bottom: 1px solid rgb(148, 183, 247);
  border-left: 1px solid rgb(148, 183, 247);
}

.borderSelected {
  background-color: #f2ffe1;
  border-top: 2px solid rgb(51, 255, 0);
  border-bottom: 2px solid rgb(51, 255, 0);
  border-left: 2px solid rgb(51, 255, 0);
  border-right: 2px solid rgb(51, 255, 0);
}
</style>
