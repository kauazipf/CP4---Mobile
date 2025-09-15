// app/books/index.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./../services/firebaseConfig";
import { collection, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "./../services/firebaseConfig";

export default function BookListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [books, setBooks] = useState<any[]>([]);
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
    const q = query(booksRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"));

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
      {item.favorite && (
        <Ionicons name="star" size={16} color="#e91e63" style={styles.favoriteIcon} />
      )}
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Livros</Text>
        <TouchableOpacity onPress={() => router.push("/books/add")}>
          <Text style={styles.addButton}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum livro cadastrado.</Text>
          <TouchableOpacity onPress={() => router.push("/books/add")}>
            <Text style={styles.addText}>Adicionar seu primeiro livro</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl refreshing={false} onRefresh={() => {}} />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#4a4a8a",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#ffffff" },
  addButton: { fontSize: 18, color: "#00d4ff", fontWeight: "600" },
  list: { padding: 20 },
  bookCard: {
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
    position: "relative",
  },
  bookTitle: { fontSize: 18, fontWeight: "bold", color: "#ffffff" },
  bookAuthor: { fontSize: 14, color: "#b0b0ff", marginTop: 4 },
  bookGenre: { fontSize: 12, color: "#8888cc", marginTop: 4 },
  bookStatus: { fontSize: 12, fontWeight: "500", marginTop: 4, color: "#b0b0ff" },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#00d4ff" },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#b0b0ff", textAlign: "center" },
  addText: { fontSize: 16, color: "#00d4ff", fontWeight: "600", marginTop: 10 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
  },
});