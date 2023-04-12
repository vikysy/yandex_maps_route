import React, { useEffect, useState } from "react";
import "./App.css";
import { GeoObject, Map, Placemark, Polygon, RoutePanel, YMaps } from "@pbe/react-yandex-maps";
import mkadCoords from "./store/mcadCoords";

function App() {
	const myKey = "0c52a1f9-41c9-4fee-a2fa-a341b7a90949";

	let polygonRef = null;
	
	const [coordsClick, setCoordsClick] = useState(null);
	const [pointClosestPolygon, setPointClosestPolygon] = useState(null);
	const [myRoutePanelRef, setMyRoutePanelRef] = useState(null);

	useEffect(() => {
		if (coordsClick) {
			setPointClosestPolygon(polygonRef.geometry.getClosest(coordsClick)?.position);
		}
	}, [coordsClick]);

	useEffect(() => {
		if(coordsClick && pointClosestPolygon) {
			setMyRoutePanelRef(<RoutePanel
				instanceRef={ref => {
					if (ref) {
						ref.routePanel.state.set({
							fromEnabled: false,
							from: coordsClick,
							toEnabled: false,
							to: pointClosestPolygon,
							type: "auto"
						})
					}
				}}
				options={{
					autofocus: false,
					auto: true,
					pedestrian: true,
					visible: true,
				}}
			/>)
		}
	}, [pointClosestPolygon])

	return (
		<div className="App">
			<YMaps
				query={{
					apikey: myKey
				}}
			>
				<Map
					width="100vw"
					height="100vh"
					modules={["geolocation", "geocode", "multiRouter.MultiRoute"]}
					defaultState={{ center: [55.76, 37.64], zoom: 9 }}
					onClick={(e) => {
						setCoordsClick(e.get("coords"));
					}}
				>
					<Polygon geometry={[mkadCoords]} instanceRef={(e) => polygonRef = e}/>
					{coordsClick && <Placemark geometry={coordsClick} />}
					{(coordsClick && pointClosestPolygon) && (
						<GeoObject 
							geometry={{
								type: "LineString",
								coordinates: [
									coordsClick,
									pointClosestPolygon,
								],
							}}
							options={{
								geodesic: true,
								strokeWidth: 2,
								strokeColor: "#F008",
							}}
						/>
					)}
					{myRoutePanelRef && myRoutePanelRef}
				</Map>
			</YMaps>
		</div>
	);
}

export default App;
