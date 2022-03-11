import React, { Fragment,useState } from 'react'
import { Form, Input, Button, Checkbox, Select, DatePicker } from 'antd';
import Loader from './loader';



const Entry = ({entryPoints,getData}) => {

    const [loading,setLoading] =useState(false)

    const onFinish = async(values) => {
       
        setLoading(true)
            values.tripStatus = "Active";
            values.exitDateTime= "";
            values.exitInterchange ="";
            values.totalCostTrip ="";
             await fetch('https://crudcrud.com/api/0de6f86092554f1a984f644dc24fb0f5/trips', {
              method: 'POST',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(values)
            }).then(async(response)=>{
                
                 await response.json().then((data)=>{

                     setLoading(false);
                     getData(data)
                 });
            }).catch((error)=>{
                setLoading(false);
            })
           
           
         
    };

   

    return (
        <Fragment>
            {loading&& <Loader/>}
            <Form
                size='large'
                name="basic"
                labelCol={{
                    span: 3,
                }}
                wrapperCol={{
                    span: 14,
                }}
                initialValues={{
                    remember: true,
                }}
                onFinish={onFinish}               
                autoComplete="off"
            >
                <Form.Item
                    label="Entry InterChange"
                    name="entryInterchange"
                    rules={[
                        {
                            required: true,
                            message: 'Please select entry interchange!',
                        },
                    ]}
                >
                    <Select>
                        {entryPoints.map((item,index)=>(

                        <Select.Option key={index} value={item.value}>{item.name}</Select.Option>
                        ))}
                    </Select>
                </Form.Item>

                <Form.Item
                    label="Number Plate"
                    name="numberPlate"
                    rules={[
                        {
                            required: true,
                            message: 'Please input number plate!',
                        },
                        {
                            pattern:/^[A-Za-z]{3}-[0-9]{3}$/,
                            required: true,
                            message: 'Please input number plate e.g xyz-123',

                        },
                        {
                            min:7,
                            max:7
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Entry Date Time"
                    name="entryDateTime"
                    rules={[
                        {
                            required: true,
                            message: 'Please input number plate!',
                        },
                    ]}
                >
                   <DatePicker showTime/>
                </Form.Item>



                <Form.Item
                    wrapperCol={{
                        offset:3,
                        span: 14,
                    }}
                >
                    <Button type="primary" block htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Fragment>
    )
}

export default Entry