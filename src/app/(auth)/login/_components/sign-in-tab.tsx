"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { setUser } from "@/redux/slices/userSlice";
import { RootState } from "@/redux/store";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { z } from "zod";

const SignInSchema = z.object({
  email: z.string().min(5).max(50),
  password: z.string().min(8).max(100),
  rememberMe: z.boolean().optional(),
});

type SignInForm = z.infer<typeof SignInSchema>;

export default function SignInTab() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<SignInForm>({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { isSubmitting } = form.formState;
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();

  async function handleSignIn(data: SignInForm) {
    const qp = new URLSearchParams();
    qp.append("remember_me", data.rememberMe ? "true" : "false");
    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/auth/login?" + qp.toString(),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
        credentials: "include",
      }
    );

    if (res.ok) {
      const userProfile = await fetchUserProfile();
      if (userProfile) {
        dispatch(
          setUser({
            id: userProfile.id,
            name: userProfile.name,
            email: userProfile.email,
            avatar_file_path: userProfile.avatar,
          })
        );
        toast.success(
          `Welcome back, ${userProfile.name || userProfile.email}!`
        );
        router.push("/dashboard");
        return;
      }
    } else {
      // const errorData = await res.json();
      toast.error("Email and password combination doesn't exist.");
    }
  }

  async function fetchUserProfile() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + "/users/me", {
      method: "GET",
      credentials: "include",
    });

    if (res.ok) {
      const userProfile = await res.json();
      return userProfile;
    } else {
      return null;
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSignIn)}>
        <FormField
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Enter your email" {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <div className="flex justify-between items-center">
                <FormLabel>Password</FormLabel>
                <a
                  href="#"
                  className="ml-auto inline-block text-sm underline-offset-4 hover:underline text-muted-foreground"
                >
                  Forgot your password?
                </a>
              </div>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                  />
                  {showPassword ? (
                    <Eye
                      onClick={() => setShowPassword(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowPassword(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          name="rememberMe"
          control={form.control}
          render={({ field }) => (
            <FormItem className="flex items-center">
              <FormControl>
                <Checkbox
                  id="rememberMe"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormLabel
                htmlFor="rememberMe"
                className="text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </FormLabel>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
