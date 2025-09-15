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
        <ActivityIndicator size="large" color="#00d4ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✏️ Editar Perfil</Text>

      <View style={styles.inputContainer}>
        <Ionicons name="person-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={styles.input}
          placeholder="Seu nome *"
          placeholderTextColor="#b0b0ff"
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
        <TextInput
          style={[styles.input, styles.inputDisabled]}
          placeholder="Email"
          placeholderTextColor="#8888cc"
          value={email}
          editable={false}
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
    backgroundColor: "#0f0f1a",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 24,
    textAlign: "center",
  },
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
  inputDisabled: {
    color: "#8888cc",
  },
  hintText: {
    fontSize: 12,
    color: "#8888cc",
    marginTop: 8,
    marginLeft: 12,
    fontStyle: "italic",
  },
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
});