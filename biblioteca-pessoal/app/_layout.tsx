import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

type IconProps = {
  color: string;
  size: number;
};

export default function RootLayout() {
  const navigation = useNavigation();

  const headerLeft = () => (
    <TouchableOpacity
      style={{ marginLeft: 15 }}
      onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
    >
      <Ionicons name="menu-outline" size={28} color="#fff" />
    </TouchableOpacity>
  );

  return (
    <Drawer
      screenOptions={{
        headerShown: true,
        drawerActiveTintColor: "#6200ee",
        drawerLabelStyle: { fontSize: 16 },
        drawerStyle: { backgroundColor: "#f2f2f2", width: 240 },
        headerStyle: { backgroundColor: "#6200ee" },
        headerTintColor: "#fff",
        headerLeft, // adiciona o botão de menu em todas as telas
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: "Início",
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="books/index"
        options={{
          title: "Meus Livros",
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="favorites"
        options={{
          title: "Favoritos",
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="heart-outline" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="profile"
        options={{
          title: "Perfil",
          drawerIcon: ({ color, size }: IconProps) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}
