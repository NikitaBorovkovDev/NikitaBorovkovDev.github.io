import { Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import { useEffect, useState } from "react";
import getData from "../utils/getData";

const FilterSelect = ({ name, defaultValue }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    getData({
      action: "get_fields",
      params: { field: name },
    }).then((data) => {
      setIsLoaded(true);
      setData([...new Set(data.filter((item) => item))]);
    });
  }, []);

  return (
    <FormControl fullWidth>
      <InputLabel id="demo-simple-select-label">
        {isLoaded ? name : <div>"loading"</div>}
      </InputLabel>
      <Select
        defaultValue={defaultValue}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        name={name}
        label={name}
      >
        <MenuItem key={"none"} value={""}>
          none
        </MenuItem>
        {isLoaded ? (
          data &&
          data.map((item) => (
            <MenuItem key={item} value={item}>
              {item}
            </MenuItem>
          ))
        ) : (
          <div></div>
        )}
      </Select>
    </FormControl>
  );
};

export default FilterSelect;
