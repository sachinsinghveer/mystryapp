"use client";
import { useRouter } from "next/navigation";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from "@/components/ui/input";
import { Button } from '@/components/ui/button';
import { signInSchema } from "@/schemas/signInSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import React, { useState } from "react";


import Link from "next/link";
import { signIn } from "next-auth/react";

const SignIn = () => {
  const router = useRouter();
   const [isSubmitting,setIsSubmitting]=useState(false);
  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

 
  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
setIsSubmitting(true);
const result=await signIn('credentials',{
  redirect:false,
  identifier:data.identifier,
  password:data.password
})
setIsSubmitting(false);
if(result?.error){
  if(result.error=='CredentialsSignin'){
 toast("Login Failed",
   {
    description:"Incorrcet username or password",
   })
  }else{
     toast("Login Failed",
   {
    description:result.error,
   })
  }
 
}

if(result?.url){
  router.replace('/dashboard');
}

  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-800">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight mb-6">
            Join True Feedback
          </h1>
          <p>Sign in to start your anonymous adventure</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email/Username</FormLabel>
                  <FormControl>
                    <Input placeholder="email or username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              Sign In
            </Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p>
            Don't have an account?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
