import { Button, Text, TextArea, TextInput } from "@ignite-ui/react";
import { CalendarBlank, Clock } from "phosphor-react";
import { ConfirmForm, FormActions, FormError, FormHeader } from "./styles";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/axios";

const confirmFormSchema = z.object({
  name: z.string().min(3, { message: "Name must have at least 3 characters" }),
  email: z.string().email({ message: "Invalid email" }),
  comments: z.string().optional(),
});

type ConfirmFormValues = z.infer<typeof confirmFormSchema>;

interface ConfirmStepProps {
  schedulingDate: Date;
  onCancelConfirmation: () => void;
}

export function ConfirmStep({
  schedulingDate,
  onCancelConfirmation,
}: ConfirmStepProps) {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = useForm<ConfirmFormValues>({
    resolver: zodResolver(confirmFormSchema),
  });

  const params = useParams();
  const router = useRouter();
  const username = params.username;

  const handleConfirmScheduling = async (data: ConfirmFormValues) => {
    const { email, name, comments } = data;

    await api.post(`/users/${username}/schedule`, {
      name,
      email,
      comments,
      date: schedulingDate,
    });

    //change this method name later
    onCancelConfirmation();
  };

  const describedDate = dayjs(schedulingDate).format("DD of MMMM of YYYY");
  const describedTime = dayjs(schedulingDate).format("HH:mm h");

  return (
    <ConfirmForm as="form" onSubmit={handleSubmit(handleConfirmScheduling)}>
      <FormHeader>
        <Text>
          <CalendarBlank />
          {describedDate}
        </Text>
        <Text>
          <Clock />
          {describedTime}
        </Text>
      </FormHeader>

      <label>
        <Text size="sm">Full Name</Text>
        <TextInput
          crossOrigin="anonymous"
          placeholder="Your name"
          {...register("name")}
        />
        {errors.name && <FormError size="sm">{errors.name.message}</FormError>}
      </label>

      <label>
        <Text size="sm">email</Text>
        <TextInput
          crossOrigin="anonymous"
          type="email"
          placeholder="johndoe@example.com"
          {...register("email")}
        />
        {errors.email && (
          <FormError size="sm">{errors.email.message}</FormError>
        )}
      </label>

      <label>
        <Text size="sm">Comments</Text>
        <TextArea {...register("comments")} />
        {errors.comments && (
          <FormError size="sm">{errors.comments.message}</FormError>
        )}
      </label>

      <FormActions>
        <Button type="button" variant="tertiary" onClick={onCancelConfirmation}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          Confirm
        </Button>
      </FormActions>
    </ConfirmForm>
  );
}
