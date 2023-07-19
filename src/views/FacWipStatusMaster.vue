<template>
  <div fullscreen class="fontSarabun px-3">
    <!-- Filter -->
    <v-row>
      <v-col>
        <div>
          <div>ค้นหาจาก Order</div>
          <v-text-field
            outlined
            hide-details
            dense
            v-model="dataFilter.ByOrder.selectedOrder"
            append-icon="search"
          />
        </div>
      </v-col>
      <v-col>
        <div>
          <div>วันที่ส่งฝ่ายขาย</div>
          <v-text-field
            v-model="dataFilter.dateBetween.showDate"
            outlined
            hide-details
            readonly
            append-icon="mdi-calendar-month"
            @click="dataFilter.dateBetween.showDialog = true"
            dense
          />
        </div>
      </v-col>
      <v-col>
        <div>
          <div>Factory</div>
          <v-select
            outlined
            hide-details
            dense
            :items="dataFilter.ByFac.showFac"
            item-value="value"
            item-text="name"
            v-model="dataFilter.ByFac.selectedFac"
            multiple
          />
        </div>
      </v-col>
      <v-col cols="1">
        <v-btn
          color="success"
          dense
          class="mt-6"
          :loading="loadingPage"
          @click="getDateMaster"
          >ค้นหา</v-btn
        >
      </v-col>
      <v-col cols="1">
        <v-btn color="red" outlined dense class="mt-6" @click="$router.go(-1)"
          >กลับ</v-btn
        >
      </v-col>
      <v-col cols="1">
        <v-btn
          color="blue"
          outlined
          dense
          class="mt-6"
          icon
          @click="printReport()"
          ><v-icon>print</v-icon></v-btn
        >
      </v-col>
    </v-row>
    <div align="center" class="mt-10" v-if="loadingPage">
      <SpinnerLoading v-if="loadingPage" />
    </div>

    <!-- ตาราง Record -->
    <div v-if="!loadingPage" class="pb-16">
      <v-card
        v-for="(order, indexMaster) in dataMaster"
        :key="indexMaster"
        :class="order.SumTotalToQa >= order.TotalQty ? 'mt-5 myImg' : 'mt-5'"
      >
        <v-simple-table dense style="width: 100%">
          <template v-slot:default>
            <thead>
              <!-- row 1 -->
              <tr>
                <th colspan="1">
                  <div
                    align="left"
                    v-if="
                      !order.isFinish && order.SumTotalToQa >= order.TotalQty
                    "
                  >
                    <v-btn color="red" icon @click="finishOrder(indexMaster)"
                      ><v-icon>close</v-icon></v-btn
                    >
                  </div>
                </th>
                <th colspan="19" class="borderHeaderMonthTopLine">
                  <div align="right">
                    <v-btn
                      color="success"
                      dense
                      small
                      width="70"
                      height="25"
                      @click="reduceQaCalendar(indexMaster)"
                      :loading="loadingBtn"
                    >
                      <div class="fontSize8 mx-n2">ปรับปฎิธินใหม่</div>
                    </v-btn>
                  </div>
                </th>
                <th
                  v-for="m in order.headerMonth"
                  :key="m.month"
                  :colspan="m.count"
                  class="borderHeaderMonthTopLineOffMonth"
                >
                  <div align="center">{{ m.month }}</div>
                </th>
              </tr>

              <!-- row 2 -->
              <tr>
                <th class="borderHeaderTopLine" colspan="3">
                  <div class="fontSize14 blue--text" align="center">
                    FAC : {{ order.ProductionTeam }}
                  </div>
                </th>
                <th
                  class="borderHeaderTopLine"
                  colspan="6"
                  @click="gotoDetail(order.OrderNumber, order.TotalQty)"
                >
                  <div class="fontSize14 mx-n3 font-weight-bold" align="center">
                    {{ order.OrderNumber }}
                  </div>
                </th>
                <th class="borderHeaderTopLine" colspan="4">
                  <div class="fontSize14 mx-n3" align="center">
                    จำนวน :
                    <b>{{ order.TotalQty.toLocaleString() }}</b>
                  </div>
                </th>
                <th class="borderHeaderTopLineOffWeek" :colspan="4">
                  <div
                    align="center"
                    class="fontSize14"
                    v-bind:class="{
                      'green--text': order.WorkingDay > 3,
                      'amber--text':
                        order.WorkingDay <= 3 && order.WorkingDay >= 0,
                      'red--text': order.WorkingDay < 0
                    }"
                  >
                    DL :
                    <span>{{ order.DueDate | moment("L") }}</span>
                  </div>
                </th>
                <th class="borderHeaderTopLine">
                  <div class="fontSize8 mx-n2" align="center">แผน ส่ง QA</div>
                </th>

                <th class="borderHeaderTopLine">
                  <div class="fontSize8" align="center">วันที่กำหนด</div>
                </th>
                <th class="borderHeaderTopLine">
                  <div class="fontSize8 mx-n3" align="center">
                    จำนวน ครั้งเลื่อน
                  </div>
                </th>

                <th
                  v-for="(h, index) in order.qaCalender"
                  :key="index"
                  :class="
                    h.Dow === 'ส.'
                      ? 'borderHeaderTopLineOffWeek'
                      : 'borderHeaderTopLine'
                  "
                >
                  <div class="fontSize8 mx-n3" align="center">
                    <div class="fontSize8">{{ h.Dow }}</div>
                    <v-divider></v-divider>
                    <div class="fontSize8">
                      {{ $moment(h.DayWip).format("D") }}
                    </div>
                  </div>
                </th>
              </tr>

              <!-- row 3 -->
              <tr>
                <th class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">วัตถุดิบ</div>
                </th>
                <th class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">สถานะ</div>
                </th>
                <th class="borderRight">
                  <div class="fontSize8 mx-n1" align="center">หัวข้อ</div>
                </th>
                <!--START LOOP PROCESS -->
                <th
                  class="borderRight"
                  v-for="(process, indexProcess) in order.Process"
                  :key="'p3' + indexProcess"
                >
                  <div class="fontSize8 mx-n2" align="center">
                    {{ process.PDProcessName }}
                  </div>
                </th>
                <!--END LOOP PROCESS -->
                <th class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">เป้าแรก</div>
                </th>
                <th class="borderRight">
                  <div class="fontSize8 mx-n4" align="center">
                    <span class="grey--text">
                      {{
                        order.qaTarget.length > 0
                          ? $moment(order.qaTarget[0].FirstTarget).format("dd")
                          : ""
                      }}
                    </span>
                    {{
                      order.qaTarget.length > 0
                        ? $moment(order.qaTarget[0].FirstTarget).format("l")
                        : "_/_/_"
                    }}
                  </div>
                </th>
                <th class="borderRight">
                  <div class="fontSize8" align="center"></div>
                </th>
                <th
                  v-for="(h, index) in order.qaCalender"
                  :key="index"
                  :class="[
                    h.Dow === 'ส.' ? 'borderRightOffWeek' : 'borderRight',
                    order.DueDate === h.DayWip ? 'orange lighten-4' : '',
                    order.CustomerDueDate === h.DayWip ? 'green lighten-4' : ''
                  ]"
                  @click="
                    InputTarget(
                      h,
                      order.OrderNumber,
                      'first',
                      indexMaster,
                      index
                    )
                  "
                >
                  <div
                    class="fontSize8 mx-n3"
                    align="center"
                    v-if="h.FirstTarget !== 0"
                  >
                    {{ h.FirstTarget.toLocaleString() }}
                  </div>
                </th>
              </tr>
            </thead>

            <tbody>
              <!-- row 4  -->
              <tr>
                <td
                  class="borderRight"
                  v-bind:class="{
                    'teal accent-3': order.statusStone.LateDay > 3,
                    'amber lighten-3':
                      order.statusStone.LateDay >= 0 &&
                      order.statusStone.LateDay <= 3,
                    'red lighten-3': order.statusStone.LateDay < 0,
                    'grey lighten-3': order.statusStone.QtyReq <= 0
                  }"
                  width="20"
                  @click="
                    showDialogMaterail(
                      order.OrderNumber,
                      'stone',
                      order.statusStone.QtyReq
                    )
                  "
                >
                  <div class="fontSize8 mx-n3" align="center">พลอย</div>
                </td>
                <th class="borderRight">
                  <div
                    class="fontSize8 mx-n3 font-weight-bold"
                    v-bind:class="{
                      'green--text': order.statusStone.LateDay > 3,
                      'amber--text':
                        order.statusStone.LateDay >= 0 &&
                        order.statusStone.LateDay <= 3,
                      'red--text': order.statusStone.LateDay < 0
                    }"
                    align="center"
                    v-if="order.statusStone.QtyReq > 0"
                  >
                    {{
                      order.statusStone.IsFinish
                        ? "จบ"
                        : order.statusStone.LateDay
                    }}
                  </div>
                </th>
                <td class="borderRight">
                  <div class="fontSize8 mx-n4" align="center">กำหนดเสร็จ</div>
                </td>

                <!--START LOOP PROCESS -->
                <td
                  class="borderRight"
                  v-for="(process, indexProcess) in order.Process"
                  :key="'p4' + indexProcess"
                >
                  <div class="fontSize8 mx-n2 white--text" align="center">
                    __/__/__
                  </div>
                </td>
                <!--END LOOP PROCESS -->

                <td class="borderRight">
                  <div class="fontSize8 mx-n4" align="center">
                    เป้าส่งสุดท้าย
                  </div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">
                    <span class="grey--text">
                      {{
                        order.qaTarget.length > 0 &&
                        order.qaTarget[0].LastTarget !== null
                          ? $moment(order.qaTarget[0].LastTarget).format("dd")
                          : ""
                      }}
                    </span>
                    {{
                      order.qaTarget.length > 0 &&
                      order.qaTarget[0].LastTarget !== null
                        ? $moment(order.qaTarget[0].LastTarget).format("l")
                        : "_/_/_"
                    }}
                  </div>
                </td>
                <td
                  class="borderRight"
                  @click="
                    showHistoryLateQa(
                      order.OrderNumber,
                      order.qaTarget.length > 0
                        ? order.qaTarget[0].SumLateQa
                        : 0
                    )
                  "
                >
                  <div class="fontSize8 mx-n3 orange--text" align="center">
                    เลื่อน
                  </div>
                  <div class="fontSize10 mx-n3 orange--text" align="center">
                    {{
                      order.qaTarget.length > 0
                        ? order.qaTarget[0].SumLateQa
                        : "0"
                    }}
                    <span class="fontSize8"> ครั้ง</span>
                  </div>
                </td>
                <td
                  v-for="(h, index) in order.qaCalender"
                  :key="index"
                  :class="[
                    h.Dow === 'ส.' ? 'borderRightOffWeek' : 'borderRight',
                    order.DueDate === h.DayWip ? 'orange lighten-4' : '',
                    order.CustomerDueDate === h.DayWip ? 'green lighten-4' : ''
                  ]"
                  @click="
                    InputTarget(
                      h,
                      order.OrderNumber,
                      'last',
                      indexMaster,
                      index
                    )
                  "
                >
                  <div
                    class="fontSize8 mx-n3"
                    align="center"
                    v-if="h.LastTarget !== 0"
                  >
                    {{ h.LastTarget.toLocaleString() }}
                  </div>
                </td>
              </tr>

              <!-- row 5  -->
              <tr>
                <td
                  class="borderRight grey lighten-3"
                  @click="showDialogMaterail(order.OrderNumber, 'parts', 1)"
                >
                  <div class="fontSize8 mx-n3" align="center">อะไหล่</div>
                </td>
                <th class="borderRight">
                  <div class="fontSize8 mx-n3" align="center"></div>
                </th>
                <td class="borderRight">
                  <div class="fontSize8 mx-n4" align="center">จำนวนค้าง</div>
                </td>

                <!--START LOOP PROCESS -->
                <td
                  class="borderRight"
                  v-for="(process, indexProcess) in order.Process"
                  :key="'p5' + indexProcess"
                >
                  <div
                    class="fontSize10 mx-n2"
                    align="center"
                    v-if="process.TotalInProcess != 0"
                  >
                    {{ process.TotalInProcess.toLocaleString() }}
                  </div>
                </td>
                <!--END LOOP PROCESS -->

                <td class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">ยอดส่งจริง</div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8" align="center"></div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8" align="center"></div>
                </td>
                <td
                  v-for="(h, index) in order.qaCalender"
                  :key="index"
                  :class="[
                    h.Dow === 'ส.' ? 'borderRightOffWeek' : 'borderRight',
                    order.DueDate === h.DayWip ? 'orange lighten-4' : '',
                    order.CustomerDueDate === h.DayWip ? 'green lighten-4' : ''
                  ]"
                >
                  <div
                    :class="
                      h.ToQa > 0 &&
                      convertDate_JS_TO_SQL(h.DayWip) >
                        convertDate_JS_TO_SQL(order.DueDate)
                        ? 'fontSize9 mx-n3 font-weight-bold red--text'
                        : 'fontSize8 mx-n3'
                    "
                    align="center"
                    v-if="h.ToQa"
                  >
                    {{ h.ToQa.toLocaleString() }}
                  </div>
                </td>
              </tr>

              <!-- row 6  -->
              <tr>
                <td class="borderBottom">
                  <div class="fontSize8 mx-n3 py-1" align="center">
                    วันทำงาน
                  </div>
                </td>
                <td class="borderBottom">
                  <div class="fontSize8 mx-n3" align="center">วันทั้งหมด</div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8 mx-n3" align="center">เลทแผนก</div>
                </td>

                <td
                  class="borderRight"
                  v-for="(process, indexProcess) in order.Process"
                  :key="'p6' + indexProcess"
                >
                  <div
                    class="fontSize10 white--text font-weight-bold mx-n3"
                    align="center"
                  >
                    0
                  </div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8 mx-n4" align="center">ยอดค้างส่ง</div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8" align="center"></div>
                </td>
                <td class="borderRight">
                  <div class="fontSize8" align="center"></div>
                </td>
                <td
                  v-for="(h, index) in order.qaCalender"
                  :key="index"
                  :class="[
                    h.Dow === 'ส.' ? 'borderRightOffWeek' : 'borderRight',
                    order.DueDate === h.DayWip ? 'orange lighten-4' : '',
                    order.CustomerDueDate === h.DayWip ? 'green lighten-4' : ''
                  ]"
                >
                  <div
                    :class="
                      (h.BalanceQty > 0 || h.ToQa > 0) &&
                      convertDate_JS_TO_SQL(h.DayWip) >
                        convertDate_JS_TO_SQL(order.DueDate)
                        ? 'fontSize9 mx-n3 font-weight-bold red--text'
                        : 'fontSize8 mx-n3'
                    "
                    align="center"
                    v-if="
                      (h.BalanceQty || h.ToQa) &&
                        convertDate_JS_TO_SQL(getDate) >=
                          convertDate_JS_TO_SQL(h.DayWip)
                    "
                  >
                    {{
                      h.ToQa && !h.BalanceQty
                        ? "จบ"
                        : h.BalanceQty.toLocaleString()
                    }}
                  </div>
                </td>
              </tr>

              <!-- row 7 -->
              <tr>
                <td class="borderBottom" rowspan="2">
                  <!-- class="fontSize10 red--text font-weight-bold mx-n3" -->
                  <div
                    v-bind:class="{
                      'fontSize10 red--text font-weight-bold mx-n3':
                        order.WorkingDay < 0,
                      'fontSize10 orange--text font-weight-bold mx-n3':
                        order.WorkingDay >= 0 && order.WorkingDay <= 5,
                      'fontSize10 green--text font-weight-bold mx-n3':
                        order.WorkingDay > 5
                    }"
                    align="center"
                    v-if="order.SumTotalToQa < order.TotalQty"
                  >
                    {{ order.WorkingDay }}
                  </div>
                </td>
                <td class="borderBottom" rowspan="2">
                  <div
                    v-bind:class="{
                      'fontSize10 red--text font-weight-bold mx-n3 ':
                        order.TotalDay < 0,
                      'fontSize10 orange--text font-weight-bold mx-n3':
                        order.TotalDay >= 0 && order.TotalDay <= 5,
                      'fontSize10 green--text font-weight-bold mx-n3':
                        order.TotalDay > 5
                    }"
                    align="center"
                    v-if="order.SumTotalToQa < order.TotalQty"
                  >
                    {{ order.TotalDay }}
                  </div>
                </td>
                <td class="borderBottom mt-5" colspan="3" rowspan="2">
                  <div class="fontSize8 mx-n3">แผนการเร่งงาน :</div>
                </td>
                <td
                  class="borderBottomOffWeek"
                  colspan="14"
                  rowspan="2"
                  @click="showInsertDes(indexMaster, 'plan')"
                >
                  <div class="fontSize8">{{ order.PlanDes }}</div>
                </td>
                <td class="borderBottom" colspan="3" rowspan="2">
                  <div class="fontSize8 mx-n3">สาเหตุล่าช้า / จำนวน :</div>
                </td>
                <td
                  class="borderBottom"
                  :colspan="order.qaCalender.length"
                  rowspan="2"
                  @click="showInsertDes(indexMaster, 'qa')"
                >
                  <div class="fontSize8">{{ order.QaDes }}</div>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-card>
    </div>

    <!-- POPUP ปฎิทิน -->
    <v-dialog
      v-model="dataFilter.dateBetween.showDialog"
      max-height="300"
      max-width="300"
      class="fontSarabun"
    >
      <v-date-picker
        v-model="dataFilter.dateBetween.values"
        range
        @change="filterDateBetween()"
        color="blue-grey lighten-2"
      ></v-date-picker>
    </v-dialog>

    <!-- POPUP INV  -->
    <v-dialog
      v-model="dialogMaterail.showDialog"
      persistent
      :overlay="false"
      width="900"
    >
      <v-card>
        <div align="right" class="pt-2 mr-2">
          <v-btn color="red" dark @click="dialogMaterail.showDialog = false"
            >close</v-btn
          >
        </div>
        <div align="center">
          <InvForOrderNewVue
            :dataInput="dialogMaterail"
            v-if="dialogMaterail.showDialog"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- ใส่เป้า -->
    <v-dialog
      v-model="dialogInputTarget.showDialog"
      :overlay="false"
      max-width="250px"
    >
      <v-card class="fontSarabun">
        <div class="px-5 pt-5">
          <!-- :disabled="!dialogInputTarget.IsEditQty" -->
          <v-text-field
            v-model="dialogInputTarget.dataInput.Qty"
            append-icon="mdi-edit"
            type="number"
            outlined
            dense
            :rules="dialogInputTarget.rulseInput"
            autofocus
          ></v-text-field>

          <!-- <v-col cols="1"
              ><v-btn
                color="success"
                icon
                class="ml-n5"
                @click="
                  dialogInputTarget.IsEditQty = !dialogInputTarget.IsEditQty
                "
                ><v-icon>edit</v-icon></v-btn
              ></v-col
            > -->
        </div>
        <div align="right" class="mr-2 pb-2">
          <v-btn
            color="red"
            width="60"
            outlined
            dense
            class="mr-2"
            small
            @click="clearDataTarget()"
            >cancel</v-btn
          >
          <v-btn color="success" width="60" dense @click="confirmTarget()" small
            >Submit</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- ใส่ Des -->
    <v-dialog
      v-model="dialogInputDes.showDialog"
      :overlay="false"
      max-width="400px"
    >
      <v-card class="fontSarabun">
        <div class="px-5 pt-2">
          <div class="fontSize18">{{ dialogInputDes.showLabel }}</div>
          <v-textarea
            autofocus
            solo
            :label="'กรุณาใส่' + dialogInputDes.showLabel"
            v-model="dialogInputDes.valueDialog"
            outlined
          ></v-textarea>
        </div>
        <div align="right" class="pb-2 mr-5 mt-n5">
          <v-btn
            color="red"
            outlined
            dense
            class="mr-2"
            small
            width="60"
            @click="clearDataDes()"
            >cancel</v-btn
          >
          <v-btn
            color="success"
            dense
            small
            width="60"
            @click="confirmDes()"
            :loading="loadingBtn"
            >Submit</v-btn
          >
        </div>
      </v-card>
    </v-dialog>

    <!-- POPUP History Due QA เพิ่ม  -->
    <v-dialog
      v-model="dialogHistoryDueQa.showDialog"
      :overlay="false"
      width="500"
    >
      <v-card class="fontSarabun">
        <div align="right" class="pt-2 mr-3">
          <v-btn
            color="red"
            outlined
            dense
            small
            @click="dialogHistoryDueQa.showDialog = false"
            >ปิด</v-btn
          >
        </div>
        <div align="center">
          <HistoryDueQa
            :dataInput="dataprop"
            v-if="dialogHistoryDueQa.showDialog"
          />
        </div>
      </v-card>
    </v-dialog>

    <!-- Show Error ถ้าไม่ใส่ search -->
    <v-snackbar
      v-model="snackBarError.showSnackBar"
      color="deep-orange lighten-2"
      :timeout="snackBarError.timeout"
    >
      <div class="fontSarabun fontSize16 text-center" align="center">
        {{ snackBarError.titleSnackBar }}
        <br
          v-if="
            snackBarError.titleSnackBar !== '' &&
              snackBarError.titleSnackBar2 !== ''
          "
        />
        {{ snackBarError.titleSnackBar2 }}
      </div>
    </v-snackbar>
  </div>
