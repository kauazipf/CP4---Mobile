// app/books/add.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "./../services/firebaseConfig";
import { db } from "./../services/firebaseConfig";

export default function AddBookScreen() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Quero ler");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddBook = async () => {
    if (!title || !author) {
      Alert.alert("Atenção", "Título e autor são obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado.");

      await addDoc(collection(db, "books"), {
        userId: user.uid,
        title,
        author,
        genre,
        status,
        favorite: false, // padrão
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Livro adicionado!");
      router.back(); // ← Volta para a lista, que já está escutando mudanças com onSnapshot
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Livro</Text>

      <TextInput
        style={styles.input}
        placeholder="Título do Livro *"
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={styles.input}
        placeholder="Autor *"
        value={author}
        onChangeText={setAuthor}
      />

      <TextInput
        style={styles.input}
        placeholder="Gênero"
        value={genre}
        onChangeText={setGenre}
      />

      <View style={styles.statusContainer}>
        <Text style={styles.label}>Status:</Text>
        {["Quero ler", "Lendo", "Lido"].map((option) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.statusOption,
              status === option && styles.statusOptionSelected,
            ]}
            onPress={() => setStatus(option)}
          >
            <Text
              style={[
                styles.statusText,
                status === option && styles.statusTextSelected,
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleAddBook}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Livro"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    fontSize: 16,
  },
  statusContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#333" },
  statusOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: "#6200ee",
    borderColor: "#6200ee",
  },
  statusText: { color: "#333" },
  statusTextSelected: { color: "#fff", fontWeight: "600" },
  button: {
    backgroundColor: "#6200ee",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#a350ff",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "600",
  },
});