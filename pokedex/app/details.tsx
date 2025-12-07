
import {Image, Text, View , ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

interface Pokemon{
  name: string;
  url: string;
  imageFront: string;
  imageBack: string;
  types: PokemonType[];
}

interface PokemonType{
  type: {
    name: string;
    url: string;
  }
}


export default function Details() {

  
const param = useLocalSearchParams()
const [pokemons, setPokemons] = useState<Pokemon[]>([])
  useEffect (() =>
 {
   //fetch pokemons
  fetchPokemons()
 },[])

async function fetchPokemons (){
  try {
const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit={param}");
const data = await response.json();
const detailedPokemons = await Promise.all(
  data.results.map(async (pokemon:any) => {
    const res = await fetch(pokemon.url);
    const details = await res.json(); 
    return {
      name: pokemon.name,
      imageFront: details.sprites.front_default,
      imageBack: details.sprites.back_default,
      types: details.types,

    };
  })
)
console.log(detailedPokemons)
setPokemons(detailedPokemons);
  } catch(e){
console.log(e)
  }

} 



  return (
    <ScrollView contentContainerStyle={{padding: 16 , gap: 16}}>
    
<View >
        <Text >{pokemons.name}</Text>
        <Text >{pokemons.types[0].type.name}</Text>
     </View>
     
    
        </ScrollView>
  );
}

