import { Directus } from "@directus/sdk";

export const directus = new Directus("https://bi5voh2i.directus.app", {
  auth: {
    mode: "json",
  },
});

export const authService = {
  // Login
  async login(email: string, password: string) {
    return await directus.auth.login({ email, password });
  },
  // Create new user
  async register(firstName: string, email: string, password: string): Promise<boolean> {
    const createUserResult = await directus.users.createOne({
      first_name: firstName,
      email,
      password,
      role: "6ca77ce6-4521-494d-905c-4b75b915d03b"
    });
    return !!createUserResult?.email;
  },
  // Log out current user
  async logout() {
    return await directus.auth.logout();
  },
  // Get current user info
  async currentUser() {
    return await directus.users.me.read({
      fields: ["email", "first_name", "avatar", "id"],
    });
  },
};