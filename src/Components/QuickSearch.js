import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import '../Styles/QuickSearch.css';

import QuickSearchItem from './QuickSearchItem';

// import breakfastImg from '../images/breakfast.jpg';
// import dinnerImg from '../images/dinner.png';
// import drinksImg from '../images/drinks.png';
// import lunchImg from '../images/lunch.jpg';
// import snacksImg from '../images/snacks.png';
// import foodImg from '../images/food.jpg';


class QuickSearch extends React.Component {
    render() {
        const { QuickSearches } = this.props;

        return <React.Fragment>       
    <div class="container-fluid">
        <div class="row">
            <div>
                <div className="Quick-Searches">Quick Searches</div>
                <br/>
                <div className="Discover-restaurants-by-type-of-meal">Discover restaurants by type of meal
                </div>
            </div>    
        </div>
        <div class="row">
                {QuickSearches.map((item,index) => {
                    return <QuickSearchItem key ={index} id={item._id} name={item.name} content={item.content} image={item.image} />
                })} 
        </div>
    </div>         
                                                       
    </React.Fragment>
    }
}
export default QuickSearch;
