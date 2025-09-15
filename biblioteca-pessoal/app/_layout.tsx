// app/_layout.tsx
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./services/firebaseConfig"; // ← Corrigi o caminho: era "./services" e deve ser "../services"
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
    return null; // ou uma tela de loading
  }

  if (!user) {
    // Usuário NÃO logado → fluxo de autenticação
    return (
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Cadastro" }} />
        <Stack.Screen name="reset-password" options={{ title: "Recuperar Senha" }} />
      </Stack>
    );
  }

  // Usuário logado → Drawer Navigation
  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#6200ee",
        drawerInactiveTintColor: "#888",
        drawerLabelStyle: { fontSize: 16 },
      }}
    >
      {/* ✅ APENAS as telas que devem aparecer no menu lateral */}
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
       {/* Telas que não devem aparecer no menu */}
      <Drawer.Screen
        name="search"
        options={{
          drawerItemStyle: { display: "none" }, // ← Oculta no menu
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="books/add"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="books/edit"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="books/[id]"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="login"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="register"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="reset-password"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
      <Drawer.Screen
        name="edit-profile"
        options={{
          drawerItemStyle: { display: "none" },
          drawerLabel: () => null,
        }}
      />
    </Drawer>
  );
}