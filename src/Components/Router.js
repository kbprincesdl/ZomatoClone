import React from 'react';
import {BrowserRouter,Route } from 'react-router-dom';

import Home from '../Components/Home';
import Filter from '../Components/Filter';
import Details from '../Components/Details';

import Header from './Header';
//import Filter from './Filter';
// import Pay from '../Components/Pay';
import MyOrders from '../Components/MyOrders';

function Router(){

    return(

        <BrowserRouter>
            {/* <Header /> */}
           <Route exact path="/" component={Home} /> 
           < Route path="/details" component={Details} />
           < Route path="/filter" component={Filter} />
           {/* < Route path="/Pay" component={Pay} /> */}
           < Route path="/MyOrders" component={MyOrders} />
          
        </BrowserRouter>
        // default url is subset of second url so child also shows parent /child
        //so we use exact keyword here to differentiate it from /child
    ) 
    
}

export default Router;