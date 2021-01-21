import React from 'react';             // Importing React to create a component
import '../Styles/search.css';         // Importing css file for external styles
import axios from 'axios';             // Importing axios to make API Calls within the component
import queryString from 'query-string';// Importing query-string package to parse the values from URL's query string 

import SubHeaher from '../Components/SubHeaher';
class Filter extends React.Component {
    constructor() {
        super();
        this.state = {
            restaurants: [],
            locations:[],
            location_id: undefined,
            mealtype_id: undefined, //initially mealType:undefined
            cusine_id: undefined,
            lcost: undefined,
            hcost: undefined,
            area:undefined,
            page: 1,
            sort: 1, //defulau sortin g 1 ascending
            restaurants: [],
            locationList: [],
            pageCount: [],
            location: undefined,
            cuisine: [],
            mealtype: undefined
           

        }
    }

    componentWillUnmount() {
       // sessionStorage.clear();
    }
    componentDidMount() {
        console.log(this.props.location.search); //to capture valuyes from  url we use this
        const queryParams = queryString.parse(this.props.location.search);
        const mealtype_id = queryParams.mealtype;
        const location_id = queryParams.city;
        const cuisine_id = queryParams.cuisine;
        const hcost=queryParams.costlessthan;
        const lcost=queryParams.costmorethan;
        const page = queryParams.page;
        const sort = queryParams.sort;

        // const locationid =queryParams.locationid;
        // const mealTypeId=queryParams.MealTypeId
        // const cusineId = queryParams.cusineId;
        // const lCost = queryParams.lCost;
        // const hCost = queryParams.hCost;
        
        //filter api call

      const filterObj = {
            location_id: location_id,
            mealtype_id: mealtype_id,
            cuisine_id : cuisine_id ,
            
            lCost: lcost,
            hCost: hcost,
            page: page,
            sort: sort

        };

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({
                restaurants: response.data.restaurant,
                pageCount: response.data.pageCount,
                mealtype: mealtype_id,
                location: location_id
            }))
            .catch(err => console.log(err))

            axios({
                method : 'GET',
                url:'https://zomatoclonebackend.herokuapp.com/location',
                headers:{'Content-Type':'application/json'}
            
            }).then(response =>{
                    this.setState({locationList: response.data.cities })
            }).catch(error=>{
                return console.log(error);
            })


        // Making location API Call to bind the values in location dropdown
    //     axios({
    //         method: 'GET',
    //         url: 'https://zomatoclonebackend.herokuapp.com/api/cityList',
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(response => this.setState({ locationList: response.data.city }))
    //         .catch(err => console.log(err))
    // }
    //     axios({
    //         method: 'GET',
    //         url: 'https://zomatoclonebackend.herokuapp.com/filter',
    //         headers: { 'Content-Type': 'application/json' },
    //         data: filterObj
    //     }).then(response => {
    //         this.setState({ 
    //             restaurants: response.data.restaurant,
    //             pageCount: response.data.pageCount,
    //             location_id: location_id, 
    //             mealtype_id: mealtype_id})
    //     }).catch(error => {
    //         return console.log(error);
    //     })

    //     axios({
    //         method : 'GET',
    //         url:'https://zomatoclonebackend.herokuapp.com/location',
    //         headers:{'Content-Type':'application/json'}
        
