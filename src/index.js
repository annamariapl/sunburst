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
            hazard_sub_type: item.hazard_sub_type
        }));

    const filtered = simplified.filter(item => item.hazard_cat && item.hazard_sub_cat && item.new_displacements && item.hazard_type && item.hazard_sub_type);

    const uniqueArraySorted = (myArray) => {
        return [...new Set(myArray)].sort((a, b) => a - b);
    }

    const uniqueMappedArray = (name, myArray) => {
        return uniqueArraySorted(myArray.map(el => el[name]));
    }

    const layer_names = ["hazard_cat", "hazard_sub_cat", "hazard_type", "hazard_sub_type"];
    const createLayer = (elements, i) => {
        const labels = uniqueMappedArray(layer_names[i], elements)
        return labels.map(l => {
            const layer = {
                name: l,
            }
            if (i < layer_names.length - 1) {
                layer.children = createLayer(elements.filter(el => el[layer_names[i]] === l), i + 1)
            } else {
                // ad loc (numbers od displacements);
                layer.loc = sum(elements.map(el => el.new_displacements));
            }
            return layer;
        })
    }
    const tree = createLayer(filtered, 0);

    // Older soution. The solution above is even nicer.
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