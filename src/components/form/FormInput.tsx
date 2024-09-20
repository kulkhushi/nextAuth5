import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";

type InputProps = {
  type?: string;
  placeholder: string;
  label: string;
  validateControl: UseFormReturn<any>;
  name:string
};

const FormInput = ({
  type = "text",
  placeholder,
  label,
  validateControl,
  name
}: InputProps) => {
  return (
    <FormField
      control={validateControl.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input type={type} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};

export default FormInput;
