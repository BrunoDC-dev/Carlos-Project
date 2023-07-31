import Image from "next/image";
import { useEffect, useState } from "react";
import { Inter } from "next/font/google";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { car_id } = router.query;

  console.log(car_id);

  return <h1>hi</h1>;
}
