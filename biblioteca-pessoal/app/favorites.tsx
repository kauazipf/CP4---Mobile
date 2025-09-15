// app/favorites.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { auth } from "./services/firebaseConfig"; // ← Corrigi o caminho: era "./services" e deve ser "../services"
import { collection, query, where, onSnapshot, orderBy, updateDoc, doc } from "firebase/firestore";
import { db } from "./services/firebaseConfig";

export default function FavoritesScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Configura header com ícone de busca
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

  // ✅ Busca livros favoritos em tempo real
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

  // ✅ Toggle de favoritos
  const toggleFavorite = async (bookId: string, currentFavorite: boolean) => {
    try {
      const bookRef = doc(db, "books", bookId);
      await updateDoc(bookRef, {
        favorite: !currentFavorite,
      });
      // ← O onSnapshot atualiza automaticamente a lista
    } catch (error) {
      console.error("Erro ao atualizar favorito:", error);
    }
  };

  const renderBook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(`/books/${item.id}`)}
    >
      <View style={styles.bookHeader}>
        <Text style={styles.bookTitle} numberOfLines={1} ellipsizeMode="tail">
          {item.title}
        </Text>
        <TouchableOpacity
          onPress={() => toggleFavorite(item.id, item.favorite)}
          style={styles.favoriteButton}
          accessibilityLabel={item.favorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
        >
          <Ionicons
            name={item.favorite ? "star" : "star-outline"}
            size={24}
            color={item.favorite ? "#e91e63" : "#b0b0ff"}
          />
        </TouchableOpacity>
      </View>
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
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Carregando seus favoritos...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Meus Favoritos</Text>

      {books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="heart-outline" size={64} color="#b0b0ff" />
          <Text style={styles.emptyText}>Você ainda não tem livros favoritos.</Text>
          <Text style={styles.hintText}>
            Toque no ícone de coração 🌟 nos detalhes do livro para favoritar!
          </Text>
        </View>
      ) : (
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 20,
  },
  list: {
    paddingBottom: 20,
  },
  bookCard: {
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  bookHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
    flex: 1,
    marginRight: 12,
  },
  favoriteButton: {
    padding: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: "#b0b0ff",
    marginTop: 4,
  },
  bookGenre: {
    fontSize: 12,
    color: "#8888cc",
    marginTop: 4,
  },
  bookStatus: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 8,
    color: "#b0b0ff",
  },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#00d4ff" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#b0b0ff",
    textAlign: "center",
    marginTop: 16,
    fontWeight: "600",
  },
  hintText: {
    fontSize: 14,
    color: "#8888cc",
    textAlign: "center",
    marginTop: 12,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0f0f1a",
  },
  loadingText: {
    color: "#b0b0ff",
    marginTop: 16,
    fontSize: 16,
  },
});