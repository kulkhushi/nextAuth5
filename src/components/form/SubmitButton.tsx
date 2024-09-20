import { LoaderCircle } from "lucide-react";
import { Button } from "../ui/button";

type ButtonProps = {
  Type: "submit" | "reset" | "button";
  IsPending?: boolean;
  Text: string;
};

const SubmitButton = ({
  Type = "submit",
  IsPending = false,
  Text,
}: ButtonProps) => {
  return (
    <Button type={Type} variant="default" className="w-full">
      {IsPending ? (
        <span className="text-gray-500 flex justify-center">
          <LoaderCircle className="w-3 h-3 animate-spin" /> Wait..
        </span>
      ) : (
        Text
      )}
    </Button>
  );
};

export default SubmitButton;
