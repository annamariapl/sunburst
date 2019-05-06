import React from "react";

import { ResponsivePie } from "@nivo/pie";

export const Pie = ({ data }) => (
  <div style={{ width: "400px", height: "400px" }}>
    <ResponsivePie
      data={data}
      startAngle={45}
      innerRadius={0.5}
      margin={{ top: "20", left: "20", bottom: "20", right: "20" }}
    />
  </div>
);
