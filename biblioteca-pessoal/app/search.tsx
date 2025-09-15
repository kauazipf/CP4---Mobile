// app/search.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { auth, db } from "./services/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";

const PAGE_SIZE = 10;

// Hook de debounce
function useDebouncedValue<T>(value: T, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

export default function SearchScreen() {
  const router = useRouter();
  const [queryText, setQueryText] = useState("");
  const search = useDebouncedValue(queryText, 350);

  const [genreFilter, setGenreFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [orderByField, setOrderByField] = useState<"createdAt" | "title">("createdAt");
  const [orderDirection, setOrderDirection] = useState<"asc" | "desc">("desc");

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const genres = ["Romance", "Ficção Científica", "Fantasia", "Biografia"];
  const statuses = ["Quero ler", "Lendo", "Lido"];

  const buildQuery = (startAfterDoc: QueryDocumentSnapshot<DocumentData> | null = null) => {
    const userId = auth.currentUser?.uid;
    if (!userId) return null;

    const booksRef = collection(db, "books");
    let q = query(booksRef, where("userId", "==", userId));

    if (genreFilter) q = query(q, where("genre", "==", genreFilter));
    if (statusFilter) q = query(q, where("status", "==", statusFilter));

    q = query(q, orderBy(orderByField, orderDirection));

    if (startAfterDoc) return query(q, startAfter(startAfterDoc), limit(PAGE_SIZE));
    return query(q, limit(PAGE_SIZE));
  };

  const fetchResults = useCallback(async () => {
    const q = buildQuery();
    if (!q) return;

    setLoading(true);
    try {
      const snap = await getDocs(q);

      const data: any[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((b) =>
        [b.title, b.author].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
      );

      setBooks(filtered);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Erro ao buscar livros:", err);
      Alert.alert("Erro", "Não foi possível carregar os livros.");
    } finally {
      setLoading(false);
    }
  }, [search, genreFilter, statusFilter, orderByField, orderDirection]);

  const fetchMore = useCallback(async () => {
    if (!hasMore || loadingMore || !lastDoc) return;

    const q = buildQuery(lastDoc);
    if (!q) return;

    setLoadingMore(true);
    try {
      const snap = await getDocs(q);

      const data: any[] = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const filtered = data.filter((b) =>
        [b.title, b.author].some((v) => v?.toLowerCase().includes(search.toLowerCase()))
      );

      setBooks((prev) => [...prev, ...filtered]);
      setLastDoc(snap.docs[snap.docs.length - 1] || null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } catch (err) {
      console.error("Erro ao carregar mais livros:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [search, genreFilter, statusFilter, orderByField, orderDirection, lastDoc, hasMore, loadingMore]);

  useEffect(() => {
    fetchResults();
  }, [fetchResults]);

  return (
    <View style={styles.container}>
      {/* Header com ícone de busca */}
      <View style={styles.header}>
        <Text style={styles.title}>🔍 Buscar Livros</Text>
      </View>

      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#b0b0ff" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Buscar por título ou autor..."
          placeholderTextColor="#b0b0ff"
          value={queryText}
          onChangeText={setQueryText}
        />
      </View>

      {/* Filtros de Gênero */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Gênero:</Text>
        <View style={styles.filterRow}>
          {genres.map((genre) => (
            <TouchableOpacity
              key={genre}
              style={[
                styles.filterButton,
                genreFilter === genre && styles.filterButtonActive,
              ]}
              onPress={() => setGenreFilter(genreFilter === genre ? null : genre)}
            >
              <Text
                style={[
                  styles.filterText,
                  genreFilter === genre && styles.filterTextActive,
                ]}
              >
                {genre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtros de Status */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Status:</Text>
        <View style={styles.filterRow}>
          {statuses.map((status) => (
            <TouchableOpacity
              key={status}
              style={[
                styles.filterButton,
                statusFilter === status && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(statusFilter === status ? null : status)}
            >
              <Text
                style={[
                  styles.filterText,
                  statusFilter === status && styles.filterTextActive,
                ]}
              >
                {status}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ordenação */}
      <View style={styles.filterSection}>
        <Text style={styles.filterTitle}>Ordenar por:</Text>
        <TouchableOpacity
          style={styles.sortButton}
          onPress={() => setOrderByField(orderByField === "title" ? "createdAt" : "title")}
        >
          <Text style={styles.sortText}>
            {orderByField === "title" ? "Título (A-Z)" : "Data (Mais recente)"}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.sortButton, { marginLeft: 8 }]}
          onPress={() => setOrderDirection(orderDirection === "asc" ? "desc" : "asc")}
        >
          <Text style={styles.sortText}>
            {orderDirection === "asc" ? "↑ Crescente" : "↓ Decrescente"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Resultados */}
      {loading && books.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#00d4ff" />
          <Text style={styles.loadingText}>Carregando livros...</Text>
        </View>
      ) : books.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="book-outline" size={48} color="#b0b0ff" />
          <Text style={styles.emptyText}>Nenhum livro encontrado.</Text>
          <Text style={styles.emptyHint}>Ajuste seus filtros ou adicione novos livros.</Text>
        </View>
      ) : (
        <FlatList
          data={books}
          keyExtractor={(item) => item.id}
          onEndReached={fetchMore}
          onEndReachedThreshold={0.5}
          renderItem={({ item }) => (
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
          )}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.loadingMoreContainer}>
                <ActivityIndicator size="small" color="#00d4ff" />
                <Text style={styles.loadingMoreText}>Carregando mais...</Text>
              </View>
            ) : null
          }
          contentContainerStyle={styles.list}
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
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
  },
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
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
  },
  filterSection: {
    marginBottom: 20,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  filterRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
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
  filterText: {
    color: "#b0b0ff",
    fontSize: 12,
  },
  filterTextActive: {
    color: "#ffffff",
    fontWeight: "600",
  },
  sortButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#4a4a8a",
    borderRadius: 8,
    marginRight: 8,
  },
  sortText: {
    color: "#00d4ff",
    fontWeight: "600",
    fontSize: 12,
  },
  list: {
    paddingBottom: 20,
  },
  bookCard: {
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
    position: "relative",
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
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
    marginTop: 4,
    color: "#b0b0ff",
  },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#00d4ff" },
  favoriteIcon: {
    position: "absolute",
    top: 8,
    right: 8,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 50,
  },
  loadingText: {
    color: "#b0b0ff",
    marginTop: 10,
    fontSize: 16,
  },
  loadingMoreContainer: {
    padding: 16,
    alignItems: "center",
  },
  loadingMoreText: {
    color: "#b0b0ff",
    marginTop: 8,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: "#b0b0ff",
    marginTop: 16,
    textAlign: "center",
  },
  emptyHint: {
    fontSize: 14,
    color: "#8888cc",
    marginTop: 8,
    textAlign: "center",
  },
});