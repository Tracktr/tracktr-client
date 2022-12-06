import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";

export const SignupWindow = () => {
  const dualScreenLeft = window.screenLeft ?? window.screenX;
  const dualScreenTop = window.screenTop ?? window.screenY;

  const width = window.innerWidth ?? document.documentElement.clientWidth ?? screen.width;

  const height = window.innerHeight ?? document.documentElement.clientHeight ?? screen.height;

  const systemZoom = width / window.screen.availWidth;

  const left = (width - 500) / 2 / systemZoom + dualScreenLeft;
  const top = (height - 550) / 2 / systemZoom + dualScreenTop;

  const newWindow = window.open(
    "/google-signin",
    "Sign in with Google",
    `width=${500 / systemZoom},height=${550 / systemZoom},top=${top},left=${left}`
  );

  newWindow?.focus();
};

const SignInPage = () => {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!(status === "loading") && !session) void signIn("google");
    if (session) window.close();
  }, [session, status]);

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        position: "absolute",
        left: 0,
        top: 0,
        background: "#101010",
      }}
    ></div>
  );
};

export default SignInPage;
