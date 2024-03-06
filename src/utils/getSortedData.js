import { SEARCH_PARAMS } from "../constants";
import getData from "./getData";
/**
 * Если в передаваемом массиве есть параметры сортировки товаров, то вернёт отфильтрованный массив id, если параметров нет или они без значений, то обычный запрос всех id
 * @param {{"key": number | string}} Params - Объект с параметрами поиска
 * @returns {Promise<string[]>} массив всех id подходящих по параметрам
 */
export default async function getSortedData(Params) {
  //отфильтровать параметры не относящиеся к сортировке
  const sortParamsKeys = SEARCH_PARAMS.filter((key) => Params[key]);

  // вернуть id без сортировки
  if (!sortParamsKeys.length) {
    const defaultReq = {
      action: "get_ids",
      params: { offset: 0 },
    };
    const data1 = await getData(defaultReq);
    return [...new Set(data1)];
  }

  // создание объекта с параметрами запроса
  const params = {};
  sortParamsKeys.forEach((key) => {
    if (key === "price") {
      params[key] = Number(Params[key]);
    } else {
      params[key] = Params[key];
    }
  });

  const reqData = {
    action: "filter",
    params: params,
  };
  return [...new Set(await getData(reqData))];
}
