"use client";

import React from "react";

import { signOut, useSession } from "next-auth/react";
import { logout } from "@/app/auth/logout";
import { useCurrentUser } from "@/hooks/use-current-user";

const SettingsPage = () => {
  //client component using session
  // const session = useSession();

  const user = useCurrentUser();

  const onClick = () => {
    logout(); // server side logout

    // signOut(); //client side signOut
  };

  return (
    <div className={"bg-white p-10 rounded-xl"}>
      <form action={onClick}>
        <button type={"submit"}>Sign out</button>
      </form>
    </div>
  );
};

export default SettingsPage;
