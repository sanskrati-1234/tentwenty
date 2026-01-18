export type MockUser = {
  id: string;
  name: string;
  email: string;
  password: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    name: "Test User",
    email: "test@tentwenty.com",
    password: "password123",
  },
];

export function findUserByEmail(email: string) {
  return mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase()) || null;
}
