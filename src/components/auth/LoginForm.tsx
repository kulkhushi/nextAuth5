"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CardWrapper from "./CardWrapper";
import { Form } from "@/components/ui/form";
import { LoginScema } from "../../../schemas";
import FormInput from "../form/FormInput";
import FormAlert from "../form/FormAlert";
import SubmitButton from "../form/SubmitButton";
import { useState, useTransition } from "react";
import { ReturnMessage } from "../../../@type";
import { LoginAction } from "../../../action/authAction";
import { useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import Link from "next/link";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const LoginForm = () => {
  const [pending, setTransition] = useTransition();
  const [validation, setValidation] = useState<
    ReturnMessage | null | undefined
  >(null);
  const [isTwoFactor, setisTwoFactor] = useState<boolean>(false);
  const searchParams = useSearchParams();

  const signInerror = searchParams.get("error");

  let AccountNotLinked;
  if (signInerror === "OAuthAccountNotLinked") {
    AccountNotLinked = {
      error: true,
      message: "This Email is already in use by other provider",
    };
  }

  const form = useForm<z.infer<typeof LoginScema>>({
    resolver: zodResolver(LoginScema),
    defaultValues: {
      email: "",
      password: "",  
      code:""
    },
  });

  const onSubmit = (values: z.infer<typeof LoginScema>) => {
    console.log("values", values);
    // return;
    setValidation(null);
    setTransition(() => {
      LoginAction(values)
        .then((data) => {
          if (data) {
            if ("twoFactor" in data) {
              // Handle two-factor authentication
             
              setisTwoFactor(data.twoFactor);
            } else {
              // Handle the case where there is a message and error
              if (data.message) {
                
                setValidation(data);
              }
            }
          } else {
            console.error("No data returned from LoginAction");
          }
        })
        .catch((error) => {
          // Handle any errors here
          console.error("Login failed", error);
        });
    });
    console.log("onSubmit", values);
  };

  return (
    <CardWrapper
      BackButtonHref="/auth/register"
      cardLabel="Sign In"
      BackButtonText="Don’t have an account yet? Sign up"
      cardSubtitle="Sign in to your account"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {isTwoFactor && (
           <>
            <FormField
            control={form.control}
            name='code'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Code</FormLabel>
                <FormControl>
                  <Input type="text"  placeholder="123456" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />        
           </>
          )}
          {!isTwoFactor && (
            <>          
              <FormInput
                label="Email"
                placeholder="hello@example.com"
                type="email"
                name="email"
                validateControl={form}
              />
              <FormInput
                label="Password"
                name="password"
                placeholder="*******"
                type="password"
                validateControl={form}
              />
                   <Button asChild variant="link" size="sm">
            <Link href="/auth/reset-password" className="h-0">
              Forgot Password?
            </Link>
          </Button>
            </>
          )}

     
          <FormAlert
            message={validation?.message || AccountNotLinked?.message}
            error={validation?.error || AccountNotLinked?.error}
          />
          <SubmitButton
            Text={isTwoFactor ? "Confirm" : "Login"}
            Type="submit"
            IsPending={pending}
          />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default LoginForm;
