// app/books/add.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { auth } from "../services/firebaseConfig"; // ← Corrigi o caminho (era ./../)
import { db } from "../services/firebaseConfig";

export default function AddBookScreen() {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Quero ler");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddBook = async () => {
    // ✅ Validação inicial
    if (!title.trim() || !author.trim()) {
      Alert.alert("Atenção", "Título e autor são obrigatórios.");
      return;
    }

    // ✅ Verifica autenticação ANTES de setar loading
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Erro", "Usuário não autenticado. Faça login novamente.");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "books"), {
        userId: user.uid,
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        status,
        favorite: false,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Sucesso", "Livro adicionado com sucesso!");
      router.back();
    } catch (error: any) {
      console.error("Erro ao adicionar livro:", error);
      Alert.alert("Erro", error.message || "Não foi possível adicionar o livro.");
    } finally {
      // ✅ GARANTIDO: Sempre reseta o loading
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Adicionar Novo Livro</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="book-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Título do Livro *"
          placeholderTextColor="#b0b0ff"
          value={title}
          onChangeText={setTitle}
          autoCapitalize="sentences"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Autor *"
          placeholderTextColor="#b0b0ff"
          value={author}
          onChangeText={setAuthor}
          autoCapitalize="words"
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="albums-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Gênero"
          placeholderTextColor="#b0b0ff"
          value={genre}
          onChangeText={setGenre}
          autoCapitalize="words"
        />
      </View>

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
        accessibilityLabel={loading ? "Salvando livro..." : "Salvar livro"}
      >
        <Text style={styles.buttonText}>
          {loading ? "Salvando..." : "Salvar Livro"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#0f0f1a" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 24, color: "#ffffff", textAlign: "center" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a2e",
    borderWidth: 1,
    borderColor: "#4a4a8a",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 16,
    height: 56,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#ffffff",
    padding: 0,
  },
  statusContainer: { marginBottom: 24 },
  label: { fontSize: 16, fontWeight: "600", marginBottom: 8, color: "#ffffff" },
  statusOption: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  statusOptionSelected: {
    backgroundColor: "#6a5af9",
    borderColor: "#6a5af9",
  },
  statusText: { color: "#b0b0ff" },
  statusTextSelected: { color: "#ffffff", fontWeight: "600" },
  button: {
    backgroundColor: "#6a5af9",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 20,
  },
  buttonDisabled: {
    backgroundColor: "#5247e0",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
  },
});