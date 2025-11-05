import React, { useEffect, useState } from "react";
import axios from "axios";
import { Grid } from "@mui/material";
import PokemonCard from "./PokemonCard";

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);

  function fetchPokemon() {
    axios.get("https://pokeapi.co/api/v2/pokemon?limit=800")
      .then((response) => {setPokemons(response.data.results)});
  }

  useEffect(() => {
    fetchPokemon();
  }, [])

  return (
    <Grid container justifyContent="center">
      {pokemons.map((pokemon, index) => (
        <PokemonCard key={pokemon.name} pokemon={pokemon} index={index+1} />))}
    </Grid>
  );
}

export default PokemonList;