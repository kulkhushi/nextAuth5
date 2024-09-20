import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SocialLogin } from "./SocialLogin";

export type CardWrapProps = {
  cardLabel: string;
  cardSubtitle?: string;
  children: React.ReactNode;
  className?: string;
  BackButtonText?: string;
  BackButtonHref: string;
  showSocial?: boolean;
};

const CardWrapper = ({ children, ...props }: CardWrapProps) => {
  return (
    <Card className="w-[450px]">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl">🔑 {props.cardLabel}</CardTitle>
        <CardDescription>{props.cardSubtitle}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className="flex flex-col justify-center items-center">
        <div className="w-full">{props?.showSocial && <SocialLogin />}</div>
        <Link
          className={`${buttonVariants({
            variant: "link",
          })} hover:text-blue-500 mt-4`}
          href={props?.BackButtonHref}
        >
          {props.BackButtonText}
        </Link>
      </CardFooter>
    </Card>
  );
};

export default CardWrapper;
