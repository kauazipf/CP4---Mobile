// app/index.tsx
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./services/firebaseConfig";

export default function HomeScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/search")}
          style={{ marginRight: 16 }}
          accessibilityLabel="Buscar livros"
        >
          <Ionicons name="search-outline" size={24} color="#00d4ff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const booksRef = collection(db, "books");
    const q = query(booksRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0, read = 0, favorites = 0;
      snapshot.forEach((doc) => {
        const book = doc.data();
        total++;
        if (book.status === "Lido") read++;
        if (book.favorite) favorites++;
      });
      setStats({ total, read, favorites });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>📚 Minha Biblioteca</Text>
      <Text style={styles.subtitle}>Bem-vindo de volta! Continue sua leitura.</Text>

      <View style={styles.row}>
        <TouchableOpacity style={styles.card} onPress={() => router.push("/books/add")}>
          <Ionicons name="add-circle-outline" size={40} color="#00d4ff" />
          <Text style={styles.cardText}>Adicionar Livro</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={() => router.push("/books")}>
          <Ionicons name="book-outline" size={40} color="#00d4ff" />
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
        {loading ? (
          <ActivityIndicator size="small" color="#00d4ff" />
        ) : (
          <View style={styles.statsRow}>
            <Text style={styles.stat}>Livros: {stats.total}</Text>
            <Text style={styles.stat}>Lidos: {stats.read}</Text>
            <Text style={styles.stat}>Favoritos: {stats.favorites}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#0f0f1a",
    flexGrow: 1,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
    color: "#ffffff",
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b0ff",
    marginBottom: 20,
    textAlign: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    top: 160,
  },
  card: {
    flex: 1,
    backgroundColor: "#1a1a2e",
    marginHorizontal: 5,
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  cardText: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: "500",
    color: "#ffffff",
    textAlign: "center",
  },
  statsContainer: {
    backgroundColor: "#1a1a2e",
    top: 330,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#ffffff",
    textAlign: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    fontSize: 16,
    fontWeight: "500",
    color: "#00d4ff",
  },
});