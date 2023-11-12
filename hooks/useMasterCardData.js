import { csvFormat } from "d3-dsv";
import { useState, useEffect } from "react";
import { csv } from "d3-request";

function useMasterCardData() {
  const [data, setData] = useState(null);
  const [sourceOutput, setSourceOutput] = useState({ csv: null, json: null });

  useEffect(() => {
    if (data) return;
    csv("/assets/data/mastercard_data_merged.csv", (error, response) => {
      if (error) {
        console.error("Error fetching mastercard_data_merged.csv:", error);
      } else {
        setData(response);
      }
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    setSourceOutput({ json: data, csv: csvFormat(data) });
  }, [data]);

  return sourceOutput;
}

export default useMasterCardData;
