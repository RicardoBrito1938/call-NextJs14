"use client";
import { Button, Heading, MultiStep, Text, TextInput } from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { Container, Form, FormError, Header } from "./styles";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";
import { AxiosError } from "axios";

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Username must contain only letters and dashes",
    })
    .transform((value) => value.toLowerCase()),
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" }),
});

type RegisterFormValues = z.infer<typeof claimUserNameFormSchema>;

export default function Register() {
  const router = useRouter();
  const useSearch = useSearchParams();
  const username = useSearch.get("username");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(claimUserNameFormSchema),
  });

  const handleRegister = async (data: RegisterFormValues) => {
    try {
      await api.post("/users", {
        username: data.username,
        name: data.name,
      });

      router.push(`/register/connect-calendar`);
    } catch (error) {
      if (error instanceof AxiosError && !!error?.response?.data?.error) {
        alert(error?.response?.data?.error);
        return;
      }
      console.error(error);
    }
  };

  useEffect(() => {
    if (username) setValue("username", username);
  }, [setValue, username]);

  return (
    <Container>
      <Header>
        <Heading as="strong">Well come to call!</Heading>
        <Text>
          We need some information to create your account and book your username
        </Text>

        <MultiStep size={4} currentStep={1} />
      </Header>

      <Form as="form" onSubmit={handleSubmit(handleRegister)}>
        <label>
          <Text size="sm">Username</Text>
          <TextInput
            crossOrigin="anonymous"
            prefix="ignite.com/"
            placeholder="seu-usuário"
            {...register("username")}
          />
          {errors.username && (
            <FormError size="sm">{errors.username.message}</FormError>
          )}
        </label>

        <label>
          <Text size="sm">Full name</Text>

          <TextInput
            crossOrigin="anonymous"
            placeholder="Seu nome"
            {...register("name")}
          />
          {errors.name && (
            <FormError size="sm">{errors.name.message}</FormError>
          )}
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Next step
          <ArrowRight />
        </Button>
      </Form>
    </Container>
  );
}
