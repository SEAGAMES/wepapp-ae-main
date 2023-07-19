import axios from "axios";
import { apiServer, apiUrl } from "./constants";

const apiURL = apiServer + "api_Employee/";

const addNewEmployee = async (newEmp) => {
  const { data } = await axios.post(`${apiURL}addNewEmployee`, newEmp);
  return data.result;
};

const getDepartment = async () => {
  const { data } = await axios.get(`${apiURL}getDepartment`);
  return data;
};

const getSection = async () => {
  const { data } = await axios.get(`${apiURL}getSection`);
  return data;
};

const getPosition = async () => {
  const { data } = await axios.get(`${apiURL}getPosition`);
  return data;
};

const getEmployeeFilter = async (dataFilter) => {
  const { data } = await axios.post(`${apiURL}getEmployeeFilter`, dataFilter);
  return data;
};

const editDataEmployee = async (dataEmployee) => {
  const { data } = await axios.post(`${apiURL}editDataEmployee`, dataEmployee);
  return data.result;
};

const getMenuAssign = async (EmpCode) => {
  const { data } = await axios.post(`${apiURL}getMenuAssign`, EmpCode);
  return data;
};

// updateMenu
const updateMenu = async (menuChoose) => {
  const { data } = await axios.post(`${apiURL}updateMenu`, menuChoose);
  return data.result;
};

const copyMenu = async (dataEmp) => {
  const { data } = await axios.post(`${apiURL}copyMenu`, dataEmp);
  return data.result;
};

const empReport = async () => {
  const { data } = await axios.get(`${apiURL}empReport`);
  return data;
};

const reportSection = async () => {
  const { data } = await axios.get(`${apiURL}reportSection`);
  return data;
};

const getEmpProcess = async (EmpCode) => 
  await axios.post(`${apiURL}getEmpProcess`, EmpCode);

const updateEmpProcess = async (dataUpdate) => 
  await axios.post(`${apiURL}updateEmpProcess`, dataUpdate);

  


export default {
  addNewEmployee,
  getDepartment,
  getSection,
  getPosition,
  getEmployeeFilter,
  editDataEmployee,
  updateMenu,
  getMenuAssign,
  copyMenu,
  empReport,
  reportSection,
  getEmpProcess,
  updateEmpProcess
};

