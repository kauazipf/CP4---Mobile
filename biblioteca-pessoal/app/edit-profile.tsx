// app/profile/edit.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useLayoutEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { auth } from "./services/firebaseConfig";
import { updateProfile } from "firebase/auth";

export default function EditProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ✅ Configura header com ícone de busca
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

  // ✅ Carrega dados do usuário
  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
      setLoading(false);
    }
  }, [user]);

  const handleSave = async () => {
    if (!displayName.trim()) {
      Alert.alert("Atenção", "O nome é obrigatório.");
      return;
    }

    setSaving(true);
    try {
      await updateProfile(user!, {
        displayName: displayName.trim(),
      });

      Alert.alert("Sucesso", "Perfil atualizado com sucesso!");
      router.back(); // Volta para a tela de perfil
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
      <Text style={styles.title}>✏️ Editar Perfil</Text>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Nome Completo *</Text>
        <TextInput
          style={styles.input}
          value={displayName}
          onChangeText={setDisplayName}
          placeholder="Seu nome"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          value={email}
          editable={false} // Firebase não permite mudar email sem reautenticação
          placeholder="Email"
        />
        <Text style={styles.hintText}>
          Para alterar o email, entre em contato com o suporte.
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.button, saving && styles.buttonDisabled]}
        onPress={handleSave}
        disabled={saving}
      >
        <Text style={styles.buttonText}>
          {saving ? "Salvando..." : "Salvar Alterações"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  inputDisabled: {
    backgroundColor: "#f0f0f0",
    color: "#666",
  },
  hintText: {
    fontSize: 12,
    color: "#888",
    marginTop: 8,
    fontStyle: "italic",
  },
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