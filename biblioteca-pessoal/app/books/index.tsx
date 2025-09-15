// app/books/index.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";

// Mock data — substitua por dados do Firestore depois
const mockBooks = [
  { id: "1", title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance", status: "Lido" },
  { id: "2", title: "1984", author: "George Orwell", genre: "Ficção Científica", status: "Lendo" },
];

export default function BookListScreen() {
  const router = useRouter();
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simular refresh
    setTimeout(() => setRefreshing(false), 1000);
  };

  const renderBook = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.bookCard}
      onPress={() => router.push(`/books/${item.id}`)}
    >
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>por {item.author}</Text>
      <Text style={styles.bookGenre}>{item.genre}</Text>
      <Text style={styles.bookStatus}>{item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meus Livros</Text>
        <TouchableOpacity onPress={() => router.push("/books/add")}>
          <Text style={styles.addButton}>+ Adicionar</Text>
        </TouchableOpacity>
      </View>

      {mockBooks.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Nenhum livro cadastrado.</Text>
          <TouchableOpacity onPress={() => router.push("/books/add")}>
            <Text style={styles.addText}>Adicionar seu primeiro livro</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={mockBooks}
          renderItem={renderBook}
          keyExtractor={(item) => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  addButton: { fontSize: 18, color: "#6200ee", fontWeight: "600" },
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
  bookStatus: { fontSize: 12, color: "#00aaff", fontWeight: "500", marginTop: 4 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#999", textAlign: "center" },
  addText: { fontSize: 16, color: "#6200ee", fontWeight: "600", marginTop: 10 },
});