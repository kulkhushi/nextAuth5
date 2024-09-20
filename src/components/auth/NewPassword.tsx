"use client";
import { NewPasswordSchema } from "../../../schemas";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import CardWrapper from "./CardWrapper";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "../ui/input";

import { useState, useTransition } from "react";
import { ReturnMessage } from "../../../@type";
import SubmitButton from "../form/SubmitButton";
import { newPasswordAction, ResetPasswordAction } from "../../../action/reset-password";
import FormAlert from "../form/FormAlert";
import { useSearchParams } from "next/navigation";

const NewPassword = () => {
  const searchparams = useSearchParams();
  const token = searchparams.get("token"); // 'token' is the query parameter
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const [pending, setTransition] = useTransition();
  const [validation, setValidation] = useState<
    ReturnMessage | null | undefined
  >(null);

  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setValidation(null);
    setTransition(() => {
     newPasswordAction(token as string, values)
     .then((data)=>{
      setValidation(data)
     })
    });
  };

  return (
    <CardWrapper
      BackButtonHref="/auth/login"
      BackButtonText="Back To Login"
      cardLabel="Auth"
      cardSubtitle="Reset Your Password"
      className="space-y-5"
    >

      <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Enter Password</FormLabel>
              <FormControl>
                <Input placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem className="mb-5">
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input placeholder="*********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mb-4">
          <FormAlert
            message={validation?.message}
            error={validation?.error}
          />
        </div>
        <SubmitButton Text="Submit Email" Type="submit" IsPending={pending} />
      </form>
    </Form>


    </CardWrapper>
  );
};

export default NewPassword;
