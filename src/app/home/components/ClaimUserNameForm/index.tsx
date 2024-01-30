import { Button, Text, TextInput } from "@ignite-ui/react";
import { Form, FormAnnotation } from "./styles";
import { ArrowRight } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

const claimUserNameFormSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters long" })
    .regex(/^([a-z\\-]+)$/i, {
      message: "Username must contain only letters and dashes",
    })
    .transform((value) => value.toLowerCase()),
});

type ClaimUserNameFormProps = z.infer<typeof claimUserNameFormSchema>;

export const ClaimUserNameForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ClaimUserNameFormProps>({
    resolver: zodResolver(claimUserNameFormSchema),
  });

  const router = useRouter();

  const handleClaimUserName = (data: ClaimUserNameFormProps) => {
    const { username } = data;
    console.log(username);
    router.push(`/register?username=${username}`);
  };

  return (
    <>
      <Form as="form" onSubmit={handleSubmit(handleClaimUserName)}>
        <TextInput
          crossOrigin="anonymous"
          size="sm"
          prefix="calendar.com/"
          placeholder="your user"
          {...register("username")}
        />
        <Button size="sm" type="submit">
          Book user
          <ArrowRight />
        </Button>
      </Form>
      <FormAnnotation>
        <Text size="sm">
          {errors.username?.message || "Type desired username"}
        </Text>
      </FormAnnotation>
    </>
  );
};
