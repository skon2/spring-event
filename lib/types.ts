// Types mirroring the Spring Boot models

export interface Address {
  street?: string;
  city?: string;
  country?: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "ADMIN" | "CLIENT";
  datebirth?: string;
  address?: Address;
  phones?: string[];
}

export interface Event {
  id: number;
  title: string;
  description: string;
  date: string; // yyyy-MM-dd
  location: string;
  price: number;
  organizerid: number;
  imageUrl?: string;
  nbplaces: number;
  nblikes: number;
}

export interface FeedBack {
  id: number;
  message: string;
  rate: number;
  date: string;
  user: User;
  event?: Event;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}