    //     }).then(response =>{
    //             this.setState({locations :response.data.cities })
    //     }).catch(error=>{
    //         return console.log(error);
    //     })
    }

    handleClick = (itemId) => {
        this.props.history.push(`/details/?restaurantId=${itemId}`);

    }

    handleLocationChange = (event) => {
        /* This function will be invoked on location value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const area = event.target.value.split('-')[0];
        const city = event.target.value.split('-')[1];
        const { location,cuisine, mealtype, hcost, lcost, page, sort } = this.state;

        // making the input object for filter API basis changed location
        const filterObj = {
            location_id: area,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, pageCount: response.data.pageCount, location: area }))
            .catch(err => console.log(err))
    }

    handlePageChange = (pageNumber) => {
        /* This function will be invoked on pagination value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const page = pageNumber;
        const { location, cuisine, mealtype, hcost, lcost, sort } = this.state;

        // making the input object for filter API basis changed pagination
        const filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, pageCount: response.data.pageCount, page: page }))
            .catch(err => console.log(err))
    }

    handleCuisineChange = (cuisineId) => {
        /* This function will be invoked on cuisine value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */
        const { location, cuisine, mealtype, hcost, lcost, sort, page} = this.state;
    
        // pushing and poping the cuisines values from array
        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        }
        else {
            var index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }

        // making the input object for filter API basis changed cuisine
        const filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, pageCount: response.data.pageCount, cuisine: cuisine }))
            .catch(err => console.log(err))
    }

    handleSortChange = (sort) => {
        /* This function will be invoked on sort radio button value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, mealtype, hcost, lcost, page } = this.state;

        // making the input object for filter API basis changed sort option
        const filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurants: response.data.restaurant, sort: Number(sort), pageCount: response.data.pageCount }))
            .catch(err => console.log(err))
    }

    handleCostChange = (lcost, hcost) => {
        /* This function will be invoked on cost filter value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, mealtype, sort, page } = this.state;

        // making the input object for filter API basis changed cost
        const filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'https://zomatoclonebackend.herokuapp.com/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({
                restaurants: response.data.restaurant,
                lcost: Number(lcost),
                hcost: Number(hcost),
                pageCount: response.data.pageCount
            }))
            .catch(err => console.log(err))
    }
    render() {
       
        const { restaurants, locationList, pageCount, sort ,image,location} = this.state;
        console.log(`restaurantlist ${restaurants}`);
        return (
            <React.Fragment>
                 <SubHeaher />
            
            <div>
                <div id="myId" className="heading-filter">Breakfast Places to look for food</div>
                <div className="container-fluid">
                    <div className="row">
                        <div className="col-sm-3 col-md-3 col-lg-3">
                            <div className="filter-options">
                                <span className="glyphicon glyphicon-th-list toggle-span" data-toggle="collapse"
                                    data-target="#demo"></span>
                                <div id="demo" className="collapse show">
                                    <div className="filter-heading">Filters</div>
                                    <div className="Select-Location">Select Location</div>
                                    <select className="Rectangle-2236" onChange={this.handleLocationChange}>
                                        <option>Select</option>
                                        {locationList.map((item) => {
                                            return <option value={`${item.location_id}-${item.city_id}`}>{`${item.name}`}</option>
                                        })}
                                    </select>
                                    <div className="">Cuisine</div>
                                    <div>
                                        <input type="checkbox" value="1" onChange={() => this.handleCuisineChange(1)} />
                                        <span className="checkbox-items">North Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(2)} />
                                        <span className="checkbox-items">South Indian</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(3)} />
                                        <span className="checkbox-items">Chineese</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(4)} />
                                        <span className="checkbox-items">Fast Food</span>
                                    </div>
                                    <div>
                                        <input type="checkbox" onChange={() => this.handleCuisineChange(5)} />
                                        <span className="checkbox-items">Street Food</span>
                                    </div>
                                    <div className="">Cost For Two</div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 500)} />
                                        <span className="checkbox-items">Less than &#8377; 500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(500, 1000)} />
                                        <span className="checkbox-items">&#8377; 500 to &#8377; 1000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1000, 1500)} />
                                        <span className="checkbox-items">&#8377; 1000 to &#8377; 1500</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1500, 2000)} />
                                        <span className="checkbox-items">&#8377; 1500 to &#8377; 2000</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(2000, 10000)} />
                                        <span className="checkbox-items">&#8377; 2000 +</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="cost" onChange={() => this.handleCostChange(1, 10000)} />
                                        <span className="checkbox-items">All</span>
                                    </div>
                                    <div className="">Sort</div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == 1} onChange={() => this.handleSortChange(1)} />
                                        <span className="checkbox-items">Price low to high</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == -1} onChange={() => this.handleSortChange(-1)} />
                                        <span className="checkbox-items">Price high to low</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="col-sm-9 col-md-9 col-lg-9  details-section scroll">
                                {restaurants.length > 0 ? restaurants.map((item) => {
                                    return <div className="Item" onClick={() => this.handleClick(item._id)}>
                                        <div className="row pl-1">
                                            <div className="col-sm-4 col-md-4 col-lg-4">
                                                {/* <img className="img2" src='/images/breakfast.png' alt="design" height="150" width="140"/>  */}
                                                <img className="img2" src={item.thumb} alt="design" height="150" width="140"/> 
                                            </div>
                                            <div className="col-sm-8 col-md-8 col-lg-8">
                                                <div className="rest-name">{item.name}</div>
                                                <div className="res-location">{item.locality}</div>
                                                <div className="rest-address">{item.address}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row padding-left">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                <div className="rest-address">CUISINES : {item.Cuisine.map((item) => item.name + ' ')}</div>
                                                <div className="rest-address">COST FOR TWO : {item.min_price} </div> 
                                            </div>
                                        </div>
                                    </div>
                                }) : <div className="noData"> No Data Found</div>}
                            </div>
                            <div>
                                
                            </div>
                           <div>
                           {/* {pageCount.length >= 1 && <div className="pagination">
                                <a href="#">&laquo;</a>
                                {pageCount.map((item) => {
                                    return < a href="#">{item}</a>
                                })}
                                <a href="#">&raquo;</a>
                            </div>} */}

                            {restaurants.length == 0 ? null :
                                <div className="pagination">
                                    <a >&laquo;</a>
                                    {pageCount.map((item) => {
                                        return <a onClick={() => this.handlePageChange(item)}>{item}</a>
                                    })}
                                    <a>&raquo;</a>
                                </div>}
                           </div>
                        </div>
                    </div>
                </div>
            </div >
            </React.Fragment>
        )
    }
}

export default Filter;