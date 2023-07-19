<template>
  <v-container v-if="!$store.state.loadingPage">
    <div class="fontSarabun fontSize24" align="center">
      <b>Employee (ข้อมูลพนักงาน)</b>
    </div>

    <!-- Search -->
    <v-card class="fontSarabun">
      <v-form @submit.prevent="submit">
        <v-simple-table dense>
          <tr>
            <td width="200">
              <div class="mt-4 mx-2">
                <v-text-field
                  v-model="dataSearch.EmpCode"
                  type="number"
                  label="รหัสพนักงาน"
                  required
                  outlined
                  dense
                />
              </div>
            </td>
            <td width="200">
              <div class="mt-4">
                <v-text-field
                  v-model="dataSearch.EmpFullName"
                  label="ชื่อ-นามสกุล"
                  required
                  outlined
                  dense
                />
              </div>
            </td>
            <td width="200">
              <div class="mt-4 mx-2">
                <v-text-field
                  v-model="dataSearch.EmpNickName"
                  label="ชื่อเล่น"
                  required
                  outlined
                  dense
                />
              </div>
            </td>

            <td width="80">
              <div align="center">
                <v-btn
                  type="submit"
                  color="success"
                  dense
                  small
                  width="40"
                  class="mt-n8"
                  ><div class="fontSize14">ค้นหา</div>
                </v-btn>
                <v-btn
                  @click="clearDataSearch()"
                  color="yellow lighten-2"
                  dense
                  small
                  width="40"
                  class="mt-n8 ml-4"
                  >Clear</v-btn
                >
              </div>
            </td>
          </tr>
          <tr>
            <td width="200">
              <div class="mx-2 mt-n3">
                <v-select
                  v-model="dataSearch.DepartmentCode"
                  :items="dataDepartMent"
                  item-value="DepartmentCode"
                  item-text="DepartmentName"
                  label="ฝ่าย"
                  required
                  outlined
                  dense
                />
              </div>
            </td>
            <td width="200">
              <div class="mt-n3">
                <v-select
                  v-model="dataSearch.SectionCode"
                  :items="dataSection"
                  item-value="SectionCode"
                  item-text="SectionName"
                  label="แผนก"
                  required
                  outlined
                  dense
                />
              </div>
            </td>
            <td width="200">
              <div class="mx-2 mt-n3">
                <v-select
                  v-model="dataSearch.PositionCode"
                  :items="dataPosition"
                  item-value="PositionCode"
                  item-text="PositionName"
                  label="ตำแหน่ง"
                  required
                  outlined
                  dense
                />
              </div>
            </td>

            <td width="80" align="center">
              <div class="mt-n3">
                <v-btn
                  @click="$router.push('/employee-report')"
                  color="blue-grey lighten-3"
                  dense
                  small
                  width="80"
                  class="mt-n8"
                  ><div class="fontSize14">Report</div>
                </v-btn>
              </div>
            </td>
          </tr>
        </v-simple-table>
      </v-form>
    </v-card>

    <v-card class="mt-3">
      <v-row class="tablePurchase">
        <!-- ตารางข้อมูลพนักงาน -->
        <v-col cols="3">
          <v-card>
            <v-data-table
              height="450"
              :headers="empTable.headers"
              :items="dataEmp"
              hide-default-footer
              :footer-props="{
                'disable-items-per-page': true,
                'items-per-page-options': [-1], // เเสดงทั้งหมด
              }"
              class="tablePurchase"
              ><template v-slot:item="{ item }">
                <tr class="fontSarabun">
                  <td @click="selectDataEmp(item)">
                    <div class="fontSize12">{{ item.EmpCode }}</div>
                  </td>
                  <td @click="selectDataEmp(item)">
                    <div class="fontSize12">{{ item.EmpFName }}</div>
                  </td>
                  <td @click="selectDataEmp(item)">
                    <div class="fontSize12">{{ item.EmpLName }}</div>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-card>
          <v-card class="mt-3">
            <v-card-actions>
              <v-form @submit.prevent="submit">
                <v-row>
                  <v-col class="ml-1 mt-2" cols="6"> ข้อมูลที่แสดง : </v-col>
                  <v-col class="mr-1" cols="5">
                    <v-text-field v-model="topShow" outlined dense>
                    </v-text-field>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-actions>
          </v-card>
        </v-col>

        <!-- รายละเอียดข้อมูลพนักงาน -->
        <v-col cols="7">
          <v-card class="fontSarabun">
            <v-simple-table dense>
              <tr>
                <td width="80">
                  <div class="mt-2 ml-2">
                    <v-text-field
                      v-model="dataSelect.EmpFName"
                      :rules="rules"
                      label="ชื่อ"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
                <td width="80">
                  <div class="mt-2 ml-2">
                    <v-text-field
                      v-model="dataSelect.EmpLName"
                      :rules="rules"
                      label="นามสกุล"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
                <td width="80">
                  <div class="mt-2 ml-2 mr-2">
                    <v-text-field
                      v-model="dataSelect.NickName"
                      :rules="rules"
                      label="ชื่อเล่น"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="80">
                  <div class="mt-n4 ml-2">
                    <v-select
                      v-model="dataSelect.Gender"
                      :rules="rules"
                      :items="gender"
                      item-value="genderCode"
                      item-text="genderName"
                      label="เพศ"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-select>
                  </div>
                </td>
                <td width="80">
                  <div class="mt-n4 ml-2">
                    <v-text-field
                      v-model="dataSelect.DateStartShow"
                      :rules="rules"
                      label="วันที่เริ่มงาน"
                      required
                      outlined
                      dense
                      readonly
                      append-icon="mdi-calendar-month"
                      @click="modal = true"
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
                <td>
                  <div class="mt-n4 ml-2 mr-2">
                    <v-select
                      v-model="dataSelect.ProductionTeam"
                      :items="factory"
                      item-text="name"
                      item-value="value"
                      label="FACTORY"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-select>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="mt-n1 ml-2">
                    <v-select
                      v-model="dataSelect.DepartmentCode"
                      :rules="rules"
                      :items="dataDepartMent"
                      item-value="DepartmentCode"
                      item-text="DepartmentName"
                      label="ฝ่าย"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-select>
                  </div>
                </td>
                <td>
                  <div class="mt-n1 ml-2">
                    <v-select
                      v-model="dataSelect.SectionCode"
                      :rules="rules"
                      :items="dataSection"
                      item-value="SectionCode"
                      item-text="SectionName"
                      label="แผนก"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-select>
                  </div>
                </td>
                <td>
                  <div class="mt-n1 ml-2 mr-2">
                    <v-select
                      v-model="dataSelect.PositionCode"
                      :rules="rules"
                      :items="dataPosition"
                      item-value="PositionCode"
                      item-text="PositionName"
                      label="ตำแหน่ง"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-select>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="80">
                  <div class="mt-1 ml-2">
                    <v-text-field
                      v-if="$store.getters.policyCode === '03'"
                      v-model="dataSelect.LoginName"
                      label="Login Name"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
                <td width="80">
                  <div class="mt-1 ml-2">
                    <v-text-field
                      v-if="$store.getters.policyCode === '03'"
                      type="password"
                      v-model="dataSelect.Password"
                      label="Password"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
                <td>
                  <div class="mt-1 ml-2 mr-2">
                    <v-text-field
                      v-if="$store.getters.policyCode === '03'"
                      v-model="dataSelect.Position"
                      label="Position"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="mt-n4 ml-2">
                    <v-text-field
                      v-if="$store.getters.policyCode === '03'"
                      v-model="dataSelect.Spare1"
                      label="Signature"
                      required
                      outlined
                      dense
                      :disabled="!editData"
                    ></v-text-field>
                  </div>
                </td>
              </tr>
            </v-simple-table>

            <v-row>
              <v-col>
                <div class="dropbox mt-n1 ml-2 mr-2">
                  <v-text-field
                    v-if="!newEmployee.assignDataNewEmp"
                    v-model="dataSelect.EmpPict"
                    label="Pict Path"
                    required
                    outlined
                    dense
                    :disabled="!editData"
                  >
                  </v-text-field>
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="3">
                <div class="mt-n10 ml-2">
                  <v-checkbox
                    v-model="dataSelect.IsResign"
                    :label="`ออกจากงาน`"
                    :disabled="!editData"
                  ></v-checkbox></div
              ></v-col>
              <v-col cols="3">
                <div class="mt-n10">
                  <v-checkbox
                    v-if="$store.getters.policyCode === '03'"
                    v-model="dataSelect.IsAdmin"
                    :label="`Administrator`"
                    :disabled="!editData"
                  ></v-checkbox></div
              ></v-col>

              <v-col cols="3"> </v-col>

              <v-col cols="3">
                <div class="mt-n4" align="center">
                  <v-btn
                    v-if="editData === false"
                    @click="editDataEmp()"
                    color="orange"
                    dense
                    small
                    fab
                    width="40"
                    class="mt-n3"
                  >
                    <v-icon>edit</v-icon>
                  </v-btn>
                </div>

                <div align="center">
                  <v-btn
                    v-if="editData !== false"
                    @click="
                      editData = false;
                      newEmployee.assignDataNewEmp = false;
                    "
                    color="red"
                    dense
                    small
                    fab
                    width="40"
                    class="mt-n3"
                  >
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="
                      editData != false &&
                      newEmployee.assignDataNewEmp === false
                    "
                    @click="modifyDataEmp()"
                    color="success"
                    dense
                    small
                    fab
                    width="40"
                    class="mt-n3 ml-5"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                  <v-btn
                    v-if="
                      editData !== false &&
                      newEmployee.assignDataNewEmp === true
                    "
                    @click="dialogConFirm.createDataEmp = true"
                    color="blue"
                    dense
                    small
                    fab
                    width="40"
                    class="mt-n3 ml-5"
                  >
                    <v-icon>mdi-content-save</v-icon>
                  </v-btn>
                </div>
              </v-col>
            </v-row>
          </v-card>

          <!-- Popup ปฎิทิน -->
          <v-dialog
            type="date"
            ref="dialog"
            :return-value.sync="date"
            persistent
            v-model="modal"
            max-height="340"
            max-width="340"
            class="fontSarabun"
          >
            <v-date-picker v-model="date" scrollable>
              <v-spacer></v-spacer>
              <v-btn text color="primary" @click="modal = false">
                Cancel
              </v-btn>
              <v-btn
                text
                color="primary"
                @click="
                  dateFunction(date);
                  modal = false;
                "
              >
                OK
              </v-btn>
            </v-date-picker>
          </v-dialog>

          <!-- ปุ่ม Menu ต่างๆ -->
          <v-row class="pt-9 ml-1 mt-3 fontSarabun">
            <v-btn
              v-if="$store.getters.policyCode === '03'"
              @click="copyMenu()"
              class="fontSize8"
              color="success"
              width="110"
              :disabled="editData === false"
            >
              Copy Menu
            </v-btn>
            <v-btn
              v-if="$store.getters.policyCode === '03'"
              class="ml-4"
              @click="menuAssign()"
              color="#FFF59D"
              width="110"
              :disabled="editData === false"
            >
              Menu Assign
            </v-btn>
            <v-btn
              v-if="$store.getters.policyCode === '03'"
              class="ml-4"
              @click="PD_Process.show = true"
              color="#FFF59D"
              width="110"
              :disabled="editData === false"
            >
              PD Process
            </v-btn>
            <v-btn
              class="ml-4"
              @click="addNewEmp()"
              color="#FFF59D"
              width="110"
            >
              เพิ่มพนักงาน
            </v-btn>
          </v-row> </v-col
        ><v-col cols="2" align="center">
          <div class="mt-2 mr-3">
            <img
              v-if="!imagePreviewURL && dataSelect !== ''"
              v-bind:src="`${dataSelect.EmpPictConvert}`"
              height="120"
              width="150"
            />
            <img
              v-if="imagePreviewURL"
              :src="imagePreviewURL"
              height="120"
              width="150"
            />
            <img
              v-if="dataSelect === ''"
              v-bind:src="`http://192.168.3.5:3000/picture/PICTURE2/Employee/avatarShow.png`"
              height="120"
              width="150"
            />
          </div>
          <div class="dropbox mt-n4 mr-2">
            <v-file-input
              @change="previewFiles"
              accept="image/png, image/jpeg, image/bmp"
              v-model="dataSelect.dataEmpPict"
              prepend-icon="mdi-camera"
              :disabled="!editData"
            ></v-file-input>
          </div>
        </v-col>
      </v-row>

      <!-- Popup ยืนยันสร้างข้อมูลพนักงาน -->
      <v-dialog v-model="dialogConFirm.createDataEmp" max-width="400">
        <v-card class="fontSarabun">
          <v-card-title primary-title class="px-n3">กรุณายืนยัน</v-card-title>
          <v-card-text class="body px-n3"
            >{{ `ยืนยันการการสร้างข้อมูลพนักงานหรือไม่ ?` }}
          </v-card-text>
          <v-card-actions class="mt-n3">
            <v-spacer></v-spacer>
            <v-btn text @click="dialogConFirm.createDataEmp = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="green"
              @click="confirmCreateNewEmp()"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Popup ยืนยันการแก้ไข -->
      <v-dialog v-model="dialogConFirm.editDataEmp" max-width="400">
        <v-card class="fontSarabun">
          <v-card-title primary-title class="px-n3">กรุณายืนยัน</v-card-title>
          <v-card-text class="body px-n3"
            >{{ `ยืนยันการแก้ไขข้อมูลหรือไม่ ?` }}
          </v-card-text>
          <v-card-actions class="mt-n3">
            <v-spacer></v-spacer>
            <v-btn text @click="dialogConFirm.editDataEmp = false"
              >Cancel</v-btn
            >
            <v-btn
              text
              color="green"
              @click="confirmEdit()"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Popup Copy Menu -->
      <v-dialog v-model="dialogCopyMenu.copyMenu" max-width="400" persistent>
        <v-card class="fontPrompt">
          <v-card-title primary-title class="px-n3">Copy Menu</v-card-title>
          <v-row
            ><v-col cols="5"
              ><v-text-field
                class="fontSarabun ml-4"
                v-model="dialogCopyMenu.getCopy"
                type="number"
                label="รับการ Copy"
                outlined
                disabled
              ></v-text-field
            ></v-col>
            <v-col cols="2"
              ><v-icon color="light-green " large class="mt-3 ml-1"
                >mdi-arrow-left-bold-circle</v-icon
              ></v-col
            >
            <v-col cols="5"
              ><v-text-field
                class="fontSarabun mr-4"
                v-model="dialogCopyMenu.fromCopy"
                autofocus
                type="number"
                label="Copy จาก"
                outlined
              ></v-text-field></v-col
          ></v-row>

          <v-card-actions class="mt-n3">
            <v-spacer></v-spacer>
            <v-btn
              text
              @click="
                dialogCopyMenu.copyMenu = false;
                dialogCopyMenu.getCopy = '';
                dialogCopyMenu.fromCopy = '';
              "
              >Cancel</v-btn
            >
            <v-btn
              text
              color="green"
              @click="confirmCopyMenu()"
              >Confirm</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Popup Menu Assign -->
      <v-dialog v-model="dialogMenu.menuAssign" max-width="400" persistent>
        <v-card class="fontSarabun">
          <v-card-title primary-title class="px-n3">Menu Assign</v-card-title>
          <v-card>
            <div>
              <v-data-table
                height="450"
                :search="dialogMenu.search"
                :headers="dialogMenu.headers"
                :items="dialogMenu.listMenuAssign"
                hide-default-footer
                :footer-props="{
                  'items-per-page-options': [-1],
                  'disable-items-per-page': true,
                }"
                class="tableDevice"
              >
                <template v-slot:top>
                  <v-toolbar flat color="white">
                    <v-toolbar-title>Code</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field
                      v-model="dialogMenu.search"
                      append-icon="search"
                      label="Search"
                      single-line
                      hide-details
                    >
                    </v-text-field>
                  </v-toolbar>
                </template>

                <template v-slot:item="{ item }">
                  <tr>
                    <td>{{ item.MenuCode }}</td>
                    <td>{{ item.MenuName }}</td>
                    <td>
                      <div>
                        <v-checkbox v-model="item.OpenRights"></v-checkbox>
                      </div>
                    </td>
                  </tr>
                </template>
              </v-data-table>
            </div>
          </v-card>
          <v-card-actions class="mt-2">
            <v-spacer></v-spacer>
            <v-btn
              @click="
                dialogMenu.menuAssign = false;
                dialogMenu.search = '';
                this.dialogMenu.dataTrue = [];
              "
              >Cancel</v-btn
            >
            <v-btn @click="assignConfirm()" color="success">Confirm</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- dialog PD Process -->
      <v-dialog v-model="PD_Process.show" max-width="400" persistent>
        <EmpProcessVue
          :empCode="dataSelect.EmpCode"
          @closePage="returnValues"
          v-if="PD_Process.show"
        />
      </v-dialog>

      <!-- snackSuccessUpdate  -->
      <div class="text-center ma-2">
        <v-snackbar v-model="snackSuccessUpdate" :timeout="3400" top>
          <div
            class="fontSarabun fontSize16 text-center"
            v-if="newEmployee.assignDataNewEmp"
          >
            สร้างข้อมูลสำเร็จ
            <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
          </div>
          <div
            class="fontSarabun fontSize16 text-center"
            v-if="!newEmployee.assignDataNewEmp"
          >
            แก้ไขสำเร็จ
            <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
          </div>
        </v-snackbar>

        <v-snackbar v-model="snackFailUpdate" :timeout="3400" top>
          <div
            class="fontSarabun fontSize16 text-center"
            v-if="newEmployee.assignDataNewEmp"
          >
            สร้างข้อมูลไม่สำเร็จ
            <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
          </div>
        </v-snackbar>
        <v-snackbar
          v-model="snackFailUpdate"
          :timeout="3400"
          top
          v-if="!newEmployee.assignDataNewEmp"
        >
          <div class="fontSarabun fontSize16 text-center">
            เเก้ไขไม่สำเร็จ
            <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
          </div>
        </v-snackbar>

        <v-snackbar v-model="snackNeedData" :timeout="3400" top>
          <div class="fontSarabun fontSize16 text-center">
            กรุณาใส่ข้อมูลให้ครบถ้วน
            <v-icon small class="ml-1" color="yellow">mdi-shield-alert</v-icon>
          </div>
        </v-snackbar>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import apiCreatePDF from "../../services/apiCreatePDF";
