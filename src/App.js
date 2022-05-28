import React, { useState, useEffect } from 'react';
import './App.css';
import * as Highcharts from 'highcharts';
import HighchartsReact from "highcharts-react-official";
import moment from 'moment'
import SearchComponent from './SearchComponent'

function App() {
    const [weatherDetails, setWeatherDetails] = useState({})
    const [loader, setLoader] = useState(true)

    const options = {
        chart: {
            height: 300
        },
        title: {
            text: '',
            useHTML: true,
            style: {
                display: 'none'

            }
        },
        subtitle: {
            style: {
                display: 'none'

            },
            text: '',
            useHTML: true,
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                dataLabels: {
                    enabled: false,
                    //   y: -2,

                    style: {
                        fontSize: "9px",
                        color: "#fff"
                    }
                },
                borderWidth: 0,
                pointPadding: 0.2,
                colorByPoint: false,
                showInLegend: false
            }
        },
        yAxis: {
            visible: false,
            min: 0,
        },
        xAxis: {
            categories: weatherDetails?.hourlyWeather?.map((item) => `${item?.temp?.toFixed(0)}°C ${moment.unix(item?.dt).format("LT")}`) || [],
            lineWidth: 0,

            reversed: false,
            tickmarkPlacement: 'on',
            gridLineWidth: 1,
            labels: {
                formatter: function () {
                    return `<h1><b>${this.value.toString().substring(0, 4)}</b><br/>${this.value.toString().substring(4)}</h1>`
                },
            }
        },
        tooltip: {

            formatter: function () {
                return `${this.x}`
            },
        },
        series: [{
            data: weatherDetails?.hourlyWeather?.map((item) => Math.floor(item.temp)) || [],
            marker: {
                lineWidth: 2,
                lineColor: Highcharts.getOptions().colors[0],
                fillColor: 'white'
            }

        }]
    }

    const options2 = {
        chart: {
            height: 200
        },
        title: {
            text: '',
            useHTML: true,
            style: {
                display: 'none'

            }
        },
        subtitle: {
            style: {
                display: 'none'

            },
            text: '',
            useHTML: true,
        },
        credits: {
            enabled: false
        },
        plotOptions: {
            series: {
                cursor: "pointer",
                dataLabels: {
                    enabled: false,
                },
                marker: {
                    enabled: false
                }
            }
        },
        yAxis: {
            visible: false,

        },
        xAxis: {
            categories: [moment.unix(weatherDetails?.currentWeather?.sunrise).format("LT"), moment.unix(weatherDetails?.currentWeather?.dt).format("LT"), moment.unix(weatherDetails?.currentWeather?.sunset).format("LT")] || [],

            lineWidth: 1,
            crosshair: true,
            gridLineWidth: 0,
            labels: {
                formatter: function () {
                    return `<h1><b>${this.value.toString().substring(0, 4)}</b><br/>${this.value.toString().substring(4)}</h1>`
                },
            }
        },
        tooltip: {

            formatter: function () {
                return `${this.x}`
            },
        },
        series: [{
            type: "areaspline",
            showInLegend: false,
            color: "#feefca",
            data: [parseInt(moment.unix(weatherDetails?.currentWeather?.sunrise).format("HH")), parseInt(moment.unix(weatherDetails?.currentWeather?.dt).format("HH")), parseInt(moment.unix(weatherDetails?.currentWeather?.sunset).format("HH"))] || [],

        }]
    }

    const changeWeatherDetails = (value) => {
        setWeatherDetails(value)
    }
    console.log("changeWeatherDetails", weatherDetails)


    return (
        <div className="App">

            <SearchComponent
                changeWeatherDetails={changeWeatherDetails}
                placeholder="Location"
                setLoader={setLoader}
            />
            <div class="future-forecast">


                <div class="weather-forecast" id="weather-forecast">
                    {weatherDetails?.weeklyWeather?.slice(0, -1)?.map((weather, index) =>
                        <div class={index == 0 ? 'weather-forecast-item-now' : 'weather-forecast-item'}>
                            <div class="day">{moment.unix(weather.dt).format("ddd")}</div>   <h4>
                                <span>{weather.temp.max.toFixed(0)}&deg;C</span>

                                <span>{weather.temp.min.toFixed(0)}&deg;C</span>
                            </h4>
                            <img src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                                alt="weather icon" class="w-icon" />
                            <h5>{weather.weather[0].description}</h5>
                        </div>
                    )}

                </div>
            </div>

            <div class="card">
                <div class="left">
                    <h1>{weatherDetails?.currentWeather?.temp?.toFixed(0)}&deg;C</h1>
                    <img src={`https://openweathermap.org/img/wn/${weatherDetails?.currentWeather?.weather[0].icon}@2x.png`} alt="weather icon" class="w-icon" />
                </div>

                <div class="right">
                    <HighchartsReact
                        highcharts={Highcharts}
                        options={options}
                        containerProps={{ style: {} }}
                    />
                </div>

                <div className='today'>
                    <div className="today__left-content" style={{ background: "#f5faff" }}><h3>Pressure</h3> <span>{weatherDetails?.currentWeather?.pressure?.toFixed(0)}hpa</span> </div>
                    <div className="today__right-content"><h3>Humidity</h3> <span>{weatherDetails?.currentWeather?.humidity?.toFixed(0)}%</span></div>
                </div>
                <div className='today' >
                    <div className="today__left-content" style={{ background: "white" }}><h3>Sunrise</h3> <span>{moment.unix(weatherDetails?.currentWeather?.sunrise).format("LT")}</span> </div>
                    <div className="today__right-content" style={{ background: "white" }}><h3>Sunset</h3> <span>{moment.unix(weatherDetails?.currentWeather?.sunset).format("LT")}</span></div>
                </div>
                <HighchartsReact
                    highcharts={Highcharts}
                    options={options2}
                    containerProps={{ style: {} }}
                />
            </div>

        </div>
    );
}

export default App;
