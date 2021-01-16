import React from 'react';
import '../Styles/QuickSearch.css';
import { withRouter } from 'react-router-dom';

// import breakfast from '../images/breakfast.jpg';

// import dinner from '../images/dinner.png';
// import drinks from '../images/drinks.png';
// import lunch from '../images/lunch.jpg';
// import snacks from '../images/snacks.png';
// import food from '../images/food.jpg';

class QuickSearchItem extends React.Component {
    handleClick = (id) => {
        //const locationID=11;
        const locationID = sessionStorage.getItem('LocationID');
        //const  CityName=sessionStorage.getItem('CityName');
        const mealtype = id;
        const city = sessionStorage.getItem('city');
        const area = sessionStorage.getItem('area');
       
        if (area) {
            //this.props.history.push(`/filter/?mealtype=${id}&area=${locationID}`);
            this.props.history.push(`/filter/?mealtype=${mealtype}&area=${area}&city=${city}`);

        }
        else {
            this.props.history.push(`/filter/?mealtype=${id}`);

        }
    }
    render() {
        const { id, name, content, image } = this.props;
        return (

        //    <div className="">
        //     <div className="row">
         
        //     <div className="col-sm-4 col-md-4 col-lg-4" onClick={() => this.handleClick(id)}>
        //         <div className="main-block">
        //             <div className="left-block">
        //                 <img className="img2" src={'../images/' + image} alt="design" height="150" width="140" />
        //             </div>
        //             <div className="right-block">
        //                 <div className="Start-with-exclusive-options">{name}</div>
        //                 <div className="Right-Subheading">{content}</div>
        //             </div>  
        //         </div>
        //     </div>
       
        //     </div>
        //     </div>
            <div className="col-sm-12 col-md-3 col-lg-4" onClick={() => this.handleClick(id)}>
                <div className="main-block">             
                   <div className="left-block">
                        <img className="img2" src={image}  alt="design" height="150" width="140"/> 
                    </div>
                   <div className="right-block">
                        <div className="Start-with-exclusive-options">{name}</div>     
                        <div className="Right-Subheading">{content}</div>
                   </div>
                </div>
            </div>

        )
    }
}
export default withRouter(QuickSearchItem);