import { Image, Text, View, ScrollView } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";

interface PokemonType {
  type: { name: string };
}

interface PokemonDetails {
  name: string;
  imageFront: string;
  imageBack: string;
  types: PokemonType[];
  height: number;
  weight: number;
  abilities: { ability: { name: string } }[];
  base_experience: number;
  stats: { base_stat: number; stat: { name: string } }[];
}

const typeColors: any = {
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
};

export default function Details() {
  const { name } = useLocalSearchParams(); 
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);

  useEffect(() => {
    fetchPokemon();
  }, []);

  async function fetchPokemon() {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      const data = await response.json();

      const detailedPokemon: PokemonDetails = {
        name: data.name,
        imageFront: data.sprites.front_default,
        imageBack: data.sprites.back_default,
        types: data.types,
        height: data.height,
        weight: data.weight,
        abilities: data.abilities,
        base_experience: data.base_experience,
        stats: data.stats,
      };

      setPokemon(detailedPokemon);
    } catch (error) {
      console.log(error);
    }
  }

  if (!pokemon) return <Text>Loading...</Text>;

  const mainType = pokemon.types[0].type.name;
  const bgColor = typeColors[mainType];

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ backgroundColor: bgColor, padding: 20, borderRadius: 15 }}>
        <Text style={{ fontSize: 32, fontWeight: "bold", textTransform: "capitalize", color: "white", textAlign: "center" }}>
          {pokemon.name}
        </Text>

        <View style={{ flexDirection: "row", justifyContent: "center", marginVertical: 20 }}>
          <Image source={{ uri: pokemon.imageFront }} style={{ width: 150, height: 150 }} />
          <Image source={{ uri: pokemon.imageBack }} style={{ width: 150, height: 150 }} />
        </View>

        <Text style={{ fontSize: 22, color: "white", fontWeight: "bold" }}>Types:</Text>

        <View style={{ flexDirection: "row", gap: 10, marginVertical: 8 }}>
          {pokemon.types.map((t, index) => (
            <Text
              key={index}
              style={{
                backgroundColor: "#ffffff55",
                color: "white",
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
                fontSize: 18,
                textTransform: "capitalize",
              }}
            >
              {t.type.name}
            </Text>
          ))}
        </View>
      </View>

      {/* ABOUT SECTION */}
      <View style={{ marginTop: 20, backgroundColor:"white", borderRadius:20, padding: 16  }} >
        <Text style={{ fontSize: 26, fontWeight: "bold",  textDecorationLine: "underline" }}>About</Text>

        <Text style={{ fontSize: 18 }}>Height: {pokemon.height}</Text>
        <Text style={{ fontSize: 18 }}>Weight: {pokemon.weight}</Text>
        <Text style={{ fontSize: 18 }}>Base Experience: {pokemon.base_experience}</Text>

        <Text style={{ fontSize: 20, marginTop: 10, fontWeight: "bold" ,  textDecorationLine: "underline"}}>Abilities:</Text>
        {pokemon.abilities.map((a, index) => (
          <Text key={index} style={{ fontSize: 18, textTransform: "capitalize" }}>
            • {a.ability.name}
          </Text>
        ))}
      </View>

      {/* stats section */}
      <View style={{ marginTop: 20, backgroundColor:"white", borderRadius:20, padding: 16  }} >
        <Text style={{ fontSize: 26, fontWeight: "bold" , textDecorationLine: "underline" }}>Stats</Text>

        {pokemon.stats.map((s, index) => (
          <View key={index} style={{ marginVertical: 6 }}>
            <Text style={{ fontSize: 18, textTransform: "capitalize" }}>
              {s.stat.name}: <Text style={{ fontWeight: "bold" }}>{s.base_stat}</Text>
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
