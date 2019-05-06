import React from "react";
import ReactDOM from "react-dom";
import { sum } from "lodash";

import { Pie } from "./Pie";

import "./styles.css";

const catGeophysical = "Geophysical";
const catWeatherRelated = "Weather related";

const groupAndSum = (data, groupProperty, amountProperty) =>
  data.reduce((acc, curr) => {
    const group = curr[groupProperty];
    if (!acc[group]) acc[group] = 0;
    acc[group] += curr[amountProperty];
    return acc;
  }, {});

const prepareData = data => {
  const simplified = data.map(item => ({
    id: item.hazard_category,
    value: item.new_displacements,
    iso: item.iso,
    hazardType: item.hazard_type
  }));

  // make our object more simple
  const filtered = simplified.filter(item => item.id && item.value);
  // for the weather disasters
  const filteredWeather = simplified.filter(
    item => item.hazardType && item.value
  );

  //geo information
  const dataGeophysical = filtered
    .filter(item => item.id === catGeophysical)
    .map(v => v.value);
  //weather information
  const dataWeatherRelated = filtered
    .filter(item => item.id === catWeatherRelated)
    .map(v => v.value);
  // flood sum
  const flood = filteredWeather
    .filter(item => item.hazardType === "Flood")
    .map(v => v.value);
  //extreme temperature sum
  const extremeTemp = filteredWeather
    .filter(item => item.hazardType === "Extreme temperature")
    .map(v => v.value);
  // wet mass sum
  const wetMass = filteredWeather
    .filter(item => item.hazardType === "Wet mass movement")
    .map(v => v.value);
  //storm sum
  const storm = filteredWeather
    .filter(item => item.hazardType === "Storm")
    .map(v => v.value);
  //wildFire sum
  const wildfire = filteredWeather
    .filter(item => item.hazardType === "Wildfire")
    .map(v => v.value);
  // Drought sum
  const drought = filteredWeather
    .filter(item => item.hazardType === "Drought")
    .map(v => v.value);
  //dry sum
  const dryMass = filteredWeather
    .filter(item => item.hazardType === "Dry mass movement")
    .map(v => v.value);
  // summry
  let sumGeophysical = sum(dataGeophysical);
  let sumWeatherRelated = sum(dataWeatherRelated);
  let sumFlood = sum(flood);
  let sumExtremeTemp = sum(extremeTemp);
  let sumWetMass = sum(wetMass);
  let sumStorm = sum(storm);
  let sumWildfire = sum(wildfire);
  let sumDrought = sum(drought);
  let sumDryMass = sum(dryMass);
  // console.log
  console.log("wildfire", sumWildfire);
  console.log("storm", sumStorm);
  console.log("wetMass", sumWetMass);
  console.log("extremeTemp", sumExtremeTemp);
  console.log("flood", sumFlood);
  console.log("drought", sumDrought);
  console.log("DryMass", sumDryMass);

  //console.log(sumGeophysical);
  //console.log(sumWeatherRelated);

  //console.log(dataGeophysical);

  // This is a simpler way of doing the above
  {
    /*const sums = groupAndSum(simplified, "id", "value");
  const easierSumGeophysical = sums[catGeophysical];
  const easierSumWeatherRelated = sums[catWeatherRelated];*/
  }

  //console.log(easierSumGeophysical);
  //console.log(easierSumWeatherRelated);

  return [
    {
      id: "Geophysical",
      value: sumGeophysical
    },
    {
      id: "Weather-related",
      value: sumWeatherRelated
    }
  ];
};

class App extends React.Component {
  state = {
    loading: true
  };
  componentDidMount() {
    fetch(
      "https://api.idmcdb.org/api/disaster_data?year=2017&ci=IDMCWSHSOLO009"
    )
      .then(resp => resp.json())
      .then(({ results }) => this.setState({ data: results, loading: false }));
  }
  render() {
    //console.log(this.state.data);
    if (this.state.loading) {
      return <h3>Loading... stay tuned!</h3>;
    }
    return (
      <div className="App">
        <Pie data={prepareData(this.state.data)} />
      </div>
    );
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
