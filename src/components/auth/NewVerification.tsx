"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { verifyAccountByToken } from "../../../action/token";
import CardWrapper from "./CardWrapper";
import { Loader2 } from "lucide-react";
import FormAlert from "../form/FormAlert";

const NewVerification = () => {
  const searchParams = useSearchParams();
  const param = searchParams.get("token"); // 'param' is the query parameter

  const { data, error, isLoading } = useQuery({
    queryKey: ["token"],
    queryFn: async () => await verifyAccountByToken(param as string),
    retry: true,
    retryDelay: 600,
  });

  console.log("data", data);

  return (
    <CardWrapper
      cardSubtitle="Account Confirmation"
      cardLabel="Auth"
      BackButtonHref="/auth/login"
      BackButtonText="Back To Login"
    >
      <>
        {isLoading || data?.message === undefined ? (
          <p className="w-full flex items-center justify-center">
            Wait.. <Loader2 className="animate-spin w-4 h-4" />
          </p>
        ) : (
          <>
            <FormAlert error={data?.error} message={data.message} />
          </>
        )}
      </>
    </CardWrapper>
  );
};

export default NewVerification;
