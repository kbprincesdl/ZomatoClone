import React from 'react';
import '../Styles/details.css';

import querystring from 'query-string';
import axios from 'axios';

import detailsImg from '../images/details.png';
import Modal from 'react-modal';

import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

import Pay from '../Components/Pay';
import SubHeaher from '../Components/SubHeaher';

// const customStyles = {
//     content : {
//       top                   : '50%',
//       left                  : '50%',
//       right                 : 'auto',
//       bottom                : 'auto',
//       marginRight           : '-50%',
//       transform             : 'translate(-50%, -50%)'
//     }
//   };
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '2px',
        backgroundColor: 'white',
        border: 'solid 2px brown',
        zIndex: '150'
    }
};
class Details extends React.Component {

    constructor() {
        super();
        this.state = {
            restaurant: {},
            itemModalIsOpen: false,
            formModalIsOpen: false,
            galleryModalIsOpen: false,
            restaurantId: '',
            items: [],
            subTotal: 0,
            name: '',
            email: '',
            phone: '',
            amount: '',
            contactNumber: '',
            address: ''
            //  restaurant:[],

            //  restaurantId:undefined,

            //  items:[],
            //  subTotal:0,
            //  itemsRest:[],
            //  ItemsList:[],
            //  Name: '',
            // Mobile: '',
            // Address: '',
            // orderModalIsOpen:false,
            // itemModalIsOpen:false,
            // formModalIsOpen: false,
            // galleryModalIsOpen: false,
            // location_id:undefined

        }

    }
    componentDidMount() {

        const queryParams = querystring.parse(this.props.location.search);
        const restaurantId = queryParams.restaurantId;
        console.log(`query params ${this.props.location.search}`);
        //api call
        axios({
            method: 'GET',
            url: `https://zomatoclonebackend.herokuapp.com/getResById/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        })
            .then(response => {
                this.setState({ restaurant: response.data.restaurant, restaurantId: restaurantId })
            }).catch(error => {
                return console.log(error)
            })
        console.log(`details restarutant :${this.restaurant}`);

    }

    makeOrder = () => {
        const { restaurantId } = this.state;
        // console.log(restaurantId);
        axios({
            method: 'GET',
            url: `https://zomatoclonebackend.herokuapp.com/getRestaurantItemsById/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ items: res.data.ItemsList, orderModalIsOpen: true }))
            .catch(err => console.log(err))
    }


    handleOrder = () => {
        const { restaurantId } = this.state;
        axios({
            method: 'GET',
            url: `https://zomatoclonebackend.herokuapp.com/getRestaurantItemsById/${restaurantId}`,
            headers: { 'Content-Type': 'application/json' }
        }).then(response => {
            this.setState({ items: response.data.ItemsList, itemModalIsOpen: true })
        }).catch(error => console.log(error));

        console.log(this.ItemsList);

    }
    handlefooditemclose = () => {
        this.setState({ orderModalIsOpen: false })
    }

    openDetailsWindow = () => {
        this.setState({ detailModelsOpen: true, orderModalIsOpen: false })
    }


    addItems = (index, operationType) => {
        let total = 0;
        const items = [...this.state.items]; //mutating the array creating a  copy of array
        const item = items[index];

        if (operationType == 'add') {
            item.qty = item.qty + 1;
        }
        else {
            item.qty = item.qty - 1;
        }
        items[index] = item;
        items.map((item) => {
            total += item.qty * item.price;
        })
        this.setState({ items: items, subTotal: total });
    }

    handlePay = () => {
        this.setState({ itemModalIsOpen: false, formModalIsOpen: true })
    }

    handleModalClose = (state) => {
        this.setState({ [state]: false });  //[state] here is dynamic variable
    }

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }

    handleSubmit = (event) => {
        const { name, contactNumber, address } = this.state;
        if (name && contactNumber && address) {
            const obj = {
                name: name,
                contactNumber: contactNumber,
                address: address
            };
            // Payment API Call
            // this.makepayment(obj);
        }
        else {
            alert('All are mandatory feilds, plz fill them');
        }
        event.preventDefault();  //default nature of html to post 

    }

    handleGallery = () => {
        this.setState({ galleryModalIsOpen: true });
    }
    //   handleClose = () => {
    //     // setState to close the modal
    //     this.setState({ loginModalIsOpen: false });
    // }


    isDate(val) {
        // Cross realm comptatible
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    isObj = (val) => {
        //return typeof val === 'object'
        return Object.prototype.toString.call(val) === '[object Date]'
    }

    stringifyValue = (val) => {
        if (this.isObj(val) && !this.isDate(val)) {
            return JSON.stringify(val)
        } else {
            return val
        }
    }

    buildForm = ({ action, params }) => {

        const form = document.createElement('form')
        //const action="submit"
        form.setAttribute('method', 'post')
        form.setAttribute('action', action)

        Object.keys(params).forEach(key => {
            const input = document.createElement('input')
            input.setAttribute('type', 'hidden')
            input.setAttribute('name', 'f1')
            input.setAttribute('value', this.stringifyValue(params[key]))
            form.appendChild(input)
        })

        return form
    }

    post = (details) => {
        const form = this.buildForm(details)
        document.body.appendChild(form)
        form.submit()
        form.remove()
    }
    getData = (data) => {
        return fetch(`https://zomatoclonebackend.herokuapp.com/paynow`, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        }).then(response => response.json()).catch(err => console.log(err))
    }

    makepayment = (e) => {
        const { subTotal } = this.state;
        this.getData({ amount: "100.00", email: "abc@gmail.com" }).then(response => {
            var information = {
                action: "https://securegw-stage.paytm.in/theia/processTransaction",
                params: response
            }
            this.post(information);
        })
        e.preventDefault();
    }


    makePaytmCall = () => {
        // this.props.history.push(`https://zomatoclonebackend.herokuapp.com`);
        //const {restaurantId}=this.state;
        axios({
            method: 'POST',
            url: `https://zomatoclonebackend.herokuapp.com/paynow`,
            headers: { 'Content-Type': 'text/html' }
        }).then(response => {
            console.log(response);
        }).catch(error => console.log(error));
        // fetch("https://zomatoclonebackend.herokuapp.com/")
        // .then(res=>{
        //     console.log(res);
        // }).catch(error=>console.log(error))
        this.setState({ formModalIsOpen: false });
        //e.preventDefault(); 
    }

    handlefooditemclose = () => {
        this.setState({ orderModalIsOpen: false })
    }


    render() {
        const { restaurant, itemModalIsOpen, items, subTotal, formModalIsOpen, name, phone, email, amount, address, contactNumber, galleryModalIsOpen } = this.state;
        // console.log(restaurant);   
        // console.log(`items -${items}`);
        return (
            <React.Fragment>
                <SubHeaher />

                <div>
                    {restaurant != null ?
                        <React.Fragment>

                            <div className="container-fluid">
                                <div className="row pl-1">

                                    <div className="col-sm-4 col-md-4 col-lg-4">
                                        <img className="detailsImg" src={restaurant.thumb} alt="No Image, currently" />
                                        {/* <Pay /> */}

                                    </div>
                                </div>

                                {/* Showcasing the First Image and rest will be showed in the Carousal  */}
                                <button className="gallery-button" onClick={this.handleGallery}>Click to see Image Gallery</button>
                            </div>
                            <button className="btn btn-danger" style={{ float: 'right', margin: '25px' }} onClick={this.handleOrder} >Place Online Order</button>
                            {/* Showing 2 Tabs on screen as Overview and Contact with details in respective sections*/}
                            <div className="heading">{restaurant.name}</div>

                            <div>


                                <Tabs className="tab-list">
                                    <TabList className="tab-list-item">
                                        <Tab className="tab-list-active">Overview</Tab>
                                        <Tab>Contact</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <h2>About the place</h2>
                                        <div>
                                            <div className="about">About the place</div>
                                            <div className="head">Cuisine</div>
                                            <div className="value">{restaurant.cuisine ? restaurant.cuisine.map((item) => item.name + ' ,') : null}</div>
                                            <div className="head">Average Cost</div>
                                            <div className="value">&#8377; {restaurant.min_price} for two people(approx)</div>
                                        </div>

                                    </TabPanel>
                                    <TabPanel>
                                        <h2>Contact Details</h2>
                                        <div className="head">Phone Number</div>
                                        <div className="value">{restaurant.contact_number}</div>
                                        <div className="head">{restaurant.name}</div>
                                        <div className="value">{`${restaurant.locality}, ${restaurant.city}`}</div>
                                    </TabPanel>
                                </Tabs>

                            </div>

                            {/* Modal within which we will show the carousal of Images*/}

                            <div>
                                <Modal
                                    isOpen={itemModalIsOpen}
                                    style={customStyles}>

                                    <div >
                                        <div>
                                            <p >
                                                <a href="#" onClick={() => this.handleModalClose('itemModalIsOpen')}>
                                                    <span class="glyphicon glyphicon-remove-sign" style={{ float: 'right' }}></span>
                                                </a>
                                            </p>
                                        </div>
                                        <h3 className="restaurant-name">{restaurant.name}</h3>
                                        <h3>SubTotal : {subTotal}</h3>
                                        <button className="btn btn-danger" onClick={this.handlePay}> Pay Now</button>
                                        {items.map((item, index) => {
                                            return <div style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', borderBottom: '2px solid #dbd8d8' }}>
                                                <div className="card" style={{ width: '43rem', margin: 'auto' }}>
                                                    <div className="row" style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                        <div className="col-xs-9 col-sm-9 col-md-9 col-lg-9 " style={{ paddingLeft: '10px', paddingBottom: '10px' }}>
                                                            <span className="card-body">
                                                                <h5 className="item-name">{item.name}</h5>
                                                                <h5 className="item-name">&#8377;{item.price}</h5>
                                                                <p className="card-text">{item.description}</p>
                                                            </span>
                                                        </div>
                                                        <div className="col-xs-3 col-sm-3 col-md-3 col-lg-3">
                                                            <img className="imgdetails" src={detailsImg} alt="designs" />
                                                            {item.qty == 0 ? <div><button className="add-button" onClick={() => this.addItems(index, 'add')}>Add</button></div> :
                                                                <div className="add-number"><button onClick={() => this.addItems(index, 'subtract')}>-</button><span style={{ backgroundColor: 'white' }}>{item.qty}</span><button onClick={() => this.addItems(index, 'add')}>+</button></div>}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        })}
                                        <div className="card" style={{ width: '44rem', marginTop: '10px', marginBottom: '10px', margin: 'auto' }}>
                                            <div className="row">
                                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal" style={{ paddingLeft: '26px' }}>Subtotal</div>
                                                <div className="col-xs-4 col-sm-4 col-md-4 col-lg-4 subtotal">&#8377; {subTotal}</div>


                                            </div>
                                        </div>

                                    </div>
                                </Modal>
                                <Modal
                                    isOpen={formModalIsOpen}
                                    style={customStyles}>

                                    <div>
                                        <div onClick={() => this.handleModalClose('formModalIsOpen')}></div>
                                        {/* <form>  */}
                                        <form className="" action="https://zomatoclonebackend.herokuapp.com/paynow" method="post">
                                            {/* <form onClick={this.handleSubmit}>  */}

                                            <table className="table table-border table-striped table-hover">
                                                <tr>
                                                    <td>
                                                        <label>Name : </label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" name="name" onChange={(event) => this.handleChange(event, 'name')} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Mobile No : </label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" name="phone" onChange={(event) => this.handleChange(event, 'phone')} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Email : </label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" name="email" onChange={(event) => this.handleChange(event, 'email')} />
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td>
                                                        <label>Amount : </label>
                                                    </td>
                                                    <td>
                                                        <input type="text" className="form-control" name="amount" value={subTotal} onChange={(event) => this.handleChange(event, 'amount')} />
                                                    </td>
                                                </tr>

                                            </table>
                                            <input type="submit" className="btn btn-danger" value="Proceed" />
                                            <input type="cancel" className="btn btn-danger" style={{ margin: '2px',float: 'right' }} value="Cancel"  onClick={() => this.handleModalClose('formModalIsOpen')}/>
                                        </form>
                                    </div>
                                </Modal>
                                <Modal
                                    isOpen={galleryModalIsOpen}
                                    style={customStyles}
                                >
                                    <div className="glyphicon glyphicon-remove lose" style={{ float: 'right' }} onClick={() => this.handleModalClose('galleryModalIsOpen')}></div>
                                    <Carousel
                                        showIndicators={false}
                                        showThumbs={false}
                                    >

                                        <div>
                                            <img src="../images/breakfast.png" />

                                        </div>
                                        <div>
                                            <img src="../images/dinner.png" />

                                        </div>
                                        <div>
                                            <img src={detailsImg} />

                                        </div>
                                        <div>
                                            <img src={restaurant.thumb} />

                                        </div>
                                        {/* {this.restaurant ? this.restaurant.thumb && this.restaurant.thumb.map((item) => {
                            return <div>
                                <img src={`${item.thumb}`} />
                            </div>
                        }) : null}  */}
                                    </Carousel>
                                </Modal>
                            </div>

                        </React.Fragment> : null
                    }
                </div>
                {/* <div>

               
                <Tabs className="tab-list">
                    <TabList className="tab-list-item">
                        <Tab className="tab-list-active">Title 1</Tab>
                        <Tab>Title 2</Tab>
                    </TabList>

                    <TabPanel >
                        <h2>Any content 1</h2>
                    </TabPanel>
                    <TabPanel>
                        <h2>Any content 2</h2>
                    </TabPanel>
                </Tabs>
                </div> */}
            </React.Fragment>
        )
    }
}

export default Details;



