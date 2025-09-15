// app/books/[id].tsx
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "./../services/firebaseConfig";

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const [book, setBook] = useState<any | null>(null);
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

  // ✅ Busca dados do livro em tempo real
  useEffect(() => {
    if (!id) return;

    setLoading(true);

    const bookRef = doc(db, "books", id);
    const unsubscribe = onSnapshot(bookRef, (doc) => {
      if (doc.exists()) {
        setBook({ id: doc.id, ...doc.data() });
      } else {
        setBook(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleEdit = () => {
    router.push({
      pathname: './[id]',
      params: { id },
    });
  };

  const handleDelete = () => {
    // TODO: Implementar exclusão com confirmação + Firestore
    alert("Funcionalidade de exclusão ainda não implementada.");
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Livro não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>por {book.author}</Text>
      <Text style={styles.genre}>Gênero: {book.genre}</Text>
      {book.pages && <Text style={styles.pages}>{book.pages} páginas</Text>}
      <Text style={[
        styles.status,
        book.status === "Lido" && styles.statusLido,
        book.status === "Lendo" && styles.statusLendo,
        book.status === "Quero ler" && styles.statusQueroLer,
      ]}>
        Status: {book.status}
      </Text>

      {book.summary && (
        <>
          <View style={styles.divider} />
          <Text style={styles.summaryTitle}>Resumo:</Text>
          <Text style={styles.summary}>{book.summary}</Text>
        </>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.editButton]}
          onPress={handleEdit}
          accessibilityLabel="Editar livro"
        >
          <Text style={styles.buttonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
          accessibilityLabel="Excluir livro"
        >
          <Text style={styles.buttonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    textAlign: "center",
    color: "#ff3b30",
    fontSize: 18,
    marginTop: 50,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#333", marginBottom: 8 },
  author: { fontSize: 18, color: "#666", marginBottom: 8 },
  genre: { fontSize: 16, color: "#888", marginBottom: 4 },
  pages: { fontSize: 14, color: "#888", marginBottom: 4 },
  status: { fontSize: 16, fontWeight: "600", marginBottom: 20 },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#6200ee" },
  divider: { height: 1, backgroundColor: "#eee", marginVertical: 20 },
  summaryTitle: { fontSize: 18, fontWeight: "600", color: "#333", marginBottom: 8 },
  summary: { fontSize: 14, color: "#555", lineHeight: 22 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 40 },
  button: { padding: 16, borderRadius: 12, width: "48%", alignItems: "center" },
  editButton: { backgroundColor: "#6200ee" },
  deleteButton: { backgroundColor: "#ff3b30" },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});