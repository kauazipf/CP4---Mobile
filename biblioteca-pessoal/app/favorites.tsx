// app/favorites.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./services/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "./services/firebaseConfig";

export default function FavoritesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Configura header
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => router.push("/search")}
          style={{ marginRight: 16 }}
          accessibilityLabel="Buscar livros"
        >
          <Ionicons name="search-outline" size={24} color="#6200ee" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  // ✅ Busca livros favoritos do usuário
  useEffect(() => {
    if (!user) return;

    setLoading(true);

    const booksRef = collection(db, "books");
    const q = query(
      booksRef,
      where("userId", "==", user.uid),
      where("favorite", "==", true),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const booksData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBooks(booksData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  const renderBook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(`/books/${item.id}`)}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>por {item.author}</Text>
      <Text style={styles.bookGenre}>{item.genre}</Text>
      <Text style={[
        styles.bookStatus,
        item.status === "Lido" && styles.statusLido,
        item.status === "Lendo" && styles.statusLendo,
        item.status === "Quero ler" && styles.statusQueroLer,
      ]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Meus Favoritos</Text>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem livros favoritos.</Text>
          <Text style={styles.hintText}>Toque no ícone de coração nos detalhes do livro para favoritar!</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", padding: 20, color: "#333" },
  list: { padding: 20 },
  bookCard: {
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#eee",
  },
  bookTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  bookAuthor: { fontSize: 14, color: "#666", marginTop: 4 },
  bookGenre: { fontSize: 12, color: "#888", marginTop: 4 },
  bookStatus: { fontSize: 12, fontWeight: "500", marginTop: 4 },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#6200ee" },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 18, color: "#999", textAlign: "center" },
  hintText: { fontSize: 14, color: "#666", textAlign: "center", marginTop: 10, paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});