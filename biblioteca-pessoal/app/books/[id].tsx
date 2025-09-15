// app/books/[id].tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function BookDetailScreen() {
  // ✅ Tipagem correta do parâmetro 'id'
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  // Mock — substitua por busca no Firestore pelo ID
  const book = {
    id,
    title: "Livro Exemplo",
    author: "Autor Exemplo",
    genre: "Gênero Exemplo",
    status: "Lendo",
    pages: 320,
    summary: "Resumo do livro...",
  };

  const handleEdit = () => {
    // ✅ Solução segura e tipada para navegação dinâmica
    router.push({
      pathname: './[id]',
      params: { id },
    });
  };

  const handleDelete = () => {
    // TODO: Implementar exclusão com confirmação + Firestore
    alert("Funcionalidade de exclusão ainda não implementada.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>por {book.author}</Text>
      <Text style={styles.genre}>Gênero: {book.genre}</Text>
      <Text style={styles.pages}>{book.pages} páginas</Text>
      <Text style={styles.status}>Status: {book.status}</Text>

      <View style={styles.divider} />

      <Text style={styles.summaryTitle}>Resumo:</Text>
      <Text style={styles.summary}>{book.summary}</Text>

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
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: "#666",
    marginBottom: 8,
  },
  genre: {
    fontSize: 16,
    color: "#888",
    marginBottom: 4,
  },
  pages: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
  },
  status: {
    fontSize: 16,
    color: "#00aaff",
    fontWeight: "600",
    marginBottom: 20,
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 20,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  summary: {
    fontSize: 14,
    color: "#555",
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 40,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
  },
  editButton: {
    backgroundColor: "#6200ee",
  },
  deleteButton: {
    backgroundColor: "#ff3b30",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});