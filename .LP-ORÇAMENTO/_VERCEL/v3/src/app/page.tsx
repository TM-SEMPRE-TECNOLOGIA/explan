"use client";

import dynamic from "next/dynamic";
import Loading from "./loading";

const LoginContent = dynamic(() => import("./LoginContent"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function LoginPage() {
  return <LoginContent />;
}
