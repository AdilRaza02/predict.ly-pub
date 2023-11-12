import { csvFormat } from "d3-dsv";
import { useState, useEffect } from "react";
import { csv } from "d3-request";
import { keyBy } from "lodash";

function useMasterCardDataSource() {
  const [data, setData] = useState(null);
  const [sourceOutput, setSourceOutput] = useState({ csv: null, json: null });

  useEffect(() => {
    csv("/assets/data/master_card_dp.csv", (error, response) => {
      if (error) {
        console.error("Error fetching master_card_dp.csv:", error);
      } else {
        setData((data) => ({ ...data, dp: response }));
      }
    });

    csv("/assets/data/master_card_dp_quad.csv", (error, response) => {
      if (error) {
        console.error("Error fetching master_card_dp_quad.csv:", error);
      } else {
        setData((data) => ({ ...data, dp_quad: response }));
      }
    });
  }, []);

  useEffect(() => {
    if (!data?.dp || !data?.dp_quad) return;

    const lookup = keyBy(data.dp_quad, "quad_id");
    const output = data.dp.map((item) => ({
      ...item,
      ...(lookup[item.quad_id] || {}),
    }));

    setSourceOutput({ json: output, csv: csvFormat(output) });
  }, [data]);

  return sourceOutput;
}

export default useMasterCardDataSource;
