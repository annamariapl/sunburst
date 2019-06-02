import React from "react";
import ReactDOM from "react-dom";
import {
  MyResponsiveSunburst
} from "./Sunburst";
import "./styles.css";

const processdData = data => {
  
  const hazardCategories = [];

  // step one, orginize by hazard_category
  data.map(item => {
    const parent = {
      name: item.hazard_category,
      children: [item]
    };
    if (hazardCategories.length === 0) {
      if (!item.hazard_category) {
        const final = {
          name: 'other',
          loc: item.new_displacements
        };
        hazardCategories.push(final);
      } else {
        hazardCategories.push(parent);
      }
      return false;
    }
    let exists = false;
    for (let i = 0; i < hazardCategories.length; i++) {
      if (hazardCategories[i].name === item.hazard_category) {
        // console.log(item.hazard_category);
        exists = true;
        hazardCategories[i].children.push(item)
      }

      // adds items under name 'other' if they don't have a hazard_category
      if (hazardCategories[i].name === 'other' && !item.hazard_category) {
        exists = true;
        hazardCategories[i].loc = hazardCategories[i].loc + item.new_displacements;
      }
    }
    if (!exists) {
      if (!item.hazard_category) {
        const final = {
          name: 'other',
          loc: item.new_displacements
        };
        hazardCategories.push(final);
      } else {
        hazardCategories.push(parent);
      }
    }
    return false;
  });

  // step two, orginize by hazard_sub_category and sum all displacements in to loc property
  const graphData = hazardCategories.map(elem => {
    const newChildrenArray = [];
    elem.children && elem.children.map(item => {
      const final = {
        name: item.hazard_sub_category || 'other',
        loc: item.new_displacements
      };
      if (newChildrenArray.length === 0) {
        newChildrenArray.push(final);
        return false;
      }
      let exists = false;
      for (let i = 0; i < newChildrenArray.length; i++) {
        if (newChildrenArray[i].name === item.hazard_sub_category) {
          exists = true;
          newChildrenArray[i].loc = newChildrenArray[i].loc + item.new_displacements;
        }
  
        // adds items under name 'other' if they don't have a hazard_sub_category
        if (newChildrenArray[i].name === 'other' && !item.hazard_sub_category) {
          exists = true;
          newChildrenArray[i].loc = newChildrenArray[i].loc + item.new_displacements;
        }
      }
      if (!exists) {
        newChildrenArray.push(final);
      }
      return false;
    })

    // don't add empty children arrays
    if (newChildrenArray.length > 0) {

      // if only one children, add it to the parent and remove children property
      if (newChildrenArray.length === 1) {
        elem.loc = newChildrenArray[0].loc
        delete elem.children
      } else {
        elem.children = newChildrenArray
      }
    }
    return elem
  })

  const nivoData = {
    name: "nivo",
    children: graphData
  }
  
  debugger;
  return nivoData;
}

class App extends React.Component {
  state = {
    loading: true
  };
  componentDidMount() {
    fetch(
        "https://api.idmcdb.org/api/disaster_data?year=2017&ci=IDMCWSHSOLO009"
      )
      .then(resp => resp.json())
      .then(({
        results
      }) => this.setState({
        data: results,
        loading: false
      }));
  }

  render() {
    //console.log(this.state.data);
    if (this.state.data) {
    }

    if (this.state.loading) {
      return <h3> Loading... stay tuned! </h3>;
    }
    const processedData = processdData(this.state.data)

    return (
      <div className="App" >
        <MyResponsiveSunburst
          data = {
            processedData
          }
        />
      </div>
    );
  }
}
const rootElement = document.getElementById("root");
ReactDOM.render( < App / > , rootElement);