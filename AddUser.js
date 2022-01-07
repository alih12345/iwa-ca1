import React, { useState } from 'react';
import { Form, Input, Button, message } from 'antd';
import 'react-phone-number-input/style.css';
import axios from 'axios';
import { BackendUrl } from '../url';
import PhoneInput from 'react-phone-number-input';

function AddUser() {
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [phoneNo, setPhoneNo] = useState();

  const onFinish = async (values) => {
    console.log(values);
    setLoading(true);
    await axios
      .post(`${BackendUrl}/user/add`, values.user)
      .then(() => {
        setLoading(false);
        message.success('User added successfully! ');
        form.resetFields();
      })
      .catch((error) => {
        setLoading(false);
        message.error(error.response.data.msg || 'Internal server error!');
      });
  };
  return (
    <div className='main_form'>
      <div className='form_child'>
        <Form name='nest-messages' onFinish={onFinish} form={form}>
          <Form.Item
            name={['user', 'name']}
            label='Name'
            rules={[
              {
                required: true,
                message: 'Name is required',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item
            name={['user', 'email']}
            label='Email'
            rules={[
              {
                type: 'email',
                required: true,
                message: 'Email is required',
              },
            ]}>
            <Input />
          </Form.Item>
          <Form.Item name={['user', 'phoneNumber']} label='Phone Number'>
            <PhoneInput
              placeholder='Enter phone number'
              value={phoneNo}
              onChange={setPhoneNo}
            />
          </Form.Item>

          <Form.Item name={['user', 'address']} label='address'>
            <Input.TextArea />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              loading={loading}
              disabled={loading}>
              {loading ? 'Submiting...' : 'Submit'}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default AddUser;
