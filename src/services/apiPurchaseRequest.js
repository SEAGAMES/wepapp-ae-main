import { serverPurchaseRequest } from "../services/constants";
import httpClient from "./httpClient";

// ใหม่
import axios from "axios";
import { apiServer, apiUrl } from "./constants";
const apiURL = apiServer + "api_PurchaseRequest/";

const createNewProduct = async (newProduct) => {
  const { data } = await axios.post(`${apiURL}createNewProduct`, newProduct);
  return data;
};

const deleteProduct = async (itemId) => {
  const { data } = await axios.post(`${apiURL}deleteProduct`, {itemId});
  return data.result;
};



const getInvetoryFull = async () => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETINVENTORYFULL}`
  );
  return result.data;
};

//GETBILLMASTERBYBILLID
const getBillMasterByID = async (Bill_ID) => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETBILLMASTERBYBILLID}/${Bill_ID}`
  );
  return result.data;
};

const getItemType = async () => {
  const result = await httpClient.get(`${serverPurchaseRequest.GETITEMTYPE}`);
  return result.data;
};

const getItemUnit = async () => {
  const result = await httpClient.get(`${serverPurchaseRequest.GETITEMUNIT}`);
  return result.data;
};

const getBillMaster = async () => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETPURCHASEBILLMASTER}`
  );
  return result.data;
};

const getSection = async () => {
  const result = await httpClient.get(`${serverPurchaseRequest.GETSECTION}`);
  return result.data;
};

//GETPURCHASEPOSITION
const getPosition = async () => {
  const result = await httpClient.get(`${serverPurchaseRequest.GETPURCHASEPOSITION}`);
  return result.data;
};

const getEmployee = async (Request_ID) => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETEMPLOYEE}/${Request_ID}`
  );
  return result.data;
};

//getItemsName
const getItemsName = async () => {
  const result = await httpClient.get(`${serverPurchaseRequest.GETITEMSNAME}`);
  return result.data;
};

const getBillOrder = async (Bill_ID) => {
  var sum = 0
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETBILLORDER}/${Bill_ID}`
  );
  result.data.forEach(async (data2, index) => {
    if (data2.PRICE == null) {
      data2.PRICE = 0;
    }
    sum = sum + Number(data2.PRICE);
  });
  result.data.push({
    UNIT_NAME: "รวมสุทธิ",
    PRICE: sum,
  });

  return result.data;
};

//GETITEMSTATUS
const getItemStatus = async (itemStatus1, itemStatus2) => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.GETITEMSTATUS}/${itemStatus1}/${itemStatus2}`
  );
  return result.data;
};



const createPurchaseBill = async (empCode, SectionCode, PositionCode, PhoneNumber, Detail) => {
  const data = {
    Request_ID: empCode,
    Section_Code: SectionCode,
    Position_Code: PositionCode,
    Phone_Number: PhoneNumber,
    DataDetail: Detail,
  };
  let result = await httpClient.post(
    serverPurchaseRequest.CREATEPURCHASEBILL,
    data
  );
  return result;
};


const updateStatus = async (StatusCode, Bill_ID) => {

  let result = await httpClient.post(
    `${serverPurchaseRequest.UPDATESTATUS}/${StatusCode}/${Bill_ID}`
  );

  return result;
};

//UPDATEINSPACTOR
const updateInspactor = async (Emp_Code, Bill_ID) => {
  let result = await httpClient.post(
    `${serverPurchaseRequest.UPDATEINSPACTOR}/${Emp_Code}/${Bill_ID}`
  );
  return result;
};

//UPDATEBILLDETAIL
const updateBillDetail = async (Bill_ID, datalist) => {
  let result = await httpClient.post(
    `${serverPurchaseRequest.UPDATEBILLDETAIL}/${Bill_ID}`, datalist
  );
  return result;
};

//UPDATENEWITEM
const updateNewItem = async (Bill_ID, index, datalist) => {
  let result = await httpClient.post(
    `${serverPurchaseRequest.UPDATENEWITEM}/${Bill_ID}/${index}`, datalist
  );
  return result;
};

//UPDATEPRICE
const updatePrice = async (ItemID, Price) => {
  let result = await httpClient.post(
    `${serverPurchaseRequest.UPDATEPRICE}/${ItemID}/${Price}`
  );
  return result;
};

//DELETEFROMEDIT
const deleteFromEdit = async (bill_id, item_no) => {
  const result = await httpClient.delete(
    `${serverPurchaseRequest.DELETEFROMEDIT}/${bill_id}/${item_no}`
  );
  return result
};


const deletePuechaseAllBill = async (id) => {
  const result = await httpClient.delete(
    `${serverPurchaseRequest.DELETEBILLPURCHASE}/${id}`
  );
  return result.data.result;
};

//DELETEBILLDETAIL
const deleteBillDetail = async (bill_id) => {
  const result = await httpClient.delete(
    `${serverPurchaseRequest.DELETEBILLDETAIL}/${bill_id}`
  );
  return result.data.result;
};

// ส่ง empCode เพื่อไปเช็คว่ามีสินค้าพร้อมรับอยู่ไหม(status code 4) 
const StatusWarning = async (empCode) => {
  const result = await httpClient.get(
    `${serverPurchaseRequest.STATUSWARNING}/${empCode}`
  );
  return result.data;
};

const getFilterPurchaseDate = async (data) => {
  const result = await httpClient.post(serverPurchaseRequest.FILTERPURCHASEBILLDATE, data)
  return result.data
}


export default {
  getInvetoryFull,
  getItemType,
  getItemUnit,
  createPurchaseBill,
  getBillMaster,
  getSection,
  getEmployee,
  getBillOrder,
  deletePuechaseAllBill,
  getItemStatus,
  updateStatus,
  getBillMasterByID,
  updateInspactor,
  updateBillDetail,
  updateNewItem,
  updatePrice,
  deleteFromEdit,
  deleteBillDetail,
  getPosition,
  getItemsName,
  StatusWarning,
  getFilterPurchaseDate,
  // ใหม่ 03-11-22
  createNewProduct,
  deleteProduct

};
