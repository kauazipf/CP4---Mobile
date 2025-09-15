// app/types.ts

// Tipagem principal para livros
export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  status: "Quero ler" | "Lendo" | "Lido";
  favorite?: boolean;
  createdAt?: any; // Firestore Timestamp
}

// Tipagem para usuário (opcional)
export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
}
