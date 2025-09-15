// app/search.tsx
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  // Mock data — substitua por consulta ao Firestore
  const allBooks = [
    { id: "1", title: "Dom Casmurro", author: "Machado de Assis", genre: "Romance", status: "Lido" },
    { id: "2", title: "1984", author: "George Orwell", genre: "Ficção Científica", status: "Lendo" },
  ];

  const filteredBooks = allBooks.filter(book => {
    const matchesQuery = book.title.toLowerCase().includes(query.toLowerCase()) ||
                         book.author.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = !genreFilter || book.genre === genreFilter;
    const matchesStatus = !statusFilter || book.status === statusFilter;
    return matchesQuery && matchesGenre && matchesStatus;
  });

  const genres = ["Romance", "Ficção Científica", "Fantasia", "Biografia"];
  const statuses = ["Quero ler", "Lendo", "Lido"];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Buscar Livros</Text>

      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#b0b0ff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou autor..."
          placeholderTextColor="#b0b0ff"
          value={query}
          onChangeText={setQuery}
        />
      </View>

      <Text style={styles.filterTitle}>Filtrar por Gênero:</Text>
      <View style={styles.filterContainer}>
        {genres.map(genre => (
          <TouchableOpacity
            key={genre}
            style={[
              styles.filterButton,
              genreFilter === genre && styles.filterButtonActive,
            ]}
            onPress={() => setGenreFilter(genreFilter === genre ? null : genre)}
          >
            <Text style={[
              styles.filterText,
              genreFilter === genre && styles.filterTextActive,
            ]}>
              {genre}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.filterTitle}>Filtrar por Status:</Text>
      <View style={styles.filterContainer}>
        {statuses.map(status => (
          <TouchableOpacity
            key={status}
            style={[
              styles.filterButton,
              statusFilter === status && styles.filterButtonActive,
            ]}
            onPress={() => setStatusFilter(statusFilter === status ? null : status)}
          >
            <Text style={[
              styles.filterText,
              statusFilter === status && styles.filterTextActive,
            ]}>
              {status}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.resultsTitle}>Resultados ({filteredBooks.length})</Text>
      <FlatList
        data={filteredBooks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.resultCard}>
            <Text style={styles.resultTitle}>{item.title}</Text>
            <Text style={styles.resultAuthor}>por {item.author}</Text>
            <Text style={styles.resultGenre}>{item.genre}</Text>
            <Text style={styles.resultStatus}>{item.status}</Text>
          </View>
        )}
        contentContainerStyle={styles.resultsList}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f0f1a" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, color: "#ffffff" },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#4a4a8a",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 20,
    height: 56,
  },
  searchIcon: { marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#ffffff" },
  filterTitle: { fontSize: 16, fontWeight: "600", marginVertical: 10, color: "#ffffff" },
  filterContainer: { flexDirection: "row", flexWrap: "wrap", marginBottom: 20 },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#4a4a8a",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  filterButtonActive: {
    backgroundColor: "#6a5af9",
    borderColor: "#6a5af9",
  },
  filterText: { color: "#b0b0ff" },
  filterTextActive: { color: "#ffffff", fontWeight: "600" },
  resultsTitle: { fontSize: 18, fontWeight: "600", marginVertical: 10, color: "#ffffff" },
  resultsList: { paddingBottom: 20 },
  resultCard: {
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  resultTitle: { fontSize: 16, fontWeight: "bold", color: "#ffffff" },
  resultAuthor: { fontSize: 14, color: "#b0b0ff" },
  resultGenre: { fontSize: 12, color: "#8888cc" },
  resultStatus: { fontSize: 12, color: "#00d4ff", fontWeight: "500" },
  emptyText: { textAlign: "center", color: "#b0b0ff", marginTop: 20 },
});