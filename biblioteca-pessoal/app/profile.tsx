// app/profile.tsx
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLayoutEffect, useEffect, useState } from "react";
import { useRouter, useNavigation } from "expo-router";
import { signOut } from "firebase/auth";
import { auth } from "./services/firebaseConfig";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "./services/firebaseConfig";

export default function ProfileScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  const user = auth.currentUser;

  const [stats, setStats] = useState({
    total: 0,
    read: 0,
    favorites: 0,
  });
  const [loading, setLoading] = useState(true);

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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const booksRef = collection(db, "books");
    const q = query(booksRef, where("userId", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let total = 0, read = 0, favorites = 0;
      snapshot.forEach((doc) => {
        const book = doc.data();
        total++;
        if (book.status === "Lido") read++;
        if (book.favorite) favorites++;
      });
      setStats({ total, read, favorites });
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Usuário não autenticado.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={40} color="#fff" />
        </View>
        <Text style={styles.name}>
          {user.displayName || user.email?.split("@")[0] || "Usuário"}
        </Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Minhas Estatísticas</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#00d4ff" style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Ionicons name="book-outline" size={24} color="#00d4ff" />
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total de Livros</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="checkmark-circle-outline" size={24} color="#4caf50" />
              <Text style={styles.statNumber}>{stats.read}</Text>
              <Text style={styles.statLabel}>Livros Lidos</Text>
            </View>
            <View style={styles.statCard}>
              <Ionicons name="heart-outline" size={24} color="#e91e63" />
              <Text style={styles.statNumber}>{stats.favorites}</Text>
              <Text style={styles.statLabel}>Favoritos</Text>
            </View>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => router.push("./edit-profile")}
        >
          <Ionicons name="pencil-outline" size={20} color="#00d4ff" />
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
    backgroundColor: "#0f0f1a",
    padding: 20,
  },
  header: {
    alignItems: "center",
    padding: 30,
    backgroundColor: "#1a1a2e",
    borderRadius: 16,
    marginBottom: 30,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#6a5af9",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#ffffff",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#b0b0ff",
  },
  section: {
    backgroundColor: "#1a1a2e",
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ffffff",
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
    backgroundColor: "#0f0f1a",
    borderRadius: 12,
    margin: 5,
    width: "30%",
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  statNumber: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#00d4ff",
    marginVertical: 8,
  },
  statLabel: {
    fontSize: 12,
    color: "#b0b0ff",
    textAlign: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#1a1a2e",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#4a4a8a",
  },
  actionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#00d4ff",
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: "#2a1a2e",
    borderColor: "#ff3b30",
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