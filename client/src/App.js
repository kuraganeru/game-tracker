import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';


import AddGame from "./components/AddGame"
import GameList from "./components/GameList"
import FilterGame from './components/FilterGame';
import GameListCollage from "./components/GameListCollage"

function App() {
  // game list state
  const [games, setGames] = useState([])

  // platform state - loads filter select on initial startup
  const [platforms, setPlatforms] = useState([])

  const [listView, setListView] = useState(false)

  const updateGamesList = () => {
    getData("games")
  }

  const switchListView = () => {
    setListView(!listView)
  }

  const getData = async (endpoint) => {
    try {
      const response = await fetch(`http://localhost:5000/${endpoint}`)
      const responseData = await response.json()
      if (endpoint === "games") {
        setGames(responseData)
      } else if (endpoint === "platforms") {
        setPlatforms([...new Map(responseData.map(v => [v.platform_id, v])).values()])
      }
    } catch (error) {
      console.error(error.message)
    }
  }

  useEffect(() => {
    // getGames()
    // getPlatforms()
    getData("games")
    getData("platforms")
  }, [])

  return (
    <div className="container">
      <button onClick={switchListView}>Switch List View</button>
      <AddGame updateGamesList={updateGamesList} />
      <FilterGame platforms={platforms} setGames={setGames} />
      {listView ?
        <GameList gamesData={games} updateGamesList={updateGamesList} listView={listView} /> :
        <GameListCollage gamesData={games} updateGamesList={updateGamesList} listView={listView} />
      }
    </div>
  );
}

export default App;
