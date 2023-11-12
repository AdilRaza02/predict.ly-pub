"use client";

import CockpitMap from "@/components/CockpitMap";
import useMasterCardDataSource from "@/hooks/useMasterCardDataSource";
import { Button } from "flowbite-react";
import Link from "next/link";

function CockpitPage() {
  const { json: outputSource } = useMasterCardDataSource();

  return (
    <div>
      <CockpitMap data={outputSource} />
      <h3 className="absolute top-0 left-0 text-gray-400 m-6 text-2xl font-bold">
        Predict.ly
      </h3>
      <Button className="float-right text-gray-400 m-6 text-2xl font-bold bg-gray-800 hover:bg-gray-800" onClick={()=>window.location.href="/live"}>Live View</Button>

    </div>
  );
}

export default CockpitPage;
