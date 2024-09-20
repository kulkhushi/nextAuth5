"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { string, z } from "zod";
import CardWrapper from "./CardWrapper";
import { Form } from "@/components/ui/form";
import { LoginScema, RegisterSchema } from "../../../schemas";
import FormInput from "../form/FormInput";
import FormAlert from "../form/FormAlert";
import SubmitButton from "../form/SubmitButton";
import { useState, useTransition } from "react";
import { ReturnMessage } from "../../../@type";
import { LoginAction, registerAction } from "../../../action/authAction";

const RegisterForm = () => {
  const [pending, setTransition] = useTransition();
  const [validation, setValidation] = useState<
    ReturnMessage | null | undefined
  >(null);

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      confirmPassword: "",
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
    setValidation(null);
    setTransition(() => {
      registerAction(values).then((data) => {
        setValidation(data);
      });
    });
    console.log("onSubmit", values);
  };

  return (
    <CardWrapper
      BackButtonHref="/auth/login"
      cardLabel="Sign Up"
      BackButtonText="Already have an account yet? Sign In"
      cardSubtitle="Sign Up to create new account"
      showSocial
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormInput
            label="Name"
            placeholder="John Smith"
            type="name"
            name="name"
            validateControl={form}
          />
          <FormInput
            label="Email"
            placeholder="hello@example.com"
            type="email"
            name="email"
            validateControl={form}
          />
          <FormInput
            label="Password"
            placeholder="*******"
            type="password"
            name="password"
            validateControl={form}
          />
          <FormInput
            label="Confirm Password"
            placeholder="*******"
            type="password"
            name="confirmPassword"
            validateControl={form}
          />
          <FormAlert message={validation?.message} error={validation?.error} />
          <SubmitButton Text="Register" Type="submit" IsPending={pending} />
        </form>
      </Form>
    </CardWrapper>
  );
};

export default RegisterForm;
