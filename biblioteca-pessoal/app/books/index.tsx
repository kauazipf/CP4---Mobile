// app/books/index.tsx
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { auth, db } from "../services/firebaseConfig";
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  getDocs,
  startAfter,
  DocumentData,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import { Book } from "../types";

const PAGE_SIZE = 10;

export default function BookListScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => router.push("/search")} style={{ marginRight: 16 }}>
          <Ionicons name="search-outline" size={24} color="#00d4ff" />
        </TouchableOpacity>
      ),
    });
  }, [navigation, router]);

  const fetchInitial = useCallback(() => {
    if (!user) return;
    setLoading(true);
    const booksRef = collection(db, "books");
    const q = query(booksRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(PAGE_SIZE));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })) as Book[];
      setBooks(data);
      setLastDoc(snapshot.docs[snapshot.docs.length - 1] ?? null);
      setHasMore(snapshot.docs.length === PAGE_SIZE);
      setLoading(false);
    });

    return unsubscribe;
  }, [user]);

  useEffect(() => {
    const unsub = fetchInitial();
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [fetchInitial]);

  const handleRefresh = async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const booksRef = collection(db, "books");
      const q = query(booksRef, where("userId", "==", user.uid), orderBy("createdAt", "desc"), limit(PAGE_SIZE));
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Book[];
      setBooks(data);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? null);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } finally {
      setRefreshing(false);
    }
  };

  const loadMore = async () => {
    if (!user || loadingMore || !hasMore || !lastDoc) return;
    setLoadingMore(true);
    try {
      const booksRef = collection(db, "books");
      const q = query(
        booksRef,
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const snap = await getDocs(q);
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() })) as Book[];
      setBooks((prev) => [...prev, ...data]);
      setLastDoc(snap.docs[snap.docs.length - 1] ?? lastDoc);
      setHasMore(snap.docs.length === PAGE_SIZE);
    } finally {
      setLoadingMore(false);
    }
  };

  const renderBook = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.bookCard} onPress={() => router.push(`/books/${item.id}`)}>
      <Text style={styles.bookTitle}>{item.title}</Text>
      <Text style={styles.bookAuthor}>por {item.author}</Text>
      <Text style={styles.bookGenre}>{item.genre}</Text>
      <Text
        style={[
          styles.bookStatus,
          item.status === "Lido" && styles.statusLido,
          item.status === "Lendo" && styles.statusLendo,
          item.status === "Quero ler" && styles.statusQueroLer,
        ]}
      >
        {item.status}
      </Text>
      {item.favorite && <Ionicons name="star" size={16} color="#e91e63" style={styles.favoriteIcon} />}
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
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={loadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#00d4ff" /> : null}
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
  favoriteIcon: { position: "absolute", top: 8, right: 8 },
  emptyContainer: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  emptyText: { fontSize: 16, color: "#b0b0ff", textAlign: "center" },
  addText: { fontSize: 16, color: "#00d4ff", fontWeight: "600", marginTop: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#0f0f1a" },
});
