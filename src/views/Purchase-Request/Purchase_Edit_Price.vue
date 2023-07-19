<template>
  <v-container class="fontSarabun">
    <v-col>
      <v-card>
        <v-data-table
          :search="search"
          :headers="headers"
          class="elevation-1 tablePurchase mt-5"
          :items="inventory"
          :items-per-page="15"
        >
          <template v-slot:top>
            <v-row>
              <v-col cols="5">
                <v-toolbar flat color="white">
                  <v-toolbar-title>เเก้ไขราคา</v-toolbar-title>
                  <v-divider class="mx-4" inset vertical></v-divider>
                  <v-text-field
                    append-icon="search"
                    v-model="search"
                    label="ค้นหาด้วยชื่อ"
                    class="mt-6"
                    outlined
                  ></v-text-field>
                </v-toolbar>
              </v-col>
              <v-col cols="2">
                <v-select
                  v-model="statusShow.id"
                  :items="statusShow"
                  item-value="id"
                  item-text="Status"
                  label="ประเภท"
                  @change="filterByType(statusShow.id)"
                  outlined
                  required
                />
              </v-col>

              <v-col class="mt-3">
                <button class="red--text" @click="cancelSort()">ยกเลิก</button>
              </v-col>
              <v-col class="mt-2">
                <div>
                  <v-btn
                    @click="addProduct.appProductPopup = true ; dataCompair()"
                    dense
                    color="cyan lighten-3"
                    >+ เพิ่มรายการสินค้า</v-btn
                  >
                </div>
              </v-col>
            </v-row>
          </template>
          <template v-slot:item="{ item, index }">
            <tr>
              <!-- <tr height="60"> -->
              <td align="center">
                {{ index + 1 }}
              </td>
              <td align="center">
                {{ item.INV_TYPE_NAME }}
              </td>
              <td align="center">
                {{ item.ITEM_ID }}
              </td>
              <td align="center" width="280">
                {{ item.ITEM_NAME }}
              </td>
              <td align="center">
                {{ item.UNIT_NAME }}
              </td>
              <td align="center">
                {{ item.PRICE }}
              </td>
              <td width="100">
                <v-icon
                  color="orange"
                  class="ml-2"
                  @click="gotoDetail(item, index)"
                  >edit</v-icon
                ><v-icon
                  @click="
                    itemDelete = item;
                    deletePopup = true;
                  "
                  class="ml-2"
                  color="red"
                  >delete</v-icon
                >
              </td>
            </tr>
          </template>
        </v-data-table>

        <!-- Popup เพิ่มรายการสินค้า -->
        <v-dialog
          v-model="addProduct.appProductPopup"
          max-height="2000"
          max-width="1000"
          persistent
          ><v-form>
            <v-card class="fontSarabun">
              <v-card-title primary-title class="px-n3"
                >เพิ่มรายการสินค้า</v-card-title
              >
              <v-card>
                <div>
                  <v-simple-table>
                    <tr>
                      <th>
                        <div></div>
                      </th>
                      <th>
                        <div>ประเภท</div>
                      </th>
                      <th>
                        <div>รหัสสินค้า</div>
                      </th>
                      <th>
                        <div>รายการ</div>
                      </th>
                      <th>
                        <div>หน่วย</div>
                      </th>
                      <th>
                        <div>ราคา</div>
                      </th>
                    </tr>
                    <tr
                      v-for="(invObj, index) in addProduct.newProduct"
                      :key="index"
                    >
                      <td>
                        <div class="ml-5 mt-n6">
                          {{ index + 1 }}
                        </div>
                      </td>
                      <td>
                        <div>
                          <v-select
                            v-model="invObj.itemType"
                            width="10"
                            :items="itemType"
                            item-text="INV_TYPE_NAME"
                            item-value="INV_TYPE_ID"
                            dense
                            required
                            outlined
                            >{{ invObj.itemType }}</v-select
                          >
                        </div>
                      </td>
                      <td>
                        <div class="ml-2">
                          <v-text-field
                            v-model="invObj.itemId"
                            :rules="nameRules"
                            dense
                            outlined
                            required
                          ></v-text-field>
                        </div>
                      </td>
                      <td>
                        <div class="ml-2">
                          <v-text-field
                            v-model="invObj.itemName"
                            dense
                            outlined
                          ></v-text-field>
                        </div>
                      </td>
                      <td>
                        <div class="ml-2">
                          <v-select
                            v-model="invObj.itemUnit"
                            width="10"
                            :items="itemUnit"
                            item-text="UNIT_NAME"
                            item-value="UNIT_ID"
                            dense
                            outlined
                          ></v-select>
                        </div>
                      </td>
                      <td>
                        <div class="ml-2 mr-4">
                          <v-text-field
                            v-model="invObj.price"
                            type="number"
                            dense
                            outlined
                          ></v-text-field>
                        </div>
                      </td>
                      <td>
                        <v-icon
                          v-if="addProduct.newProduct.length > 1"
                          @click="deleteNewItem(index)"
                          class="mt-n9 mr-2"
                          color="red"
                          large
                          >delete</v-icon
                        >
                      </td>
                    </tr>
                    <td>
                      <div class="ml-4">
                        <v-btn
                          @click="addNewProduct()"
                          dense
                          fab
                          small
                          color="success"
                          ><v-icon>mdi-plus-circle</v-icon></v-btn
                        >
                      </div>
                    </td>

                  </v-simple-table>
                </div>
              </v-card>
              <v-card-actions class="mt-2">
                <v-spacer></v-spacer>
                <v-btn
                  @click="
                    addProduct.appProductPopup = false;
                    clear_newProduct();
                  "
                  >Cancel</v-btn
                >
                <v-btn @click="addProductConfirm()" color="success"
                  >Confirm</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <!-- Popup ลบสินค้า -->
        <v-dialog v-model="deletePopup" max-width="290">
          <v-card class="fontSarabun">
            <v-card-title primary-title>ยืนยันลบรายการนี้หรือไม่</v-card-title>
            <v-card-text class="body"
              >รหัสสินค้า : {{ itemDelete.ITEM_ID }}</v-card-text
            ><v-card-text class="body"
              >ชื่อสินค้า : {{ itemDelete.ITEM_NAME }}
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                text
                @click="
                  deletePopup = false;
                  clear_newProduct();
                "
                >Cancel</v-btn
              >
              <v-btn text @click="confirmDeleteProduct()" color="error"
                >Confirm</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>

        <!-- Popup เเก้ไขราคา -->
        <v-dialog
          v-model="editPopup"
          max-height="600"
          max-width="600"
          class="fontPrompt"
        >
          <v-form class="fontPrompt" @submit="confirmEditPrice()">
            <v-card class="pa-5">
              <v-row>
                <v-col cols="6" class="mt-9 ml-7">
                  <p>{{ `${selectData.ITEM_NAME} :` }}</p>
                </v-col>
                <v-col cols="1"> </v-col>
                <v-col cols="5" class="mt-4 ml-n16">
                  <v-text-field
                    autofocus
                    label="ราคาใหม่"
                    outlined
                    v-model="newPrice"
                  ></v-text-field>
                </v-col>
              </v-row>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn @click="editPopup = false">Cancel</v-btn>
                <v-btn color="error" type="submit">Confirm</v-btn>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-dialog>

        <!-- snackBarSuccessInsert  -->
        <div class="text-center ma-2">
          <v-snackbar v-model="snackBarSuccessInsert" :timeout="3400" top>
            <div class="fontSarabun fontSize16 text-center">
              เพิ่มสินค้าสำเร็จ
              <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
            </div>
          </v-snackbar>

          <v-snackbar v-model="snackBarFailInsert" :timeout="3400" top>
            <div class="fontSarabun fontSize16 text-center">
              เพิ่มสินค้าไม่สำเร็จ
              <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
            </div>
          </v-snackbar>

          <v-snackbar v-model="snackBarNeedData" :timeout="3400" top>
            <div class="fontSarabun fontSize16 text-center">
              กรุณาใส่ข้อมูลให้ครบถ้วน
              <v-icon small class="ml-1" color="yellow"
                >mdi-shield-alert</v-icon
              >
            </div>
          </v-snackbar>

          <v-snackbar v-model="snackBarItemIDError" :timeout="7000" top>
            <div class="fontSarabun fontSize16 text-center">
              รหัส {{ addProduct.itemId }} ซ้ำ
              <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
            </div>
          </v-snackbar>
        </div>

        <!-- snackBarDelete -->
        <div class="text-center ma-2">
          <v-snackbar v-model="snackBarSuccessDelete" :timeout="3400" top>
            <div class="fontSarabun fontSize16 text-center">
              ลบสินค้าสำเร็จ
              <v-icon small class="ml-1" color="green">mdi-shield-check</v-icon>
            </div>
          </v-snackbar>

          <v-snackbar v-model="snackBarFailDelete" :timeout="3400" top>
            <div class="fontSarabun fontSize16 text-center">
              ลบสินค้าไม่สำเร็จ
              <v-icon small class="ml-1" color="red">mdi-shield-alert</v-icon>
            </div>
          </v-snackbar>
        </div>
      </v-card>
    </v-col>
  </v-container>
