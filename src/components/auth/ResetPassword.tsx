'use client'
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form"
import CardWrapper from "./CardWrapper"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetSchema } from "../../../schemas"
import { z } from "zod"
import { Input } from "../ui/input"

import { useState, useTransition } from "react"
import { ReturnMessage } from "../../../@type"
import SubmitButton from "../form/SubmitButton"
import { ResetPasswordAction } from "../../../action/reset-password"
import FormAlert from "../form/FormAlert"


const ResetPassword = () => {
    const form = useForm<z.infer<typeof ResetSchema>>({
        resolver: zodResolver(ResetSchema),
        defaultValues: {
            email: "",
        },
      });

      const [pending, setTransition] = useTransition();
      const [validation, setValidation] = useState<ReturnMessage |null | undefined>(null);

      const onSubmit = (values: z.infer<typeof ResetSchema>) => {
        setValidation(null)
        setTransition(()=>{
           ResetPasswordAction(values)
            .then((data)=>{
                setValidation(data)  
            })
        })
      }

   
  return (
   <CardWrapper BackButtonHref="/auth/login" BackButtonText="Back To Login" cardLabel="Auth" cardSubtitle="Reset Your Password" className="space-y-5">
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FormField control={form.control} name="email" render={({field})=>(
                    <FormItem className="mb-5">
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="test@eample.com" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )} />
<div className="mb-4">
<FormAlert message={validation?.message} error={validation?.error}  />
</div>
                <SubmitButton Text="Submit Email" Type="submit" IsPending={pending} /> 
            </form>
        </Form>
   </CardWrapper>
  )
}

export default ResetPassword