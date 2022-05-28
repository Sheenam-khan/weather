import React, { useState, useEffect, useContext } from 'react';
import { Select, message } from 'antd';
import {
    SearchOutlined,
} from '@ant-design/icons';
import _ from 'lodash';
import axios from 'axios';
import moment from 'moment'
const apiKey = 'AIzaSyAqu6fqJ9JMsC83CNtkOje2X-KylbDnoss';
const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74';
const key = 'AIzaSyDYp1te-bQEhWE9P9yehRE3biB7LpSEh4U'
const language = 'en'; 
const country = 'country:in|country:bt|country:np|country:pk|country:af';

const GoogleComponent = props => {
    console.log("props", props)
    const [result, setresult] = useState([]);
    const [city, setcity] = useState('');
    const [weatherDetails, setWeatherDetails] = useState({})
    const getHourlyWeather = (hourlyData, timezone) => {

        const endOfDay = moment().endOf("day").valueOf();

        const eodTimeStamp = Math.floor(endOfDay / 1000);

        const todaysData = hourlyData.filter((data) => data.dt < eodTimeStamp);
        return todaysData;
    };
    const getWeatherData = async (latitude, longitude) => {

        try {
            const { data } = await axios.get(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely&units=metric&appid=${API_KEY}`)


            const weeklyWeather = data.daily;
            const currentWeather = data.current;

            const hourlyWeather = getHourlyWeather(data.hourly, data.timezone);


            setWeatherDetails({ currentWeather, weeklyWeather, hourlyWeather })
            props.changeWeatherDetails({ currentWeather, weeklyWeather, hourlyWeather })

        }
        catch (err) {
            return;
        }
    }


    const getAddress = async (param) => {
        console.log("location***********", param)

        let url = param?.address ? `https://maps.googleapis.com/maps/api/geocode/json?address=${param?.address}&key=${key}` : `https://maps.googleapis.com/maps/api/geocode/json?latlng=${param?.latitude},${param?.longitude}&key=${key}`
        try {
            console.log("url", url, param)
            const { data } = await axios.get(url)
            console.log("weather ", data)
            if (data?.results) {
                const {
                    results: [
                        {
                            geometry: { location },
                            formatted_address
                        },
                    ],
                } = data;
                console.log("resukts", location, formatted_address)
                setcity(formatted_address)
                setresult(data.results)
                const { lat: latitude, lng: longitude } = location
                getWeatherData(latitude, longitude)


            }


        }
        catch (err) {
            return;
        }
    }

    const getCurrentLocation = () => {

        if ("geolocation" in navigator) {

            navigator.geolocation.getCurrentPosition(
                location => {
                    console.log(" current location", location)
                    let { latitude, longitude } = location.coords;
                    getAddress({ latitude, longitude })
                }
            );
        }
        else {
            axios
                .get(`http://ip-api.com/json`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                .then(({ data }) => {
                    let { lat: latitude, lon: longitude } = data
                    getWeatherData(latitude, longitude)

                    setcity(`${data?.city} , ${data.regionName} , ${data.country}`)
                })
                .catch(err => {
                    console.log(err);

                });
        }

    };

    useEffect(() => {
        try {
            getCurrentLocation();
            props.setLoader(false)
        } catch (err) {
            console.log(err);
        }
    }, []);

    const handleSearch = param => {
 
        if (param) {
            setcity(param)
            getAddress({ address: param })
                .then(res => {
                    console.log("res", res);
                    // if (res.length > 0) {
                    //   setresult(res);
                    // } else {
                    //   setresult([]);
                    // }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    };

    const handleChange = values => {
        getAddress({ address: city })
            .then(location => {

            })
            .catch(err => {
                console.log(err);
            });
    };

    console.log("city", city, weatherDetails)
    return (
        <div
            className="location-box-cover" >
            <Select
                showSearch={true}
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onChange={handleChange}
                onSearch={handleSearch}
                notFoundContent={null}
                value={city}
                suffixIcon={<SearchOutlined />}
                placeholder='Search Location ...'
                style={{ width: "100%", borderRadius: '10px', marginTop: '30px' }}
            >
                {result.map((result, i) => (
                    <Select.Option value={result.formatted_address} key={i}>
                        {result.formatted_address}
                    </Select.Option>
                ))}
            </Select>
        </div>
    );
};

export default GoogleComponent