import apiEmployee from "../../services/apiEmployee";
import EmpProcessVue from "../../views/Employee/EmpProcess.vue";
import { convertDate_JS_TO_SQL } from "../../services/constants";

export default {
  data() {
    return {
      loadingBtn: false,
      dense: false,
      imagePreviewURL: null,
      date: convertDate_JS_TO_SQL(new Date()),
      menu: false,
      modal: false,
      menu2: false,
      dataEmp: [],
      dataDepartMent: [],
      dataSection: [],
      dataPosition: [],
      dataSelect: "",
      dateStartAssign: "",
      topShow: 30,
      editData: false,
      snackSuccessUpdate: false,
      snackFailUpdate: false,
      snackNeedData: false,
      PD_Process: {
        show: false,
      },

      rules: [
        value => !!value ,
      ],

      factory: [
        { name: "Factory 1", value: "1" },
        { name: "Factory 2", value: "2" },
        { name: "Factory 3", value: "3" },
        { name: "Factory 4", value: "4" },
      ],
      empTable: {
        headers: [
          {
            text: "รหัส",
            align: "center",
            sortable: false,
          },
          {
            text: "ชื่อ",
            align: "center",
            sortable: false,
          },
          {
            text: "นามสกุล",
            align: "center",
            sortable: false,
          },
        ],
      },
      newEmployee: {
        assignDataNewEmp: false,
        newDataEmp: {
          DateStart: "",
          DateStartShow: "",
          DepartmentCode: "",
          EmpCode: "",
          EmpPict: "",
          EmpStatus: "",
          Gender: "",
          IsAdmin: 0,
          IsResign: 0,
          IsUnlockProductMaster: 0,
          LoginName: "",
          Password: "",
          EmpFullName: "",
          EmpFName: "",
          EmpLName: "",
          NickName: "",
          Position: "",
          PositionCode: "",
          ProductionTeam: "",
          SectionCode: "",
          Spare1: "",
          Status: "",
        },
      },
      dialogMenu: {
        search: "",
        menuAssign: false,
        listMenuAssign: [],
        dataTrue: [],
        menuChoose: [],
        headers: [
          {
            text: "Code",
            align: "left",
            sortable: false,
            value: "MenuCode",
          },
          {
            text: "Menu Name",
            align: "center",
            sortable: false,
            value: "MenuName",
          },
          {
            text: "Open",
            align: "left",
            sortable: false,
          },
        ],
      },

      dialogCopyMenu: {
        copyMenu: false,
        getCopy: "",
        fromCopy: "",
      },

      dialogConFirm: {
        createDataEmp: false,
        editDataEmp: false,
      },

      dataSearch: {
        EmpCode: "",
        EmpFullName: "",
        EmpNickName: "",
        DepartmentCode: "",
        SectionCode: "",
        PositionCode: "",
      },
      gender: [
        {
          genderCode: "M",
          genderName: "ชาย",
        },
        {
          genderCode: "F",
          genderName: "หญิง",
        },
      ],
    };
  },
  components: {
    EmpProcessVue,
  },

  async mounted() {
    //console.log("2022-11-09", this.date);
    this.$store.state.loadingPage = true;
    setTimeout(async () => {
      this.submit();
      this.dataDepartMent = await apiEmployee.getDepartment();
      this.dataSection = await apiEmployee.getSection();
      this.dataPosition = await apiEmployee.getPosition();
      setTimeout(() => {
        this.$store.state.loadingPage = false;
      }, 500);
    }, 340);
  },

  methods: {
    async submit() {
      this.dataEmp = await apiEmployee.getEmployeeFilter({
        EmpCode: this.dataSearch.EmpCode,
        EmpFullName: this.dataSearch.EmpFullName,
        EmpNickName: this.dataSearch.EmpNickName,
        DepartmentCode: this.dataSearch.DepartmentCode.trim(),
        SectionCode: this.dataSearch.SectionCode.trim(),
        PositionCode: this.dataSearch.PositionCode.trim(),
        TopShow: this.topShow,
      });
    },
    selectDataEmp(data) {
      // clear ค่า imagePreviewURL
      this.imagePreviewURL = null;
      // clear ปุ่ม save edit save ให้ปิด
      this.editData = false;
      this.dataSelect = data;
      this.newEmployee.assignDataNewEmp = false;
      //console.log(this.dataSelect);
      //เพิ่ม EmpCode เข้าไปเพื่อป้องกันกรณีเปลี่ยนเเปลง EmpCode
      this.dataSelect.EmpCodeBackUp = this.dataSelect.EmpCode;
    },

    // เปลี่ยนแปลงข้อมูลพักงาน
    editDataEmp() {
      if (this.dataSelect !== "") {
        this.editData = !this.editData;
      }
    },
    modifyDataEmp() {
      this.dialogConFirm.editDataEmp = true;
    },
    async confirmEdit() {
      this.dialogConFirm.editDataEmp = false;
      if (this.imagePreviewURL !== null) {
        var result_UploadImg = await this.uploadImgEmp();
        this.dataSelect.EmpPict =
          result_UploadImg.data.result.uploadPath +
          result_UploadImg.data.result.filename;
      }

      setTimeout(async () => {
        this.dataSelect.EmpFullName =
          this.dataSelect.EmpFName + " " + this.dataSelect.EmpLName;

        let result = await apiEmployee.editDataEmployee(this.dataSelect);

        if (result === "ok") {
          this.snackSuccessUpdate = true;
          this.submit();
          this.editData = false;
          //console.log("dataEmp: ", this.dataEmp);
        } else {
          this.snackFailUpdate = true;
        }
      }, 800);
    },

    // กำหนดการเข้าถึงเมนูต่างๆ
    async menuAssign() {
      this.dialogMenu.menuAssign = true;
      this.dialogMenu.listMenuAssign = await apiEmployee.getMenuAssign({
        EmpCode: this.dataSelect.EmpCode,
      });
    },

    async assignConfirm() {
      // Loop เอาเฉพาะตัวที่เป็น True (มีการกดเลือกในเมนู)
      this.dialogMenu.listMenuAssign.forEach((menuObj) => {
        if (menuObj.OpenRights === true) {
          this.dialogMenu.dataTrue.push(menuObj);
        }
      });
      const result = await apiEmployee.updateMenu({
        menuChoose: this.dialogMenu.dataTrue,
        empCode: this.dataSelect.EmpCode,
      });
      if (result === "ok") {
        this.dialogMenu.menuAssign = false;
        this.snackSuccessUpdate = true;
        this.dialogMenu.dataTrue = [];
      } else {
        this.dialogMenu.menuAssign = false;
        this.snackFailUpdate = true;
        this.dialogMenu.dataTrue = [];
      }
    },

    async returnValues({ isChange, EmpCode, dataReturn }) {
      if (isChange) {
        try {
          const dataInsert = dataReturn
            .filter(({ checkbox }) => checkbox)
            .map(({ PDProcessCode }) => PDProcessCode);
          // console.log(dataInsert)
          const { data } = await apiEmployee.updateEmpProcess({
            EmpCode: EmpCode,
            dataInsert: dataInsert,
          });
          if (data.result !== "ok") {
            alert("เกิดข้อผิดพลาดกรุณาติดต่อแผนก IT");
          }
        } catch (error) {
          alert("เกิดข้อผิดพลาดกรุณาติดต่อแผนก IT");
        } finally {
          setTimeout(() => {
            this.PD_Process.show = false;
          }, 800);
        }
      } else {
        this.PD_Process.show = false;
      }
    },

    clearDataSearch() {
      (this.dataSearch.EmpCode = ""),
        (this.dataSearch.EmpFullName = ""),
        (this.dataSearch.EmpNickName = ""),
        (this.dataSearch.DepartmentCode = ""),
        (this.dataSearch.SectionCode = ""),
        (this.dataSearch.PositionCode = "");
        this.submit()
    },

    // Copy Menu
    copyMenu() {
      this.dialogCopyMenu.copyMenu = true;
      this.dataSelect.EmpCode !== ""
        ? (this.dialogCopyMenu.getCopy = this.dataSelect.EmpCode)
        : (this.dialogCopyMenu.getCopy = "");
    },
    async confirmCopyMenu() {
      if (
        this.dialogCopyMenu.getCopy != "" &&
        this.dialogCopyMenu.fromCopy != ""
      ) {
        let result = await apiEmployee.copyMenu({
          getCopy: this.dialogCopyMenu.getCopy,
          fromCopy: this.dialogCopyMenu.fromCopy,
        });
        if (result === "ok") {
          this.dialogCopyMenu.copyMenu = false;
          this.snackSuccessUpdate = true;
          this.dialogCopyMenu.getCopy = "";
          this.dialogCopyMenu.fromCopy = "";
        } else {
          this.snackFailUpdate = true;
          this.dialogCopyMenu.getCopy = "";
          this.dialogCopyMenu.fromCopy = "";
        }
      } else {
        this.snackNeedData = true;
      }
    },

    // Upload IMG
    async uploadImgEmp() {
      // console.log(this.dataSelect.dataEmpPict);
      const base64 = await this.getBase64(this.dataSelect.dataEmpPict);
      // console.log(base64);
      const res = await apiCreatePDF.uploadImgEmp({
        imageBase64: base64,
        pictName: this.dataSelect.dataEmpPict.name,
      });
      return res;
    },

    getBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });
    },

    previewFiles(payload) {
      // console.log("previewFiles : ", event.target.files);

      //const file = payload.target.files[0]; // use it in case of normal HTML input
      const file = payload; // in case vuetify file input
      if (file) {
        this.imagePreviewURL = URL.createObjectURL(file);
        URL.revokeObjectURL(file); // free memory
      } else {
        this.imagePreviewURL = null;
      }
    },

    // วันที่เริ่มงาน
    dateFunction(date) {
      this.dataSelect.DateStart = date;
      this.dataSelect.DateStartShow = date;
    },

    addNewEmp() {
      //console.log(this.newEmployee.newDataEmp)
      this.dataSelect = this.newEmployee.newDataEmp;
      this.editData = true;
      this.newEmployee.assignDataNewEmp = true;
    },

    async confirmCreateNewEmp() {
      var dataCheck = this.dataSelect;
      if (
        (dataCheck.EmpFName !== "" &&
          dataCheck.EmpLName !== "" &&
          dataCheck.NickName !== "" &&
          dataCheck.gender !== "" &&
          dataCheck.DateStartShow  &&
        dataCheck.DepartmentCode !== "" &&
        dataCheck.SectionCode !== "" &&
        dataCheck.PositionCode !== "")
      ) {
        if (this.imagePreviewURL !== null) {
          var result_UploadImg = await this.uploadImgEmp();
          this.dataSelect.EmpPict =
            result_UploadImg.data.result.uploadPath +
            result_UploadImg.data.result.filename;
        } else {
          this.dataSelect.EmpPict = ''
        }
        

        setTimeout(async () => {
          this.dataSelect.EmpFullName =
            this.dataSelect.EmpFName + " " + this.dataSelect.EmpLName;
          //console.log(this.dataSelect);

          const result = await apiEmployee.addNewEmployee(this.dataSelect);

          if (result === "ok") {
            this.snackSuccessUpdate = true;
            this.submit();
            this.editData = false;
            //console.log("dataEmp: ", this.dataEmp);
          } else {
            this.snackFailUpdate = true;
          }
        }, 800);
        this.dialogConFirm.createDataEmp = false;
      } else {
        this.snackNeedData = true;
        this.dialogConFirm.createDataEmp = false;
      }
    },
  },
};
</script>

<style>
.tablePurchase table th {
  font-size: 14px !important;
  text-align: center;
  background-color: rgba(141, 245, 236, 0.753);
}

.tableDevice table th {
  font-size: 12px !important;
  text-align: center;
  background-color: rgba(117, 137, 248, 0.747);
}
</style>
