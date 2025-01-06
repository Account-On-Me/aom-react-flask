import { AddShoppingCart, DeleteForever, DoneOutline, Edit } from "@mui/icons-material";
import { Box, Chip, Divider, IconButton, InputBase, List, ListItem, MenuItem, Paper, Select, Skeleton, Slide, Switch, TextField, Typography } from "@mui/material";
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Fragment, useContext, useEffect, useState } from "react";
import { AlertManagerContext } from "../../components/AlertManager";
import { OrderContext } from "../../contexts/orderContext";
import { calculatePaychecks } from "../../utils/orderUtils";

const getDefaultNewItem = () => ({
  name: "Item",
  price: 0,
  quantity: 1,
  taxed: false,
  type: "ITEM",
  method: "EQUAL",
  thumbnail: "",
  candidateIds: [],
  methodMeta: {
    ratio: {},
    manual: {},
  },
})

const SCALES = {
  thumbnailSize: '250px',
}

export const BillDetailTab = () => {
  const { setAlert } = useContext(AlertManagerContext);
  const { orderConstructor, setOrderConstructor } = useContext(OrderContext);
  const { orderPageInfo, setOrderPageInfo } = useContext(OrderContext);

  const handleItemUpdate = (index, item) => {
    setOrderConstructor(prev => {
      const newItems = [...prev.items];
      newItems[index] = item;
      return { ...prev, items: newItems };
    });
  };

  const handleItemDelete = (index) => {
    setOrderConstructor(prev => {
      const newItems = [...prev.items];
      newItems.splice(index, 1);
      return { ...prev, items: newItems };
    });
  };

  const handleItemAdd = () => {
    setOrderConstructor(prev => {
      const newItems = [...prev.items];
      const item = getDefaultNewItem();
      item.candidateIds = prev.candidateIds;
      newItems.push(item);
      return { ...prev, items: newItems };
    });
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
        <List sx={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderRadius: "12px",
          boxSizing: "border-box",
          maxHeight: "60vh",
          overflowY: "auto",
        }}>
          {orderConstructor.items.map((item, index) => (
            <ListItem key={index} sx={{
              justifyContent: "center",
              backgroundColor: "white",
              width: "100%",
              borderRadius: "10px",
              boxSizing: "border-box",
              mb: '15px',
            }}>
              <OrderItemPanel
                item={item}
                updateItem={(newItem) => handleItemUpdate(index, newItem)}
                deleteItem={() => handleItemDelete(index)}
              />
            </ListItem>
          ))}
          <ListItem sx={{
            display: "flex",
            justifyContent: "center",
          }}>
            <IconButton onClick={handleItemAdd} sx={{
              borderColor: "primary.main",
              borderWidth: "1px",
              borderStyle: "solid",
            }}>
              <AddShoppingCart sx={{
                color: "primary.main",
                width: "30px",
                height: "30px",
              }} />
            </IconButton>
          </ListItem>
        </List>
      </Box>
    </Slide>
  );
};

