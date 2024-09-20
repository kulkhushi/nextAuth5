import z from 'zod'

export const LoginScema= z.object({
    email: z.string().email({message: 'Email is Required'}),
    password: z.string().min(1,{message: 'Password is Required'}),
    code: z.optional(z.string())
})

export const RegisterSchema=z
.object({
  email: z.string().email().min(1, { message: 'Email is Required' }),
  password: z.string().min(1, { message: 'Password is Required' }),
  name: z.string().min(1, { message: 'Name is Required'}),
  confirmPassword: z
    .string()
    .min(1, { message: 'Please confirm your password' }),
})
.refine((data) => data.password === data.confirmPassword, {
    message: "Password is not the same as confirm password",
    path: ["confirmPassword"], // path of error
  });

export const ResetSchema=z.object({
  email: z.string().email({
    message: 'Email is Required'
  })
})

export const NewPasswordSchema=z.object({
  password: z.string().min(1, { message: 'Password is Required' }),
  confirmPassword: z
  .string()
  .min(1, { message: 'Please confirm your password' }),
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Password is not the same as confirm password",
  path: ["confirmPassword"], // path of error
});