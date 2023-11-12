"use client";

import { Map } from "react-map-gl";
import maplibregl from "maplibre-gl";
import { AmbientLight, PointLight, LightingEffect } from "@deck.gl/core";
import { HexagonLayer } from "@deck.gl/aggregation-layers";
import DeckGL from "@deck.gl/react";
import DetailView from "./DetailView";
import { useState } from "react";
import { uniq } from "lodash";
import TimelineInput from "./TimelineInput";

const ambientLight = new AmbientLight({
  color: [255, 255, 255],
  intensity: 1.0,
});

const pointLight1 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-0.144528, 49.739968, 80000],
});

const pointLight2 = new PointLight({
  color: [255, 255, 255],
  intensity: 0.8,
  position: [-3.807751, 54.104682, 8000],
});

const lightingEffect = new LightingEffect({
  ambientLight,
  pointLight1,
  pointLight2,
});

const material = {
  ambient: 0.64,
  diffuse: 0.6,
  shininess: 32,
  specularColor: [51, 51, 51],
};

const INITIAL_VIEW_STATE = {
  longitude: 14,
  latitude: 48,
  zoom: 6,
  minZoom: 6,
  maxZoom: 15,
  pitch: 47,
  bearing: -27,
};

const MAP_STYLE =
  "https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json";

export const colorRange = [
  [1, 152, 189],
  [73, 227, 206],
  [216, 254, 181],
  [254, 237, 177],
  [254, 173, 84],
  [209, 55, 78],
];

function getTooltip({ object }) {
  if (!object) {
    return null;
  }
  const tooltipContent = object.points.map((item) => {
    const {
      COORDINATES,
      id,
      txn_date,
      industry,
      quad_id,
      txn_amt,
      txn_cnt,
      acct_cnt,
      avg_ticket,
      avg_freq,
      avg_spend_amt,
      yoy_txn_amt,
      yoy_txn_cnt,
    } = item.source;
    // return `ID: ${id}\nTransaction Date: ${txn_date}\nIndustry: ${industry}\nQuad ID: ${quad_id}\nTransaction Amount: ${txn_amt}\nTransaction Count: ${txn_cnt}\nAccount Count: ${acct_cnt}\nAverage Ticket: ${avg_ticket}\nAverage Frequency: ${avg_freq}\nAverage Spend Amount: ${avg_spend_amt}\nYear-over-Year Transaction Amount: ${yoy_txn_amt}\nYear-over-Year Transaction Count: ${yoy_txn_cnt}\nCoordinates: [${COORDINATES[1]}, ${COORDINATES[0]}]`;
    return `${industry}`;
  });
  return uniq(tooltipContent).join("\n");
}

export default function CockpitMap({ data, startLive }) {
  const outputSource = (data || [])
    .map((value) => {
      const longitude = Number(value?.central_longitude);
      const latitude = Number(value?.central_latitude);

      if (!isNaN(longitude) && !isNaN(latitude)) {
        return {
          COORDINATES: [longitude, latitude],
          ...value,
        };
      }
      return null;
    })
    .filter((item) => item !== null);

  const dates = uniq(outputSource.map(({ txn_date }) => txn_date));

  const [layerData, setLayerData] = useState(null);
  const [currentSliderDate, setCurrentSliderDate] = useState(0);

  const layers = [
    new HexagonLayer({
      id: "heatmap",
      colorRange,
      coverage: 1,
      data: outputSource.filter(
        (item) => item.txn_date === dates[currentSliderDate]
      ),
      elevationRange: [0, 3000],
      elevationScale: data && data.length ? 50 : 0,
      extruded: true,
      getPosition: (d) => d.COORDINATES,
      pickable: true,
      radius: 1000,
      upperPercentile: 100,
      material,
      transitions: {
        elevationScale: 3000,
      },
    }),
  ];

  return (
    <DeckGL
      layers={layers}
      effects={[lightingEffect]}
      initialViewState={INITIAL_VIEW_STATE}
      controller={true}
      getTooltip={getTooltip}
      onClick={(event) => {
        if (event?.layer?.id === "heatmap") {
          console.log(event);
          setLayerData(event);
        }
      }}
    >
      <Map
        mapLib={maplibregl}
        mapStyle={MAP_STYLE}
        preventStyleDiffing={true}
      />
      <DetailView data={layerData} />
      <TimelineInput
        startLive={startLive}
        dates={dates}
        currentSliderState={currentSliderDate}
        onSliderChange={(value) => setCurrentSliderDate(value)}
      />
    </DeckGL>
  );
}