const OrderItemPanel = ({ item, updateItem, deleteItem }) => {
  const [editing, setEditing] = useState(false);
  const [itemState, setItemState] = useState({ ...item });
  const { orderConstructor } = useContext(OrderContext);

  const handleEditConfirm = () => {
    setEditing(false)
    updateItem(itemState);
  }

  const handleCandidateSelectChange = (e) => {
    const selectedIds = e.target.value;
    setItemState({ ...itemState, candidateIds: selectedIds });
  }

  const handleMethodMetaChange = (e, paycheckId) => {
    if (itemState.method === "RATIO") {
      setItemState(prev => ({ ...prev, methodMeta: { ...prev.methodMeta, ratio: { ...prev.methodMeta.ratio, [paycheckId]: e.target.value } } }));
    }
    else if (itemState.method === "MANUAL") {
      setItemState(prev => ({ ...prev, methodMeta: { ...prev.methodMeta, manual: { ...prev.methodMeta.manual, [paycheckId]: e.target.value } } }));
    }
  }

  useEffect(() => {
    setItemState({ ...item });
  }, [item]);

  return (
    <Paper elevation={2} sx={{
      width: "100%",
      boxSizing: "border-box",
    }}>
      {/* {JSON.stringify(itemState)} */}
      <Box sx={{
        display: "flex",
        // alignItems: "center",
        height: "100%",
        width: "100%",
        boxSizing: "border-box",
      }}>
        {/* thumbnail */}
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt="Item"
            loading="lazy"
            width={SCALES.thumbnailSize}
            height={SCALES.thumbnailSize}
            sx={{
              width: SCALES.thumbnailSize,
              height: SCALES.thumbnailSize,
            }}
          />
        ) : (
          <Box sx={{ width: SCALES.thumbnailSize, height: SCALES.thumbnailSize, p: '1px' }}>
            <Skeleton variant="rectangular" width="100%" height="100%" animation={"wave"} sx={{ backgroundColor: 'primary.main', opacity: 0.7 }} />
          </Box>
        )}
        <Box sx={{
          width: "fit-content",
          display: "flex",
          flexDirection: "row",
        }}>
          {/* col 1: name, price, quantity, taxed */}
          {editing ? (
            <Grid container spacing={0} rowSpacing={1} columnSpacing={1} justifyContent="center" alignItems="flex-start" sx={{
              boxSizing: "border-box",
              m: 0,
              alignItems: "stretch",
              flexBasis: "50%",
            }}>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Name
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  variant="standard"
                  value={itemState.name}
                  onChange={(e) => setItemState(prev => ({ ...prev, name: e.target.value }))}
                  sx={{
                    boxSizing: "border-box",
                    width: "80%",
                  }}
                />
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Price
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  variant="standard"
                  value={itemState.price}
                  type="number"
                  onChange={(e) => setItemState(prev => ({ ...prev, price: e.target.value }))}
                  sx={{
                    boxSizing: "border-box",
                    width: "80%",
                  }}
                />
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Quantity
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <TextField
                  fullWidth
                  variant="standard"
                  value={itemState.quantity}
                  type="number"
                  onChange={(e) => setItemState(prev => ({ ...prev, quantity: e.target.value }))}
                  sx={{
                    boxSizing: "border-box",
                    width: "80%",
                  }}
                />
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Type
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Select
                  fullWidth
                  variant="standard"
                  value={itemState.type}
                  onChange={(e) => { setItemState(prev => ({ ...prev, type: e.target.value })) }}
                  sx={{
                    boxSizing: "border-box",
                    width: "80%",
                  }}
                >
                  <MenuItem value={"ITEM"}>General Item</MenuItem>
                  <MenuItem value={"TAX"}>Overall Tax</MenuItem>
                  <MenuItem value={"SERVICE_FEE"}>Service Fee</MenuItem>
                  <MenuItem value={"DELIVERY_FEE"}>Delivery Fee</MenuItem>
                </Select>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Method
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Select
                  fullWidth
                  variant="standard"
                  value={itemState.method}
                  onChange={(e) => { setItemState(prev => ({ ...prev, method: e.target.value })) }}
                  sx={{
                    boxSizing: "border-box",
                    width: "80%",
                  }}
                >
                  <MenuItem value={"EQUAL"}>Split Equally</MenuItem>
                  <MenuItem value={"RATIO"}>Split by Ratio</MenuItem>
                  <MenuItem value={"MANUAL"}>Custom Split</MenuItem>
                </Select>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Taxed?
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Switch
                  checked={itemState.taxed}
                  onChange={(e) => setItemState({ ...itemState, taxed: e.target.checked })}
                />
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={0} rowSpacing={1} columnSpacing={1} justifyContent="center" alignItems="flex-start" sx={{
              boxSizing: "border-box",
              m: 0,
              alignItems: "stretch",
              flexBasis: "50%",
            }}>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Name
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Typography variant="body1">
                  {itemState.name}
                </Typography>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Price
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Typography variant="body1">
                  {itemState.price}
                </Typography>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Quantity
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Typography variant="body1">
                  {itemState.quantity}
                </Typography>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Type
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Typography variant="body1">
                  {itemState.type === "ITEM" && "General Item"}
                  {itemState.type === "TAX" && "Overall Tax"}
                  {itemState.type === "SERVICE_FEE" && "Service Fee"}
                  {itemState.type === "DELIVERY_FEE" && "Delivery Fee"}
                </Typography>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Method
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Typography variant="body1">
                  {itemState.method === "EQUAL" && "Split Equally"}
                  {itemState.method === "RATIO" && "Split by Ratio"}
                  {itemState.method === "MANUAL" && "Custom Split"}
                </Typography>
              </Grid>
              <Grid xs={3} spacing={0} display="flex" alignItems="center">
                <Typography variant="h6">
                  Taxed?
                </Typography>
              </Grid>
              <Grid xs={9} spacing={0} display="flex" alignItems="center">
                <Switch
                  checked={itemState.taxed}
                  disabled={true}
                  onChange={(e) => setItemState({ ...itemState, taxed: e.target.checked })}
                />
              </Grid>
            </Grid>
          )}
          <Divider orientation="vertical" flexItem />
          {/* col 2: type, method, paychecks */}
          {editing ? (
            <Grid container spacing={0} rowSpacing={1} columnSpacing={1} sx={{
              boxSizing: "border-box",
              flexBasis: "45%",
              height: "fit-content",
              pl: "5px",
            }}>
              <Grid xs={4} spacing={0} display="flex" height="fit-content">
                <Typography variant="h6">
                  Candidates
                </Typography>
              </Grid>
              <Grid xs={8} spacing={0} height="fit-content">
                <Select
                  value={itemState.candidateIds}
                  variant="standard"
                  size="small"
                  multiple
                  fullWidth
                  onChange={handleCandidateSelectChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip size="small" key={value} label={orderConstructor.candidates.find((person) => person._id.toString() === value.toString()).name} />
                      ))}
                    </Box>
                  )}
                  sx={{
                    width: "80%",
                    pl: "10px",
                  }}
                >
                  {orderConstructor.candidates.map((person) => (
                    <MenuItem key={person._id} value={person._id}>{person.name}</MenuItem>
                  ))}
                </Select>
              </Grid>
              <Grid xs={4} spacing={0} display="flex" height="fit-content">
                <Typography variant="h6">
                  Settings
                </Typography>
              </Grid>
              {(itemState.method === "RATIO" || itemState.method === "MANUAL") && (
                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  flexBasis: "auto",
                  overflowX: "auto",
                  flexWrap: "nowrap",
                  p: "5px",
                }}>
                  {itemState.candidateIds.map((paycheckId, index) => (
                    <Fragment key={paycheckId}>
                      <InputBase
                        type="number"
                        key={paycheckId}
                        placeholder={orderConstructor.candidates.find((person) => person._id.toString() === paycheckId.toString()).name}
                        sx={{
                          width: "80px",
                          height: "30px",
                          borderColor: "primary.main",
                          borderWidth: "1px",
                          borderStyle: "solid",
                          borderRadius: "5px",
                        }}
                        defaultValue={itemState.method === "RATIO" ? itemState.methodMeta.ratio[paycheckId] : itemState.methodMeta.manual[paycheckId]}
                        inputProps={{
                          style: { textAlign: "center", borderRadius: "5px", margin: '0 3px 0 10px' }
                        }}
                        onChange={(e) => handleMethodMetaChange(e, paycheckId)}
                      />
                      {index !== itemState.candidateIds.length - 1 && (
                        <Typography variant="body1" sx={{ mx: "10px" }}>
                          {itemState.method === "RATIO" && ":"}
                          {itemState.method === "MANUAL" && "|"}
                        </Typography>
                      )}
                    </Fragment>
                  ))}
                </Box>
              )}
            </Grid>
          ) : (
            <Grid container spacing={0} rowSpacing={1} columnSpacing={1} justifyContent="flex-start" alignItems="flex-start" sx={{
              boxSizing: "border-box",
              flexBasis: "45%",
              height: "fit-content",
              pl: "5px",
            }}>
              <Grid xs={4} spacing={0} display="flex">
                <Typography variant="h6">
                  Candidates
                </Typography>
              </Grid>
              <Grid xs={8} spacing={0} display="flex">
                <Grid container spacing={0} wrap="wrap" rowSpacing={1} columnSpacing={1} sx={{
                  boxSizing: "border-box",
                  m: 0,
                  pl: "10px",
                }}>
                  {itemState.candidateIds.map((paycheckId) => (
                    <Grid spacing={0} xs={5} key={paycheckId}>
                      <Chip color="primary" size="small" label={orderConstructor.candidates.find((person) => person._id.toString() === paycheckId.toString()).name} />
                    </Grid>
                  ))}
                </Grid>
              </Grid>
              <Grid xs={4} spacing={0} display="flex" height="fit-content">
                <Typography variant="h6">
                  Summary
                </Typography>
              </Grid>
              <Box sx={{
                display: "flex",
                flexDirection: "row",
                flexBasis: "auto",
                overflowX: "auto",
                flexWrap: "nowrap",
                p: "5px",
              }}>
                <Box sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflowY: "auto",
                }}>
                  {calculatePaychecks(itemState, itemState.candidateIds).map((paycheck, index) => (
                    <Typography variant="body1" sx={{ my: "10px" }} key={index}>
                      {`${orderConstructor.candidates.find((person) => person._id.toString() === paycheck.candidate.toString()).name}: $${paycheck.shouldPay.toFixed(2)}`}
                    </Typography>
                  ))}
                </Box>
              </Box>
            </Grid>
          )}
          <Divider orientation="vertical" flexItem />
          {/* col 3: confirm and delete buttons */}
          <Grid container direction="column" rowSpacing={1} columnSpacing={1} justifyContent="stretch" alignItems="stretch" sx={{
            boxSizing: "border-box",
            m: 0,
            flexBasis: "auto",
          }}>
            <Grid xs={2} spacing={0} display="flex" alignItems="center">
              {editing ? (
                <IconButton onClick={handleEditConfirm}>
                  <DoneOutline sx={{ color: 'green' }} />
                </IconButton>
              ) : (
                <IconButton onClick={() => { setEditing(true) }}>
                  <Edit sx={{ color: 'primary.main' }} />
                </IconButton>
              )}
            </Grid>
            <Grid xs={2} spacing={0} display="flex" alignItems="center">
              <IconButton onClick={deleteItem}>
                <DeleteForever sx={{ color: 'red' }} />
              </IconButton>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Paper>
  )
};