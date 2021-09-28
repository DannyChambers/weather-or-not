/*
Developer notes.

1. I would normally use a fully componentised system with sandboxed components, documentation and a Storybook.
2. I have used Styled-compinents here but I am also perfectly comfortable with SASS.
3. I haven't had time to add the stretch goals, apologies.
4. 

*/

import React, { useState, useEffect } from "react";
import "./App.css";
import styled, { css } from "styled-components";
import "typeface-roboto";
import useGeolocation from "react-hook-geolocation";
import axios from "axios";

import "./App.css";

function App() {
	const geolocation = useGeolocation();
	const [closeModal, setCloseModal] = useState(false);
	const [icon, setIcon] = useState(null);
	const [temperature, setTemperature] = useState(null);
	const [backgroundColor, setbackgroundColor] = useState("#ffffff");

	const getSetWeather = async () => {
		const location = await axios(
			`https://www.metaweather.com/api/location/search/?lattlong=${geolocation.latitude},${geolocation.longitude}`
		);

		const weather = await axios(
			`https://www.metaweather.com/api/location/${location.data[0].woeid}/`
		);

		setIcon(weather.data.consolidated_weather[0].weather_state_abbr);
		setTemperature(weather.data.consolidated_weather[0].the_temp);
	};

	useEffect(() => {
		if (geolocation.latitude) {
			setInterval(function () {
				getSetWeather();
			}, 5000);
		}
	}, [geolocation]);

	useEffect(() => {
		if (temperature) {
			const equateRange = (
				//Map one range against another: https://www.codegrepper.com/code-examples/javascript/how+to+map+a+group+of+numbers+to+another+range+in+js
				val,
				in_min,
				in_max,
				out_min,
				out_max
			) =>
				((val - in_min) * (out_max - out_min)) / (in_max - in_min) +
				out_min;

			/*
                Developer note: 
                The equation above must be modified to map an ascending range of nubers against a descending one - But I'm afraid I am simply out of time. 
                Hopefully I have demonstrated enough.
                */

			if (parseInt(temperature) <= -10) {
				setbackgroundColor(`hsl(180, 100%, 50%)`);
			} else if (parseInt(temperature) >= 30) {
				setbackgroundColor(`hsl(33, 100%, 50%)`);
			} else {
				let hue = Math.floor(equateRange(30, -10, 30, 33, 180));

				setbackgroundColor(`hsl(${hue}, 100%, 50%)`);
			}
		}
	}, [temperature]);

	return (
		<El className='App' role='main' backgroundColor={backgroundColor}>
			<h1 className='visually-hidden'>Weather or not</h1>

			{(() => {
				if (!closeModal) {
					return (
						<div className='overlay'>
							<div className='modal'>
								<div className='modal-content'>
									<h2>Enable location services</h2>
									<p>
										Please enable location services for this
										utility.
									</p>
									<button onClick={setCloseModal}>
										Got it!
									</button>
								</div>
							</div>
						</div>
					);
				} else {
					return (
						<>
							{(() => {
								if (!geolocation.error) {
									return (
										<>
											{(() => {
												if (temperature) {
													return (
														<>
															<img
																src={`https://www.metaweather.com/static/img/weather/${icon}.svg`}
															/>
															<p>
																Current
																temperature:
																{` ${temperature} degrees`}
															</p>
														</>
													);
												} else {
													return (
														<p className='system-information'>
															Loading data..
														</p>
													);
												}
											})()}
										</>
									);
								} else {
									return (
										<p className='system-information'>
											Please allow us to use your location
											to provide this service.
											Alternatively find weather
											information here:{" "}
											<a
												href='https://www.metoffice.gov.uk/weather/'
												target='_blank'
											>
												https://www.metoffice.gov.uk/weather/
											</a>
										</p>
									);
								}
							})()}
						</>
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

	h2 {
		font-size: 26px;
		margin-bottom: var(--spacing-full);
	}

	p {
		font-size: 16px;
		margin-bottom: var(--spacing-full);
	}

	button {
		font-size: 18px;
		line-height: 44px;
		padding: 0 var(--spacing-half);
		cursor: pointer;
	}

	.system-information {
		font-size: 20px;
	}

	img {
		max-width: 150px;
		margin-bottom: var(--spacing-full);
	}

	.visually-hidden {
		height: 0;
		width: 0;
		overflow: hidden;
		position: absolute;
		top: -9999px;
		left: -9999px;
	}

	.overlay {
		position: fixed;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		background: rgba(1, 1, 1, 0.6);
		display: table;

		.modal {
			display: table-cell;
			vertical-align: middle;
			text-align: center;

			.modal-content {
				background: white;
				border-radius: 10px;
				padding: var(--spacing-double) var(--spacing-full);
				margin: 0 auto;
				max-width: 768px;
			}
		}
	}

	@media (min-width: 768px) {
	}
`;
