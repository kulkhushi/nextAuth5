import { Check, TriangleAlert } from "lucide-react";

type FormMessage = {
  message?: string;
  error?: boolean;
};
const FormAlert = ({ error, message }: FormMessage) => {
  if (!message) {
    return null;
  }

  if (error) {
    return (
      <div className="bg-destructive/10 text-destructive flex gap-2 p-3 text-sm items-center justify-start">
        {" "}
        <TriangleAlert className="w-4 h-4" /> {message}
      </div>
    );
  }

  return (
    <div className="bg-green-600/10 text-destructive p-3 text-sm flex gap-2 text-green-600 items-center justify-start">
      {" "}
      <Check className="w-4 h-4" /> {message}
    </div>
  );
};

export default FormAlert;
