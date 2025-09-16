import { auth } from "@/auth"; 

export default async function getCurrentUser() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    return session.user; // user is already available
  } catch (error) {
    console.error("GetCurrentUser Error:", error);
    return null;
  }
}