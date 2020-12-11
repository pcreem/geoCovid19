import './App.css';
import { MapContainer, Circle, Popup, TileLayer } from "react-leaflet";
import list from './laln.json';
import numeral from "numeral";

function App() {
  const position = [50.8549217, -130.2094884]
  return (
    <div className="app">
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
  );
}

export default App;
