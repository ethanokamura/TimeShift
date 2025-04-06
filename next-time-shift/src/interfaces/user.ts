// Custom Type for app user
export interface User {
  uid: string;
  displayName: string | "Unknown User";
  email: string | "unknownuser@perfectline.io";
  photoURL: string | null;
  provider: string;
};
