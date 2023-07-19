import axios from "axios";
import { apiServer } from "./constants";

const apiURL = apiServer + "api_FacToQa/";

const getStatusMaster = async filter => {
  // console.log(filter)
  const { data } = await axios.post(`${apiURL}getStatusMaster`, filter);
  return data;
};

const getStatusDetail = async orderNumber => {
  const { data } = await axios.post(`${apiURL}getStatusDetail`, orderNumber);
  return data;
};

const getQaBill = async dataFilter => {
  const { data } = await axios.post(`${apiURL}getBillQa`, dataFilter);
  return data;
};

const getreason = async () => {
  const { data } = await axios.get(`${apiURL}getReasonRepair`);
  return data;
};

const getTotalBillForReceive = async order => {
  const { data } = await axios.post(`${apiURL}gettotalbillreceive`, order);
  // console.log(data)
  return data;
};

const createBill = async DatabillCreate => {
  const { data } = await axios.post(
    `${apiURL}insertBillFactoqa`,
    DatabillCreate
  );
  // console.log(data)
  return data;
};

const receiveBillFacToQa = async dataUpdate => {
  const { data } = await axios.post(`${apiURL}receivebillFactoqa`, dataUpdate);
  // console.log(data)
  return data;
};

const insertqaRepairBill = async dataRepair => {
  const { data } = await axios.post(`${apiURL}insertqaRepairBill`, dataRepair);
  // console.log(data)
  return data;
};

const insertqaFinish = async dataFinish => {
  const { data } = await axios.post(`${apiURL}insertqaFinish`, dataFinish);
  // console.log(data)
  return data;
};

const getBillByJob = async job => {
  const { data } = await axios.post(`${apiURL}getqaBillByJob`, job);
  return data;
};

const deleteBillQA = async billID => {
  const { data } = await axios.post(`${apiURL}deleteBillQA`, billID);
  return data;
};

const getOrderStatusByJob = async job => {
  const { data } = await axios.post(`${apiURL}getOrderStatusByJob`, job);
  return data;
};

const getQaBillRepair = async filter => {
  const { data } = await axios.post(`${apiURL}getBillRepairForFac`, filter);
  //console.log(data);
  return data;
};

//  update จำนวนส่งซ่่อม
const updateBillRepair = async ItemBill => {
  const { data } = await axios.post(`${apiURL}updateBillRepair`, ItemBill);
  return data;
};

const getReasonRepair = async dataReason => {
  //console.log(dataReason);
  const { data } = await axios.post(`${apiURL}getReasonRepair`, dataReason);
  return data;
};

const receiveBillRepair = async dataReceive => {
  const { data } = await axios.post(`${apiURL}receiveBillRepair`, dataReceive);
  return data;
};

const qaReceiveBillReapair = async dataQaReceive => {
  // console.log(dataQaReceive);
  const { data } = await axios.post(
    `${apiURL}qaReceiveBillReapair`,
    dataQaReceive
  );
  return data;
};

const cancelBillRepairFromFac = async qaRepair_ID => {
  // console.log(qaRepair_ID);
  const { data } = await axios.post(
    `${apiURL}cancelBillRepairFromFac`,
    qaRepair_ID
  );
  return data;
};

const findRepairBillByJob = async DocPrefix => {
  const { data } = await axios.post(`${apiURL}getBillRepairbyJob`, DocPrefix);
  return data;
};

const reportRepairByOrder = async orderNumber => {
  const { data } = await axios.post(
    `${apiURL}reportRepairByOrder`,
    orderNumber
  );
  return data;
};

const reportFactoQa = async dataFilter => {
  const { data } = await axios.post(`${apiURL}reportFactoQa`, dataFilter);
  return data;
};

const getQaBillByOrderItem = async orderItem => {
  const { data } = await axios.post(`${apiURL}getqabillbyorderitem`, orderItem);
  return data;
};

const reportfactoqaDetail = async dataOrder => {
  const { data } = await axios.post(`${apiURL}reportfactoqa-detail`, dataOrder);
  return data;
};

export default {
  getStatusMaster,
  getStatusDetail,
  getQaBill,
  getreason,
  getTotalBillForReceive,
  createBill,
  receiveBillFacToQa,
  insertqaRepairBill,
  insertqaFinish,
  getBillByJob,
  deleteBillQA,
  getOrderStatusByJob,
  getQaBillRepair,
  updateBillRepair,
  getReasonRepair,
  receiveBillRepair,
  findRepairBillByJob,
  qaReceiveBillReapair,
  cancelBillRepairFromFac,
  reportRepairByOrder,
  reportFactoQa,
  getQaBillByOrderItem,
  reportfactoqaDetail
};
