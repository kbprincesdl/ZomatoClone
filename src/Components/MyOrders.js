import React, { Component } from 'react'
import axios from 'axios';

import SubHeaher from '../Components/SubHeaher';

class MyOrders extends Component {

    constructor(){
        super();
        this.state={
            Orderitems:[]
        }
    }
   
    componentDidMount(){
        const { Orderitems } = this.state;
       // console.log(restaurantId);
        axios({
            method: 'GET',
            url: `http://localhost:8901/getorders`,
            headers: { 'Content-Type': 'application/json' }
        }).then(res => this.setState({ Orderitems: res.data.ordersresult }))
            .catch(err => console.log(err))
    }

    // getOrder = () => {
        
    // }


    render() {
        const { Orderitems} = this.state;
   
        return (
           <React.Fragment>
               <SubHeaher />
               <h2>Orders placed</h2>
            <div className="container-fluid">
               <table className="table table-hover tm-table-small tm-product-table">
               <thead>
                <tr>
                        
                        {/* <th scope="col">TXNID</th>
                        <th scope="col">BANKTXNID</th> */}
                        
                        <th scope="col">CUST ID</th>
                        <th scope="col">EMAIL</th>
                        <th scope="col">MOBILE NO</th>
                        <th scope="col">ORDERID</th>
                        <th scope="col">TXNAMOUNT</th>
                        <th scope="col">STATUS</th>
                        <th scope="col">TXNTYPE</th>
                        <th scope="col">GATEWAYNAME</th>
                        {/* <th scope="col">RESPCODE</th> */}
                        <th scope="col">RESPMSG</th>
                        <th scope="col">BANKNAME</th>
                        {/* <th scope="col">MID</th> */}
                        <th scope="col">PAYMENTMODE</th>
                        <th scope="col">REFUNDAMT</th>
                        <th scope="col">TXNDATE</th>
                        <th scope="col">WEBSITE</th>
                        <th scope="col">CHANNEL ID</th>
                        <th scope="col">INDUSTRY TYPE ID</th>
                        

                        
                        
                </tr>
               </thead>
               <tbody>
               {Orderitems.map((item, index) => {
                   return(
                    <tr key={index}>
                                
                  
                    {/* <td>{item.TXNID}</td>
                   <td>{item.BANKTXNID}</td>      */}

                   
                   <td >{item.CUST_ID}</td>
                   <td >{item.EMAIL}</td>
                   <td >{item.MOBILE_NO}</td>
                   <td >{item.ORDERID}</td>
                   <td >{item.TXNAMOUNT}</td>  
                   <td >{item.STATUS}</td>  
                   <td >{item.TXNTYPE}</td>  
                   <td >{item.GATEWAYNAME}</td>  
                   {/* <td >{item.RESPCODE}</td>   */}
                   <td >{item.RESPMSG}</td>  
                   <td >{item.BANKNAME}</td>                         
                   {/* <td >{item.MID}</td>   */}
                   <td>{item.PAYMENTMODE}</td>  
                   <td >{item.REFUNDAMT}</td>  
                   <td >{item.TXNDATE}</td>  
                   <td >{item.WEBSITE}</td>  
                   <td >{item.CHANNEL_ID}</td>  
                   <td >{item.INDUSTRY_TYPE_ID}</td>  
               </tr>
                   );
               })}
               </tbody>
               </table>
            </div>
               
            
                            
           
        
           </React.Fragment>
        )
    }
}

export default MyOrders;
