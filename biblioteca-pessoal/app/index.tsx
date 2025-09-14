import { View, Text, Button } from "react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text style={{ fontSize: 20, marginBottom: 20 }}>📚 Minha Biblioteca</Text>
      <Button title="Meus Livros" onPress={() => router.push("/books")} />
      <Button title="Favoritos" onPress={() => router.push("/favorites")} />
      <Button title="Perfil" onPress={() => router.push("/profile")} />
    </View>
  );
}
