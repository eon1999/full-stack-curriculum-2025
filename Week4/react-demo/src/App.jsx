import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Scoreboard from './components/Scoreboard.jsx'

function App() {

  return (
    <>
      <Scoreboard team1="Rockets" team2="Thunder" />
    </>
  );
}

export default App
