import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  Form, Input, Icon, Button,
} from 'antd';

import { commodityProps } from './commodity';
import * as styles from './index.css';

let id : number = 1;

const Commodity: React.SFC<commodityProps> = (props) => {
  const {
    commoditys, addCom, deleteCom, form,
  } = props;
  const { getFieldDecorator, getFieldValue } = form;

  const addCommodityItem = useCallback(() => {
    id += 1;

    addCom(id);
  }, [id]);

  const formItemLayoutWithOutLabel = {
    wrapperCol: {
      xs: { span: 24, offset: 0 },
      sm: { span: 16, offset: 5 },
    },
  };

  const commodityItem = commoditys.map((value, index) => {
    const commodityId = value.id;
    return (
      <>
        <Form.Item
          label={`商品名${commodityId}`}
          required={false}
          key={commodityId}
        >
          {getFieldDecorator(`${commodityId}Name`, { initialValue: value.name })(<Input placeholder="名称" />)}

        </Form.Item>
        <Form.Item
          wrapperCol={formItemLayoutWithOutLabel.wrapperCol}
          label=""
        >
          {getFieldDecorator(`${commodityId}Price`, {
            initialValue: value.price,
          })(<Input placeholder="单价" className={styles.commodityInput} />)}
          {getFieldDecorator(`${commodityId}Count`, {
            initialValue: value.count,
          })(<Input placeholder="数量默认1" className={styles.commodityInput} />)}
          {getFieldDecorator(`${commodityId}Discount`, {
            initialValue: value.discount,
          })(<Input placeholder="优惠默认0" className={styles.commodityInput} />)}
          <Icon
            className="dynamic-delete-button"
            type="minus-circle-o"
            onClick={() => deleteCom(commodityId)}
          />
        </Form.Item>
      </>
    );
  });

  return (
    <>
      <h4>商品</h4>
      {commodityItem}
      <Button type="dashed" onClick={addCommodityItem} className={styles.addButton}>
        <Icon type="plus" />
        {' '}
        添加商品
      </Button>
    </>
  );
};

Commodity.propTypes = {
  commoditys: PropTypes.array.isRequired,
  addCom: PropTypes.func.isRequired,
  deleteCom: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
};

export default Commodity;
