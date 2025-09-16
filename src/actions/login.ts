"use server";
import * as z from "zod";
import { LoginSchema } from "@/schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/route";
import { sendVerificationEmail, sendTwoFactorTokenEmail } from "@/lib/mail"
import { AuthError }  from "next-auth";
import { generateVerificationToken, generateTwoFactorToken } from "@/lib/tokens";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { db } from "@/lib/db";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";
import { revalidatePath } from "next/cache";

export const Login = async (values: z.infer<typeof LoginSchema>, 
  callbackUrl?: string | null, path: string = "/"  ) => {
    const validatedFields = LoginSchema.safeParse(values);
    if (!validatedFields.success) {
        return { error: "Invalid fields!"}; }
   const { email, password, code } = validatedFields.data;
   const existingUser = await getUserByEmail(email);
 if (!existingUser || !existingUser.email || !existingUser.password ) {
  return { error: "Email does not exist!"}
 }
 if (!existingUser.emailVerified ) {
  const verificationToken = await generateVerificationToken(existingUser.email);
 
  try {
    await sendVerificationEmail(verificationToken.email, verificationToken.token, );
    return { success: "Verification email sent" };
} catch (error) {
    console.error("Error sending verification email:", error);
    return { error: "Failed to send verification email" };
}
 }

if (existingUser.isTwoFactorEnabled && existingUser.email) {
  if (code) {
     const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);
    if(!twoFactorToken) {  return { error: "Invalid code!" };  }
    if (twoFactorToken.token !== code) { return { error: "Invalid code!" }; }

    const hasExpired = new Date(twoFactorToken.expires) < new Date();
    if (hasExpired) {
      return { error: "Code expired!" };
    }
    await db.twoFactorToken.delete({
      where: { id: twoFactorToken.id }
    });
    const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);
    if (existingConfirmation) {
      await db.twoFactorConfirmation.delete({
        where: { id: existingConfirmation.id }
      });
    }
    await db.twoFactorConfirmation.create({
      data: {
        userId: existingUser.id,
      }
    });
  } 
   
  else {
  const twoFactorToken = await generateTwoFactorToken(existingUser.email)
  try {
    await sendTwoFactorTokenEmail(twoFactorToken.email, twoFactorToken.token, );
    return { twoFactor: true };
} catch (error) {
    console.error("Error sending two factor code:", error);
    return { error: "Failed to send two factor verification code" };
}
} }

    try {
  await signIn("credentials", {
    email,
    password,
    redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
  });
   revalidatePath(path);
} catch (error) {
  // Ignore Next.js internal redirect "error"
  if (error instanceof Error && error.message === "NEXT_REDIRECT") {
    throw error; // ✅ let Next.js handle redirect
  }

  if (error instanceof AuthError && error.type === "CredentialsSignin") {
    return { error: "Invalid credentials!" };
  }

  // ✅ rethrow all other errors (don’t show "Something went wrong")
  throw error;
}

}; 

