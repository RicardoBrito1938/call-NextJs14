"use client";
import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { Container, Header } from "../styles";

import { useSearchParams } from "next/navigation";
import { ConnectBox, ConnectItem } from "./styles";
import { signIn } from "next-auth/react";

export default function Register() {
  const useSearch = useSearchParams();
  const username = useSearch.get("username");

  //   const handleRegister = async (data: RegisterFormValues) => {};

  return (
    <Container>
      <Header>
        <Heading as="strong">Connect your agenda</Heading>
        <Text>
          Connect your calendar to find the best time for your meetings
        </Text>

        <MultiStep size={4} currentStep={2} />
      </Header>
      <ConnectBox>
        <ConnectItem>
          <Text>Google Calendar</Text>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => signIn("google")}
          >
            Connect
            <ArrowRight />
          </Button>
        </ConnectItem>

        <Button type="submit">
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
