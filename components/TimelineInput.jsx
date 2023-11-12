"use client";

import { Label, RangeSlider } from "flowbite-react";
import { useEffect, useState } from "react";

export default function TimelineInput({
  dates,
  onSliderChange,
  currentSliderState,
  startLive,
}) {
  const [currentValue, setCurrentValue] = useState(currentSliderState);

  useEffect(() => {
    setInterval(() => {
      if (startLive) {
        setCurrentValue((currentValue) => {
          if (currentValue === dates?.length) {
            currentValue = 0;
          }
          onSliderChange(currentValue + 1);
          return currentValue + 1;
        });
      }
    }, 10);
  }, []);

  return (
    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-1/2 z-10">
      <div className="text-center">
        <Label
          className="text-gray-500"
          value={dates[currentSliderState] || "Loading..."}
        />
      </div>
      <RangeSlider
        min={0}
        max={dates?.length - 1 ?? 0}
        step={1}
        value={currentValue}
        onChange={(value) => {
          onSliderChange(value.target.value);
          setCurrentValue(value.target.value);
        }}
      />
    </div>
  );
}
