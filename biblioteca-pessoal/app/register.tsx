// app/register.tsx
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "./services/firebaseConfig";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert("Atenção", "Preencha todos os campos.");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Atenção", "A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setLoading(true);
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCred.user, { displayName: name });
      console.log("Usuário criado:", userCred.user.email);
      Alert.alert("Sucesso!", "Conta criada com sucesso!");
      router.replace("/login");
    } catch (error: any) {
      Alert.alert("Erro no cadastro", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="person-add-outline" size={72} color="#00d4ff" />
        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>Junte-se à sua biblioteca digital</Text>
      </View>

      {/* Formulário */}
      <View style={styles.form}>
        {/* Input Nome */}
        <View style={styles.inputContainer}>
          <Ionicons name="person-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
          <TextInput
            placeholder="Nome completo"
            placeholderTextColor="#b0b0ff"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
        </View>

        {/* Input Email */}
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

        {/* Input Senha */}
        <View style={styles.inputContainer}>
          <Ionicons name="lock-closed-outline" size={20} color="#b0b0ff" style={styles.inputIcon} />
          <TextInput
            placeholder="Senha (mín. 6 caracteres)"
            placeholderTextColor="#b0b0ff"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
          />
        </View>

        {/* Botão Cadastrar */}
        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleRegister}
          activeOpacity={0.8}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading ? "Criando conta..." : "Cadastrar"}
          </Text>
        </TouchableOpacity>

        {/* Link de volta */}
        <TouchableOpacity onPress={() => router.replace("/login")} style={styles.backButton}>
          <Text style={styles.backText}>← Voltar ao Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f0f1a", // fundo escuro tecnológico
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#ffffff",
    marginTop: 16,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    color: "#b0b0ff",
    marginTop: 8,
  },
  form: {
    width: "100%",
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
  button: {
    backgroundColor: "#6a5af9", // roxo futurista
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
    shadowColor: "#00d4ff",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  buttonDisabled: {
    backgroundColor: "#5247e0",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  backButton: {
    alignItems: "center",
    marginTop: 16,
  },
  backText: {
    color: "#00d4ff", // ciano elétrico
    fontSize: 16,
    fontWeight: "500",
  },
});