import Vue from "vue";
import Vuex from "vuex";
import api from "../services/api";
import apiDevice from "../services/apiDevice";
import { server } from "../services/constants";
import apiRepairDoc from "../services/apiRepairDoc";
import apiReport from "../services/apiReport";
import apiMould from "../services/apiMould";
import apiCreatePDF from "../services/apiCreatePDF";
// import moment from "moment";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    checkTimeout: true,
    loadingPage: false,
    menuShow: false,
    isLogged: false,
    alertTimeout: false,
    username: "",
    fullName: "",
    EmpPict: "",
    Factory: "",
    no_picture: "http://192.168.3.5:3000/picture/PICTURE2/no_picture.png",
    levelUser: {
      policyCode: "",
      policyName: "",
      Appove: "",
      QueUpdate: "",
      StatusUpdate: "",
      ReviseMoldStatus: "",
      currentUrl: "",
      isFacTeam: [],
      isQATeam: []
    },
    deviceMaster: {
      selectDepart: "",
      ShowTable: false,
      editDeviceID: 0,
      showModify: false,
      deviceData: [],
      showHeaderSum: false,
      dataFilter: null,
      dataFilter_Device: null
    },
    deviceModify: {
      deviceData: {
        JobTypeCode: null,
        CategoryCode: null,
        DeviceNo: null,
        FloorCode: null,
        RoomCode: null,
        PurchaseDate: new Date("2000/01/01"),
        OutWarranty: new Date("2000/01/01"),
        Owner: "",
        Desciption: "",
        Status1: "0",
        Status2: ""
      }
    },
    deviceForm: {
      Category: [],
      Floor: [],
      Room: [],
      Emp: []
    },
    repairMaster: {
      getSumBill: {}
    },
    repairCreate: {
      deviceNo: [],
      BillRepair: []
    },
    repairModify: {
      billRepair: 0,
      dataRepair: {},
      ShowPopupRepairModify: false,
      disableInput: {
        showDevice: false
      }
    },
    repairDetail: {
      dataHeader: {}
    },
    report: {
      chartBillMonth: [],
      datachartShow: null
    },
    mould: {
      mouldBill: [],
      mouldModify: {
        showPopupModify: false,
        dataModifyBill: {
          BillDate: null,
          DocID: "",
          ID: 0,
          JobType: "0",
          ModelNo: "",
          OrderNumber: "",
          Owner: "",
          Qty: 0,
          Receiver: "",
          RepairModelDesc: "",
          ReturnDate: null,
          ReturnPerson: "",
          Status: ""
        },
        dataMouldAll: [],
        PictMould: "",
        checkOrder: null,
        OrderNumberSelect: [],
        JobTypeSelect: []
      },
      mouldDetail: {
        dataHeader: {
          BillDate: "",
          Datelate: 0,
          DocID: "",
          ID: 0,
          JobType: "",
          JobTypeName: "",
          ModelNo: "",
          OrderNumber: "",
          Owner: "",
          OwnerFullName: "",
          Qty: 0,
          Receiver: "",
          ReceiverFullName: "",
          RepairModelDesc: "",
          ReturnDate: null,
          ReturnPerson: null,
          ReturnPersonFullName: null,
          Status: ""
        },
        dataTable: [],
        PictModel: ""
      }
    },
    orderStatus: {
      orderStatusMaster: {},
      orderStatusDetail: {
        StatusHeader: {}
      }
    },
    InsertDevice: {},
    waterlog: {
      chartData: []
    },
    //
    purchaseBillMaster: {
      dataFilter: null,
      dateBetween: {
        values: [],
        showPopup: false,
        showDate: ""
      },
      status: {
        values: []
      },
      section: {
        values: []
      }
    },
    //Update 20-10-2564
    purchaseDetail: {
      dataHeader: null
    },
    mppPage: {
      mppSelectOrderToDetail: {},
      mppBillIDForPrint: null,
      dataFilterMaster: null
    },
    castingPage: {
      values_gotoDetail: {}
    },
    processBill: {
      processBillCreate: {
        step1: {
          selectedProcess: "",
          selectedProcessName: ""
        },
        step2: {
          selectedItem: [],
          dataItem: [],
          orderNumber: ""
        },
        step3: {
          selectedProcess: "",
          selectedProcessName: ""
        }
      }
    },
    filterFacwip: null,
    FacToQa: {
      tab: "",
      StatusMaster: {
        isDataFilterPage: false,
        filterValuesMaster: {
          orderFilter: "",
          valuesFactory: [],
          valuesTeamSales: [],
          salesDateBetween: []
        }
      },
      StatusDetail: {
        dataMaster: null,
        valuesCart: [],
        employeeQC: [],
        gotoqaBill: false
      },
      filterQaBill: {
        orderFilter: "",
        factory: {
          values: [],
          factoryShow: [
            { name: "Factory1", value: "1" },
            { name: "Factory2", value: "2" },
            { name: "Factory3", value: "3" },
            { name: "Factory4", value: "4" }
          ]
        },
        statusBill: {
          values: [],
          statusShow: [
            { name: "รอตรวจ", value: "1" },
            { name: "ยังไม่ได้รับ", value: "" },
            { name: "เสร็จแล้ว", value: "2" }
          ]
        },
        teamSales: {
          values: [],
          customerShow: [
            { name: "K.Klar", value: 1 },
            { name: "K.Noot", value: 2 },
            { name: "K.Nan", value: 3 }
          ]
        },
        dateBetween: {
          values: [],
          showDate: ""
        },
        isReceive: false,
        isPrint: false,
        isShowStatus: false
      },
      qaBillMaster: {
        isDataFilterPage: false
      },
      qaRepairBill: {
        isDataFilterPage: false,
        filterValuesMaster: {
          orderFilter: "",
          valuesFactory: [],
          valuesTeamSales: [],
          billDateBetween: [],
          showDate: ``,
          jobScan: ""
        }
      },
      reportFactoQa: {
        filterMaster: null
      }
    },
    //เพิ่ม
    facBillRepair: {
      ShowPopupReceiveBill: false, // srtatus 0 FAC กดรับบิลซ่อม
      ShowPopupRepair: false, // status 1 FAC ส่ง QA
      reasonShowPop: false,
      billRepairItems: []
    }
  },

  getters: {
    isLogin(state) {
      return state.isLogged;
    },
    username(state) {
      return state.username;
    },
    fullName(state) {
      return state.fullName;
    },
    EmpPict(state) {
      return state.EmpPict;
    },
    Factory(state) {
      return state.Factory;
    },
    editDeviceID(state) {
      return state.deviceMaster.editDeviceID;
    },
    showModifyDevice(state) {
      return state.deviceMaster.showModify;
    },
    DataDeviceEdit(state) {
      return state.deviceModify.deviceData;
    },
    DataDeviceMaster(state) {
      return state.deviceMaster.deviceData;
    },
    formDeviceCat(state) {
      return state.deviceForm.Category;
    },
    formDeviceFloor(state) {
      return state.deviceForm.Floor;
    },
    formDeviceRoom(state) {
      return state.deviceForm.Room;
    },
    formDeviceEmp(state) {
      return state.deviceForm.Emp;
    },
    DeviceFilter(state) {
      return state.repairCreate.deviceNo;
    },
    billRepair(state) {
      return state.repairCreate.BillRepair;
    },
    ShowPopupRepairModify(state) {
      return state.repairModify.showPopupRepairModify;
    },
    BillRepairModify(state) {
      return state.repairModify.billRepair;
    },
    DataRepairModify(state) {
      return state.repairModify.dataRepair;
    },
    policyCode(state) {
      return state.levelUser.policyCode;
    },
    policyName(state) {
      return state.levelUser.policyName;
    },
    policyAppove(state) {
      return state.levelUser.Appove;
    },

    // GAME
    policyQueUpdate(state) {
      return state.levelUser.QueUpdate;
    },
    policyStatusUpdate(state) {
      return state.levelUser.StatusUpdate;
    },
    policyReviseMoldStatus(state) {
      return state.levelUser.ReviseMoldStatus;
    },
    //

    getSumBill(state) {
      return state.repairMaster.getSumBill;
    },
    ReportChartBillMonth(state) {
      return state.report.chartBillMonth;
    },
    dataChartShow(state) {
      return state.report.datachartShow;
    },
    mouldBill(state) {
      return state.mould.mouldBill;
    },
    showPopupMouldModify(state) {
      return state.mould.mouldModify.showPopupModify;
    },
    mouldModifybill(state) {
      return state.mould.mouldModify.dataModifyBill;
    },
    dataMouldAll(state) {
      return state.mould.mouldModify.dataMouldAll;
    },
    dataMouldDetail(state) {
      return state.mould.mouldDetail.dataHeader;
    },
    dataMouldDetailTable(state) {
      return state.mould.mouldDetail.dataTable;
    },
    dataPictMouldModify(state) {
      return state.mould.mouldModify.PictMould;
    },
    orderModifySelect(state) {
      return state.mould.mouldModify.OrderNumberSelect;
    },
    jobTypeModifySelect(state) {
      return state.mould.mouldModify.JobTypeSelect;
    },
    pictDetail(state) {
      return state.mould.mouldDetail.PictModel;
    },
    statusDetailHeader(state) {
      return state.orderStatus.orderStatusDetail.StatusHeader;
    },
    // repairInputModify(state) {
    //     return state.repairModify.disableInput.showDevice
    // }
    //Update 20-10-2564
    dataPurchaseDetail(state) {
      return state.purchaseDetail.dataHeader;
    }
  },

  mutations: {
    SET_LOGGED_IN(state) {
      state.isLogged = true;
    },
    SET_LOGGED_OUT(state) {
      state.isLogged = false;
    },
    SET_USERNAME(state, value) {
      state.username = value;
    },
    SET_FULLNAME(state, value) {
      state.fullName = value;
    },
    SET_EmpPict(state, EmpPict) {
      state.EmpPict = EmpPict;
    },
    SET_Factory(state, Factory) {
      state.Factory = Factory;
    },
    SET_MODIFYDEVICEID(state, value) {
      (state.deviceMaster.editDeviceID = value),
        (state.deviceMaster.showModify = true);
    },
    SET_DataDeviceEdit(state, value) {
      state.deviceModify.deviceData = value;
    },
    SET_DataDeviceMaster(state, value) {
      state.deviceMaster.deviceData = value;
    },
    SET_DataFormCat(state, resultCat) {
      state.deviceForm.Category = resultCat;
    },
    SET_DataFormFloor(state, resultFloor) {
      state.deviceForm.Floor = resultFloor;
    },
    SET_DataFormRoom(state, resultRoom) {
      state.deviceForm.Room = resultRoom;
    },
    SET_DataFormEmp(state, resultEmp) {
      state.deviceForm.Emp = resultEmp;
    },
    SET_DataDeviceFilter(state, result) {
      state.repairCreate.deviceNo = result;
    },
    SET_DatabillRepair(state, result) {
      state.repairCreate.BillRepair = result;
    },
    SET_DataBillRepairModify(state, result) {
      state.repairModify.dataRepair = result;
    },
    SET_RepairModifyID(state, result) {
      state.repairModify.billRepair = result;
      state.repairModify.ShowPopupRepairModify = true;
    },
    SET_PolicyCode(state, result) {
      state.levelUser.policyCode = result;
    },
    SET_PolicyName(state, result) {
      state.levelUser.policyName = result;
    },
    SET_APPOVE(state, result) {
      state.levelUser.Appove = result;
    },

    // GAME
    SET_QUEUPDATE(state, result) {
      state.levelUser.QueUpdate = result;
    },
    SET_STATUSUPDATE(state, result) {
      state.levelUser.StatusUpdate = result;
    },
    SET_REVISEMOLDSTATUS(state, result) {
      state.levelUser.ReviseMoldStatus = result;
    },
    SET_ISFACTEAM(state, result) {
      state.levelUser.isFacTeam = result;
    },
    SET_ISQATEAM(state, result) {
      state.levelUser.isQATeam = result;
    },
    SET_GetSumBill(state, result) {
      state.repairMaster.getSumBill = result;
    },
    SET_DATACHART_BILL(state, result) {
      state.report.chartBillMonth = result;
    },
    SET_DATAChartShow(state, result) {
      state.report.datachartShow = result;
    },
    SET_GETMOULDBILL(state, result) {
      state.mould.mouldBill = result;
    },
    SET_MOULD_MODIFYBILL(state, result) {
      state.mould.mouldModify.dataModifyBill = result;
    },
    SET_MODELMOULDALL(state, result) {
      state.mould.mouldModify.dataMouldAll = result;
    },
    SET_DATAMOULDDETAIL(state, data) {
      state.mould.mouldDetail.dataHeader = data;
    },
    SET_DATAMOULDDETAIL_TABLE(state, result) {
      state.mould.mouldDetail.dataTable = result;
    },
    SET_filterImgMould(state, NewPict) {
      state.mould.mouldModify.PictMould = NewPict;
    },
    SET_ORDER_MODIFYBILL(state, result) {
      state.mould.mouldModify.OrderNumberSelect = result;
    },
    SET_JOBTYPE_MODIFYBILL(state, JobType) {
      state.mould.mouldModify.JobTypeSelect = JobType;
    },
    SET_PICTDETAIL(state, result) {
      state.mould.mouldDetail.PictModel = result;
    },
    SET_DATAORDERSTATUS(state, data) {
      state.orderStatus.orderStatusDetail.StatusHeader = data;
    },
    SET_DATA_WATERLOG_CHART(state, data) {
      state.waterlog.chartData.push(data);
    },
    SET_DATAFILTER_QABILL(state, data) {
      state.FacToQa.filterQaBill = data;
    },
    SET_DATAFILTER_QASTATUS_MASTER(state, data) {
      state.FacToQa.StatusMaster.filterValuesMaster = data;
    },
    SET_DATAFILTER_QAREPAIR_MASTER(state, data) {
      state.FacToQa.qaRepairBill.filterValuesMaster = data;
    }
  },
  actions: {
    async doLogin({ commit }, { username, password }) {
      const result = await api.login({ username, password });
      if (result === true) {
        const fullName = localStorage.getItem(server.FULLNAME);
        const PolicyCode = localStorage.getItem(server.PolicyCode);
        const PolicyName = localStorage.getItem(server.PolicyName);
        const EmpPict = localStorage.getItem(server.EmpPict);
        const Factory = localStorage.getItem(server.FACTORY);
        const Appove = localStorage.getItem(server.APPOVE);
        const QueUpdate = localStorage.getItem(server.QUEUPDATE);
        const StatusUpdate = localStorage.getItem(server.STATUSUPDATE);
        const ReviseMoldStatus = localStorage.getItem(server.REVISEMOLDSTATUS);
        // const isFacTeam = [];
        // const isQATeam = [];
        // console.log(JSON.parse(localStorage.getItem(server.ISFACTEAM)))
        const isFacTeam = JSON.parse(localStorage.getItem(server.ISFACTEAM));
        const isQATeam = JSON.parse(localStorage.getItem(server.ISQATEAM));

        // console.log(fullName);
        commit("SET_LOGGED_IN");
        commit("SET_USERNAME", username);
        commit("SET_FULLNAME", fullName);
        commit("SET_PolicyCode", PolicyCode);
        commit("SET_PolicyName", PolicyName);
        commit("SET_APPOVE", Appove);
        commit("SET_EmpPict", EmpPict);
        commit("SET_Factory", Factory);
        commit("SET_QUEUPDATE", QueUpdate);
        commit("SET_STATUSUPDATE", StatusUpdate);
        commit("SET_REVISEMOLDSTATUS", ReviseMoldStatus);
        commit("SET_ISFACTEAM", isFacTeam);
        commit("SET_ISQATEAM", isQATeam);
      }
      // else {
      //   dispatch("doLogout", {});
      // }
    },
    async doLogout({ commit }) {
      await api.logOff();
      commit("SET_LOGGED_OUT");
      commit("SET_USERNAME", "");
    },
    // เช็คว่า Login อยู่หรือเปล่า ถ้าใช่ให้ไปดึงค่าที่ Storage กลับ
    async restoreLogin({ commit, dispatch }) {
      if ((await api.isLoggedIn()) === true) {
        const username = localStorage.getItem(server.USERNAME);
        const fullName = localStorage.getItem(server.FULLNAME);
        const PolicyCode = localStorage.getItem(server.PolicyCode);
        const PolicyName = localStorage.getItem(server.PolicyName);
        const EmpPict = localStorage.getItem(server.EmpPict);
        const Factory = localStorage.getItem(server.FACTORY);
        const Appove = localStorage.getItem(server.APPOVE);
        const QueUpdate = localStorage.getItem(server.QUEUPDATE);
        const StatusUpdate = localStorage.getItem(server.STATUSUPDATE);
        const ReviseMoldStatus = localStorage.getItem(server.REVISEMOLDSTATUS);
        const isFacTeam = JSON.parse(localStorage.getItem(server.ISFACTEAM));
        const isQATeam = JSON.parse(localStorage.getItem(server.ISQATEAM));
        commit("SET_LOGGED_IN");
        commit("SET_USERNAME", username);
        commit("SET_FULLNAME", fullName);
        commit("SET_PolicyCode", PolicyCode);
        commit("SET_PolicyName", PolicyName);
        commit("SET_APPOVE", Appove);
        commit("SET_EmpPict", EmpPict);
        commit("SET_Factory", Factory);
        commit("SET_QUEUPDATE", QueUpdate);
        commit("SET_STATUSUPDATE", StatusUpdate);
        commit("SET_REVISEMOLDSTATUS", ReviseMoldStatus);
        commit("SET_ISFACTEAM", isFacTeam);
        commit("SET_ISQATEAM", isQATeam);
        // console.log('ทำตอน Login', isQATeam)
      } else {
        dispatch("doLogout", {});
      }
    },
    async modifyDeviceID({ commit }, { id }) {
      commit("SET_MODIFYDEVICEID", id);
      const result = await apiDevice.geteditDevice(id);
      commit("SET_DataDeviceEdit", result[0]);
    },

    async loadDataDeviceMaster({ commit }) {
      const result = await apiDevice.getDeviceMaster();
      commit("SET_DataDeviceMaster", result);
      // console.log('data1', result);
    },
    async loadFormDevice({ commit }) {
      const resultCat = await apiDevice.getCategory();
      const resultFloor = await apiDevice.getFloor();
      const resultRoom = await apiDevice.getRoom();
      const resultEmp = await apiDevice.getemployee();
      commit("SET_DataFormCat", resultCat);
      commit("SET_DataFormFloor", resultFloor);
      commit("SET_DataFormRoom", resultRoom);
      commit("SET_DataFormEmp", resultEmp);
    },
    async getDeviceFilter({ commit }) {
      const result = await apiRepairDoc.getDeviceFilter();
      commit("SET_DataDeviceFilter", result);
    },
    async getBillRepair({ commit }) {
      const result = await apiRepairDoc.getBillRepair();
      commit("SET_DatabillRepair", result);
    },
    async getBillRepairModify({ commit }, { id }) {
      commit("SET_RepairModifyID", id);
      const result = await apiRepairDoc.getBillRepairModify(id);
      commit("SET_DataBillRepairModify", result[0]);
      // commit("")
      // console.log(result[0])
      // console.log(this.$store.state.repairModify.ShowPopupRepairModify)
    },
    async getSumBill({ commit }, { data }) {
      // console.log(data)
      const result = await apiRepairDoc.getSumBill(data);
      // console.log(result)
      commit("SET_GetSumBill", result[0]);
    },
    async reportChartBill({ commit }) {
      const result = await apiReport.reportChartBill();
      commit("SET_DATACHART_BILL", result);
    },
    setDataChartShow({ commit }, { data }) {
      commit("SET_DATAChartShow", data);
    },
    async getMouldBill({ commit }) {
      const result = await apiMould.getMouldBill();
      commit("SET_GETMOULDBILL", result);
    },
    async getMouldModifyBill({ commit }, { id }) {
      const result = await apiMould.getModifyBill(id);
      // console.log(result[0])
      commit("SET_MOULD_MODIFYBILL", result[0]);
      console.log(result[0]);
      let JobType = await apiMould.getJobmould();
      if (result[0].Status === "01") {
        const resultOrder1 = await apiMould.getOrderNumber();
        commit("SET_ORDER_MODIFYBILL", resultOrder1);
        console.log(resultOrder1);
        JobType = JobType.filter(i => {
          return i.JobType !== "05";
        });
        commit("SET_JOBTYPE_MODIFYBILL", JobType);
      } else if (result[0].Status === "05") {
        const resultOrderEx = await apiMould.getOrderNumberEX();
        commit("SET_ORDER_MODIFYBILL", resultOrderEx);
        console.log(resultOrderEx);
        JobType = JobType.filter(i => {
          return i.JobType === "05";
        });
        commit("SET_JOBTYPE_MODIFYBILL", JobType);
      }
    },
    async getModelMouldAll({ commit }, { ModelNo }) {
      // console.log(OrderNumber);
      // const data = { OrderNumber: OrderNumber }
      const ModelMould = ModelNo;
      const result = await apiMould.getModelAll();
      commit("SET_MODELMOULDALL", result);
      const filterImg = result.filter(f => {
        return f.ModelNo === ModelMould;
      });
      // console.log(ModelMould, result)
      // console.log(filterImg[0].NewPict)
      commit("SET_filterImgMould", filterImg[0].NewPict);
    },
    async setDataMouldDetail({ commit }, { data }) {
      // console.log(data);
      commit("SET_DATAMOULDDETAIL", data);
      const result = await apiMould.getMouldBillDetail(data.ModelNo);
      const result2 = await apiMould.getPictDetail(data.ModelNo);
      // console.log('state', result2)
      commit("SET_PICTDETAIL", result2[0].NewPict);
      commit("SET_DATAMOULDDETAIL_TABLE", result);
    },
    SendDataOrderStatus({ commit }, { data }) {
      commit("SET_DATAORDERSTATUS", data);
    },
    SetDataWaterLogChart({ commit }, { data }) {
      commit("SET_DATA_WATERLOG_CHART", data);
    },
    SET_filterQaBillMaster({ commit }, { setDefault, valuesFilter }) {
      // console.log(setDefault)
      let startDate = new Date();
      let endDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      endDate.setDate(endDate.getDate() + 1);
      // console.log('ทำตอน โหลด', this.state.levelUser.isQATeam)
      const defaultValues = {
        orderFilter: "",
        factory: {
          values: this.state.levelUser.isFacTeam.map(({ FacTeam }) => FacTeam),
          factoryShow: [
            { name: "Factory1", value: "1" },
            { name: "Factory2", value: "2" },
            { name: "Factory3", value: "3" },
            { name: "Factory4", value: "4" }
          ]
        },
        statusBill: {
          values: ["", "1"],
          statusShow: [
            { name: "รอตรวจ", value: "1" },
            { name: "ยังไม่ได้รับ", value: "" },
            { name: "เสร็จแล้ว", value: "2" }
          ]
        },
        teamSales: {
          values: this.state.levelUser.isQATeam.map(({ QATeam }) => QATeam),
          customerShow: [
            { name: "K.Klar", value: 1 },
            { name: "K.Noot", value: 2 },
            { name: "K.Nan", value: 3 }
          ]
        },
        dateBetween: {
          values: [
            apiCreatePDF.convertDate_JS_TO_SQL(startDate),
            apiCreatePDF.convertDate_JS_TO_SQL(endDate)
          ],
          showDate: `${apiCreatePDF.convertDate_JS_TO_SQL(
            startDate
          )} ~ ${apiCreatePDF.convertDate_JS_TO_SQL(endDate)}`
        },
        isReceive: false,
        isPrint: false,
        isShowStatus: false
      };
      if (!this.state.FacToQa.qaBillMaster.isDataFilterPage) {
        this.state.FacToQa.qaBillMaster.isDataFilterPage = true;
        commit("SET_DATAFILTER_QABILL", defaultValues);
      }
      const setValuesFilter = {
        orderFilter: valuesFilter.orderFilter
          ? valuesFilter.orderFilter
          : this.state.FacToQa.filterQaBill.orderFilter,
        factory: {
          values: valuesFilter.valuesFact
            ? valuesFilter.valuesFact
            : this.state.FacToQa.filterQaBill.factory.values,
          factoryShow: [
            { name: "Factory1", value: "1" },
            { name: "Factory2", value: "2" },
            { name: "Factory3", value: "3" },
            { name: "Factory4", value: "4" }
          ]
        },
        statusBill: {
          values: valuesFilter.valuesStatus
            ? valuesFilter.valuesStatus
            : this.state.FacToQa.filterQaBill.statusBill.values,
          statusShow: [
            { name: "รอตรวจ", value: "1" },
            { name: "ยังไม่ได้รับ", value: "" },
            { name: "เสร็จแล้ว", value: "2" }
          ]
        },
        teamSales: {
          values: valuesFilter.valuesTeamSales
            ? valuesFilter.valuesTeamSales
            : this.state.FacToQa.filterQaBill.teamSales.values,
          customerShow: [
            { name: "K.Klar", value: 1 },
            { name: "K.Noot", value: 2 },
            { name: "K.Nan", value: 3 }
          ]
        },
        dateBetween: {
          values: valuesFilter.valuesBillDate
            ? valuesFilter.valuesBillDate
            : this.state.FacToQa.filterQaBill.dateBetween.values,
          showDate: valuesFilter.valuesBillDate
            ? `${apiCreatePDF.convertDate_JS_TO_SQL(
                valuesFilter.valuesBillDate[0]
              )} ~ ${apiCreatePDF.convertDate_JS_TO_SQL(
                valuesFilter.valuesBillDate[1]
              )}`
            : this.state.FacToQa.filterQaBill.dateBetween.showDate
        },
        isReceive:
          valuesFilter.isReceive !== null &&
          valuesFilter.isReceive !== undefined
            ? valuesFilter.isReceive
            : this.state.FacToQa.filterQaBill.isReceive,
        isPrint:
          valuesFilter.isPrint !== null && valuesFilter.isPrint !== undefined
            ? valuesFilter.isPrint
            : this.state.FacToQa.filterQaBill.isPrint,
        isShowStatus:
          valuesFilter.isShowStatus !== null &&
          valuesFilter.isShowStatus !== undefined
            ? valuesFilter.isShowStatus
            : this.state.FacToQa.filterQaBill.isShowStatus
      };

      commit(
        "SET_DATAFILTER_QABILL",
        setDefault ? defaultValues : setValuesFilter
      );
    },
    SET_filterQAStatusMaster({ commit }, { setDefault, valuesFilter }) {
      let startDate = new Date();
      let endDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      endDate.setDate(endDate.getDate() + 30);
      // console.log(startDate, endDate)
      // console.log(555, this.state.levelUser.isQATeam)
      // console.log(this.state.levelUser.isQATeam.map(({ QATeam }) => QATeam))
      const defaultValues = {
        orderFilter: "",
        valuesFactory: this.state.levelUser.isFacTeam.map(
          ({ FacTeam }) => FacTeam
        ),
        valuesTeamSales: this.state.levelUser.isQATeam.map(
          ({ QATeam }) => QATeam
        ),
        salesDateBetween: [
          apiCreatePDF.convertDate_JS_TO_SQL(startDate),
          apiCreatePDF.convertDate_JS_TO_SQL(endDate)
        ]
      };
      // console.log('ทำตอน โหลด', this.state.levelUser.isQATeam)
      // console.log(defaultValues)
      if (!this.state.FacToQa.StatusMaster.isDataFilterPage) {
        this.state.FacToQa.StatusMaster.isDataFilterPage = true;
        this.state.FacToQa.StatusMaster.filterValuesMaster = defaultValues;
        // commit("SET_DATAFILTER_QASTATUS_MASTER", defaultValues)
      }

      const setValues = {
        orderFilter: valuesFilter.orderFilter
          ? valuesFilter.orderFilter
          : this.state.FacToQa.StatusMaster.filterValuesMaster.orderFilter,
        valuesFactory: valuesFilter.valuesFactory
          ? valuesFilter.valuesFactory
          : this.state.FacToQa.StatusMaster.filterValuesMaster.valuesFactory,
        valuesTeamSales: valuesFilter.valuesTeamSales
          ? valuesFilter.valuesTeamSales
          : this.state.FacToQa.StatusMaster.filterValuesMaster.valuesTeamSales,
        salesDateBetween: valuesFilter.salesDateBetween
          ? valuesFilter.salesDateBetween
          : this.state.FacToQa.StatusMaster.filterValuesMaster.salesDateBetween
      };
      commit(
        "SET_DATAFILTER_QASTATUS_MASTER",
        setDefault ? defaultValues : setValues
      );
    },

    SET_filterQARepairMaster({ commit }, { setDefault, valuesFilter }) {
      let startDate = new Date();
      let endDate = new Date();
      startDate.setDate(startDate.getDate() - 30);
      endDate.setDate(endDate.getDate() + 1);
      // console.log(startDate, endDate)
      const defaultValues = {
        orderFilter: "",
        valuesFactory: this.state.levelUser.isFacTeam.map(
          ({ FacTeam }) => FacTeam
        ),
        valuesTeamSales: this.state.levelUser.isQATeam.map(
          ({ QATeam }) => QATeam
        ),
        billDateBetween: [
          apiCreatePDF.convertDate_JS_TO_SQL(startDate),
          apiCreatePDF.convertDate_JS_TO_SQL(endDate)
        ],
        showDate: `${apiCreatePDF.convertDate_JS_TO_SQL(
          startDate
        )} - ${apiCreatePDF.convertDate_JS_TO_SQL(endDate)}`,
        jobScan: ""
      };
      if (!this.state.FacToQa.qaRepairBill.isDataFilterPage) {
        this.state.FacToQa.qaRepairBill.isDataFilterPage = true;
        // console.log('default', defaultValues)
        commit("SET_DATAFILTER_QAREPAIR_MASTER", defaultValues);
      }

      const setValues = {
        orderFilter: valuesFilter.orderFilter
          ? valuesFilter.orderFilter
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.orderFilter,
        valuesFactory: valuesFilter.valuesFactory
          ? valuesFilter.valuesFactory
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.valuesFactory,
        valuesTeamSales: valuesFilter.valuesTeamSales
          ? valuesFilter.valuesTeamSales
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.valuesTeamSales,
        billDateBetween: valuesFilter.billDateBetween
          ? valuesFilter.billDateBetween
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.billDateBetween,
        showDate: valuesFilter.showDate
          ? valuesFilter.showDate
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.showDate,
        jobScan: valuesFilter.jobScan
          ? valuesFilter.jobScan
          : this.state.FacToQa.qaRepairBill.filterValuesMaster.jobScan
      };
      commit(
        "SET_DATAFILTER_QAREPAIR_MASTER",
        setDefault ? defaultValues : setValues
      );
    }
  }
});
