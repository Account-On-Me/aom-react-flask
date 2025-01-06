import { Avatar, Box, FormControl, MenuItem, Select, Slide, Typography } from "@mui/material"
import { Fragment, useContext, useEffect } from "react";
import { OrderContext } from "../../contexts/orderContext";
import { fetchPeopleList } from "../../api/people";
import { AlertManagerContext } from "../../components/AlertManager";


export const PayerTab = () => {
  const { setAlert } = useContext(AlertManagerContext);
  const { orderConstructor, setOrderConstructor } = useContext(OrderContext);
  const { orderPageInfo, setOrderPageInfo } = useContext(OrderContext);

  useEffect(() => {
    if (orderPageInfo.people.length > 0) return;
    fetchPeopleList()
      .then((data) => {
        setOrderPageInfo({ ...orderPageInfo, people: data });
      })
      .catch((err) => {
        setAlert({
          severity: "error",
          message: "Failed to fetch avaliable candidates.",
          show: true,
        });
        console.error(err);
      });
  }, []);

  const handleSelectChange = (e) => {
    const payer = orderPageInfo.people.find((person) => person._id.toString() === e.target.value.toString());
    setOrderConstructor({ ...orderConstructor, payer: payer, payerId: e.target.value, candidates: [payer], candidateIds: [payer._id] });
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
          Who paid for this bill?
        </Typography>

        {orderPageInfo.people.length === 0 && (
          <Typography variant="body1" sx={{}}>
            No avaliable candidates. Please refresh the page and try again.
          </Typography>
        )}
        {orderPageInfo.people.length > 0 && (
          <Box sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: '100%',
          }}>
            {orderConstructor.payer && (<Avatar sx={{ width: '30px', height: '30px', mr: '35px' }}>{orderConstructor.payer.name[0].toUpperCase()}</Avatar>)}
            <FormControl variant="standard" sx={{
              width: "30%",
            }}>
              <Select
                value={orderConstructor.payerId}
                label="Payer"
                onChange={handleSelectChange}
              >
                {orderPageInfo.people.map((person) => (
                  <MenuItem key={person._id} value={person._id}>{person.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </Box>
    </Slide>
  )
}