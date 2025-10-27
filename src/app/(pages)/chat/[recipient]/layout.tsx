"use client";
import { useParams } from "next/navigation";
export default function RecipientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const params = useParams();
  const recipient = params.recipient;
  console.log(`assa ${recipient}`);
  return <>{children}</>;
}