</template>

<script>
import api from "../../services/api";
import apiPurchaseRequest from "../../services/apiPurchaseRequest";

const itemIdSame = []

export default {
  data() {
    return {
      search: "",
      itemDelete: "",
      editPopup: false,
      deletePopup: false,
      confirmDeleteDlg: false,

      snackBarSuccessInsert: false,
      snackBarFailInsert: false,
      snackBarNeedData: false,

      snackBarSuccessDelete: false,
      snackBarFailDelete: false,
      snackBarItemIDError: false,

      selectData: [],
      DataStatuschange: [],
      newPrice: null,
      inventory: [],
      inventoryBackup: [],
      nameRules: [
        v => !itemIdSame.includes(v)|| 'ข้อมูลซ้ำ กรุณาเปลี่ยน',
      ],
      headers: [
        {
          text: "ลำดับที่",
          value: "INV_TYPE_ID",
          sortable: false,
          align: "center",
          justify: "center",
          class: "#",
        },
        {
          text: "ประเภท",
          value: "INV_TYPE_NAME",
          align: "center",
          justify: "center",
        },
        {
          text: "รหัส",
          value: "ITEM_ID",
          align: "center",
          justify: "center",
        },
        {
          text: "รายการ",
          value: "ITEM_NAME",
          align: "center",
          justify: "center",
        },
        {
          text: "หน่วย",
          value: "UNIT_NAME",
          align: "center",
          justify: "center",
        },
        {
          text: "ราคา",
          value: "PRICE",
          align: "center",
          justify: "center",
        },
        {
          text: "Action",
          value: "Delete_Order",
          sortable: false,
          align: "center",
          justify: "center",
        },
      ],
      statusShow: [
        {
          id: "1",
          Status: "วัสดุสำนักงาน",
        },
        {
          id: "2",
          Status: "อุปกรณ์ช่างสิ้นเปลือง",
        },
        {
          id: "3",
          Status: "วัสดุสิ้นเปลือง",
        },
        {
          id: "4",
          Status: "บรรจุภัณฑ์",
        },
        {
          id: "5",
          Status: "น้ำยาชุบ",
        },
      ],

      // เพิ่มสินค้าใหม่
      addProduct: {
        appProductPopup: false,
        itemId: "",
        newProduct: [
          {
            itemType: "",
            itemId: "",
            itemName: "",
            itemUnit: "",
            price: null,
          },
        ],
      },
      itemType: [],
      itemUnit: [],
    };
  },
  async mounted() {
    await this.getInventory();
    this.itemType = await apiPurchaseRequest.getItemType();
    this.itemUnit = await apiPurchaseRequest.getItemUnit();
  },
  methods: {

    async getInventory() {
      this.inventory = await apiPurchaseRequest.getInvetoryFull();
      this.inventoryBackup = this.inventory;
    },

    async gotoDetail(item, index) {
      this.selectData = item;
      this.newPrice = item.PRICE;
      this.editPopup = true;
    },

    async confirmDeleteProduct() {
      let result = await apiPurchaseRequest.deleteProduct(
        this.itemDelete.ITEM_ID
      );
      if (result === "ok") {
        this.snackBarSuccessDelete = true;
        await this.getInventory();
      } else {
        this.snackBarFailDelete = true;
      }
      this.deletePopup = false;
    },

    async confirmEditPrice() {
      const result = await apiPurchaseRequest.updatePrice(
        this.selectData.ITEM_ID,
        this.newPrice
      );
      this.editPopup = false;
      if (result.data.result == "ok") {
        await this.$swal({
          title: "Update Success",
          icon: "success",
          text: "Your work has been saved",
          showConfirmButton: false,
          timer: 1500,
        });
        await this.getInventory();
      } else {
        await this.$swal({
          title: "Error",
          icon: "error",
          text: "Cannot be saved",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    //filterBySection
    filterByType(type_id) {
      this.inventory = this.inventoryBackup.filter((S) => {
        return S.INV_TYPE_ID == type_id;
      });
    },
    cancelSort() {
      this.getInventory();
      this.search = null;
      this.statusShow.id = null;
    },

    addNewProduct() {
      this.addProduct.newProduct.push({
        itemType: "",
        itemId: "",
        itemName: "",
        itemUnit: "",
        price: null,
      });
    },
    async addProductConfirm() {
      let checkPass = 0;
      this.addProduct.newProduct.forEach(async (dataCheck) => {
        if (
          dataCheck.itemType === "" ||
          dataCheck.itemId === "" ||
          dataCheck.itemName === "" ||
          dataCheck.itemUnit === "" ||
          dataCheck.price === null
        ) {
          this.snackBarNeedData = true;
        } else {
          // check ว่าใส่ข้อมูลครบทุกช่องมั้ย
          checkPass += 1;
          if (checkPass === this.addProduct.newProduct.length) {
            const { result } = await apiPurchaseRequest.createNewProduct(
              this.addProduct.newProduct
            );
            if (result === "ok") {
              this.snackBarSuccessInsert = true;
              await this.getInventory();
            } else {
              this.snackBarFailInsert = true;
            }
            this.addProduct.appProductPopup = false;
            this.clear_newProduct();
            await this.getInventory();
          }
        }
      });
    },

    deleteNewItem(index) {
      if (this.addProduct.newProduct.length > 1) {
        this.addProduct.newProduct.splice(index, 1);
      }
    },

    clear_newProduct() {
      this.addProduct.newProduct = [
        {
          itemType: "",
          itemId: "",
          itemName: "",
          itemUnit: "",
          price: null,
        },
      ];
    },

    // ใช้เช็ก item id หากพิมพ์ลง v-text-field เเล้วซ้ำ
    dataCompair() {
      const data = this.inventory.map(({ ITEM_ID }) => ITEM_ID)
      this.inventory.forEach((data) => {
        itemIdSame.push(data.ITEM_ID)
      });
    }
  },
  
};
</script>

<style>
.myImg {
  filter: brightness(50%);
}

.tablePurchase table th {
  font-size: 14px !important;
  text-align: center;
  background-color: rgba(208, 134, 243, 0.753);
}
.tableFinish {
  background-color: rgba(241, 222, 247, 0.753);
}
</style>
