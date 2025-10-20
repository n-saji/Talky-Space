"use client";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const SignUpSchema = z.object({
  email: z.string().min(5).max(50),
  password: z.string().min(8).max(100),
  confirmPassword: z.string().min(8).max(100),
  name: z.string().min(2).max(50),
  phoneNumber: z.string().min(10).max(10),
});

type SignUpForm = z.infer<typeof SignUpSchema>;

export default function SignUpTab() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const form = useForm<SignUpForm>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
      phoneNumber: "",
    },
  });
  const { isSubmitting } = form.formState;
  const router = useRouter();

  async function handleSignUp(data: SignUpForm) {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const User: User = {
      email: data.email,
      name: data.name,
      phone_number: data.phoneNumber,
      password: data.password,
    };

    const res = await fetch(
      process.env.NEXT_PUBLIC_API_URL + "/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(User),
      }
    );
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const errorData = await res.json();
      if (errorData.error === "user already exists") {
        toast.error("User already exists.");
      } else {
        toast.error("Something went wrong during sign up.");
      }
    }
  }

  return (
    <Form {...form}>
      <form className="grid gap-4" onSubmit={form.handleSubmit(handleSignUp)}>
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter your name" {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
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
          name="phoneNumber"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your phone number"
                  {...field}
                  type="tel"
                />
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
              <FormLabel>Password</FormLabel>
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
          name="confirmPassword"
          control={form.control}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    {...field}
                  />
                  {showConfirmPassword ? (
                    <Eye
                      onClick={() => setShowConfirmPassword(false)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                    />
                  ) : (
                    <EyeOff
                      onClick={() => setShowConfirmPassword(true)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50"
                    />
                  )}
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-full" type="submit">
          {isSubmitting ? <Spinner /> : "Sign Up"}
        </Button>
      </form>
    </Form>
  );
}
