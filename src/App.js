import React, { useState, useEffect } from "react";
import "./App.css";
import styled, { css } from "styled-components";
import "typeface-roboto";
import useGeolocation from "react-hook-geolocation";

import "./App.css";

function App() {
	const geolocation = useGeolocation();
	const [backgroundColor, setbackgroundColor] = useState("#cccccc");

	return (
		<El className='App' role='main' backgroundColor={backgroundColor}>
			<h1>Weather or not</h1>
			{(() => {
				if (!geolocation.error) {
					return (
						<ul>
							<li>Latitude: {geolocation.latitude}</li>
							<li>Longitude: {geolocation.longitude}</li>
							<li>Location accuracy: {geolocation.accuracy}</li>
							<li>Altitude: {geolocation.altitude}</li>
							<li>
								Altitude accuracy:{" "}
								{geolocation.altitudeAccuracy}
							</li>
							<li>Heading: {geolocation.heading}</li>
							<li>Speed: {geolocation.speed}</li>
							<li>Timestamp: {geolocation.timestamp}</li>
						</ul>
					);
				} else {
					return (
						<p className='system-information'>
							No geolocation, sorry.
						</p>
					);
				}
			})()}
		</El>
	);
}

export default App;

const El = styled.div`
	height: 100vh;
	padding: var(--spacing-half);
	display: flex;
	align-items: center;
	justify-content: center;
	flex-direction: column;
	font-family: roboto;

	${(props) =>
		props.backgroundColor &&
		css`
			background: ${props.backgroundColor};
		`}

	h1 {
		font-size: 30px;
		margin-bottom: var(--spacing-full);
	}

	.system-information {
		font-size: 20px;
	}

	@media (min-width: 768px) {
	}
`;
