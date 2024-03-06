import { Grid, Card, CardContent, Typography, Stack } from "@mui/material";

const ProductCard = ({ id, name, price, brand }) => {
  return (
    <Grid item xs={1} md={1} height={250}>
      <Card
        sx={{
          minWidth: "100%",
          minHeight: "100%",
          display: "flex",
          alignItems: "center",
        }}
      >
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="caption" component="h3">
              name: {name}
            </Typography>
            <Typography variant="caption" component="h3">
              price: {price}
            </Typography>
            <Typography variant="caption" component="h3">
              brand: {brand}
            </Typography>
            <Typography variant="caption">id: {id}</Typography>
          </Stack>
        </CardContent>
      </Card>
    </Grid>
  );
};

export default ProductCard;
