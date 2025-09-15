// app/books/[id].tsx
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { doc, getDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "../services/firebaseConfig";

// ✅ Interface para tipar o livro
interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: string;
  favorite: boolean;
  pages?: number;
  summary?: string;
  createdAt?: any;
  updatedAt?: any;
}

export default function BookDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const navigation = useNavigation();

  const [book, setBook] = useState<Book | null>(null); // ✅ Tipado
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
    if (!id) {
      Alert.alert("Erro", "ID do livro não encontrado.");
      router.back();
      return;
    }

    setLoading(true);
    const loadBook = async () => {
      try {
        const bookRef = doc(db, "books", id);
        const bookSnap = await getDoc(bookRef);
        
        if (!bookSnap.exists()) {
          Alert.alert("Erro", "Livro não encontrado.");
          router.back();
          return;
        }

        setBook({ id: bookSnap.id, ...bookSnap.data() } as Book); // ✅ Tipado
      } catch (error) {
        console.error("Erro ao carregar livro:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do livro.");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleEdit = () => {
    router.push({
      pathname: './[id]',
      params: { id },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "⚠️ Confirmar Exclusão",
      "Tem certeza que deseja excluir este livro? Esta ação não pode ser desfeita.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            try {
              const bookRef = doc(db, "books", id);
              await deleteDoc(bookRef);
              
              Alert.alert("✅ Sucesso", "Livro excluído com sucesso!");
              router.replace("/books");
            } catch (error: any) {
              Alert.alert("❌ Erro", error.message || "Não foi possível excluir o livro.");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const toggleFavorite = async () => {
    if (!book) return;

    try {
      const bookRef = doc(db, "books", id);
      await updateDoc(bookRef, {
        favorite: !book.favorite,
      });

      // ✅ Tipado corretamente
      setBook((prev: Book | null) => {
        if (!prev) return prev;
        return {
          ...prev,
          favorite: !prev.favorite,
        };
      });
    } catch (error) {
      Alert.alert("Erro", "Não foi possível atualizar o favorito.");
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00d4ff" />
        <Text style={styles.loadingText}>Carregando dados do livro...</Text>
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

      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={toggleFavorite}
      >
        <Ionicons
          name={book.favorite ? "star" : "star-outline"}
          size={24}
          color={book.favorite ? "#e91e63" : "#b0b0ff"}
        />
        <Text style={styles.favoriteText}>
          {book.favorite ? "Remover dos Favoritos" : "Adicionar aos Favoritos"}
        </Text>
      </TouchableOpacity>

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
        >
          <Text style={styles.buttonText}>✏️ Editar</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>🗑️ Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f0f1a" },
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
  errorText: {
    textAlign: "center",
    color: "#ff3b30",
    fontSize: 18,
    marginTop: 50,
  },
  title: { fontSize: 28, fontWeight: "bold", color: "#ffffff", marginBottom: 8 },
  author: { fontSize: 18, color: "#b0b0ff", marginBottom: 8 },
  genre: { fontSize: 16, color: "#8888cc", marginBottom: 4 },
  pages: { fontSize: 14, color: "#8888cc", marginBottom: 4 },
  status: { fontSize: 16, fontWeight: "600", marginBottom: 20, color: "#b0b0ff" },
  statusLido: { color: "#4caf50" },
  statusLendo: { color: "#ff9800" },
  statusQueroLer: { color: "#00d4ff" },
  divider: { height: 1, backgroundColor: "#4a4a8a", marginVertical: 20 },
  summaryTitle: { fontSize: 18, fontWeight: "600", color: "#ffffff", marginBottom: 8 },
  summary: { fontSize: 14, color: "#b0b0ff", lineHeight: 22 },
  buttonContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 20 },
  button: { padding: 16, borderRadius: 12, width: "48%", alignItems: "center" },
  editButton: { backgroundColor: "#6a5af9" },
  deleteButton: { backgroundColor: "#ff3b30" },
  buttonText: { color: "#ffffff", fontSize: 16, fontWeight: "600" },
  favoriteButton: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    padding: 12,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
    alignSelf: "center",
  },
  favoriteText: {
    color: "#ffffff",
    fontSize: 16,
    marginLeft: 8,
  },
});