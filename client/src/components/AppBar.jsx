import { AppBar, Box, Button, Typography } from "@mui/material"
import { Outlet, useNavigate } from "react-router-dom"

export const TopAppBarContainer = () => { 
  const navigate = useNavigate();

  const handleNavigation = (route) => { 
    if (route.params) {
      navigate(route.path, {state: route.params});
      return;
    }
    else {
      navigate(route.path);
      return;
    }
  }

  const routes = [
    {
      path: '/',
      name: 'Home',
    },
    {
      path: '/create',
      name: 'Create',
    },
    {
      path: '/people',
      name: 'People',
    },
  ]

  return (
    <Box sx={{
      width: "100vw",
      height: "100vh",
    }}>
      <AppBar position="static" sx={{ flexDirection: "row", p: '5px 0 5px 0'}}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: '10px' }}>
          Account On Me!
        </Typography>
        {routes.map((route) => (
          <Typography
            key={route.name}
            onClick={() => handleNavigation(route)}
            sx={{
              color: "white",
              cursor: "pointer",
              padding: "5px 10px 5px 10px",
            }}
          >
            {route.name}
          </Typography>
        ))}
      </AppBar>

      <Outlet />
    </Box>
  )
}