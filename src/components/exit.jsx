import React, { Fragment, useEffect, useState } from 'react'
import { Form, Typography, Input, Button, Checkbox, Select, DatePicker, Row, Col, Card, Divider } from 'antd';
import moment from 'moment';
import { getDiscount } from '../helperFunctions';
import { baseRate } from '../globalConstants';
import Loader from './loader';


const { Text, Title } = Typography;

let discount = 0;

const Exit = ({ entryPoints, data }) => {

  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [receiptDetails, setReceiptDetails] = useState({});
  const [initial, setInitial] = useState({});

  useEffect(() => {
    if (Object.keys(data).length > 0) {
      form.setFieldsValue({
        numberPlate: data.numberPlate
      });
    }
  }, [data])

  // on submission form
  const onFinish = async (values) => {
    let obj = { ...data, ...values };


    // Distance always positive
    let distance = Math.abs(obj.exitInterchange - obj.entryInterchange)


    let totalChargesPerKm = 0;

    // Getting day, date and month
    let day = moment(obj.exitDateTime).day();
    let month = moment(obj.exitDateTime).month();
    let date = moment(obj.exitDateTime).date();



    // if day is Sat/Sun

    if (day === 0 || day === 6) {
      totalChargesPerKm = (distance * 1.5).toFixed(2);
    }
    else {
      totalChargesPerKm = (distance * 0.2).toFixed(2);

    }


    // If holidays like (23rd march, 14th August, and 25th December) then discount will be 50%

    if (month === 2 && date === 23 || month === 7 && date === 17 || month === 11 && date === 25) {
      discount = 50;
      const res = getDiscount(totalChargesPerKm, discount)
      updateRecord(res, obj);
      return
    }


    // Extracting number from number plate

    let numberPattern = /\d+/g;

    let number = values.numberPlate.match(numberPattern).join("");



    // Car with even number and days are mon & wed get 10% discount
    if (+number % 2 === 0 && (day === 1 || day === 3)) {
      discount = 10;
      const res = getDiscount(totalChargesPerKm, discount)
      updateRecord(res, obj);
    }

    // Car with odd number and days are mon, tue & wed get 10% discount
    else if (+number % 2 !== 0 && (day === 2 || day === 4)) {
      discount = 10;
      const res = getDiscount(totalChargesPerKm, discount)
      updateRecord(res, obj);

    }
    // No discount
    else {
      discount = 0;
      const res = getDiscount(totalChargesPerKm, discount)
      updateRecord(res, obj);
    }

  };

  // Update record
  const updateRecord = async (res, obj) => {
    setLoading(true);
    delete obj._id;
    let req = {
      ...res,
      ...obj,

    }

    req.totalCostTrip = res.discountedPrice;
    req.tripStatus = "Completed"

    const response = await fetch(`https://crudcrud.com/api/0de6f86092554f1a984f644dc24fb0f5/trips/${data._id}`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(req)
    });
    const content = response;
    if (content.status === 200) {
      setLoading(false);
      getReceipt();
    } else {
      setLoading(false);
    }
  }

  // Get toll Receipt
  const getReceipt = async () => {
    setLoading(true);
    await fetch(`https://crudcrud.com/api/0de6f86092554f1a984f644dc24fb0f5/trips/${data._id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
    }).then(async (response) => {
      await response.json().then(data => {
        setLoading(false);
        setReceiptDetails(data)
      });
    }).catch(error => {
      setLoading(false);
    })




  }
  return (
    <Fragment>
      {loading && <Loader />}
      <Row>
        <Col span={16}>
          <Form
            form={form}
            size='large'
            name="basic"
            labelCol={{
              span: 4,
            }}
            wrapperCol={{
              span: 14,
            }}
            initialValues={initial}
            onFinish={onFinish}
            autoComplete="off"

          >
            <Form.Item
              label="Exit InterChange"
              name="exitInterchange"
              rules={[
                {
                  required: true,
                  message: 'Please select entry interchange!',
                },
              ]}
            >
              <Select>
                {entryPoints.map((item, index) => (

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

              ]}
            >
              <Input disabled={true} readOnly />
            </Form.Item>
            <Form.Item
              label="Entry Date Time"
              name="exitDateTime"
              rules={[
                {
                  required: true,
                  message: 'Please input exit date time!',
                },
              ]}
            >
              <DatePicker showTime />
            </Form.Item>



            <Form.Item
              wrapperCol={{
                offset: 4,
                span: 14,
              }}
            >
              <Button type="primary" block htmlType="submit">
                Calculate
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col span={6}>
          <Card>
            <Row justify='space-between' align='top'>
              <Col span={18}>
                <Title level={5}>Base Rate</Title>
              </Col>
              <Col span={6}>
                <Text type='secondary'>{baseRate} Pkr</Text>
              </Col>
            </Row>
            {receiptDetails?.distanceCost !== undefined&&
              <Row justify='space-between' align='top'>
                <Col span={18}>
                  <Title level={5}>Distance Cost</Title>
                </Col>
                <Col span={6}>
                  <Text type='secondary'>{receiptDetails?.distanceCost} Pkr</Text>
                </Col>
              </Row>
            }
            {receiptDetails?.distanceCost !== undefined&&
              <Row justify='space-between' align='top'>
                <Col span={18}>
                  <Title level={5}>SubTotal</Title>
                </Col>
                <Col span={6}>
                  <Text type='secondary'>{(+receiptDetails?.distanceCost + baseRate).toFixed(2)} Pkr</Text>
                </Col>
              </Row>}
            {receiptDetails?.discount !== undefined &&
              <>
                <Row justify='space-between' align='top'>
                  <Col span={18}>
                    <Title level={5}>Discount/Other</Title>
                  </Col>
                  <Col span={6}>
                    <Text type='secondary'>{receiptDetails?.discount || '0'}%</Text>
                  </Col>
                </Row>
                <Divider />
              </>}
            {receiptDetails?.totalCostTrip &&
              <Row justify='space-between' align='top'>
                <Col span={18}>
                  <Title level={5}>Total Charged</Title>
                </Col>
                <Col span={6}>
                  <Text type='secondary'>{receiptDetails?.totalCostTrip} Pkr</Text>
                </Col>
              </Row>}
          </Card>
        </Col>

      </Row>
      <Row>
        <Col span={24}><Text type="danger">Assumptions:</Text></Col>
        <Col span={12}><Text type="success">
          I assume only one vehicle enter and exit for now as I can't track all the vehicels that enters because of
          not providing api to track all vehicles.Fare calculated when exit point form filled.
        </Text>
        </Col>
      </Row>
    </Fragment>
  )
}

export default Exit