import React from "react";
import ReactDOM from "react-dom";
import { sum } from "lodash";
import { MyResponsiveSunburst } from "./Sunburst";
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
  const simplified = data.map(item => (
  {
    hazard_cat: item.hazard_category,
    new_displacements: item.new_displacements,
    iso: item.iso,
    hazardType: item.hazard_type,
    hazardSub: item.hazard_sub_type
  }));
  // ask about specifications: for now incomplete records out && undefined hussle out (small part of data)
  const filtered = simplified.filter(item => item.hazard_cat && item.new_displacements && item.hazardType && item.new_displacements);
  const uniqueArray = (myArray, myFunction) => {
    return [...new Set(myArray.map(el => myFunction(el)))].sort((a, b) => a - b);
  }
  const uniqCats = uniqueArray(filtered, el => el.hazard_cat);
  const uniqTypes = uniqueArray(filtered, el => el.hazardType);
  const uniqSubs = uniqueArray(filtered, el => el.hazardSub);
  console.log("uniqCats", uniqCats);

  const result = {};
  const dataAMW = uniqCats.map(item => {
    const createCats = (categoryLevel, myFunction) => {
     const obj = {};
     for (let [value, key] of Object.entries(categoryLevel)){
      value = filtered.filter(e => (myFunction(e)) === key).reduce((accum, elem) => accum + elem.new_displacements || 0, 0);
      obj[key] = value;
      /*      if (key === (result["name"])) value = result["loc"]*/
    }
    /*    console.log("OBJECT",obj);*/
    return obj;
  }
  const cats = createCats(uniqCats,(e => e.hazard_cat) );
  console.log("CATS",cats);
  const types = createCats(uniqTypes,(e => e.hazardType) );
  const subs = createCats(uniqSubs,(e => e.hazardSub) );
  Object.entries(cats).forEach(([key, value]) =>
    result["name"] = key
    result["loc"] = value
    );
  console.log("myresult",result)
  return result;
});


  const flood = filtered
  .filter(item => item.hazardType === "Flood")
  .map(v => v.new_displacements);
  //extreme temperature sum
  const extremeTemp = filtered
  .filter(item => item.hazardType === "Extreme temperature")
  .map(v => v.new_displacements);
  // wet mass sum
  const wetMass = filtered
  .filter(item => item.hazardType === "Wet mass movement")
  .map(v => v.new_displacements);
  // wet mass sub type
  const landslide = filtered
  .filter(item => item.hazardSub === "Landslide, Avalanche")
  .map(v => v.new_displacements);
  //storm sum
  const storm = filtered
  .filter(item => item.hazardType === "Storm")
  .map(v => v.new_displacements);
  // storm sub type
  const stormHTC = filtered
  .filter(item => item.hazardSub === "Storm, Tropical, Hurricane")
  .map(v => v.new_displacements);
  // tornado storm
  const tornado = filtered
  .filter(item => item.hazardSub === "Tornado")
  .map(v => v.new_displacements);
  //wildFire sum
  const wildfire = filtered
  .filter(item => item.hazardType === "Wildfire")
  .map(v => v.new_displacements);
  // Drought sum
  const drought = filtered
  .filter(item => item.hazardType === "Drought")
  .map(v => v.new_displacements);
  //dry sum
  const dryMass = filtered
  .filter(item => item.hazardType === "Dry mass movement")
  .map(v => v.new_displacements);
  // summry
  let sumFlood = sum(flood);
  let sumExtremeTemp = sum(extremeTemp);
  let sumWetMass = sum(wetMass);
  let sumLandslide = sum(landslide);
  let sumStorm = sum(storm);
  let sumStormHTC = sum(stormHTC);
  let otherStorm = sum(storm) - sum(stormHTC);
  let sumTornado = sum(tornado);
  let sumWildfire = sum(wildfire);
  let sumDrought = sum(drought);
  let sumDryMass = sum(dryMass);
  // console.log
  console.log("wildfire", sumWildfire);
  console.log("storm", sumStorm);
  console.log("HTC", sumStormHTC);
  console.log("tornado", sumTornado);
  console.log("wetMass", sumWetMass);
  console.log("extremeTemp", sumExtremeTemp);
  console.log("flood", sumFlood);
  console.log("drought", sumDrought);
  console.log("DryMass", sumDryMass);
  console.log("landslide", sumLandslide);
  console.log("other Storm", sumStorm - sumStormHTC);
/*  console.log("sumGeophysical", sumGeophysical);
console.log("sumWeatherRelated",sumWeatherRelated)*/;
  //console.log(dataGeophysical);
  // This is a simpler way of doing the above
  {
    /*const sums = groupAndSum(simplified, "hazard_cat", "new_displacements");
  const easierSumGeophysical = sums[catGeophysical];
  const easierSumWeatherRelated = sums[catWeatherRelated];*/
}
  //console.log(easierSumGeophysical);
  //console.log(easierSumWeatherRelated);
  return {
    name: "nivo",
    children: [
    {name: "Geophysical",
    children: [ 
    {name: "1",loc: 69397},
    {name: "2", children: 
    [{name: "chart", loc: 55991},{name: "xAxis",loc: 86290},{name: "yAxis", loc: 13714 }]},
    {name: "3", children: 
    [{name: "chart", children: [{name: "pie", children: [{name: "outline",loc: 21858}, {name: "slices", loc: 52802}, {name: "bbox", loc: 118807}]},{name: "donut", loc: 152629}, {name: "gauge", loc: 97966}]}, {name: "legends", loc: 157098}]}]
  },
  {
    name: "Weather related",
    children: [
    {
      name: "Flood",
      loc: sumFlood
    },
    {
      name: "Storm",
      loc: sumStorm,
      children: [
      { name: "Storm, Tropical, Hurricane", 
      loc: sumStormHTC },
      {name: "Tornado",
      loc: sumTornado
    }
    ]
  },
  {
    name: "Extreme temperature",
    loc: sumExtremeTemp
  },
  {
    name: "Landslide, Avalanche",
    loc: sumLandslide
  },
  {
    name: "Dry mass movement",
    loc: sumDryMass
  },
  {
    name: "Wildfire",
    loc: sumWildfire
  },
  {
    name: "Drought",
    loc: sumDrought
  }
  ]
}
]
};
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
      <MyResponsiveSunburst data={prepareData(this.state.data)} />
      </div>
      );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);