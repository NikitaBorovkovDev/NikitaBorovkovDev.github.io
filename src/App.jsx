import {
  Container,
  Grid,
  Stack,
  Pagination,
  Box,
  TextField,
  Button,
} from "@mui/material";
import ProductCard from "./components/ProductCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CARD_PER_PAGE, SEARCH_PARAMS } from "./constants";
import getData from "./utils/getData";
import getSortedData from "./utils/getSortedData";
import FilterSelect from "./components/FilterSelect";

const App = () => {
  const [renderData, setRenderData] = useState(null);
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoaded, setIsLoaded] = useState(false);
  const [fatalError, setFatalError] = useState(false);

  /**searchParams в формате обычного объекта*/
  const searchParamsObj = Object.fromEntries([...searchParams]);

  // для пагинации
  const pageCount = Math.ceil(data.length / CARD_PER_PAGE);

  let offset = Number(page) - 1;
  offset = offset ? offset * CARD_PER_PAGE : 0;

  // Сохранить номер страницы, из параметров, и запрос id
  useEffect(() => {
    const searchParamsPage = Number(searchParams.get("page"));
    if (searchParamsPage) {
      setPage(searchParamsPage);
    }

    getSortedData(searchParamsObj)
      .then((data) => setData(data))
      .catch(() => {
        setFatalError(true);
      });
  }, []);

  /** получить информацию о товарах по массиву id
   * @param {number[]} data - массив id, не более 100*/
  const getRenderData = (data) => {
    const reqData = {
      action: "get_items",
      params: { ids: data },
    };
    getData(reqData).then((data) => {
      // фильтрация повторяющихся id
      const uniqueIds = {};
      const filteredData = data.filter((obj) => {
        // Проверяем, если id уже встречался
        if (uniqueIds[obj.id]) {
          return false;
        }
        // Добавляем id в объект для отслеживания
        uniqueIds[obj.id] = true;
        return true;
      });
      setRenderData(filteredData);
      setIsLoaded(true);
    });
  };

  // Получение информации о товарах по id
  useEffect(() => {
    if (data?.length) {
      getRenderData(data.slice(offset, offset + CARD_PER_PAGE));
    }
  }, [data]);

  // Установить номер страницы и запросить данные товаров с другой страницы
  const handlePageChange = (_, page) => {
    setIsLoaded(false);
    setPage(page);
    setSearchParams({ ...searchParamsObj, page: page });
    if (data?.length) {
      let offset = page - 1;
      offset = offset ? offset * CARD_PER_PAGE : 0;

      getRenderData(data.slice(offset, offset + CARD_PER_PAGE));
    }
  };

  // Запрос данных по фильтрам
  const handleFilter = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    // Преобразование FormData в объект
    const formDataObject = {};
    formData.forEach((value, key) => {
      formDataObject[key] = value;
    });
    const newParamsObj = { ...searchParamsObj, ...formDataObject };

    setIsLoaded(false);

    getSortedData(newParamsObj).then((data) => setData(data));
    setSearchParams(newParamsObj);
  };

  return fatalError ? (
    <div>Что-то пошло не так... Подробности в консоли.</div>
  ) : isLoaded ? (
    <Container maxWidth="lg" sx={{ my: "25px" }}>
      <Stack spacing={2} component={"form"} onSubmit={handleFilter}>
        {SEARCH_PARAMS.map((searchParam) => {
          return searchParam === "brand" ? (
            <FilterSelect
              key={searchParam}
              name={searchParam}
              id={searchParam}
              defaultValue={
                searchParamsObj[searchParam] ? searchParamsObj[searchParam] : ""
              }
            />
          ) : (
            <TextField
              key={searchParam}
              name={searchParam}
              id={searchParam}
              defaultValue={
                searchParamsObj[searchParam] ? searchParamsObj[searchParam] : ""
              }
              label={searchParam + " filter"}
              variant="outlined"
            />
          );
        })}
        <Button type="submit" variant="outlined">
          search
        </Button>
      </Stack>

      <Stack spacing={2} mt={2} mb={2}>
        <Pagination
          page={page}
          onChange={handlePageChange}
          count={pageCount}
          variant="outlined"
          shape="rounded"
        />
      </Stack>
      <Grid container columns={5} spacing={2}>
        {renderData?.length ? (
          renderData.map((item) => (
            <ProductCard
              name={item.product}
              id={item.id}
              key={item.id}
              price={item.price}
              brand={item.brand}
            ></ProductCard>
          ))
        ) : (
          <div>нет</div>
        )}
      </Grid>
    </Container>
  ) : (
    <div>loading</div>
  );
};

export default App;
