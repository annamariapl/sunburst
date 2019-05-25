import React from "react";

import { ResponsiveSunburst } from "@nivo/sunburst";

export const MyResponsiveSunburst = ({ data }) => (
	<div
	style={{ width: "500px", height: "500px", backgroundColor: "lightBlue" }}
	>
	<ResponsiveSunburst
	data={data}
	margin={{ top: 40, right: 20, bottom: 20, left: 20 }}
	identity="name"
	value="loc"
	cornerRadius={2}
	borderWidth={1}
	borderColor="black"
	colors={{ scheme: "nivo" }}
	childColor={{ from: "color" }}
	animate={true}
	motionStiffness={90}
	motionDamping={15}
	isInteractive={true}
	/>
	</div>
	);
