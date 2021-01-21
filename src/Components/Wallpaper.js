import React from 'react';
import '../Styles/Wallpaper.css';
import homeImg from '../images/homepageimg.png';
import axios from 'axios';
import {withRouter} from 'react-router-dom';

class Wallpaper extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            suggestions: [],
            text: '',
            restaurants: []
        }
    }

    handleLocationChange = (event) => {
        const locationid = event.target.value;
        //const cityname=this.locations.name;
        sessionStorage.setItem('LocationID', locationid);
        //sessionStorage.setItem('CityName',cityname);
    }
    handleChange = (event) => {
        const area = event.target.value.split('-')[0];
        const city = event.target.value.split('-')[1];
        console.log(area, city);
        sessionStorage.setItem('area', area);
        sessionStorage.setItem('city', city);

        axios({
            method: 'GET',
            url: `http://localhost:8901/getRestaurantsbycity/${area}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ restaurants: res.data.restaurantList }))
            .catch(err => console.log(err))

    }
    handleInputChange = (e) => {
        const value = e.target.value;
        const { restaurants } = this.state;
        let suggestions = [];

        if (value.length > 0) {
            suggestions = restaurants.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
        }
        this.setState(() => ({
            suggestions: suggestions,
            text: value
        }))
    }
    selectedText(itemObj) {
        this.setState({
            text: itemObj.name,
            suggestions: [],
        }, () => {
            this.props.history.push(`/details/?restaurantId=${itemObj._id}`);
            // this.props.history.push(`/details/?restaurantId=${itemId}`);
           
        })
    }
    renderSuggestions = () => {
        const { suggestions } = this.state;

        if (suggestions.length === 0) {
            return null;
        }
        return (
            <ul >
                {
                    suggestions.map((item, index) => (<li key={index} onClick={() => this.selectedText(item)}>{`${item.name}, ${item.city_name}`}</li>))
                }
            </ul>
        );
    }
    render() {
        const { locations, text } = this.props;
        //const { text } = this.state;
        return (

            <React.Fragment>
                {/*         
                    <img className="main-img" src={homeImg} style={{ width: '100%', height: '450px' }} />
                    <div className="logo"><b>e!</b></div> 
                    <div className="headings">Find the best restaurants, cafés, and bars</div>
                    <div className="locationSelector">
                    <select className="locationDropdown" onChange={this.handleChange}>
                        <option value="0">Select</option>
                        {locations.map((item, index) => {
                            return <option key={index} value={`${item.location_id}-${item.city_id}`}>{`${item.name}, ${item.city}`}</option>
                        })}
                    </select>

                    <div id="notebooks">
                        <input id="query" type="text" onChange={this.onTextChange} value={text} />
                        {this.renderSuggestions()}
                    </div>
                    <span className="glyphicon glyphicon-search search"></span>

                </div> */}
                <div>
                    <img className="main-img" src={homeImg} style={{ width: '100%', height: '450px' }} alt="design" />
                </div>

                <div className="logo"><b>e!</b></div>
                <div className="Find-the-best-restaurants-cafs-and-bars">Find the best restaurants, cafés, and bars
                </div>
                <div>
                    <select className="Please-type-a-location" type="text" placeholder="Please-type-a-location" onChange={this.handleChange}>
                        <option value="0">Select</option>
                        {locations.map((item, index) => {
                            return <option key={index} value={`${item.location_id}-${item.city_id}`}>{`${item.name}`}</option>
                        })}
                    </select>

                    {/* <div className="glyphicon glyphicon-search searches" aria-hidden="true"></div> */}
                    <div id="notebooks">
                        <input id="query" className="restaurantsinput" type="text" placeholder="Search for Restaurant" value={text} onChange={this.handleInputChange} />
                        {this.renderSuggestions()}
                    </div>
                    <span className="glyphicon glyphicon-search search"></span>


                </div>



            </React.Fragment>

        )
    }
}
export default withRouter(Wallpaper);
