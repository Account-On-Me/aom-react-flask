import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, Slide, Typography } from "@mui/material"
import { useContext } from "react";
import { AlertManagerContext } from "../../components/AlertManager";
import { OrderContext } from "../../contexts/orderContext";

export const CandidateTab = () => {
  const { setAlert } = useContext(AlertManagerContext);
  const { orderConstructor, setOrderConstructor } = useContext(OrderContext);
  const { orderPageInfo, setOrderPageInfo } = useContext(OrderContext);

  const handleSelectChange = (e) => {
    const selectedIds = e.target.value;
    setOrderConstructor({ ...orderConstructor, candidateIds: selectedIds, candidates: orderPageInfo.people.filter((person) => selectedIds.includes(person._id)) });
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
          Who is involved in this bill?
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
            <FormControl variant="standard" sx={{
              width: "30%",
            }}>
              <InputLabel>Candidates</InputLabel>
              <Select
                value={orderConstructor.candidateIds}
                multiple
                label="Payer"
                onChange={handleSelectChange}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={orderPageInfo.people.find((person) => person._id.toString() === value.toString()).name} />
                    ))}
                  </Box>
                )}
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