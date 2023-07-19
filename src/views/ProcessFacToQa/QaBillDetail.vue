<template>
  <v-app v-if="!loadingPage">
    <v-card class="fontSarabun ma-2">
      <div class="fontSize24 mb-7" align="center">
        <b>สถานะงานในบิล</b>
      </div>

      <div class="mt-n14 pr-3" align="right">
        <v-btn color="blue" dark dense small fab @click="printQaBillSlip()">
          <v-icon>print</v-icon>
        </v-btn>
        <br />
        <span class="fontSize12">พิมพ์สลิป</span>
      </div>

      <v-row dense>
        <v-col>
          <b class="fontSize18">เลขที่บิล :</b>
          <span class="fontSize18 ml-2">{{ dataBill.qaDocNumber }}</span>
        </v-col>
        <v-col>
          <b class="fontSize18">OrderNumber :</b>
          <span class="fontSize18 ml-2">{{ dataBill.OrderNumber }}</span>
        </v-col>
      </v-row>

      <v-row dense class="">
        <v-col>
          <b class="fontSize18">ผู้ส่งบิล :</b>
          <span class="fontSize18 ml-2">{{
            dataBill.Sender ? dataBill.Sender : ""
          }}</span></v-col
        >
        <v-col>
          <b class="fontSize18">โอนจาก :</b>
          <span class="fontSize18 ml-2">{{
            `Factory ${dataBill.ProductionTeam}`
          }}</span></v-col
        >
      </v-row>
      <v-row dense>
        <v-col>
          <div>
            <b class="fontSize18">วันเปิดบิล :</b>
            <span class="fontSize18 ml-2"
              >{{ $moment(dataBill.billDate).format("L") }}
              <b class="fontSize18">เวลา :</b>
              {{ $moment(dataBill.billDate).format("LTS") }}</span
            >
          </div>
          <div class="mt-2" v-if="dataBill.qaBillStatus.trim() !== ''">
            <v-row dense>
              <v-col cols="12">
                <div class="ml-3">
                  <v-checkbox
                    label="ระบุผู้ตรวจสอบงาน ( QA ):"
                    class="mt-n1"
                    color="blue"
                    v-model="defaultQAPerson.checkbox"
                    :disabled="
                      dataBill.qaBillStatus.trim() !== '1' ||
                        $store.state.levelUser.isQATeam.filter(
                          obj =>
                            obj.QATeam === dataBill.saleManager &&
                            obj.isReceive === true
                        ).length <= 0
                    "
                    @change="checkboxDefaultQAPerson()"
                  />
                </div>
              </v-col>
            </v-row>
            <v-row dense>
              <v-col cols="4">
                <div class="ml-3">
                  <v-autocomplete
                    label="รหัสพนักงาน"
                    :items="$store.state.FacToQa.StatusDetail.employeeQC"
                    item-text="EmpCode"
                    item-value="EmpCode"
                    dense
                    outlined
                    class="mt-n5"
                    :disabled="!defaultQAPerson.checkbox"
                    v-model="defaultQAPerson.valuesQAPerson"
                    @change="setDefaultQAPerson()"
                  />
                </div>
              </v-col>
              <v-col cols="6">
                <div>
                  <v-autocomplete
                    label="ชื่อผู้ตรวจสอบ"
                    :items="$store.state.FacToQa.StatusDetail.employeeQC"
                    item-text="EmpFullName"
                    item-value="EmpCode"
                    dense
                    outlined
                    class="mt-n5"
                    :disabled="!defaultQAPerson.checkbox"
                    v-model="defaultQAPerson.valuesQAPerson"
                    @change="setDefaultQAPerson()"
                  />
                </div>
              </v-col>
            </v-row>
          </div>
        </v-col>
        <v-col cols="6">
          <span class="fontSize18">
            <b>ผู้รับ :</b>
            {{ dataBill.Receiver ? dataBill.Receiver : "___________________" }}
            <br v-if="dataBill.receiveDate" />
            <b>วันที่รับ :</b>
            {{
              dataBill.receiveDate
                ? $moment(dataBill.receiveDate).format("L")
                : "_________"
            }}
            <b class="fontSize18">เวลา :</b>
            {{
              dataBill.receiveDate
                ? $moment(dataBill.receiveDate).format("LTS")
                : "_________"
            }}</span
          >
        </v-col>
      </v-row>

      <!-- CART -->
      <v-row v-if="dataBill.qaBillStatus.trim() !== ''" class="mb-n10 mt-n8">
        <v-col cols="1">
          <div class="mt-n5 ml-3">
            <v-checkbox
              v-model="checkboxAllFinish"
              @change="checkBoxFinishAll()"
              large
              color="blue"
            />
          </div>
        </v-col>
        <v-col cols="3">
          <div class="fontPrompt fontSize20 ml-n5 mt-n1">: งานผ่านทั้งหมด</div>
        </v-col>
        <v-col cols="2"> </v-col>
        <v-col cols="3">
          <div align="left" class="ml-n2 mt-n2">
            <v-btn color="amber" dense>
              <div class="fontSize16 mx-n2" @click="gotorepair()">
                ดูรายการส่งซ่อมของบิลนี้
              </div>
            </v-btn>
          </div>
        </v-col>
        <v-col cols="2"> </v-col>
        <v-col cols="1" class="mt-n2">
          <v-badge
            :color="valuesInCart.valuesFinish.length ? 'red' : ''"
            :content="countItemInCart()"
            overlap
          >
            <v-menu bottom offset-y width="80">
              <template v-slot:activator="{ on, attrs }">
                <v-icon large v-bind="attrs" v-on="on" class=""
                  >mdi-cart</v-icon
                >
              </template>
              <v-list
                style="max-height: 500px"
                width="300"
                class="overflow-y-auto fontPrompt"
              >
                <v-list-item class="mt-n4 mb-n2 blue lighten-4">
                  <v-list-item-content>
                    <div class="fontSize16 mt-2" align="center">
                      <b>งานผ่าน</b>
                    </div></v-list-item-content
                  ></v-list-item
                >
                <v-list-item
                  align="center"
                  @click="() => {}"
                  v-for="(item, indexCart) in valuesInCart.valuesFinish"
                  :key="indexCart"
                >
                  <div class="fontSize12 fontPrompt">
                    {{ item.OrderItemNo }}
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
                      <b>{{ item.SelectQaFinish }} ชิ้น</b>
                    </div>
                    <div
                      class="grey--text fontSize11"
                      v-if="item.EmpQCItem !== ''"
                    >
                      ผู้ตรวจงาน :{{ showNameEmpQA(item.QAPerson) }}
                    </div>
                  </v-list-item-content>

                  <v-icon
                    class="mr-n4 mt-n2"
                    @click="deleteCartFinish(item.OrderItemNo, indexCart)"
                    >mdi-close</v-icon
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list align="center" class="fontSarabun blue lighten-4">
                  <div class="fontSize14">
                    จำนวนงานที่ผ่าน :
                    <b class="fontSize16">{{
                      valuesInCart.valuesFinish.reduce(
                        (pv, cv) => +pv + +cv.SelectQaFinish,
                        0
                      )
                    }}</b>
                    ชิ้น
                  </div>
                </v-list>
              </v-list>
              <v-list
                style="max-height: 500px"
                width="300"
                class="overflow-y-auto fontPrompt"
              >
                <v-list-item class="mt-n4 mb-n2 yellow lighten-4">
                  <v-list-item-content>
                    <div class="fontSize16 mt-2" align="center">
                      <b>งานซ่อม</b>
                    </div></v-list-item-content
                  ></v-list-item
                >
                <v-list-item
                  align="center"
                  @click="() => {}"
                  v-for="(item, indexCart) in valuesInCart.valuesRepair"
                  :key="indexCart"
                >
                  <div class="fontSize12 fontPrompt">
                    {{ item.OrderItemNo }}
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
                      <b>{{ item.SelectToRepair }} ชิ้น</b>
                    </div>
                    <!-- <div
                      class="grey--text fontSize11"
                      v-if="item.EmpQCItem !== ''"
                    >
                      ผู้ตรวจงาน :{{ showNameEmpQA(item.QAPerson) }}
                    </div> -->
                  </v-list-item-content>

                  <v-icon
                    class="mr-n4 mt-n2"
                    @click="deleteCartRepair(item.OrderItemNo, indexCart)"
                    >mdi-close</v-icon
                  >
                </v-list-item>
                <v-divider></v-divider>
                <v-list align="center" class="fontSarabun yellow lighten-4">
                  <div class="fontSize14">
                    จำนวนงานที่ซ่อม :
                    <b class="fontSize16">{{
                      valuesInCart.valuesRepair.reduce(
                        (pv, cv) =>
                          +pv + (cv.SelectToRepair ? +cv.SelectToRepair : 0),
                        0
                      )
                    }}</b>
                    ชิ้น
                  </div>
                </v-list>
              </v-list>
            </v-menu>
          </v-badge>
        </v-col>
      </v-row>

      <!-- DATA TABLE -->
      <v-row class="">
        <v-col>
          <v-simple-table class="border">
            <template v-slot:default>
              <thead>
                <tr
                  align="center"
                  justify="center"
                  :class="
                    dataBill.qaBillStatus.trim() === ''
                      ? 'red lighten-2'
                      : 'black'
                  "
                >
                  <th class="text-center" width="100">
                    <div class="fontSize14 white--text mx-n3">
                      <b>Picture</b>
                    </div>
                  </th>
                  <th class="text-center" width="300">
                    <div class="fontSize14 white--text mx-n3">
                      <b>รายละเอียด</b>
                    </div>
                  </th>
                  <th class="text-center" width="80">
                    <div class="fontSize14 white--text mx-n3">
                      <b>จำนวนทั้งหมด</b>
                    </div>
                  </th>
                  <th
                    class="text-center"
                    width="80"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize14 blue--text mx-n3">
                      <b>ผ่าน QA</b>
                    </div>
                  </th>

                  <th
                    class="text-center"
                    width="80"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize14 red--text mx-n3"><b>รอตรวจ</b></div>
                  </th>
                  <th
                    class="text-center"
                    width="80"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize14 orange--text mx-n3">
                      <b>ส่งซ่อม</b>
                    </div>
                  </th>
                  <th
                    class="text-center blue--text"
                    width="80"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize14 mx-n4">เลือก<br />จำนวนผ่าน</div>
                  </th>
                  <th
                    class="text-center orange--text"
                    width="80"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize14 mx-n3">เลือกจำนวนซ่อม</div>
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr class="grey lighten-2">
                  <td colspan="2">
                    <div align="center" class="fontSize18"><b>ยอดรวม :</b></div>
                  </td>
                  <td>
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) => +pv + cv.QtyItem,
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                  <td v-if="dataBill.qaBillStatus.trim() !== ''">
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) => +pv + +cv.QtyQAPass,
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                  <td v-if="dataBill.qaBillStatus.trim() !== ''">
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) =>
                            +pv +
                            (cv.QtyItem -
                              cv.QtyQAPass -
                              (cv.QtyInRepair - cv.QtyRepairFinish)),
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                  <td v-if="dataBill.qaBillStatus.trim() !== ''">
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) =>
                            +pv + (cv.QtyInRepair - cv.QtyRepairFinish),
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                  <td v-if="dataBill.qaBillStatus.trim() !== ''">
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) =>
                            +pv + (cv.SelectQaFinish ? cv.SelectQaFinish : 0),
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                  <td v-if="dataBill.qaBillStatus.trim() !== ''">
                    <div align="center" class="fontSize18">
                      <b>{{
                        dataBill.ItemBill.reduce(
                          (pv, cv) =>
                            +pv + (cv.SelectToRepair ? cv.SelectToRepair : 0),
                          0
                        ).toLocaleString()
                      }}</b>
                    </div>
                  </td>
                </tr>
                <tr
                  align="center"
                  v-for="(item, index) in dataBill.ItemBill"
                  :key="index"
                  v-bind:class="{
                    focusItem: item.FocusItem,
                    isFinish: item.QtyQAPass >= item.QtyItem
                  }"
                  focus
                >
                  <td align="center">
                    <v-img
                      :src="item.NewPict"
                      :lazy-src="$store.state.no_picture"
                      width="120"
                      class="text-left"
                    >
                      <v-chip color="blue" dark small>
                        <span class="">{{ item.OrderItemNo }}</span></v-chip
                      >
                    </v-img>
                  </td>
                  <td class="">
                    <div align="left">
                      <div class="mx-n3">{{ item.ProductCode }}</div>
                      <div class="mx-">
                        <b>Code :</b> {{ item.qaJobNumber }}
                      </div>
                      <div class="mx-"><b>QC FAC :</b> {{ item.QCPerson }}</div>
                    </div>
                  </td>
                  <td class="text-center">
                    <div class="fontSize18">
                      <b>{{ item.QtyItem.toLocaleString() }}</b>
                    </div>
                  </td>
                  <td
                    class="text-center"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize18 blue--text">
                      {{ item.QtyQAPass.toLocaleString() }}
                    </div>
                  </td>
                  <td
                    class="text-center"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize18 red--text">
                      {{
                        (
                          item.QtyItem -
                          item.QtyQAPass -
                          (item.QtyInRepair - item.QtyRepairFinish)
                        ).toLocaleString()
                      }}
                    </div>
                  </td>
                  <td
                    class="text-center"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="fontSize18 orange--text">
                      {{
                        (
                          item.QtyInRepair - item.QtyRepairFinish
                        ).toLocaleString()
                      }}
                    </div>
                  </td>
                  <td
                    class="text-center"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="mx-n3">
                      <v-btn
                        color="blue"
                        small
                        dense
                        @click="actionsDialog('PASS', index)"
                        :disabled="
                          (item.QtyQAPass >= item.QtyItem ||
                            item.QtyItem -
                              item.QtyQAPass -
                              (item.QtyInRepair - item.QtyRepairFinish) -
                              item.QtyRepairWaitReceive -
                              item.SelectQaFinish -
                              item.SelectToRepair <=
                              0) &&
                            item.SelectQaFinish <= 0
                        "
                      >
                        <b class="fontSize16">{{
                          (item.SelectQaFinish
                            ? item.SelectQaFinish
                            : 0
                          ).toLocaleString()
                        }}</b></v-btn
                      >
                    </div>
                  </td>
                  <td
                    class="text-center"
                    v-if="dataBill.qaBillStatus.trim() !== ''"
                  >
                    <div class="mx-n3">
                      <v-btn
                        color="amber"
                        small
                        dense
                        class="ml-2"
                        @click="actionsDialog('REPAIR', index)"
                        :disabled="
                          (item.QtyQAPass >= item.QtyItem ||
                            item.QtyItem -
                              (item.QtyInRepair - item.QtyRepairFinish) -
                              item.QtyQAPass -
                              item.QtyRepairWaitReceive -
                              item.SelectQaFinish -
                              item.SelectToRepair <=
                              0) &&
                            item.SelectToRepair <= 0
                        "
                        ><b class="fontSize16">{{
                          (item.SelectToRepair
                            ? item.SelectToRepair
                            : 0
                          ).toLocaleString()
                        }}</b>
                      </v-btn>
                    </div>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-col>
      </v-row>
    </v-card>

    <div align="center" class="fontPrompt">
      <v-btn
        color="red"
        tile
        dark
        width="80"
        class="mr-16"
        @click="$router.go(-1)"
        :loading="loadingBtn"
      >
        <div class="fontSize16">กลับ</div>
      </v-btn>

      <v-btn
        color="success"
        tile
        width="80"
        class="ml-16"
        v-if="
          dataBill.qaBillStatus.trim() === '' &&
            dataBill.senderCode !== $store.state.username &&
            $store.state.levelUser.isQATeam.filter(
              obj =>
                obj.QATeam === dataBill.saleManager && obj.isReceive === true
            ).length > 0
        "
        @click="showDialogReceive()"
        :loading="loadingBtn"
      >
        <div class="fontSize16">ยืนยันรับ</div>
      </v-btn>

      <v-btn
        color="blue"
        tile
        width="80"
        class="ml-16"
        dark
        v-if="dataBill.qaBillStatus.trim() === '1'"
        @click="qaConfirmProcess()"
        :loading="loadingBtn"
        :disabled="
          $store.state.levelUser.isQATeam.filter(
            obj => obj.QATeam === dataBill.saleManager && obj.isReceive === true
          ).length <= 0
        "
      >
        <div class="fontSize16">เปิดบิล</div>
      </v-btn>
    </div>

    <!-- POPUP งานผ่าน -->
    <v-dialog v-model="dialogFinishItem.isShow" width="400">
      <v-card width="400" class="fontSarabun">
        <v-form @submit.prevent="confirmFinishItem()">
          <div align="center">
            <div align="left" class="pa-2">
              {{ dialogFinishItem.OrderItemNo }}
            </div>
            <v-img :src="dialogFinishItem.img" width="200" class="mt-n5" />
            <div class="fontSize16">
              <b>{{ dialogFinishItem.ProductCode }}</b>
            </div>
            <div class="px-10 mt-2">
              <v-text-field
                label="ใส่จำนวนโอน"
                v-model="dialogFinishItem.QtySend"
                autofocus
                type="number"
                dense
                outlined
                @change="checkError()"
              />
            </div>
            <div align="left" class="ml-12 mt-n6 red--text fontSize12">
              <b>{{ dialogFinishItem.error[0] }}</b>
            </div>

            <div class="mt-3 mb-3 pl-10" align="left"><b>ผู้ตรวจงาน</b></div>
            <v-row class="px-10 mt-5">
              <v-col cols="4">
                <v-autocomplete
                  label="รหัสพนักงาน"
                  :items="$store.state.FacToQa.StatusDetail.employeeQC"
                  item-text="EmpCode"
                  item-value="EmpCode"
                  v-model="dialogFinishItem.EmpQAItem"
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
                  v-model="dialogFinishItem.EmpQAItem"
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
                :disabled="dialogFinishItem.checkQty < dialogFinishItem.QtySend"
                >ยืนยัน</v-btn
              >
            </div>
          </div>
        </v-form>
      </v-card>
    </v-dialog>

    <!-- POPUP งานซ่อม -->
    <v-dialog v-model="dialogRepairItem.isShow" width="600">
      <v-card width="600" class="fontSarabun">
        <v-form @submit.prevent="confirmRepairItem()">
          <div align="center">
            <div align="left" class="pa-2">
              {{ dialogRepairItem.OrderItemNo }}
            </div>
            <v-img :src="dialogRepairItem.img" width="200" class="mt-n5" />
            <div class="fontSize16">
              <b>{{ dialogRepairItem.ProductCode }}</b>
            </div>

            <div class="fontSize18 ma-3" align="left">
              <b
                >จำนวนรวมที่ต้องการซ่อม =
                <span class="fontSize22">{{
                  dialogRepairItem.reason.reduce(
                    (pv, cv) => +pv + (cv.QtySend ? +cv.QtySend : 0),
                    0
                  )
                }}</span>
              </b>
            </div>
            <v-row
              dense
              class="mb-n6 mx-6"
              v-for="(r, index) in dialogRepairItem.reason"
              :key="index"
            >
              <v-col cols="4">
                <v-select
                  outlined
                  dense
                  label="แผนก"
                  v-model="r.type_ID"
                  :items="reasonShow"
                  item-text="repairType"
                  item-value="type_ID"
                />
              </v-col>
              <v-col cols="4">
                <v-select
                  outlined
                  dense
                  label="สาเหตุ"
                  :items="filterReason(r.type_ID)"
                  item-text="reasonType"
                  item-value="reason_No"
                  v-model="r.reason_No"
                  :disabled="!r.type_ID"
                />
              </v-col>
              <v-col cols="4">
                <v-text-field
                  outlined
                  dense
                  label="จำนวน"
                  v-model="r.QtySend"
                  type="number"
                  :disabled="!r.reason_No"
                />
              </v-col>
            </v-row>

            <v-row dense class="mt-n3">
              <v-col cols="12">
                <v-btn
                  color="blue"
                  dark
                  fab
                  small
                  @click="
                    dialogRepairItem.reason.push({
                      type_ID: null,
                      reason_No: null,
                      QtySend: null
                    })
                  "
                >
                  <v-icon>mdi-plus</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <div class="pb-2 mt-5">
              <v-btn
                color="success"
                type="submit"
                :disabled="sumTotalRepairInDialog() > dialogRepairItem.checkQty"
                >ยืนยัน</v-btn
              >
            </div>
          </div>
        </v-form>
      </v-card>
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
          <v-btn text @click="dialogConfirmReceive.showDialog = false"
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

    <v-dialog
      v-model="dialogInserted.showDialog"
      max-width="800"
      persistent
      :overlay="false"
      transition="dialog-transition"
    >
      <v-card class="fontSarabun px-4">
        <div align="center" class="fontSize26 py-2">
          <b>{{ dialogInserted.titleHeader }}</b>
        </div>
        <v-row>
          <!-- ตัวอย่างบิลเสร็จ -->
          <v-col
            :cols="valuesInCart.valuesRepair.length > 0 ? 6 : 12"
            v-if="valuesInCart.valuesFinish.length > 0"
          >
            <v-card>
              <div align="center">
                <v-btn
                  :color="
                    valuesInCart.valuesFinish.insertsuccess ? 'green' : 'red'
                  "
                  large
                  outlined
                  icon
                  readonly
                  height="80"
                  width="80"
                  ><v-icon large>{{
                    dialogInserted.Finish.icon
                  }}</v-icon></v-btn
                >
                <div>
                  {{ dialogInserted.Finish.billNumber }}
                </div>
                <div>
                  {{ dialogInserted.Finish.title }}
                </div>
                <div>
                  {{ dialogInserted.Finish.subtitle }}
                </div>
              </div>
              <!-- HEADER BILL Finish -->
              <v-row dense class="bgBlue mt-2 mx-2">
                <v-col cols="12">
                  <div align="center" class="fontPrompt"><b>QA ผ่าน</b></div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>เลขที่บิล : </b> {{ dialogInserted.Finish.billNumber }}
                  </div>
                </v-col>

                <v-col cols="6">
                  <div class="fontSize12">
                    <b>Order NO : </b> {{ dataBill.OrderNumber }}
                  </div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>ผู้ส่ง : </b> {{ $store.state.fullName }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>วันที่เปิดบิล : </b> {{ $moment().format("L") }}
                  </div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="12">
                  <v-simple-table>
                    <tr class="bgCyan">
                      <th class="HeaderOther">
                        <div class="fontSize12">Picture</div>
                      </th>
                      <th class="HeaderOther">
                        <div class="fontSize12">รายละเอียด</div>
                      </th>
                      <th class="HeaderOther">
                        <div class="fontSize12">จำนวนผ่าน</div>
                      </th>
                    </tr>
                    <tr
                      v-for="(F, Findex) in valuesInCart.valuesFinish"
                      :key="Findex"
                    >
                      <td class="borderGrey">
                        <div align="center">
                          <v-img
                            :src="F.NewPict"
                            :lazy-src="$store.state.no_picture"
                            width="60"
                          />
                        </div>
                      </td>
                      <td class="borderGrey">
                        <div align="left" class="fontSize12 ml-2">
                          {{ F.ProductCode }}
                        </div>
                        <div align="left" class="fontSize8 ml-2 grey--text">
                          QA : {{ F.QAPerson }}
                        </div>
                      </td>
                      <td class="borderGrey">
                        <div align="center" class="fontSize12">
                          {{ F.SelectQaFinish }}
                        </div>
                      </td>
                    </tr>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <!-- ตัวอย่างบิลซ่อม  -->
          <v-col
            :cols="valuesInCart.valuesFinish.length > 0 ? 6 : 12"
            v-if="valuesInCart.valuesRepair.length > 0"
          >
            <v-card>
              <div align="center">
                <v-btn
                  :color="
                    valuesInCart.valuesRepair.insertsuccess ? 'green' : 'red'
                  "
                  large
                  outlined
                  icon
                  readonly
                  height="80"
                  width="80"
                  ><v-icon large>{{
                    dialogInserted.Repair.icon
                  }}</v-icon></v-btn
                >
                <div>
                  {{ dialogInserted.Repair.billNumber }}
                </div>
                <div>
                  {{ dialogInserted.Repair.title }}
                </div>
                <div>
                  {{ dialogInserted.Repair.subtitle }}
                </div>
              </div>
              <!-- HEADER BILL Finish -->
              <v-row dense class="bgAmber mt-2 mx-2">
                <v-col cols="12">
                  <div align="center" class="fontPrompt">
                    <b>เปิดบิลซ่อม</b>
                  </div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>เลขที่บิล : </b> {{ dialogInserted.Repair.billNumber }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>Order NO : </b> {{ dataBill.OrderNumber }}
                  </div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>ผู้ส่ง : </b> {{ $store.state.fullName }}
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="fontSize12">
                    <b>วันที่เปิดบิล : </b> {{ $moment().format("L") }}
                  </div>
                </v-col>
              </v-row>
              <v-row dense class="mx-2">
                <v-col cols="12">
                  <v-simple-table>
                    <tr class="bgYellow">
                      <th class="HeaderOther">
                        <div class="fontSize12">Picture</div>
                      </th>
                      <th class="HeaderOther">
                        <div class="fontSize12">รายละเอียด</div>
                      </th>
                      <th class="HeaderOther">
                        <div class="fontSize12">จำนวนส่งซ่อม</div>
                      </th>
                    </tr>
                    <tr
                      v-for="(F, Findex) in valuesInCart.valuesRepair"
                      :key="Findex"
                    >
                      <td class="borderGrey">
                        <div align="center">
                          <v-img
                            :src="F.NewPict"
                            :lazy-src="$store.state.no_picture"
                            width="60"
                          />
                        </div>
                      </td>
                      <td class="borderGrey">
                        <div align="center" class="fontSize12">
                          {{ F.ProductCode }}
                        </div>
                      </td>
                      <td class="borderGrey">
                        <div align="center" class="fontSize12">
                          {{ F.SelectToRepair }}
                        </div>
                      </td>
                    </tr>
                  </v-simple-table>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

        <div class="mt-8 pb-5" align="center">
          <v-btn
            color="grey lighten-2"
            dense
            width="100"
            class="mx-4"
            @click="actionInserted(1)"
            :loading="loadingBtn"
            ><b>กลับ QABILL</b>
          </v-btn>
          <v-btn
            color="amber lighten-3"
            dense
            width="100"
            class="mx-4"
            @click="actionInserted(2)"
            :loading="loadingBtn"
          >
            <b>ดูบิลซ่อม</b></v-btn
          >
          <v-btn
            color="blue lighten-3"
            dense
            width="100"
            class="mx-4"
            @click="actionInserted(3)"
            :loading="loadingBtn"
          >
            <b>พิมพ์ใบส่งซ่อม</b>
          </v-btn>
          <v-btn
            color="red lighten-3"
            dense
            width="100"
            class="mx-4"
            @click="actionInserted(4)"
            :loading="loadingBtn"
          >
            <b>สถานะ ORDER</b>
          </v-btn>
        </div>
      </v-card>
    </v-dialog>

    <v-snackbar
      v-model="snackbar.show"
      :timeout="snackbar.timeout ? snackbar.timeout : 1500"
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
import apiDevice from "../../services/apiDevice";
import apiCreatePDF from "../../services/apiCreatePDF";

export default {
  name: "qabill-detail",
  components: {},

  data() {
    return {
      loadingBtn: false,
      loadingPage: true,
      snackbar: {
        show: false,
        title: "",
        icon: "",
        color: "",
        timeout: 0
      },
      checkboxAllFinish: false,
      dataBill: {},
      valuesInCart: {
        valuesFinish: [],
        valuesRepair: []
      },
      dialogFinishItem: {
        isShow: false,
        OrderItemNo: null,
        img: "",
        ProductCode: "",
        QtySend: null,
        index: null,
        checkQty: 0,
        error: [],
        EmpQAItem: ""
      },
      dialogRepairItem: {
        isShow: false,
        OrderItemNo: null,
        img: "",
        ProductCode: "",
        index: null,
        checkQty: 0,
        error: [],
        reason: []
      },
      dialogConfirmReceive: {
        showDialog: false
      },
      dialogInserted: {
        showDialog: false,
        titleHeader: "",
        Finish: {
          insertsuccess: false,
          billNumber: "",
          title: "",
          subtitle: "",
          icon: ""
        },
        Repair: {
          insertsuccess: false,
          billNumber: "",
          title: "",
          subtitle: "",
          icon: ""
        }
      },
      reasonShow: [],
      defaultQAPerson: {
        checkbox: false,
        valuesQAPerson: null
      }
    };
  },
  async mounted() {
    this.loadingPage = true;
    if (this.$route.params.data) {
      this.dataBill = this.$route.params.data;
      // console.log(this.dataBill);
      await this.loadEmp();
      setTimeout(() => {
        this.loadingPage = false;
      }, 300);
    } else {
      this.goback();
      setTimeout(async () => {
        this.loadingPage = false;
      }, 300);
    }
    // console.log(this.$route.params.data);
  },
  methods: {
    async loadEmp() {
      if (this.$store.state.FacToQa.StatusDetail.employeeQC.length === 0) {
        this.$store.state.FacToQa.StatusDetail.employeeQC = await apiDevice.getemployee();
      }
    },
    actionsDialog(action, index) {
      if (action === "PASS") {
        this.showDialogPass(index);
      } else if (action === "REPAIR") {
        this.showDialogRepair(index);
      }
    },
    confirmFinishItem() {
      //   console.log(55);
      // SET VALUES
      const indexCart = this.valuesInCart.valuesFinish.findIndex(
        ({ OrderItemNo }) =>
          OrderItemNo ===
          this.dataBill.ItemBill[this.dialogFinishItem.index].OrderItemNo
      );
      if (
        this.dialogFinishItem.checkQty >= this.dialogFinishItem.QtySend &&
        this.dialogFinishItem.QtySend > 0
      ) {
        this.dataBill.ItemBill[
          this.dialogFinishItem.index
        ].SelectQaFinish = +this.dialogFinishItem.QtySend;
        this.dataBill.ItemBill[
          this.dialogFinishItem.index
        ].QAPerson = this.dialogFinishItem.EmpQAItem;
        if (indexCart >= 0) {
          this.valuesInCart.valuesFinish[indexCart].SelectQaFinish = +this
            .dialogFinishItem.QtySend;
          this.valuesInCart.valuesFinish[
            indexCart
          ].QAPerson = this.dialogFinishItem.EmpQAItem;
        } else {
          this.valuesInCart.valuesFinish.push(
            this.dataBill.ItemBill[this.dialogFinishItem.index]
          );
        }
      } else if (
        this.dialogFinishItem.QtySend <= 0 ||
        !this.dialogFinishItem.QtySend
      ) {
        this.dataBill.ItemBill[this.dialogFinishItem.index].SelectQaFinish = 0;
        this.dataBill.ItemBill[this.dialogFinishItem.index].QAPerson = "";
        if (indexCart >= 0) {
          this.valuesInCart.valuesFinish.splice(indexCart, 1);
        }
      }
      //CLEAR DATA
      this.dialogFinishItem = {
        isShow: false,
        OrderItemNo: null,
        img: "",
        ProductCode: "",
        QtySend: null,
        index: null,
        checkQty: 0,
        error: [],
        EmpQAItem: ""
      };
    },
    showDialogPass(index) {
      // console.log("เดิม", this.dataBill.ItemBill[index].QAPerson);
      this.dialogFinishItem = {
        isShow: true,
        OrderItemNo: this.dataBill.ItemBill[index].OrderItemNo,
        img: this.dataBill.ItemBill[index].NewPict,
        ProductCode: this.dataBill.ItemBill[index].ProductCode,
        QtySend: this.dataBill.ItemBill[index].SelectQaFinish
          ? this.dataBill.ItemBill[index].SelectQaFinish
          : null,
        index: index,
        checkQty:
          this.dataBill.ItemBill[index].QtyItem -
          (this.dataBill.ItemBill[index].QtyInRepair -
            this.dataBill.ItemBill[index].QtyRepairFinish) -
          this.dataBill.ItemBill[index].QtyQAPass -
          this.dataBill.ItemBill[index].QtyRepairWaitReceive -
          this.dataBill.ItemBill[index].SelectToRepair,
        error: [],
        EmpQAItem: this.dataBill.ItemBill[index].QAPerson
          ? this.dataBill.ItemBill[index].QAPerson
          : this.defaultQAPerson.valuesQAPerson
      };
      // console.log("ใหม่", this.dialogFinishItem.EmpQAItem);
    },
    async showDialogRepair(index) {
      if (this.reasonShow.length === 0) {
        this.reasonShow = await apiFacToQa.getreason();
      }
      // console.log(this.reasonShow);
      this.dialogRepairItem = {
        isShow: true,
        OrderItemNo: this.dataBill.ItemBill[index].OrderItemNo,
        img: this.dataBill.ItemBill[index].NewPict,
        ProductCode: this.dataBill.ItemBill[index].ProductCode,
        QtySend: this.dataBill.ItemBill[index].SelectToRepair
          ? this.dataBill.ItemBill[index].SelectToRepair
          : null,
        index: index,
        checkQty:
          this.dataBill.ItemBill[index].QtyItem -
          (this.dataBill.ItemBill[index].QtyInRepair -
            this.dataBill.ItemBill[index].QtyRepairFinish) -
          this.dataBill.ItemBill[index].QtyQAPass -
          this.dataBill.ItemBill[index].QtyRepairWaitReceive -
          this.dataBill.ItemBill[index].SelectQaFinish,
        error: [],
        reason: this.dataBill.ItemBill[index].reason
          ? this.dataBill.ItemBill[index].reason
          : [
              {
                type_ID: null,
                reason_No: null,
                QtySend: null
              },
              {
                type_ID: null,
                reason_No: null,
                QtySend: null
              },
              {
                type_ID: null,
                reason_No: null,
                QtySend: null
              }
            ]
      };
    },
    filterReason(ID) {
      const a = ID
        ? this.reasonShow.filter(({ type_ID }) => type_ID === ID)[0].reason
        : [];
      //   console.log(a);
      return a;
    },
    checkError() {
      this.dialogFinishItem.error = [];
      if (this.dialogFinishItem.checkQty < this.dialogFinishItem.QtySend) {
        this.dialogFinishItem.error.push("จำนวนเกิน");
      }
    },
    showNameEmpQA(EmpQAItem) {
      const [name] = this.$store.state.FacToQa.StatusDetail.employeeQC
        .filter(({ EmpCode }) => EmpCode === EmpQAItem)
        .map(({ EmpFullName }) => EmpFullName);
      return name === undefined ? "" : name;
    },
    deleteCartFinish(OrderItemNoCart, indexCart) {
      const reviseIndex = this.dataBill.ItemBill.findIndex(
        ({ OrderItemNo }) => OrderItemNo === OrderItemNoCart
      );
      // console.log(reviseIndex);
      this.dataBill.ItemBill[reviseIndex].SelectQaFinish = null;
      this.dataBill.ItemBill[reviseIndex].QAPerson = "";
      this.valuesInCart.valuesFinish.splice(indexCart, 1);
    },
    checkBoxFinishAll() {
      this.valuesInCart.valuesFinish = [];
      if (this.checkboxAllFinish) {
        this.dataBill.ItemBill.forEach(obj => {
          obj.SelectQaFinish =
            obj.QtyItem -
            obj.QtyInRepair -
            obj.QtyQAPass -
            obj.QtyRepairWaitReceive -
            obj.SelectToRepair;
          if (obj.SelectQaFinish > 0) {
            this.valuesInCart.valuesFinish.push(obj);
          }
          // this.valuesInCart.valuesFinish.push(obj);
        });
      } else {
        this.dataBill.ItemBill.forEach(obj => {
          obj.SelectQaFinish = 0;
        });
      }
    },
    sumTotalRepairInDialog() {
      const res = this.dialogRepairItem.reason.reduce(
        (pv, cv) => +pv + (cv.QtySend ? +cv.QtySend : 0),
        0
      );
      return res;
    },
    countItemInCart() {
      const res1 = [
        ...new Set([
          ...this.valuesInCart.valuesFinish.map(
            ({ OrderItemNo }) => OrderItemNo
          ),
          ...this.valuesInCart.valuesRepair.map(
            ({ OrderItemNo }) => OrderItemNo
          )
        ])
      ].length;
      return res1 ? res1 : 0;
    },

    confirmRepairItem() {
      // console.log(this.dialogRepairItem);

      const indexCart = this.valuesInCart.valuesRepair.findIndex(
        ({ OrderItemNo }) =>
          OrderItemNo ===
          this.dataBill.ItemBill[this.dialogRepairItem.index].OrderItemNo
      );
      // SET VALUES
      if (
        this.dialogRepairItem.checkQty >= this.sumTotalRepairInDialog() &&
        this.sumTotalRepairInDialog() > 0
      ) {
        this.dataBill.ItemBill[
          this.dialogRepairItem.index
        ].SelectToRepair = this.sumTotalRepairInDialog();

        this.dataBill.ItemBill[
          this.dialogRepairItem.index
        ].reason = this.dialogRepairItem.reason.filter(
          ({ QtySend }) => +QtySend > 0
        );
        // Insert Cart
        if (indexCart >= 0) {
          this.valuesInCart.valuesRepair[
            indexCart
          ].SelectToRepair = this.sumTotalRepairInDialog();
          this.valuesInCart.valuesRepair[
            indexCart
          ].reason = this.dialogRepairItem.reason;
        } else {
          this.valuesInCart.valuesRepair.push(
            this.dataBill.ItemBill[this.dialogRepairItem.index]
          );
        }
      } else if (
        this.sumTotalRepairInDialog() <= 0 ||
        !this.sumTotalRepairInDialog()
      ) {
        this.dataBill.ItemBill[
          this.dialogRepairItem.index
        ].SelectToRepair = null;
        this.dataBill.ItemBill[this.dialogRepairItem.index].reason = null;
        if (indexCart >= 0) {
          this.valuesInCart.valuesRepair.splice(indexCart, 1);
        }
      }
      //CLEAR DATA
      this.dialogRepairItem = {
        isShow: false,
        OrderItemNo: null,
        img: "",
        ProductCode: "",
        index: null,
        checkQty: 0,
        error: [],
        reason: []
      };
      // console.log(this.valuesInCart.valuesRepair);
    },
    deleteCartRepair(OrderItemNoCart, indexCart) {
      const reviseIndex = this.dataBill.ItemBill.findIndex(
        ({ OrderItemNo }) => OrderItemNo === OrderItemNoCart
      );
      this.dataBill.ItemBill[reviseIndex].SelectToRepair = null;
      this.dataBill.ItemBill[reviseIndex].reason = null;
      this.valuesInCart.valuesRepair.splice(indexCart, 1);
    },
    showDialogReceive() {
      this.dialogConfirmReceive.showDialog = true;
      // console.log(this.dataBill.qaBill_ID);
    },
    async confirmReceive() {
      this.loadingBtn = true;
      const data = {
        qaBill_ID: this.dataBill.qaBill_ID,
        receiver: this.$store.state.username
      };
      // console.log(data);
      const { result } = await apiFacToQa.receiveBillFacToQa(data);
      if (result === "ok") {
        this.dataBill.qaBillStatus = "1";
        this.dialogConfirmReceive.showDialog = false;
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
    goback() {
      this.$router.go(-1);
    },

    async qaConfirmProcess() {
      this.loadingBtn = true;
      // console.log(this.valuesInCart);
      // ทำ QA เสร็จ
      if (this.valuesInCart.valuesFinish.length > 0) {
        // console.log("เปิดบิลเสร็จ", this.valuesInCart.valuesFinish);
        this.valuesInCart.valuesFinish.sort((a, b) =>
          a.OrderItemNo > b.OrderItemNo
            ? 1
            : b.OrderItemNo > a.OrderItemNo
            ? -1
            : 0
        );
        const dataBillFinish = {
          qaBill_ID: this.dataBill.qaBill_ID,
          orderNumber: this.dataBill.OrderNumber,
          docPrefix: `FN${this.$moment(new Date()).format("YY")}${this.$moment(
            new Date()
          ).format("MM")}`,
          sender: this.$store.state.username,
          finishItem: this.valuesInCart.valuesFinish.map((obj, index) => {
            return {
              finish_Item: index + 1,
              bill_Item: obj.bill_Item,
              QtySend: obj.SelectQaFinish,
              qaJobNumber: obj.qaJobNumber,
              QAPerson: obj.QAPerson
            };
          })
        };
        const { result, billNumber } = await apiFacToQa.insertqaFinish(
          dataBillFinish
        );
        if (result === "ok") {
          // console.log("เปิดบิลผ่าน", billNumber);
          this.dialogInserted.Finish = {
            insertsuccess: true,
            billNumber: billNumber,
            title: "สร้างบิลเรียบร้อยแล้ว",
            subtitle: ``,
            icon: "mdi-check-bold"
          };
        } else {
          this.dialogInserted.Finish = {
            insertsuccess: false,
            billNumber: billNumber,
            title: "ไม่สามารถบันทึกข้อมูลได้",
            subtitle: `กรุณาลองใหม่อีกครั้งหรือติดต่อแผนก IT`,
            icon: "mdi-close-circle"
          };
        }
      }
      // ทำ ส่งซ่อม
      if (this.valuesInCart.valuesRepair.length > 0) {
        // console.log("เปิดบิลซ่อม", this.valuesInCart.valuesRepair);
        this.valuesInCart.valuesRepair.sort((a, b) =>
          a.OrderItemNo > b.OrderItemNo
            ? 1
            : b.OrderItemNo > a.OrderItemNo
            ? -1
            : 0
        );
        const dataBillRepair = {
          qaBill_ID: this.dataBill.qaBill_ID,
          orderNumber: this.dataBill.OrderNumber,
          docPrefix: `RP${this.$moment(new Date()).format("YY")}${this.$moment(
            new Date()
          ).format("MM")}`,
          sender: this.$store.state.username,
          repairItem: this.valuesInCart.valuesRepair.map((obj, index) => {
            return {
              repair_Item: index + 1,
              bill_Item: obj.bill_Item,
              QtySend: +obj.SelectToRepair,
              qaJobNumber: obj.qaJobNumber,
              reason: obj.reason
            };
          })
        };
        const { result, billNumber } = await apiFacToQa.insertqaRepairBill(
          dataBillRepair
        );
        if (result === "ok") {
          // console.log("เปิดบิลซ่อมสำเร็จ", billNumber);
          this.dialogInserted.Repair = {
            insertsuccess: true,
            billNumber: billNumber,
            title: "สร้างบิลเรียบร้อยแล้ว",
            subtitle: "",
            icon: "mdi-check-bold"
          };
          // console.log(this.dataBill);
        } else {
          this.dialogInserted.Repair = {
            insertsuccess: false,
            billNumber: billNumber,
            title: "ไม่สามารถบันทึกข้อมูลได้",
            subtitle: `กรุณาลองใหม่อีกครั้งหรือติดต่อแผนก IT`,
            icon: "mdi-close-circle"
          };
        }
      }
      setTimeout(() => {
        //หลังจากเสร็จ
        this.loadingBtn = false;
        if (
          this.valuesInCart.valuesRepair.length > 0 ||
          this.valuesInCart.valuesFinish.length > 0
        ) {
          (this.dialogInserted.showDialog = true),
            (this.dialogInserted.titleHeader = "บันทึกข้อมูลเรียบร้อยแล้ว");
        }
      }, 1000);
    },
    async actionInserted(action) {
      // console.log(action);
      switch (action) {
        case 1:
          this.$router.go(-1);
          break;
        case 2:
          await this.$store.dispatch({
            type: "SET_filterQARepairMaster",
            setDefault: false,
            //TEMPLATE Filter Values
            valuesFilter: {
              orderFilter: this.dataBill.OrderNumber
            }
          });
          await this.$router.push({
            name: "qabillrepair-master"
          });
          this.$store.state.FacToQa.tab = "tab-3";
          break;
        case 3:
          this.loadingBtn = true;
          const res = await apiFacToQa.findRepairBillByJob({
            DocPrefix: this.dialogInserted.Repair.billNumber,
            isJob: 3
          });
          // console.log(res);
          await apiCreatePDF.printBillRepairFac(res[0]);
          this.loadingBtn = false;
          break;
        case 4:
          await this.$store.dispatch({
            type: "SET_filterQAStatusMaster",
            setDefault: false,
            valuesFilter: {
              orderFilter: this.dataBill.OrderNumber
            }
          });
          await this.$router.push({
            name: "status-toqamaster"
          });
          this.$store.state.FacToQa.tab = "tab-1";
          break;
        default:
          break;
      }
    },
    async gotorepair() {
      await this.$store.dispatch({
        type: "SET_filterQARepairMaster",
        setDefault: false,
        //TEMPLATE Filter Values
        valuesFilter: {
          orderFilter: this.dataBill.OrderNumber
        }
      });
      await this.$router.push({
        name: "qabillrepair-master"
      });
      this.$store.state.FacToQa.tab = "tab-3";
    },
    async printQaBillSlip() {
      // console.log("Front", this.dataBill);
      await apiCreatePDF.printFacToQaBillSlip(this.dataBill);
    },
    setDefaultQAPerson() {
      this.valuesInCart.valuesFinish.forEach((objCart, indexCart) => {
        this.valuesInCart.valuesFinish[
          indexCart
        ].QAPerson = this.defaultQAPerson.valuesQAPerson;
      });
      this.dataBill.ItemBill.forEach((objBill, indexBill) => {
        this.dataBill.ItemBill[
          indexBill
        ].QAPerson = this.defaultQAPerson.valuesQAPerson;
      });
    },
    checkboxDefaultQAPerson() {
      if (!this.defaultQAPerson.checkbox) {
        this.defaultQAPerson.valuesQAPerson = null;
      }
      this.setDefaultQAPerson();
    }
  }
};
</script>

<style>
.isFinish {
  filter: brightness(70%);
  background-color: #ffffff;
}

.focusItem {
  background-color: #c8eafd;
}

.bgBlue {
  background-color: #66a8ff;
}

.bgCyan {
  background-color: #66edff;
}

.bgAmber {
  background-color: #ffd781;
}

.bgYellow {
  background-color: #f2ff81;
}

.borderGrey {
  border-left: 1px solid rgb(214, 214, 214);
  border-bottom: 1px solid rgb(214, 214, 214);
}
</style>
