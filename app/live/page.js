"use client";

import CockpitMap from "@/components/CockpitMap";
import useMasterCardData from "@/hooks/useMasterCardData";
import { Button } from "flowbite-react";

function CockpitPage() {
  const { json: outputSource } = useMasterCardData();

  return (
    <div>
      <CockpitMap data={outputSource} startLive={true} />
      <h3 className="absolute top-0 left-0 text-gray-400 m-6 text-2xl font-bold">
        Predict.ly
      </h3>
      <Button
        className="float-right text-gray-400 m-6 text-2xl font-bold bg-gray-800 hover:bg-gray-800"
        onClick={() => (window.location.href = "/")}
      >
        Analysis View
      </Button>
    </div>
  );
}

export default CockpitPage;
