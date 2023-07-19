// import { Store } from 'vuex';
import router from "../router";
import { server } from "../services/constants";
import httpClient from "./httpClient";
import store from "../store/index";

//เช็คว่า Login อยู่หรือเปล่า
const isLoggedIn = async () => {
  store.state.currentUrl = window.location.pathname;
  const token = localStorage.getItem(server.TOKEN_KEY);
  if (token !== null) {
    // if (store.state.checkTimeout) {
    // console.log(token)
    const result = await httpClient.post(server.CHECKTOKEN, { token: token });
    // store.state.checkTimeout = false;
    // console.log('ทำแล้ว')
    return result.data.apiResult;
    // } else {
    //     return true;
    // }
  } else {
    return false;
  }
};

const login = async values => {
  console.log('dataSend', values)
  let result = await httpClient.post(server.LOGIN_URL, values);
  console.log(result)
  if (result.data.result === "ok") {
    // console.log(result.data.token);
    if (true) {
      localStorage.setItem(server.USERNAME, values.username);
      localStorage.setItem(server.FULLNAME, result.data.fullName);
      localStorage.setItem(server.TOKEN_KEY, result.data.token);
      localStorage.setItem(server.PolicyCode, result.data.PolicyCode);
      localStorage.setItem(server.PolicyName, result.data.PolicyName);
      localStorage.setItem(server.EmpPict, result.data.EmpPict);
      localStorage.setItem(server.FACTORY, result.data.Factory);
      localStorage.setItem(server.APPOVE, result.data.Appove);
      localStorage.setItem(server.QUEUPDATE, result.data.QueUpdate);
      localStorage.setItem(server.STATUSUPDATE, result.data.StatusUpdate);
      localStorage.setItem(
        server.REVISEMOLDSTATUS,
        result.data.reviseMoldStatus
      );
      localStorage.setItem(
        server.ISQATEAM,
        JSON.stringify(result.data.isQATeam)
      );
      localStorage.setItem(
        server.ISFACTEAM,
        JSON.stringify(result.data.isFacTeam)
      );
      // if (store.state.currentUrl !== "/" && store.state.currentUrl !== "/login") {
      //     await router.push(store.state.currentUrl);
      // } else {
      await router.push("/home");
      // }
      return true;
    } else {
      alert("Token Error");
    }
  } else {
    alert(JSON.stringify(result.data.result));
    return false;
  }
};

const logOff = async () => {
  localStorage.removeItem(server.TOKEN_KEY);
  localStorage.removeItem(server.USERNAME);
  localStorage.removeItem(server.FULLNAME);
  localStorage.removeItem(server.PolicyCode);
  localStorage.removeItem(server.PolicyName);
  localStorage.removeItem(server.EmpPict);
  localStorage.removeItem(server.FACTORY);
  localStorage.removeItem(server.APPOVE);
  localStorage.removeItem(server.QUEUPDATE);
  localStorage.removeItem(server.STATUSUPDATE);
  localStorage.removeItem(server.REVISEMOLDSTATUS);
  localStorage.removeItem(server.ISQATEAM);
  localStorage.removeItem(server.ISFACTEAM);
  await router.push("/login").catch(err => {
    /* to do*/
  });
};

const checkPassword = async data => {
  const res = await httpClient.post(server.GETCHECKPASSWORD, data);
  // console.log(res.data.result);
  return res.data.result;
};

const confirmUpdatePassword = async data => {
  const res = await httpClient.post(server.UPDATEPASSWORD, data);
  return res.data.result;
};

export default {
  isLoggedIn,
  login,
  logOff,
  checkPassword,
  confirmUpdatePassword
};
