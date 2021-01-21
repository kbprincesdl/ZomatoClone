import React, { Component } from 'react'
import axios from 'axios';
class Pay extends Component {

    constructor(){
        super();
        this.state={
          name: '',
          phone: '',
          email:'',
          amount: ''
    }
}

handlePayChange = () => {
   
    const { name,phone,email,amount } = this.state;

    // making the input object for filter API basis changed location
    const payObj = {
        name: name,
        phone: phone,
        email:email,
        amount: amount
        
    }

    // axios({
    //     method: 'POST',
    //     url: 'http://localhost:4000/paynow',
    //     headers: { 'Content-Type': 'application/json' },
    //     data: payObj
    // })
    //     .then(response => console.log(response))
    //     .catch(err => console.log(err))
    fetch(`http://localhost:4000/paynow`,{
        method:'POST',  
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payObj)
    }).then(response => response.json()).catch(err => console.log(err))
       // e.preventDefault();
}

    handleChange = (event, state) => {
        this.setState({ [state]: event.target.value });
    }
    render() {
        const { name,email, phone,amount} = this.state;
    
        return <React.Fragment>
            <div className="row my-5">
                <div className="col-md-4 offset-md-4">
                    <div className="card">
                        <div className="card-body">
                            <form className="" action="http://localhost:4000/paynow" method="post">
                            {/* <form> */}
                                <div className="form-group">
                                    <label for="">Name: </label>
                                   
                                    <input className="form-control" type="text" value={name} onChange={(event) => this.handleChange(event, 'name')} />
                                </div>
                                    <div className="form-group">
                                        <label for="">Email: </label>
                                        
                                        <input className="form-control" type="text" value={email} onChange={(event) => this.handleChange(event, 'email')} />
                                </div>
                                        <div className="form-group">
                                            <label for="">Phone: </label>
                                            <input className="form-control" type="text" value={phone} onChange={(event) => this.handleChange(event, 'phone')} />
                                         
                                </div>
                                            <div className="form-group">
                                                <label for="">Amount: </label>
                                                <input className="form-control" type="text" value={amount} onChange={(event) => this.handleChange(event, 'amount')} />
                                       
                                </div>
                                                <div className="form-group">
                                                    {/* <button className="btn form-control btn-primary" name="submit" onSubmit={this.handlePayChange}>Pay Now</button> */}
                                                    <input type="submit" className="btn btn-danger"  value="Submit" />
                                                </div>
                            </form>
                        </div>
                    </div>
                </div>
    </div>
                
    </React.Fragment>

    }
}
export default Pay;
