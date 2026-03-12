"use client";

import { GoogleLogin } from "@react-oauth/google";
import { useGoogleLoginMutation } from "@/hooks/auth";

export function LoginGoogleAccountButton() {
  const { handleCredential } = useGoogleLoginMutation();

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          if (credentialResponse.credential) {
            handleCredential(credentialResponse.credential);
          }
        }}
        onError={() => console.error("Google login failed")}
        useOneTap={false}
        type="standard"
        theme="outline"
        size="large"
        text="continue_with"
        shape="rectangular"
      />
    </div>
  );
}
