import React from "react";
import ReactDOM from "react-dom";
import {sum} from "lodash";
import {MyResponsiveSunburst} from "./Sunburst";
import "./styles.css";


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
            hazard_sub_cat: item.hazard_sub_category,
            new_displacements: item.new_displacements,
            hazard_type: item.hazard_type,
            hazard_sub_type: item.hazard_sub_typ
        }));

    const filtered = simplified.filter(item => item.hazard_cat && item.new_displacements && item.hazard_type && item.new_displacements && item.hazard_sub_type && item.hazard_sub_cat);


    const uniqueArray = (myArray) => {
        return [...new Set(myArray)].sort((a, b) => a - b);
    }

    const uniqueMappedArray = (name, myArray) => {
        return uniqueArray(myArray.map(el => el[name]));
    }

    const uniqCats = uniqueMappedArray("hazard_cat", filtered);
    const layer_names = ["hazard_cat", "hazard_sub_cat", "hazard_type", "hazard_sub_type"]
    const createLayer = (elements, i) => {
        const labels = uniqueMappedArray(layer_names[i], elements)
        return labels.map(l => {
            const layer = {
                name: l,
            }
            if (i < layer_names.length-1) {
                layer.children = createLayer(elements.filter(el => el[layer_names[i]] === l), i + 1)
            } else {
                // ad loc (numbers od displacements);
                layer.loc = sum(elements.map(el => el.new_displacements));
            }
            return layer;
        })
    }
    const tree = createLayer(filtered, 0);
    console.log("treeOfLife", tree);

    console.log("uC", uniqCats);

    const uniqCatsSubCats = uniqCats.map(el => {
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
    })


    console.log("uniCatsSubCats", uniqCatsSubCats);


    const flood = filtered
        .filter(item => item.hazard_type === "Flood")
        .map(v => v.new_displacements);
    //extreme temperature sum
    const extremeTemp = filtered
        .filter(item => item.hazard_type === "Extreme temperature")
        .map(v => v.new_displacements);
    // wet mass sum
    const wetMass = filtered
        .filter(item => item.hazard_type === "Wet mass movement")
        .map(v => v.new_displacements);
    // wet mass sub type
    const landslide = filtered
        .filter(item => item.hazard_sub_type === "Landslide, Avalanche")
        .map(v => v.new_displacements);
    //storm sum
    const storm = filtered
        .filter(item => item.hazard_type === "Storm")
        .map(v => v.new_displacements);
    // storm sub type
    const stormHTC = filtered
        .filter(item => item.hazard_sub_type === "Storm, Tropical, Hurricane")
        .map(v => v.new_displacements);
    // tornado storm
    const tornado = filtered
        .filter(item => item.hazard_sub_type === "Tornado")
        .map(v => v.new_displacements);
    //wildFire sum
    const wildfire = filtered
        .filter(item => item.hazard_type === "Wildfire")
        .map(v => v.new_displacements);
    // Drought sum
    const drought = filtered
        .filter(item => item.hazard_type === "Drought")
        .map(v => v.new_displacements);
    //dry sum
    const dryMass = filtered
        .filter(item => item.hazard_type === "Dry mass movement")
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

    return { name: "nivo",
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