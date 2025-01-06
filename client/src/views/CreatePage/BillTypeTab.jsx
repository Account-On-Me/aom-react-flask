import { Box, Button, FormControl, MenuItem, Select, Slide, TextField, Typography } from "@mui/material"
import { useContext, useState } from "react";
import { OrderContext } from "../../contexts/orderContext";
import { getItemsFromWalmertJSON } from "../../utils/orderUtils";
import { AlertManagerContext } from "../../components/AlertManager";


export const BillTypeTab = () => {
  const { orderConstructor, setOrderConstructor } = useContext(OrderContext);
  const { orderPageInfo, setOrderPageInfo } = useContext(OrderContext);
  const { setAlert } = useContext(AlertManagerContext);

  const [walmartJSON, setWalmartJSON] = useState(null);

  const handleWalmartJsonParse = () => {
    try {
      const parsedJson = JSON.parse(walmartJSON);
      const items = getItemsFromWalmertJSON(parsedJson);
      setOrderConstructor({ ...orderConstructor, items: items });
      setAlert({
        type: "success",
        message: "Walmart JSON parsed successfully!",
        show: true,
      });
    } catch (err) {
      setAlert({
        type: "error",
        message: "Walmart JSON parsed failed!",
        show: true,
      });
      console.error(err);
    }
  }

  return (
    <Slide in={true} direction="up">
      <Box sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        boxSizing: "border-box",
      }}>
        <Typography variant="h3" sx={{
          mb: '50px',
        }}>
          What is this bill about?
        </Typography>
        <FormControl variant="standard" sx={{
          width: "30%",
        }}>
          <Select
            value={orderConstructor.type}
            label="Bill Type"
            onChange={(e) => setOrderConstructor({ ...orderConstructor, type: e.target.value })}
          >
            <MenuItem value="DEFAULT">General</MenuItem>
            <MenuItem value="WALMART">Walmart</MenuItem>
            <MenuItem value="INTERNET">XFinity</MenuItem>
            <MenuItem value="ENERGY">Duke Energy</MenuItem>
            <MenuItem value="TAKEOUT">Take Out</MenuItem>
          </Select>
        </FormControl>
        {orderConstructor.type === "WALMART" && (
          <Box sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}>
            <TextField
              label="JSON"
              multiline
              autoFocus
              rows={8}
              placeholder="Paste Walmart JSON here."
              variant="standard"
              defaultValue=''
              fullWidth
              onChange={(e) => setWalmartJSON(e.target.value)}
              sx={{
                width: "60%",
                mb: '20px',
              }}
            />
            <Button variant="contained" onClick={handleWalmartJsonParse} sx={{

            }} >
              Add
            </Button>
          </Box>
        )}
      </Box>
    </Slide>
  )
}