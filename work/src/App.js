import './App.css';
import React, { useState } from "react";
import { MapContainer, Circle, Popup, TileLayer } from "react-leaflet";
import list from './laln.json';
import data from './data.json';
import numeral from "numeral";
import {
  FormControl,
  Select,
  InputLabel,
  makeStyles
} from "@material-ui/core";
import Chart from "./Chart";

function App() {
  const position = [58.027160, -105.380900]
  const provinces = [...new Set(data.map(item => item.Province))]
  const [province, setProvince] = useState("");
  const [l3csMenu, setL3csMenu] = useState([]);
  const [l3cs, setL3cs] = useState("");
  const [l1pMenu, setL1pMenu] = useState([]);
  const [l1p, setL1p] = useState("");
  const [l2pMenu, setL2pMenu] = useState([]);
  const [l2p, setL2p] = useState("");
  const [demandDate, setDemandDate] = useState({});

  const onProvinceChange = (e) => {
    setProvince(e.target.value)
    setL3csMenu([...new Set(data.filter(item => item.Province === e.target.value).map(item => item["L3 Consumption Segment"]))])
  };

  const onL3csChange = (e) => {
    setL3cs(e.target.value)
    setL1pMenu([...new Set(data.filter(item => item.Province === province && item["L3 Consumption Segment"] === e.target.value).map(item => item["L1 Product"]))])
  };

  const onL1pChange = (e) => {
    setL1p(e.target.value)
    setL2pMenu([...new Set(data.filter(item => item.Province === province && item["L3 Consumption Segment"] === l3cs && item["L1 Product"] === e.target.value).map(item => item["L2 Product"]))]
    )
  };

  const onL2pChange = (e) => {
    setL2p(e.target.value)
    function filterByItem(item) {
      if (
        item.Province === province &&
        item["L3 Consumption Segment"] === l3cs &&
        item["L1 Product"] === l1p &&
        item["L2 Product"] === e.target.value
      ) {
        return true
      }

      return false;
    }

    let filteredData = data.filter(filterByItem)
    let demandDate = {}
    filteredData.map(item => {
      if (demandDate[item.Date] === undefined) {
        demandDate[item.Date] = 0;
      }
      demandDate[item.Date] += parseInt(item.Demand);
    })

    setDemandDate(demandDate)
    return null
  };

  const useStyles = makeStyles((theme) => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 100,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }));

  const classes = useStyles();

  let provinceSum = {}
  data.map(item => {
    if (provinceSum[item.Province] === undefined) {
      provinceSum[item.Province] = 0;
    }
    provinceSum[item.Province] += parseInt(item.Demand);

    return null
  })

  return (
    <div className="app">
      <div className="app__title">
        <h1>Canada PPE Demand Data</h1>
      </div>

      <div className="app__menulist">
        <FormControl className={classes.formControl}>
          <InputLabel >Province</InputLabel>
          <Select
            native
            onChange={onProvinceChange}
            value={province}
          >
            <option aria-label="None" value="" />
            {provinces.map((province) => (
              <option value={province}>{province}</option>
            ))}
          </Select>
        </FormControl>


        {l3csMenu.length > 0 &&
          <FormControl className={classes.formControl}>
            <InputLabel >L3 Consumption Segment</InputLabel>
            <Select
              native
              onChange={onL3csChange}
              value={l3cs}
            >
              <option aria-label="None" value="" />
              {l3csMenu.map((l3cs) => (
                <option value={l3cs}>{l3cs}</option>
              ))}
            </Select>
          </FormControl>
        }



        {l1pMenu.length > 0 &&
          <FormControl className={classes.formControl}>
            <InputLabel >L1 Product</InputLabel>
            <Select
              native
              onChange={onL1pChange}
              value={l1p}
            >
              <option aria-label="None" value="" />
              {l1pMenu.map((l1p) => (
                <option value={l1p}>{l1p}</option>
              ))}
            </Select>
          </FormControl>
        }



        {l2pMenu.length > 0 &&
          <FormControl className={classes.formControl}>
            <InputLabel >L2 Product</InputLabel>
            <Select
              native
              onChange={onL2pChange}
              value={l2p}
            >
              <option aria-label="None" value="" />
              {l2pMenu.map((l2p) => (
                <option value={l2p}>{l2p}</option>
              ))}
            </Select>
          </FormControl>
        }
      </div>

      <div className="app__infocontain">

        <div className="app__chart">
          {Object.keys(demandDate).length > 0 && <Chart demandDate={demandDate} />}
        </div>

        <div className="app__map">
          <MapContainer center={position} zoom={3} >
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {list.map(item =>
              <Circle
                center={item.latlong}
                fillOpacity={0.4}
                pathOptions={{ color: "#7dd71d", fillColor: "#7dd71d" }}
                radius={
                  Math.sqrt(item.demand) * 30
                }
              >
                <Popup>
                  <div className="info-container">
                    <div
                      className="info-flag"
                      style={{ backgroundImage: `url(${item.url})` }}
                    ></div>
                    <div className="info-name">{item.name}</div>
                    <div className="info-confirmed">
                      Demand: {numeral(item.demand).format("0,0")}
                    </div>
                  </div>
                </Popup>
              </Circle>
            )}
          </MapContainer>

        </div>
      </div>
      <div className="app__footer">
        <i>StatCan Hackathon Team1</i>
      </div>
    </div>
  );
}

export default App;
