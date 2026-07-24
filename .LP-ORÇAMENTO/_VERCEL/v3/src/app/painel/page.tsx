"use client";

import dynamic from "next/dynamic";
import Loading from "../loading";

const PainelContent = dynamic(() => import("./PainelContent"), {
  ssr: false,
  loading: () => <Loading />,
});

export default function PainelPage() {
  return <PainelContent />;
}
