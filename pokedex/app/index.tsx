import {Image, Text, View , ScrollView, StyleSheet, Pressable } from "react-native";
import { useEffect, useState } from "react";
import { Link } from "expo-router";

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

const colorsByType = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
}

export default function Index() {
 const [pokemons, setPokemons] = useState<Pokemon[]>([])
  useEffect (() =>
 {
   //fetch pokemons
  fetchPokemons()
 },[])

async function fetchPokemons (){
  try {
const response = await fetch("https://pokeapi.co/api/v2/pokemon/?limit=20");
const data = await response.json();
console.log(data)
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
      {pokemons.map((pokemon) => (
        <Link key={pokemon.name} href={{ pathname: "/details/[name]", params: { name: pokemon.name } }} style={{ // @ts-ignore 
           backgroundColor: colorsByType[pokemon.types[0].type.name] + 30, padding: 20, borderRadius: 20 , textAlign:"center"}}>
        <View>
          <Text style={styles.name}>{pokemon.name}</Text>
          <Text style={styles.type}>{pokemon.types[0].type.name}</Text>
          
          
          <View style={{flexDirection:"row" , gap: 48}}>
            <Image source={{uri: pokemon.imageFront}} style={{width: 100 , height: 150}}/>
            <Image source={{uri: pokemon.imageBack}} style={{width: 100 , height: 150}}/>
          </View>
          
        </View>
        </Link>
      ))}  
        </ScrollView>
  );
}

const styles = StyleSheet.create({
  name: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },
  type: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  }
})
