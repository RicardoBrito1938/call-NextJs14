"use client";
import { Button, Heading, MultiStep, Text } from "@ignite-ui/react";
import { ArrowRight, Check } from "phosphor-react";

import { Container, Header } from "../styles";

import { useRouter, useSearchParams } from "next/navigation";
import { AuthError, ConnectBox, ConnectItem } from "./styles";
import { signIn, useSession } from "next-auth/react";

export default function ConnectCalendar() {
  const useSearch = useSearchParams();
  const session = useSession();
  const router = useRouter();

  const hasAuthError = !!useSearch.get("error");
  const isSignedIn = session.status === "authenticated";

  const handleConnectGoogleCalendar = async () => {
    await signIn("google");
  };

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
          {isSignedIn ? (
            <Button size="sm" disabled>
              Connected
              <Check />
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={handleConnectGoogleCalendar}
            >
              Connect
              <ArrowRight />
            </Button>
          )}
        </ConnectItem>

        {hasAuthError && (
          <AuthError size="sm">
            Error connecting to your calendar. Please try again and check if you
            allowed the necessary permissions.
          </AuthError>
        )}

        <Button
          type="submit"
          disabled={!isSignedIn}
          onClick={() => router.push("/register/time-intervals")}
        >
          Next step
          <ArrowRight />
        </Button>
      </ConnectBox>
    </Container>
  );
}
