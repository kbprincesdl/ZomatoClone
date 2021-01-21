import React from 'react';

import Wallpaper from '../Components/Wallpaper';
import QuickSearch from '../Components/QuickSearch';

import axios from 'axios';
import Header from './Header';
class Home extends React.Component{
 
        constructor(){
            super();
            this.state={
                locations:[],
                mealtypes:[]
            }
        }
       
        componentDidMount(){
            sessionStorage.setItem('area', undefined);
            sessionStorage.setItem('city', undefined);
            //sessionStorage.setItem('LocationID',undefined);  not working
            //so use 
            //sessionStorage.clear();
        axios({
                method : 'GET',
                url:'https://zomatoclonebackend.herokuapp.com/location',
                headers:{'Content-Type':'application/json'}
            
            }).then(response =>{
                    this.setState({locations :response.data.cities })
            }).catch(error=>{
                return console.log(error);
            })

            axios({
                method : 'GET',
                url:'https://zomatoclonebackend.herokuapp.com/mealtype',
                headers:{'content-Type':'application/json'}
            }).then(response =>{
                    this.setState({mealtypes :response.data.mealtypes })
            }).catch(error=>console.log(error));
    }
    render(){
        const {locations,mealtypes} =this.state;
        return(
            <div>
                <Header />
                <Wallpaper locations={locations}/>
                <QuickSearch QuickSearches={mealtypes}/>
            </div>

        )
    }
}

export default Home;