</template>

<script>
import apiFacWip from "../services/apiFacWipStatus";
import apiMould from "../services/apiMould";
import InvForOrderNewVue from "./OrderStatus/InvForOrderNew.vue";
import SpinnerLoading from "../components/Loadings/SpinnerLoading.vue";
import apiCreatePDF from "../services/apiCreatePDF";
// import apiFacWipStatus from "../services/apiFacWipStatus";
import HistoryDueQa from "../views/FacWipStatusHistoryDueQa.vue";
// import ItemInProcessVue from "./ItemInProcess.vue";

export default {
  name: "facwipstatus-master",
  data: () => ({
    snackBarError: {
      showSnackBar: false,
      titleSnackBar: "",
      titleSnackBar2: "",
      timeout: 1500
    },
    dataMaster: [],
    loadingPage: false,
    getDate: new Date(),
    filterMonth: {
      pushMonth: 0,
      getDate: new Date(),
      showMonth: ""
    },
    dataFilter: {
      dateBetween: {
        showDialog: false,
        values: [],
        showDate: ""
      },
      ByFac: {
        selectedFac: [],
        showFac: [
          {
            name: "Factory 1",
            value: "1"
          },
          {
            name: "Factory 2",
            value: "2"
          },
          {
            name: "Factory 3",
            value: "3"
          },
          {
            name: "Factory 4",
            value: "4"
          }
        ]
      },
      ByOrder: {
        showOrder: [],
        selectedOrder: ""
      },
      ByStatus: {
        showStatus: ["เลยกำหนดส่ง", "เร่งการผลิต", "ดีมาก", "ปกติ"],
        selectedStatus: []
      }
    },
    dialogMaterail: {
      showDialog: false,
      orderNumber: "",
      material: 0
    },
    dialogInputTarget: {
      showDialog: false,
      IsEditQty: false,
      rulseInput: [v1 => !!v1 || "required"], // TEST Validate
      choseIndexMaster: 0,
      choseIndexCalender: 0,
      choseTarget: "",
      dataInput: {
        DueDate: "",
        OrderNumber: "",
        choseTarget: "",
        Qty: 0,
        EmpCode: ""
      }
    },
    dialogInputDes: {
      showDialog: false,
      IsEditDes: false,

      valueDialog: "",
      choseIndex: 0,
      choseDes: "",
      showLabel: "",
      dataInput: {
        orderNumber: "",
        PlanDes: "",
        QaDes: "",
        EmpCode: ""
      }
    },
    loadingBtn: false,
    dialogHistoryDueQa: {
      showDialog: false
    },
    dataprop: {
      orderNumber: ""
    }
  }),
  computed: {},
  components: {
    InvForOrderNewVue,
    SpinnerLoading,
    HistoryDueQa
  },
  async mounted() {
    this.convertDate_JS_TO_SQL(this.getDate);
    if (this.$store.state.filterFacwip !== null) {
      this.dataFilter = this.$store.state.filterFacwip;
      await this.getDateMaster();
    } else {
      this.dataFilter.dateBetween.showDate = "2022-01-01 ~ 2022-12-31";
      this.dataFilter.dateBetween.values[0] = "2022-01-01";
      this.dataFilter.dateBetween.values[1] = "2022-12-31";
      // this.dataFilter.ByOrder.selectedOrder = "MEJ116";
      // this.dataFilter.ByFac.selectedFac = ["1", "2", "3", "4"];
      await this.getDateMaster();
    }
  },
  methods: {
    async getDateMaster() {
      if (
        this.dataFilter.ByOrder.selectedOrder === "" ||
        this.dataFilter.ByFac.selectedFac.length === 0
      ) {
        this.loadingPage = true;
        this.snackBarError.showSnackBar = true;
        this.snackBarError.titleSnackBar = `${
          this.dataFilter.ByOrder.selectedOrder === ""
            ? "กรุณาใส่ Order ที่ต้องการ"
            : ""
        }`;
        this.snackBarError.titleSnackBar2 = `${
          this.dataFilter.ByFac.selectedFac.length === 0
            ? "โปรดระบุ Fact ที่ต้องการ"
            : ""
        }`;
        setTimeout(() => {
          this.loadingPage = false;
        }, 1500);
      } else {
        this.loadingPage = true;
        this.dataMaster = await apiFacWip.getOrderStatusNew({
          orderFilter: this.dataFilter.ByOrder.selectedOrder.toUpperCase(),
          factory: this.dataFilter.ByFac.selectedFac,
          dateBetween: this.dataFilter.dateBetween.values
        });
        setTimeout(() => {
          this.loadingPage = false;
        }, 500);
      }
    },
    async getOrderForFilter() {
      this.dataFilter.ByOrder.showOrder = await apiMould.getOrderNumber();
      this.dataFilter.ByOrder.showOrder = this.dataFilter.ByOrder.showOrder.map(
        ({ OrderNumber }) => OrderNumber
      );
    },
    showDialogMaterail(orderNumber, materail, isCheck) {
      if (isCheck) {
        this.dialogMaterail.material = materail;
        this.dialogMaterail.orderNumber = orderNumber;
        this.dialogMaterail.showDialog = true;
      }
    },
    gotoDetail(orderNumber, OrderQty) {
      this.$router.push({
        name: "facwipstatus-detail",
        params: {
          orderNumber: orderNumber,
          OrderQty: OrderQty
        }
      });
      this.$store.state.filterFacwip = this.dataFilter;
    },
    filterDateBetween() {
      this.dataFilter.dateBetween.showDialog = false;
      this.dataFilter.dateBetween.values.sort((a, b) =>
        a > b ? 1 : b > a ? -1 : 0
      );
      this.dataFilter.dateBetween.showDate = `${this.dataFilter.dateBetween.values[0]} ~ ${this.dataFilter.dateBetween.values[1]}`;
    },
    InputTarget(
      { DayWip, FirstTarget, LastTarget },
      orderNumber,
      chose,
      indexMaster,
      indexCalendar
    ) {
      if (
        this.dataMaster[indexMaster].SumTotalToQa <
        this.dataMaster[indexMaster].TotalQty
      ) {
        const sumTargetFirst = this.dataMaster[indexMaster].qaCalender.reduce(
          (pv, cv) => pv + cv.FirstTarget,
          0
        );
        // const sumTargetLast = this.dataMaster[indexMaster].qaCalender.reduce(
        //   (pv, cv) => pv + cv.LastTarget,
        //   0
        // );
        if (
          chose === "first" &&
          (sumTargetFirst < this.dataMaster[indexMaster].TotalQty ||
            this.convertDate_JS_TO_SQL(
              this.dataMaster[indexMaster].qaTarget[0].FirstTarget
            ) === this.convertDate_JS_TO_SQL(new Date()))
        ) {
          this.dialogInputTarget.dataInput.DueDate = DayWip;
          this.dialogInputTarget.dataInput.OrderNumber = orderNumber;
          this.dialogInputTarget.dataInput.choseTarget = chose;
          this.dialogInputTarget.dataInput.Qty =
            chose === "first" && FirstTarget > 0 ? FirstTarget : null;
          this.dialogInputTarget.dataInput.EmpCode = this.$store.state.username;
          this.dialogInputTarget.choseIndexMaster = indexMaster;
          this.dialogInputTarget.choseIndexCalender = indexCalendar;
          this.dialogInputTarget.showDialog = true;
        } else if (
          chose === "last" &&
          sumTargetFirst >= this.dataMaster[indexMaster].TotalQty
          // กดโชว์ POP ไม่ตรวจสอบ จำนวน
        ) {
          this.dialogInputTarget.dataInput.DueDate = DayWip;
          this.dialogInputTarget.dataInput.OrderNumber = orderNumber;
          this.dialogInputTarget.dataInput.choseTarget = chose;
          this.dialogInputTarget.dataInput.Qty =
            chose === "last" && FirstTarget > 0 ? LastTarget : null;
          this.dialogInputTarget.dataInput.EmpCode = this.$store.state.username;
          this.dialogInputTarget.choseIndexMaster = indexMaster;
          this.dialogInputTarget.choseIndexCalender = indexCalendar;
          this.dialogInputTarget.showDialog = true;
        }
      }
    },
    async confirmTarget() {
      const oldQty =
        this.dialogInputTarget.dataInput.choseTarget === "first"
          ? this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
              this.dialogInputTarget.choseIndexCalender
            ].FirstTarget
          : this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
              this.dialogInputTarget.choseIndexCalender
            ].LastTarget;
      // console.log(oldQty);
      switch (this.dialogInputTarget.dataInput.choseTarget) {
        case "first":
          // console.log("first", oldQty);
          this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
            this.dialogInputTarget.choseIndexCalender
          ].FirstTarget =
            this.dialogInputTarget.dataInput.Qty !== null
              ? Number(this.dialogInputTarget.dataInput.Qty)
              : 0;
          const sumFirstTarget = this.dataMaster[
            this.dialogInputTarget.choseIndexMaster
          ].qaCalender.reduce((pv, cv) => pv + cv.FirstTarget, 0);
          if (
            sumFirstTarget <=
            this.dataMaster[this.dialogInputTarget.choseIndexMaster].TotalQty
          ) {
            // console.log("success");
            //INSERT DATA
            const { result } = await apiFacWip.insertDueQa(
              this.dialogInputTarget.dataInput
            );
            this.dataMaster[
              this.dialogInputTarget.choseIndexMaster
            ].qaTarget = result;
            // console.log(result);
            //CLEAR DATA
            this.clearDataTarget();
          } else {
            // ไม่อัพเดท Array เอาค่าเดิมมาแทน
            this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
              this.dialogInputTarget.choseIndexCalender
            ].FirstTarget = oldQty;
            // Sum หาผลรวมค่าเดิม เพื่อนำมาคำนวนหาค่าที่ควรต้องใส่
            const sumTargetDefault = this.dataMaster[
              this.dialogInputTarget.choseIndexMaster
            ].qaCalender.reduce((pv, cv) => pv + cv.FirstTarget, 0);
            // แทนค่าจำนวนที่ต้องใส่
            this.dialogInputTarget.dataInput.Qty =
              this.dataMaster[this.dialogInputTarget.choseIndexMaster]
                .TotalQty - sumTargetDefault;
            // console.log("fail");
          }
          break;
        case "last":
          // console.log("last", oldQty);
          this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
            this.dialogInputTarget.choseIndexCalender
          ].LastTarget =
            this.dialogInputTarget.dataInput.Qty !== null
              ? Number(this.dialogInputTarget.dataInput.Qty)
              : 0;
          const sumLastTarget = this.dataMaster[
            this.dialogInputTarget.choseIndexMaster
          ].qaCalender.reduce((pv, cv) => pv + cv.LastTarget, 0);
          if (
            sumLastTarget <=
            this.dataMaster[this.dialogInputTarget.choseIndexMaster].TotalQty
          ) {
            // console.log("success");
            //INSERT DATA
            const { result } = await apiFacWip.insertDueQa(
              this.dialogInputTarget.dataInput
            );
            this.dataMaster[
              this.dialogInputTarget.choseIndexMaster
            ].qaTarget = result;
            // console.log(result);
            //CLEAR DATA
            this.clearDataTarget();
          } else {
            // ไม่อัพเดท Array เอาค่าเดิมมาแทน
            this.dataMaster[this.dialogInputTarget.choseIndexMaster].qaCalender[
              this.dialogInputTarget.choseIndexCalender
            ].LastTarget = oldQty;
            // Sum หาผลรวมค่าเดิม เพื่อนำมาคำนวนหาค่าที่ควรต้องใส่
            const sumLastTargetDefault = this.dataMaster[
              this.dialogInputTarget.choseIndexMaster
            ].qaCalender.reduce((pv, cv) => pv + cv.LastTarget, 0);
            // แทนค่าจำนวนที่ต้องใส่
            this.dialogInputTarget.dataInput.Qty =
              this.dataMaster[this.dialogInputTarget.choseIndexMaster]
                .TotalQty - sumLastTargetDefault;
            // console.log("fail");
          }

          break;
        default:
          break;
      }
    },
    convertDate_JS_TO_SQL(date) {
      const valueDate = `${this.$moment(date).format("YYYY")}-${this.$moment(
        date
      ).format("MM")}-${this.$moment(date).format("DD")}`;
      return valueDate;
    },
    showInsertDes(index, input) {
      if (
        this.dataMaster[index].SumTotalToQa < this.dataMaster[index].TotalQty
      ) {
        this.dialogInputDes.choseIndex = index;
        this.dialogInputDes.choseDes = input;
        this.dialogInputDes.showLabel =
          input === "plan" ? "แผนการเร่งงาน" : "สาเหตุล่าช้า QA / จำนวน";
        this.dialogInputDes.valueDialog =
          input === "plan"
            ? this.dataMaster[index].PlanDes
            : this.dataMaster[index].QaDes;
        this.dialogInputDes.showDialog = true;
      }
    },
    async confirmDes() {
      switch (this.dialogInputDes.choseDes) {
        case "plan":
          this.dataMaster[
            this.dialogInputDes.choseIndex
          ].PlanDes = this.dialogInputDes.valueDialog;
          break;
        case "qa":
          this.dataMaster[
            this.dialogInputDes.choseIndex
          ].QaDes = this.dialogInputDes.valueDialog;
          break;
      }
      this.dialogInputDes.dataInput = {
        orderNumber: this.dataMaster[this.dialogInputDes.choseIndex]
          .OrderNumber,
        PlanDes: this.dataMaster[this.dialogInputDes.choseIndex].PlanDes,
        QaDes: this.dataMaster[this.dialogInputDes.choseIndex].QaDes,
        EmpCode: this.$store.state.username
      };
      this.loadingBtn = true;
      const { result } = await apiFacWip.insertOrderDes(
        this.dialogInputDes.dataInput
      );
      setTimeout(() => {
        if (result === "ok") {
          this.loadingBtn = false;
          //CLEAR DATA
          this.clearDataDes();
        } else {
          this.loadingBtn = false;
          alert("ข้อมูลผิดพลาด");
        }
      }, 500);
    },
    showHistoryLateQa(OrderNumber, count) {
      if (count > 0) {
        this.dataprop.orderNumber = OrderNumber;
        this.dialogHistoryDueQa.showDialog = true;
      }
    },
    clearDataTarget() {
      // this.dialogInputTarget.IsEditQty = false;
      this.dialogInputTarget.dataInput.Qty = 0;
      this.dialogInputTarget.showDialog = false;
    },
    clearDataDes() {
      this.dialogInputDes = {
        showDialog: false,
        IsEditDes: false,
        valueDialog: "",
        choseIndex: 0,
        choseDes: "",
        dataCreate: {
          orderNumber: "",
          PlanDes: "",
          QaDes: "",
          EmpCode: ""
        }
      };
    },
    async reduceQaCalendar(indexMaster) {
      this.loadingBtn = true;
      // this.loadingPage = true;
      // console.log("ก่อน", this.dataMaster[indexMaster].qaCalender);
      let { result, headerMonth } = await apiFacWip.reduceQaCalendar({
        orderNumber: this.dataMaster[indexMaster].OrderNumber
      });
      // console.log(message, result);
      let OrderQty = this.dataMaster[indexMaster].TotalQty;
      result.forEach((obj, index) => {
        OrderQty = OrderQty - obj.ToQa;
        result[index].BalanceQty = OrderQty;
      });
      this.dataMaster[indexMaster].qaCalender = result;
      this.dataMaster[indexMaster].headerMonth = headerMonth;
      setTimeout(() => {
        // this.loadingPage = false;
        // console.log("หลัง", this.dataMaster[indexMaster].qaCalender);
        this.loadingBtn = false;
      }, 500);
    },
    async finishOrder(index) {
      const { message } = await apiFacWip.isfinishOrderFact({
        orderNumber: this.dataMaster[index].OrderNumber,
        EmpCode: this.$store.state.username
      });
      if (message === "ok") {
        this.dataMaster[index].isFinish = true;
        this.snackBarError.showSnackBar = true;
        this.snackBarError.timeout = 5000;
        this.snackBarError.titleSnackBar =
          "Order นี้เสร็จแล้ว จะถูกปิด Order ในอีก 7 วัน";
      }
    },
    async printReport() {
      // console.log(this.dataMaster);
      await apiCreatePDF.printFacWipStatus(this.dataMaster);
    }
  }
};
</script>

<style lang="scss">
table > thead > tbody > tr > th,
td {
  min-width: 1px !important;
  height: 1px !important;
}
.myImg {
  filter: brightness(80%);
}

.borderRight {
  border-right: 1px solid rgb(214, 214, 214);
}

.borderRightOffWeek {
  border-right: 2px solid rgb(190, 216, 255);
}

.borderHeaderTopLine {
  border-top: 1px solid rgb(214, 214, 214);
  border-right: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.borderHeaderMonthTopLine {
  border-right: 1px solid rgb(214, 214, 214);
}

.borderHeaderMonthTopLineOffMonth {
  border-top: 1px solid rgb(214, 214, 214);
  border-right: 2px solid rgb(190, 216, 255);
}

.borderHeaderTopLineOffWeek {
  border-top: 1px solid rgb(214, 214, 214);
  border-right: 2px solid rgb(190, 216, 255);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.borderBottom {
  border-right: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}

.borderBottomOffWeek {
  border-right: 2px solid rgb(190, 216, 255);
  border-bottom: 1px solid rgb(214, 214, 214);
}
</style>
