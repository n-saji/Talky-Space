"use client";

import { useParams } from "next/navigation";

export default function UserPage() {
  const params = useParams();
  return <div>Number: {params.number}</div>;
}
