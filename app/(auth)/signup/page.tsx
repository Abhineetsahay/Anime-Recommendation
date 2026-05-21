// import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { verifyToken } from "@/lib/auth";
import SignupPage from "./signup";

export default async function Page() {
  // const cookieStore = await cookies();
  // const token = cookieStore.get("token")?.value;

  // if (token) {
  //   const payload = verifyToken(token);

  //   if (payload) {
  //     redirect("/discover");
  //   }
  // }

  return <SignupPage />;
}
