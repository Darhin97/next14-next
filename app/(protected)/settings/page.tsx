import React from "react";
import { auth, signOut } from "@/auth";

const SettingsPage = async () => {
  const session = await auth();
  return (
    <div>
      Settings page
      {JSON.stringify(session)}
      <form
        action={async () => {
          "use server";
          //signOut is used for only server component
          await signOut();
        }}
      >
        <button type={"submit"}>Sign out</button>
      </form>
    </div>
  );
};

export default SettingsPage;
