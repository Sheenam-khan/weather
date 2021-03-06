import React, { useState, useEffect } from 'react';
import './App.css'; 
import moment from 'moment'
import SearchComponent from './components/SearchComponent'
import WeatherDetailComponent from './components/WeatherDetailComponent';
import * as Highcharts from 'highcharts';

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
    
    return (
        <div className="App">

            <SearchComponent
                changeWeatherDetails={changeWeatherDetails}
                placeholder="Location"
                setLoader={setLoader}
            />
           <WeatherDetailComponent
           weatherDetails={weatherDetails}
           options={options}
           options2={options2}
           />

        </div>
    );
}

export default App;
