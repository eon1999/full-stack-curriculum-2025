import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './context/ThemeContext';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';
import PokemonList from './components/PokemonList';

function App() {

  const {theme, toggleTheme} = useContext(ThemeContext)

  return (
    <ThemeProvider theme={theme}>
      <Appbar position="sticky">
        <Toolbar>
          <Typography variant="h6" sx={{flexGrow: 1}}>
            <Link>
              to="/"  
              style
            </Link>
          </Typography>
        </Toolbar>
      </Appbar>
      <Routes>
        <Route path="/" element = {<PokemonList/>} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;