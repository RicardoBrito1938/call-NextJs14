"use client";
import { queryClient } from "@/lib/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren } from "react";

export const ClientSideProviders = (props: PropsWithChildren) => {
  return <QueryClientProvider client={queryClient} {...props} />;
};
