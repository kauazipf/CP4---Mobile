// app/edit/[id].tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore"; // ✅ getDoc importado aqui
import { db } from "../services/firebaseConfig";

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
    if (!id) return;

    const loadBook = async () => {
      try {
        const bookRef = doc(db, "books", id);
        const bookSnap = await getDoc(bookRef); // ✅ Correção: getDoc(bookRef)
        if (bookSnap.exists()) {
          const bookData = bookSnap.data();
          setTitle(bookData.title || "");
          setAuthor(bookData.author || "");
          setGenre(bookData.genre || "");
          setStatus(bookData.status || "Quero ler");
        } else {
          Alert.alert("Erro", "Livro não encontrado.");
          router.back();
        }
      } catch (error) {
        console.error("Erro ao carregar livro:", error);
        Alert.alert("Erro", "Não foi possível carregar os dados do livro.");
      } finally {
        setLoading(false);
      }
    };

    loadBook();
  }, [id]);

  const handleUpdateBook = async () => {
    if (!title || !author) {
      Alert.alert("Atenção", "Título e autor são obrigatórios.");
      return;
    }

    setSaving(true);
    try {
      const bookRef = doc(db, "books", id);
      await updateDoc(bookRef, {
        title,
        author,
        genre,
        status,
        updatedAt: new Date(),
      });
      Alert.alert("Sucesso", "Livro atualizado!");
      router.back();
    } catch (error: any) {
      Alert.alert("Erro", error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Livro</Text>

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});