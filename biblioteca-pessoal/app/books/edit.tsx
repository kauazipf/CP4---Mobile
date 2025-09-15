// app/edit/[id].tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./../services/firebaseConfig";

export default function EditBookScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [status, setStatus] = useState("Quero ler");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Carrega dados do livro
  useEffect(() => {
    if (!id) {
      Alert.alert("Erro", "ID do livro não encontrado.");
      router.back();
      return;
    }

    const loadBook = async () => {
      try {
        const bookRef = doc(db, "books", id);
        const bookSnap = await getDoc(bookRef);
        
        if (!bookSnap.exists()) {
          Alert.alert("Erro", "Livro não encontrado.");
          router.back();
          return;
        }

        const bookData = bookSnap.data();
        setTitle(bookData.title || "");
        setAuthor(bookData.author || "");
        setGenre(bookData.genre || "");
        setStatus(bookData.status || "Quero ler");
      } catch (error) {
        console.error("Erro ao carregar livro:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do livro.");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  // ✅ Validação dos campos
  const validate = () => {
    if (!title.trim()) {
      Alert.alert("Atenção", "O título é obrigatório.");
      return false;
    }
    if (!author.trim()) {
      Alert.alert("Atenção", "O autor é obrigatório.");
      return false;
    }
    return true;
  };

  // ✅ Salva as alterações
  const handleUpdateBook = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      const bookRef = doc(db, "books", id);
      await updateDoc(bookRef, {
        title: title.trim(),
        author: author.trim(),
        genre: genre.trim(),
        status,
        updatedAt: new Date(),
      });

      Alert.alert("Sucesso", "Livro atualizado com sucesso!");
      router.back(); // ← Volta para a tela anterior (detalhes ou lista)
    } catch (error: any) {
      Alert.alert("Erro", error.message || "Não foi possível atualizar o livro.");
    } finally {
      setSaving(false);
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar Livro</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="book-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Título do Livro *"
          placeholderTextColor="#b0b0ff"
          value={title}
          onChangeText={setTitle}
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
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleUpdateBook}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Atualizando..." : "Atualizar Livro"}
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
});