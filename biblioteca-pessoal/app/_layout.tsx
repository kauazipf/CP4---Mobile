import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./services/firebaseConfig";
import { User } from "firebase/auth";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 🔑 Monitora o login automaticamente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  if (loading) {
    return null; // você pode trocar por uma tela de Splash/Loading
  }

  if (!user) {
    // Usuário NÃO logado → fluxo de autenticação
    return (
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="Login" options={{ title: "Login" }} />
        <Stack.Screen name="Register" options={{ title: "Cadastro" }} />
        <Stack.Screen name="Reset-password" options={{ title: "Recuperar Senha" }} />
      </Stack>
    );
  }

  // Usuário logado → Drawer Navigation
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#6200ee",
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Início",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="books/index"
        options={{
          title: "Meus Livros",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Perfil",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
