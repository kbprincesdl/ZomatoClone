import React from 'react';
//import '../Styles/filter.css';
import Img1 from '../images/img1.png';
import queryString from 'query-string';
import axios from 'axios';
import '../Styles/search.css';         // Importing css file for external styles



// import { withRouter } from 'react-router-dom';
class Filter3 extends React.Component {
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
            restaurantList: [],
            locationList: [],
            pageCount: [],
            location: undefined,
            cuisine: [],
            mealtype: undefined

        }
    }

    componentWillUnmount() {
        sessionStorage.clear();
    }
    componentDidMount() {
         //console.log(this.props.location.search); //to capture valuyes from  url we use this
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

      let filterObj = {
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
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({
                restaurantList: response.data.restaurant,
                pageCount: response.data.pageCount,
                mealtype: mealtype_id,
                location: location_id
            }))
            .catch(err => console.log(err))

            axios({
                method : 'GET',
                url:'http://localhost:8901/location',
                headers:{'Content-Type':'application/json'}
            
            }).then(response =>{
                    this.setState({locationList: response.data.cities })
            }).catch(error=>{
                return console.log(error);
            })


        // Making location API Call to bind the values in location dropdown
    //     axios({
    //         method: 'GET',
    //         url: 'http://localhost:8901/api/cityList',
    //         headers: { 'Content-Type': 'application/json' }
    //     }).then(response => this.setState({ locationList: response.data.city }))
    //         .catch(err => console.log(err))
    // }
    //     axios({
    //         method: 'GET',
    //         url: 'http://localhost:8901/filter',
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
    //         url:'http://localhost:8901/location',
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
        const { cuisine, mealtype, hcost, lcost, page, sort } = this.state;

        // making the input object for filter API basis changed location
        let filterObj = {
            location_id: area,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: sort,
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${area}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurantList: response.data.restaurant, pageCount: response.data.pageCount, location: area }))
            .catch(err => console.log(err))
    }

    handlePageChange = (pageNumber) => {
        /* This function will be invoked on pagination value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const page = pageNumber;
        const { location, cuisine, mealtype, hcost, lcost, sort } = this.state;

        // making the input object for filter API basis changed pagination
        let filterObj = {
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
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurantList: response.data.restaurant, pageCount: response.data.pageCount, page: page }))
            .catch(err => console.log(err))
    }

    handleCuisineChange = (cuisineId) => {
        /* This function will be invoked on cuisine value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { cuisine, location, mealtype, hcost, lcost, sort, page } = this.state;

        // pushing and poping the cuisines values from array
        if (cuisine.indexOf(cuisineId) == -1) {
            cuisine.push(cuisineId);
        }
        else {
            var index = cuisine.indexOf(cuisineId);
            cuisine.splice(index, 1);
        }

        // making the input object for filter API basis changed cuisine
        let filterObj = {
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
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurantList: response.data.restaurant, pageCount: response.data.pageCount, cuisine: cuisine }))
            .catch(err => console.log(err))
    }

    onSortChange = (sort) => {
        /* This function will be invoked on sort radio button value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, lcost, hcost, mealtype, page } = this.state;

        // making the input object for filter API basis changed sort option
        let filterObj = {
            location_id: location,
            mealtype_id: mealtype,
            cuisine_id: cuisine.length != 0 ? cuisine : undefined,
            hcost: hcost,
            lcost: lcost,
            sort: Number(sort),
            page: page
        };

        // Update the URL basis the changed selections
        this.props.history.push(`/filter?area=${location}&cuisine=${cuisine}&mealtype=${mealtype}&costlessthan=${hcost}&costmorethan=${lcost}&page=${page}&sort=${sort}`);

        axios({
            method: 'POST',
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({ restaurantList: response.data.restaurant, sort: Number(sort), pageCount: response.data.pageCount }))
            .catch(err => console.log(err))
    }

    handleCostChange = (lcost, hcost) => {
        /* This function will be invoked on cost filter value change from filter page,
         and would automatically invoke filter API to fetch the updated restaurants basis the changed selection */

        const { location, cuisine, mealtype, sort, page } = this.state;

        // making the input object for filter API basis changed cost
        let filterObj = {
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
            url: 'http://localhost:8901/filter',
            headers: { 'Content-Type': 'application/json' },
            data: filterObj
        })
            .then(response => this.setState({
                restaurantList: response.data.restaurant,
                lcost: Number(lcost),
                hcost: Number(hcost),
                pageCount: response.data.pageCount
            }))
            .catch(err => console.log(err))
    }
    // handleSortChange=(sort)=>{

    //     const {mealtype_id,location_id,cusine_id,hcost,lcost,page} =this.state;
    //     const filterObj = {
    //         mealtype_id: mealtype_id,
    //         location_id: location_id,
    //         cusine_id: cusine_id,
    //         hcost:hcost,
    //         lcost: lcost,
    //         page:page,
    //         sort:sort
           
    //     }

    //     this.props.history.push(`/filter/?mealtype=${mealtype_id}&area=${location_id}&cuisine=${cusine_id}&costlessthan=${hcost}&costmorethan=${lcost}&sort=${sort}$page=${page}`);
    //     axios({
    //         method: 'GET',
    //         url: 'http://localhost:8901/filter',
    //         headers: { 'Content-Type': 'application/json' },
    //         data: filterObj
    //     }).then(response => {
    //         this.setState({ restaurants: response.data.restaurant,sort:sort})
    //     }).catch(error => {
    //         return console.log(error);
    //     })
        

       
    // }

    
    // handleCostChange=(lCost,hCost)=>{

    //     const {mealtype_id,location_id,cusine_id,page,sort} =this.state;
    //     const filterObj = {
    //         mealtype_id: mealtype_id,
    //         location_id: location_id,
    //         cusine_id: cusine_id,
    //         hcost:hCost,
    //         lcost: lCost,
    //         page:page,
    //        sort:sort
           
    //     }

    //     this.props.history.push(`/filter/?mealtype=${mealtype_id}&area=${location_id}&cuisine=${cusine_id}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}$page=${page}`);
    //     axios({
    //         method: 'GET',
    //         url: 'http://localhost:8901/filter',
    //         headers: { 'Content-Type': 'application/json' },
    //         data: filterObj
    //     }).then(response => {
    //         this.setState({ restaurants: response.data.restaurant, lcost: lCost,hcost:hCost})
    //     }).catch(error => {
    //         return console.log(error);
    //     })
        

       
    // }

     
    // handleLocationsChange=()=>{

    //     const {mealtype_id,location_id,cusine_id,page,sort,hCost,lCost,area} =this.state;
    //     const filterObj = {
    //         mealtype_id: mealtype_id,
    //         location_id: location_id,
    //         cusine_id: cusine_id,
    //         hcost:hCost,
    //         lcost: lCost,
    //         page:page,
    //        sort:sort,
    //        area: area
           
    //     }

    //    // this.props.history.push(`/filter/?mealtype=${mealtype_id}&area=${location_id}&cuisine=${cusine_id}&costlessthan=${hCost}&costmorethan=${lCost}&sort=${sort}$page=${page}`);
    //     axios({
    //         method: 'GET',
    //         url: 'http://localhost:8901/filter',
    //         headers: { 'Content-Type': 'application/json' },
    //         data: filterObj
    //     }).then(response => {
    //         this.setState({ area: area})
    //     }).catch(error => {
    //         return console.log(error);
    //     })
        

       
    // }
    render() {
        const { restaurantList, locationList, pageCount, sort } = this.state;
        return (
            <div>
                <div id="myId" className="heading-filter">Breakfast Places in Delhi</div>
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
                                            return <option value={`${item.location_id}-${item.city_id}`}>{`${item.name}, ${item.city}`}</option>
                                        })}
                                    </select>
                                    <div className="Cuisine">Cuisine</div>
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
                                    <div className="Cuisine">Cost For Two</div>
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
                                    <div className="Cuisine">Sort</div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == 1} onChange={() => this.onSortChange(1)} />
                                        <span className="checkbox-items">Price low to high</span>
                                    </div>
                                    <div>
                                        <input type="radio" name="sort" checked={sort == -1} onChange={() => this.onSortChange(-1)} />
                                        <span className="checkbox-items">Price high to low</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div>
                            <div className="col-sm-9 col-md-9 col-lg-9 scroll">
                                {restaurantList.length > 0 ? restaurantList.map((item) => {
                                    return <div className="Item" onClick={() => this.handleClick(item._id)}>
                                        <div className="row pl-1">
                                            <div className="col-sm-4 col-md-4 col-lg-4">
                                                <img className="img" src={require('../images/breakfast.jpg')} />
                                            </div>
                                            <div className="col-sm-8 col-md-8 col-lg-8">
                                                <div className="rest-name">{item.name}</div>
                                                <div className="res-location">{item.locality}</div>
                                                <div className="rest-address">{item.city}</div>
                                            </div>
                                        </div>
                                        <hr />
                                        <div className="row padding-left">
                                            <div className="col-sm-12 col-md-12 col-lg-12">
                                                {/* <div className="rest-address">CUISINES : {item.cuisine.map((item) => item.name + ', ')}</div>
                                                <div className="rest-address">COST FOR TWO : {item.min_price} </div> */}
                                            </div>
                                        </div>
                                    </div>
                                }) : <div className="noData"> No Data Found</div>}
                            </div>
                            {pageCount.length >= 1 && <div className="pagination">
                                <a href="#">&laquo;</a>
                                {pageCount.map((item) => {
                                    return < a href="#">{item}</a>
                                })}
                                <a href="#">&raquo;</a>
                            </div>}
                        </div>
                    </div>
                </div>
            </div >
        )
    }
}

export default Filter3;


