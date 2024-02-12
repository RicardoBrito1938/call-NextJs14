"use client";
import { Avatar, Heading, Text } from "@ignite-ui/react";
import { Container, UserHeader } from "./styles";
import { IUser, getUser } from "./actions";
import { useEffect, useState } from "react";
import { ScheduleForm } from "./ScheduleForm";

interface ISchedule {
  params: { username: string };
}

//TODO: next is meant to be server side, stiches is breaking the things here, it could be simpler, keep that in mind

export default function Schedule({ params: { username } }: ISchedule) {
  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    if (!username) return;

    getUser(username).then((userFetched) => {
      setUser(userFetched);
    });
  }, [username]);

  return (
    <Container>
      <UserHeader>
        <Avatar src={user?.avatarUrl || undefined} />
        <Heading>{user?.name}</Heading>
        <Text>{user?.bio}</Text>
      </UserHeader>

      <ScheduleForm />
    </Container>
  );
}
