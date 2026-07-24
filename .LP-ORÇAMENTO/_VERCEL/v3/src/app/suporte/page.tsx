"use client";
import dynamic from "next/dynamic";
import Loading from "../loading";

const Content = dynamic(() => import("./SuporteContent"), { ssr: false, loading: () => <Loading /> });
export default function Page() { return <Content />; }
