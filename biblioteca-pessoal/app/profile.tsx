// app/profile.tsx
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from ".//services/firebaseConfig";
import { useRouter } from "expo-router";

export default function ProfileScreen() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace("/login");
    } catch (error) {
      console.error("Erro ao sair:", error);
    }
  };

  // Mock user data — substitua por dados reais do Firebase Auth/Firestore
  const user = {
    displayName: "João Silva",
    email: "joao@example.com",
    totalBooks: 15,
    booksRead: 8,
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Meu Perfil</Text>
      </View>

      <View style={styles.profileSection}>
        <Text style={styles.profileName}>{user.displayName}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
      </View>

      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.totalBooks}</Text>
          <Text style={styles.statLabel}>Total de Livros</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.booksRead}</Text>
          <Text style={styles.statLabel}>Livros Lidos</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{user.totalBooks - user.booksRead}</Text>
          <Text style={styles.statLabel}>Lendo/Para Ler</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.editButton}>
        <Text style={styles.editButtonText}>✏️ Editar Perfil</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>🚪 Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  title: { fontSize: 24, fontWeight: "bold", color: "#333" },
  profileSection: { alignItems: "center", padding: 20 },
  profileName: { fontSize: 28, fontWeight: "bold", color: "#333" },
  profileEmail: { fontSize: 16, color: "#666", marginTop: 8 },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
  },
  statCard: { alignItems: "center" },
  statNumber: { fontSize: 32, fontWeight: "bold", color: "#6200ee" },
  statLabel: { fontSize: 14, color: "#666", marginTop: 4 },
  editButton: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    margin: 20,
  },
  editButtonText: { fontSize: 16, color: "#333", fontWeight: "600" },
  logoutButton: {
    backgroundColor: "#ff3b30",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginHorizontal: 20,
  },
  logoutButtonText: { fontSize: 16, color: "#fff", fontWeight: "600" },
});