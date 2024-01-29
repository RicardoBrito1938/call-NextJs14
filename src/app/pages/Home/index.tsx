"use client";

import { Heading, Text } from "@ignite-ui/react";
import { Container, Hero, Preview } from "./styles";
import previewImage from "@/assets/preview.png";
import Image from "next/image";
import { ClaimUserNameForm } from "./components/ClaimUserNameForm";

export default function Home() {
  return (
    <Container>
      <Hero>
        <Heading as="h1" size="4xl">
          hassle-free scheduling
        </Heading>
        <Text size="xl">
          Connect your calendar to your website and let your clients book
        </Text>
        <ClaimUserNameForm />
      </Hero>

      <Preview>
        <Image
          src={previewImage}
          height={400}
          quality={100}
          priority
          alt="Calendário simbolizando aplicação em funcionamento"
        />
      </Preview>
    </Container>
  );
}
