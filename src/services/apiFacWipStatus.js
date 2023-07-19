import axios from "axios";
import { apiServer } from "./constants";

const apiURL = apiServer + "api_facwipstatus/";

// const apiURLPrismaServer = apiServer + "api_facwipstatus/";

const getOrderStatusNew = async filter => {
  const { data } = await axios.post(`${apiURL}getOrderStatusNew`, filter);
  return data;
};

const insertDueQa = async dataInput => {
  const { data } = await axios.post(`${apiURL}insertDueQa`, dataInput);
  return data;
};

const getProductStatusNew = async orderNumber => {
  const { data } = await axios.post(
    `${apiURL}getProductStatusNew`,
    orderNumber
  );
  // console.log('data', data)
  return data;
};

const insertOrderDes = async dataInsert => {
  const { data } = await axios.post(`${apiURL}insertOrderDes`, dataInsert);
  return data;
};

const insertOrderItemDes = async dataInsert => {
  const { data } = await axios.post(`${apiURL}insertOrderItemDes`, dataInsert);
  return data;
};

const getHistoryDueQa = async order => {
  const { data } = await axios.post(`${apiURL}getHistoryDueQa`, order);
  return data;
};

const reduceQaCalendar = async order => {
  const { data } = await axios.post(`${apiURL}reduceQaCalendar`, order);
  return data;
};

const isfinishOrderFact = async order => {
  const { data } = await axios.post(`${apiURL}isfinishOrderFact`, order);
  return data;
};

export default {
  getOrderStatusNew,
  insertDueQa,
  getProductStatusNew,
  insertOrderDes,
  insertOrderItemDes,
  getHistoryDueQa,
  reduceQaCalendar,
  isfinishOrderFact
};
