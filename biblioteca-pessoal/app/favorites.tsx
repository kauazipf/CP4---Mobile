// app/favorites.tsx
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";

// Mock data — substitua por livros favoritos do Firestore
const mockFavorites = [
  { id: "1", title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance" },
  { id: "3", title: "O Pequeno Príncipe", author: "Antoine de Saint-Exupéry", genre: "Fábula" },
];

export default function FavoritesScreen() {
  const renderFavorite = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.bookCard}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>por {item.author}</Text>
      <Text style={styles.bookGenre}>{item.genre}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌟 Meus Favoritos</Text>

      {mockFavorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>Você ainda não tem livros favoritos.</Text>
          <Text style={styles.hintText}>Toque no ícone de coração nos detalhes do livro para favoritar!</Text>
        </View>
      ) : (
        <FlatList
          data={mockFavorites}
          renderItem={renderFavorite}
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
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 18, color: "#999", textAlign: "center" },
  hintText: { fontSize: 14, color: "#666", textAlign: "center", marginTop: 10, paddingHorizontal: 20 },
});