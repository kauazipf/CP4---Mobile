// app/login.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./services/firebaseConfig";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const validate = () => {
    if (!email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return false;
    }
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Email inválido", "Digite um email válido.");
      return false;
    }
    if (password.length < 6) {
      Alert.alert("Senha curta", "A senha deve ter pelo menos 6 caracteres.");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("./index"); // ← Acesso direto, sem verificar email
    } catch (error: any) {
      const message =
        error?.code === "auth/user-not-found"
          ? "Usuário não encontrado."
          : error?.code === "auth/wrong-password"
          ? "Senha incorreta."
          : error?.message ?? "Erro ao efetuar login.";
      Alert.alert("Erro no login", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Ionicons name="book-outline" size={72} color="#00d4ff" />
        <Text style={styles.title}>Biblioteca Pessoal</Text>
        <Text style={styles.subtitle}>Entre para acessar sua coleção</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Ionicons name="mail-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
          <TextInput
            placeholder="Email"
            placeholderTextColor="#b0b0ff"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha"
            placeholderTextColor="#b0b0ff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          activeOpacity={0.8}
          disabled={loading}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

        <View style={styles.footerLinks}>
          <TouchableOpacity onPress={() => router.push("/register")}>
            <Text style={styles.linkText}>Criar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.push("/reset-password")}>
            <Text style={styles.linkText}>Esqueci a senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f0f1a", justifyContent: "center", padding: 24 },
  logoContainer: { alignItems: "center", marginBottom: 48 },
  title: { fontSize: 32, fontWeight: "800", color: "#ffffff", marginTop: 16 },
  subtitle: { fontSize: 16, color: "#b0b0ff", marginTop: 8 },
  form: { width: "100%" },
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
  inputIcon: { marginRight: 12 },
  input: { flex: 1, fontSize: 16, color: "#ffffff" },
  button: {
    backgroundColor: "#6a5af9",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 24,
  },
  buttonDisabled: { backgroundColor: "#5247e0" },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "600" },
  footerLinks: { flexDirection: "row", justifyContent: "space-between" },
  linkText: { color: "#00d4ff", fontSize: 16, fontWeight: "500" },
});