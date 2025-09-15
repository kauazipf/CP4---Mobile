import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";

export default function RootLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); 
  // 🔑 depois integramos com Firebase Auth

  if (!isLoggedIn) {
    // Se o usuário não estiver logado → mostra fluxo de autenticação
    return (
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="login" options={{ title: "Login" }} />
        <Stack.Screen name="register" options={{ title: "Cadastro" }} />
        <Stack.Screen name="reset-password" options={{ title: "Recuperar Senha" }} />
      </Stack>
    );
  }

  // Se o usuário estiver logado → mostra Drawer
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
