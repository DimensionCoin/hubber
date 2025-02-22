import React from "react";
import { UserProfile } from "@clerk/nextjs";
import { dark } from "@clerk/themes"; // ✅ Import Clerk's dark theme

const Account = () => {
  return (
    <div className="flex justify-center items-center text-white ">
      <UserProfile
        appearance={{
          baseTheme: dark,
        }}
      />
    </div>
  );
};

export default Account;
