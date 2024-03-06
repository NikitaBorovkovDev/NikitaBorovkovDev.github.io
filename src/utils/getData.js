import { FETCH_URL, PASSWORD } from "../constants";
import getTimestamp from "./getTimestamp";
import CryptoJS from "crypto-js";

/**
 * Запрос к серверу по указанным параметрам
 * @param {{"action": string, "params": {[k: string]: string | number}}} reqData object
 * @returns {Promise<result>}
 */

export default async function getData(reqData) {
  // создание строки авторизации по шаблону: md5(пароль_таймштамп)
  try {
    const authString = `${PASSWORD}_${getTimestamp()}`;
    const authHashString = CryptoJS.MD5(authString).toString();

    const header = {
      "X-Auth": authHashString,
      "content-type": "application/json",
    };

    const resData = await fetch(FETCH_URL, {
      method: "POST",
      headers: header,
      body: JSON.stringify(reqData),
    });

    if (!resData.ok) {
      throw resData;
    }

    const data = await resData.json();

    return data.result;
  } catch (error) {
    if (error.status === 500) {
      return await getData(reqData);
    } else {
      console.error("ошибка при запросе на сервер", error.status);
      throw new Error("ошибка при запросе на сервер");
    }
  }
}
