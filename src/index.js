import React from "react";
import ReactDOM from "react-dom";
import {sum} from "lodash";
import {MyResponsiveSunburst} from "./Sunburst";
import "./styles.css";

const prepareData = data => {
  const simplified = data.map(item => (
  {
    hazard_cat: item.hazard_category,
    hazard_sub_cat: item.hazard_sub_category,
    new_displacements: item.new_displacements,
    hazard_type: item.hazard_type,
    hazard_sub_type: item.hazard_sub_type
  }));

  const filtered = simplified.filter(item => item.hazard_cat && item.hazard_sub_cat && item.new_displacements && item.hazard_type && item.hazard_sub_type);

// WHY I SKIPPED "other" ?
// there are results without (hazard_category & subcategory etc.)
// the total sum of those is very low = 939 
// there are exactly two results without category: please check "const other" to see details
// const other = data.filter(item => item.hazard_category !== "Weather related" && item.hazard_category !== "Geophysical");
// console.log("OTHER",other);

const uniqueArraySorted = (myArray) => {
  return [...new Set(myArray)].sort((a, b) => a - b);
}

    // the Array of Objects: key-value (not strings!)
    const uniqueMappedArray = (name, myArray) => {
      return uniqueArraySorted(myArray.map(el => el[name]));
    }

    // more generic solution
    const layer_names = ["hazard_cat", "hazard_sub_cat", "hazard_type", "hazard_sub_type"];
    const createLayer = (elements, i) => {
      const labels = uniqueMappedArray(layer_names[i], elements);
      return labels.map(label => {
        const layer = {
          name: label,
        }
        if (i < layer_names.length - 1) {
          layer.children = createLayer(elements.filter(el => el[layer_names[i]] === label), i + 1)
        } else {
                // ad loc (number od displacements), needed only on the last layer of sunburst graph (nivo sunbusrt sums up the previous ones automatically)
                layer.loc = sum(elements.map(el => el.new_displacements));
              }
              return layer;
            })
    }
    const tree = createLayer(filtered, 0);

    // Older soution. But the solution above (recursion) is even nicer.
    //const uniqCats = uniqueMappedArray("hazard_cat", filtered);
    // console.log("uC", uniqCats);
    /*    const uniqCatsSubCats = uniqCats.map(el => {
            const res = {
                hazard_cat: el,
                hazard_sub_cats: uniqueMappedArray("hazard_sub_cat", filtered.filter(el2 => (el2.hazard_cat === el))).map(el3 => {
                    console.log("hazard_sub_cat", el3)
                    return (
                        {
                            hazard_sub_cat: el3,
                            hazard_types: uniqueMappedArray("hazard_type", filtered.filter(el4 => (el4.hazard_sub_cat === el3))).map(el4 => {
                                    console.log("hazard_type", el4);
                                    return ({
                                        hazard_type: el4,
                                        hazard_sub_types: uniqueMappedArray("hazard_sub_type", filtered.filter(el5 => (el5.hazard_type === el4)))
                                            .map(el5 => ({hazard_sub_type: el5})),
                                    })
                                }
                            )
                        }
                    )
                })
            }
            return res
          })*/
    // console.log("uniCatsSubCats", uniqCatsSubCats);

    return {
      name: "nivo",
      children: tree
    }

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
      .then(({results}) => this.setState({data: results, loading: false}));
    }

    render() {
        //console.log(this.state.data);
        if (this.state.loading) {
          return <h3>Loading... stay tuned!</h3>;
        }
        return (
          <div className="App">
          <MyResponsiveSunburst data={prepareData(this.state.data)}/>
          </div>
          );
      }
    }

    const rootElement = document.getElementById("root");
    ReactDOM.render(<App/>, rootElement);