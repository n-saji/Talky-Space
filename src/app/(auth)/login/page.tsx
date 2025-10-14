import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SignUpTab from "./_components/sign-up-tab";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInTab from "./_components/sign-in-tab";
import NavBar from "@/app/(landingPage)/navBar";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function generateMetadata() {
  return {
    title: "Login | TalkySpace",
  };
}

export default async function Login() {
  const cookiesStore = await cookies();
  const token = cookiesStore.get("access_token")?.value;

  if (token) {
    redirect("/setup-profile");
  }
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar landingPage={false} />
      <div className="flex flex-1 flex-col px-4 max-w-md w-full mx-auto">
        <Tabs defaultValue="sign-in" className="w-full my-6 px-4">
          <TabsList className="mb-4">
            <TabsTrigger value="sign-in" className="w-1/2">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="sign-up" className="w-1/2">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="sign-in">
            <Card className="max-w-sm w-full">
              <CardHeader className="text-xl">
                <CardTitle>Sign In</CardTitle>
                <CardDescription>
                  Welcome back! Please enter your details.
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <SignInTab />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="sign-up">
            <Card className="max-w-sm w-full">
              <CardHeader className="text-xl">
                <CardTitle>Sign Up</CardTitle>
                <CardDescription>
                  Create your account. It&apos;s free!
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <SignUpTab />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
