import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 Minha Biblioteca</Text>
      <Text style={styles.subtitle}>Bem-vindo de volta! Continue sua leitura.</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/books/add")}>
          <Ionicons name="add-circle-outline" size={40} color="#6200ee" />
          <Text style={styles.cardText}>Adicionar Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/books")}>
          <Ionicons name="book-outline" size={40} color="#6200ee" />
          <Text style={styles.cardText}>Meus Livros</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/favorites")}>
          <Ionicons name="heart-outline" size={40} color="#e91e63" />
          <Text style={styles.cardText}>Favoritos</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/profile")}>
          <Ionicons name="person-outline" size={40} color="#4caf50" />
          <Text style={styles.cardText}>Meu Perfil</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>📊 Estatísticas</Text>
        <View style={styles.statsRow}>
          <Text style={styles.stat}>Livros: 12</Text>
          <Text style={styles.stat}>Lidos: 5</Text>
          <Text style={styles.stat}>Favoritos: 3</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f9f9f9" },
  title: { fontSize: 26, fontWeight: "bold", marginBottom: 5 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 20 },
  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  cardText: { marginTop: 10, fontSize: 14, fontWeight: "500" },
  statsContainer: { backgroundColor: "#fff", padding: 20, borderRadius: 12, elevation: 2 },
  statsTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  statsRow: { flexDirection: "row", justifyContent: "space-around" },
  stat: { fontSize: 16, fontWeight: "500", color: "#333" },
});
