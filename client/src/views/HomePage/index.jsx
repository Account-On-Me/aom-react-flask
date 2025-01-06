import { Avatar, Badge, Box, Button, Card, CardActions, CardContent, CardHeader, Collapse, IconButton, List, ListItem, Paper, Typography } from "@mui/material"
import { Fragment, useContext, useEffect, useState } from "react"
import { AlertManagerContext } from "../../components/AlertManager"
import { claimPaycheck, fetchPeopleList } from "../../api/people"
import { ThinScrollBarCSS } from "../../css/themes"
import {
  ExpandMore as ExpandMoreIcon,
  Payment,
  Check
} from "@mui/icons-material"

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
    ]
  },
  {
    _id: "2",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  },
  {
    _id: "3",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  },
  {
    _id: "4",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  },
  {
    _id: "5",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  },
  {
    _id: "6",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  },
  {
    _id: "7",
    name: "Gareth Bale",
    email: "lol2@qq.com",
    remainingPaychecks: [
    ]
  }
]

export const HomePage = () => {
  return (
    <Paper elevation={0} sx={{
      padding: "15px 5px 15px 5px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
    }}>
      <PeopleOverview />
    </Paper>
  )
}

const PeopleOverview = () => {
  const { setAlert } = useContext(AlertManagerContext);
  const [people, setPeople] = useState([]);
  useEffect(() => {
    fetchPeopleList()
      .then((p) => setPeople(p))
      .catch((e) => {
        setAlert({ message: `Failed to load candidates. Please try again.`, type: "error", show: true });
        console.error(e);
      });
    // setPeople(testPeople)
  }, []);

  const PersonCard = ({ person }) => {
    const [expanded, setExpanded] = useState(false);
    const handleClaimPaycheck = (targetId) => { 
      claimPaycheck(person._id, targetId)
        .then((res) => {
          setAlert({ message: `Paycheck claimed successfully!`, type: "success", show: true });
          setPeople(people.map((p) => p._id === person._id ? res : p))
        }).catch((e) => { 
          setAlert({ message: `Failed to claim paycheck. Please try again.`, type: "error", show: true });
          console.error(e);
        });
    }

    const PaycheckList = ({ paychecks }) => {

      return (
        <List>
          {paychecks.map((paycheck, index) => (
            <ListItem key={index} sx={{
              p: '8px 0 8px 0',
              width: '100%',
              border: '1px solid #bdbdbd78',
              borderRadius: '5px',
              boxSizing: 'border-box',
            }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                width: '100%',
                boxSizing: 'border-box',
              }}>
                <Box sx={{
                  width: '100%',
                  boxSizing: 'border-box',
                }}>
                  <CardHeader
                    avatar={<Avatar sx={{ width: '30px', height: '30px' }}>{paycheck.candidate.name[0].toUpperCase()}</Avatar>}
                    title={paycheck.candidate.name}
                    sx={{
                      p: '8px',
                      boxSizing: 'border-box',
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  />
                </Box>


                <Box sx={{
                  display: "flex",
                  flexDirection: "row",
                  boxSizing: 'border-box',
                  width: '100%',
                  justifyContent: "space-between",
                  p: '0 10px 0 10px',
                }}>
                  <Typography variant="body2" color="text.secondary" sx={{
                    display: "flex",
                    alignItems: "center",
                  }}>
                    {`Should Pay ${paycheck.candidate.name.split(' ')[0]}: $${paycheck.shouldPay}`}
                  </Typography>
                  <IconButton onClick={() => handleClaimPaycheck(paycheck.candidate._id)}>
                    <Check sx={{ color: 'green' }} />
                  </IconButton>
                </Box>
              </Box>
            </ListItem>
          ))}
        </List>
      )
    }

    return (
      <Card sx={{ padding: "10px", margin: "10px", minWidth: '265px', height: 'fit-content' }}>
        <CardHeader
          avatar={<Avatar sx={{ backgroundColor: 'primary.main' }}>{person.name[0].toUpperCase()}</Avatar>}
          title={person.name}
          sx={{
            p: '8px',
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
          }}
          action={
            <Badge
              color="primary"
              badgeContent={person.remainingPaychecks.length}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
            >
              <Payment />
            </Badge>
          }
        />
        <CardActions sx={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          p: '6px'
        }}>
          <IconButton
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label="show more"
            sx={{ p: 0 }}
          >
            <ExpandMoreIcon
              sx={{
                transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.13s",
              }}
            />
          </IconButton>
        </CardActions>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent sx={{
            p: '6px 0 6px 0'
          }}>
            <PaycheckList paychecks={person.remainingPaychecks} />
          </CardContent>
        </Collapse>
      </Card>
    )
  }

  return (
    <Fragment>
      <Typography variant="h5" sx={{ p: "10px" }}>
        Candidates Overview
      </Typography>
      <Box sx={{
        display: "flex",
        flexDirection: "row",
        // overflowX: "auto",
        // ...ThinScrollBarCSS,
        flexWrap: "wrap",
      }}>
        {!people.length && <Box sx={{ textAlign: "center", p: '15px' }}>No candidates found.</Box>}
        {people.map((p) => (
          <PersonCard person={p} key={p._id} />
        ))}
      </Box>
    </Fragment>

  )
}