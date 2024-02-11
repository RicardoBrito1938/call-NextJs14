"use client";
import {
  Avatar,
  Button,
  Heading,
  MultiStep,
  Text,
  TextArea,
} from "@ignite-ui/react";
import { ArrowRight } from "phosphor-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Container, Header } from "../styles";
import { FormAnnotation, ProfileBox } from "./styles";
import { useSession } from "next-auth/react";
import { api } from "@/lib/axios";
import { useRouter } from "next/navigation";

const updateProfileSchema = z.object({
  bio: z.string(),
});

type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;

export default function UpdateProfile() {
  const session = useSession();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
  });

  const handleUpdateProfile = async (data: UpdateProfileFormValues) => {
    await api.put("users/profile", data);

    router.push(`/schedule/${session.data?.user?.username}`);
  };

  return (
    <Container>
      <Header>
        <Heading as="strong">Well come to call!</Heading>
        <Text>
          We need some information to create your account and book your username
        </Text>

        <MultiStep size={4} currentStep={4} />
      </Header>

      <ProfileBox as="form" onSubmit={handleSubmit(handleUpdateProfile)}>
        <label>
          <Text>Profile picture</Text>
          <Avatar
            src={session.data?.user?.avatar_url}
            alt={String(session.data?.user?.name)}
          />
        </label>

        <label>
          <Text size="sm">About you</Text>
          <TextArea placeholder="Seu nome" {...register("bio")} />
          <FormAnnotation size="sm">
            Tell us a little about yourself. This will appear on your profile
          </FormAnnotation>
        </label>

        <Button type="submit" disabled={isSubmitting}>
          Finalize
          <ArrowRight />
        </Button>
      </ProfileBox>
    </Container>
  );
}
