import { Avatar, Box, Card, CardActions, CardHeader, IconButton, Paper, Typography, ListItemButton, Dialog, DialogTitle, List, ListItem, ListItemIcon, ListItemText, DialogContent, Menu, MenuItem, DialogContentText, TextField, DialogActions, Button } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { AlertManagerContext } from "../../components/AlertManager"
import { MoreVert, ChevronRight, CurrencyExchange, DeleteForever, AddCircleOutline } from "@mui/icons-material"
import { createPerson, fetchPeopleList } from "../../api/people"

const testPeople = [
  {
    _id: "1",
    name: "John Doe",
    email: "lol@qq.com",
    remainingPaychecks: [
      {
        candidate: {
          _id: "2",
          name: "Gareth Bale",
        },
        shouldPay: 256.32,
      },
      {
        candidate: {
          _id: "3",
          name: "Leon Be",
        },
        shouldPay: 14.5,
      }
    ],
    paymentRecords: [
      {
        to: {
          _id: "2",
          name: "Gareth Bale",
        },
        amount: 256.32,
        date: "2021-10-10",
      },
      {
        to: {
          _id: "3",
          name: "Gareth Bale",
        },
        amount: 256.32,
        date: "2021-10-10",
      },
      {
        to: {
          _id: "2",
          name: "Gareth Bale",
        },
        amount: 256.32,
        date: "2021-10-10",
      }
    ],
  },
  {
    _id: "2",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ],
    paymentRecords: []
  },
]
export const PeoplePage = () => {
  const { setAlert } = useContext(AlertManagerContext);
  const [paymentDialogInfo, setPaymentDialogInfo] = useState({
    open: false,
    person: null,
  });
  const [addPersonDialogInfo, setAddPersonDialogInfo] = useState({
    open: false,
    form: {
      name: "",
      email: "",
      avatar: "",
    }
  });
  const [people, setPeople] = useState([]);
  useEffect(() => {
    fetchPeopleList()
      .then((p) => setPeople(p))
      .catch((e) => {
        setAlert({ message: `Failed to load candidates. Please try again.`, type: "error", show: true });
        console.error(e);
      });
    // setPeople(testPeople);
  }, [])

  const handleAddPersonClick = () => { 
    setAddPersonDialogInfo({
      ...addPersonDialogInfo,
      open: true,
    })
  }

  const handleCreateNewUser = () => { 
    createPerson(addPersonDialogInfo.form)
      .then(res => {
        alert(JSON.stringify(res))
        setPeople([...people, res])
        setAddPersonDialogInfo({
          open: false,
          form: {
            name: "",
            email: "",
            avatar: "",
          }
        })
        setAlert({
          message: "Successfully created new candidate.",
          type: "success",
          show: true,
        })
      }).catch(e => { 
        setAlert({
          message: "Failed to create new candidate. Please try again.",
          type: "error",
          show: true,
        })
      })
  }

  return (
    <Paper elevation={0} sx={{
    }}>
      <Typography variant="h5" sx={{ p: "10px", boxSizing: 'border-box' }}>
        People
      </Typography>

      <Box sx={{
        // display: "flex",
        // flexWrap: "wrap",
        // alignItems: "center",
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill,minmax(250px, 1fr))',
        p: "10px",
        boxSizing: 'border-box'
      }}>
        {people.length === 0 && (
          <Typography variant="body1" sx={{ p: "10px", boxSizing: 'border-box' }}>
            No people found.
          </Typography>
        )}
        {people.map((person) => (
          <PersonCard key={person._id} person={person} setDlg={setPaymentDialogInfo} />
        ))}
        <Box sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          pb: '25px',
          boxSizing: 'border-box'
        }}>
          <IconButton sx={{ width: "50px", height: "50px" }} onClick={handleAddPersonClick}>
            <AddCircleOutline sx={{ width: "50px", height: "50px", color: 'primary.main' }} />
          </IconButton>
        </Box>
      </Box>
      {paymentDialogInfo?.person && (
        <Dialog open={paymentDialogInfo.open} onClose={() => setPaymentDialogInfo({ open: false, person: null })}>
          <DialogTitle>
            Payment Records for {paymentDialogInfo.person.name}
          </DialogTitle>
          <DialogContent>
            {paymentDialogInfo.person.paymentRecords.length === 0 && (
              <DialogContentText>
                No payment records found.
              </DialogContentText>
            )}
            <List sx={{maxHeight: '200px', overflowY: 'auto'}}>
              {paymentDialogInfo.person.paymentRecords.map((record, index) => (
                <ListItem key={index}>
                  <ListItemIcon>
                    <CurrencyExchange />
                  </ListItemIcon>
                  <ListItemText primary={`To ${record.to.name}: ${record.amount}`} secondary={record.date} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={addPersonDialogInfo.open} onClose={() => setAddPersonDialogInfo({ ...addPersonDialogInfo, open: false })}>
        <DialogTitle>
          Add New Candidate
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Please enter the candidate's Info.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            fullWidth
            variant="standard"
            label="Full Name"
            value={addPersonDialogInfo.form.name}
            onChange={(e) => setAddPersonDialogInfo({...addPersonDialogInfo, form: {...addPersonDialogInfo.form, name: e.target.value}})}
          />
          <TextField
            margin="dense"
            fullWidth
            variant="standard"
            label="Email"
            value={addPersonDialogInfo.form.email}
            onChange={(e) => setAddPersonDialogInfo({...addPersonDialogInfo, form: {...addPersonDialogInfo.form, email: e.target.value}})}
          />
          <TextField
            margin="dense"
            fullWidth
            variant="standard"
            label="(Optoinal)Avatar URL"
            value={addPersonDialogInfo.form.avatar}
            onChange={(e) => setAddPersonDialogInfo({...addPersonDialogInfo, form: {...addPersonDialogInfo.form, avatar: e.target.value}})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddPersonDialogInfo({open: false,form: {name: "",email: "",avatar: ""}})}>Cancel</Button>
          <Button onClick={handleCreateNewUser}>Create</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  )
}

const PersonCard = ({ person, setDlg }) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);

  const handlePyamentRecordsClick = () => {
    setDlg({
      open: true,
      person: person,
    })
  }
  return (
    <Card sx={{ minWidth: "250px", mb: '25px', mr: '10px' }}>
      <CardHeader
        avatar={<Avatar sx={{ backgroundColor: '#1976d2' }}>{person.name[0].toUpperCase()}</Avatar>}
        title={person.name}
        subheader={person.email}
        action={
          <IconButton aria-label="settings" onClick={e => setMenuAnchorEl(e.currentTarget)}>
            <MoreVert />
          </IconButton>
        }
      />
      <Menu
        anchorEl={menuAnchorEl}
        open={Boolean(menuAnchorEl)}
        onClose={() => setMenuAnchorEl(null)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        keepMounted
        transformOrigin={{vertical: 'top', horizontal: 'right'}}
      >
        <MenuItem>
          <ListItemIcon>
            <DeleteForever />
          </ListItemIcon>
          <ListItemText onClick={() => {alert("delete")}}>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <CardActions>
        <ListItemButton
          onClick={handlePyamentRecordsClick}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Payment Records:
          </Typography>
          <ChevronRight />
        </ListItemButton>
      </CardActions>
    </Card>
  )
}