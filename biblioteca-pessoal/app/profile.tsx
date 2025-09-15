// app/profile.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect } from "react";
import { useRouter, useNavigation } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "./services/firebaseConfig";
import { User } from "firebase/auth";

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser; // 👈 Obtém dados do usuário logado

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Avatar e Informações */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>
          {user.displayName || user.email?.split("@")[0] || "Usuário"}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      {/* Estatísticas */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Minhas Estatísticas</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Ionicons name="book-outline" size={24} color="#6200ee" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Total de Livros</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle-outline" size={24} color="#4caf50" />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Livros Lidos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="heart-outline" size={24} color="#e91e63" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Favoritos</Text>
          </View>
        </View>
      </View>

      {/* Ações */}
      <View style={styles.section}>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="pencil-outline" size={20} color="#6200ee" />
          <Text style={styles.actionText}>✏️ Editar Perfil</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.actionButton, styles.logoutButton]} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ff3b30" />
          <Text style={[styles.actionText, styles.logoutText]}>🚪 Sair da Conta</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 30,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6200ee",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
  section: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
    textAlign: "center",
  },
  statsGrid: {
    flexDirection: "row",
    justifyContent: "space-around",
    flexWrap: "wrap",
  },
  statCard: {
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f5f5ff",
    borderRadius: 12,
    margin: 5,
    width: "30%",
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#6200ee",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    marginBottom: 12,
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#ffebee",
  },
  logoutText: {
    color: "#ff3b30",
  },
  errorText: {
    textAlign: "center",
    color: "#ff3b30",
    fontSize: 16,
    marginTop: 50,
  },
});