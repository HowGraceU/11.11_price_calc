import React, { useState, useCallback } from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import * as styles from './index.css';
import Commodity from '../commodity';
import ShowTable from '../show_table';

function toFix2(num:number): number {
  return Math.round(num * 100) / 100;
}

function ProceCalc(props) {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const [ret, setRet] = useState<calcRet[]>([]);

  getFieldDecorator('commoditys', {
    initialValue: [{
      id: 1,
      name: '商品1',
    }] as commodity[],
  });

  const commoditys = getFieldValue('commoditys');

  const addCom = useCallback((commodityId) => {
    const nowCommoditys = getFieldValue('commoditys');

    setFieldsValue({ commoditys: nowCommoditys.concat({ id: commodityId, name: `商品${commodityId}` }) });
  }, [commoditys]);

  const deleteCom = useCallback((commodityId) => {
    const nowCommoditys = getFieldValue('commoditys');

    setFieldsValue({ commoditys: nowCommoditys.filter(({ id }) => id !== commodityId) });
  }, [commoditys]);

  const calcPrice = useCallback(() => {
    const {
      allowance_full: allowanceFull = 400, allowance_reduction: allowanceReduction = 50, allowance_num: allowanceNum = 1, store_full: storeFull = 0, store_reduction: storeReduction = 0, commoditys: nowCommoditys,
    } = form.getFieldsValue();

    const priceSum = nowCommoditys.reduce((sum, { id }) => {
      const price = getFieldValue(`${id}Price`);
      const count = getFieldValue(`${id}Count`) || 1;
      return sum + price * count;
    }, 0);
    const allowacnet = priceSum / (allowanceFull * allowanceNum) * allowanceReduction;
    const commodityPay = (nowCommoditys as commodity[]).map<calcRet>(({ id, name }) => {
      const count = getFieldValue(`${id}Count`) || 1;
      const goodDiscount = getFieldValue(`${id}Discount`) || 0;
      const commoditySum = getFieldValue(`${id}Price`) * count;
      const allowacneDiscount = toFix2(allowacnet * commoditySum / priceSum);
      const storeDiscount = toFix2(storeReduction * commoditySum / priceSum);

      const pay = toFix2(commoditySum - allowacneDiscount - storeDiscount - goodDiscount);

      let need;
      if (pay < 0) {
        need = toFix2(commoditySum * ((storeDiscount / (commoditySum - goodDiscount - commoditySum * (allowanceReduction / (allowanceFull * allowanceNum)))) - 1));
      }

      return {
        name, commoditySum, allowacneDiscount, storeDiscount, pay, need,
      };
    });

    setRet(commodityPay);
  }, []);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 5 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };

  return (
    <div className={styles.betweenFlex}>
      <Form labelCol={formItemLayout.labelCol} wrapperCol={formItemLayout.wrapperCol} className={styles.formWrap}>
        <h4>津贴优惠</h4>
        <Form.Item label="满">
          {getFieldDecorator('allowance_full')(<Input placeholder="不填默认400" />)}
        </Form.Item>

        <Form.Item label="减">
          {getFieldDecorator('allowance_reduction')(<Input placeholder="不填默认50" />)}
        </Form.Item>

        <Form.Item label="使用多少张津贴">
          {getFieldDecorator('allowance_num')(<Input placeholder="不填默认1" />)}
        </Form.Item>

        <h4>店铺优惠</h4>
        <Form.Item label="满">
          {getFieldDecorator('store_full')(<Input placeholder="不填默认0" />)}
        </Form.Item>

        <Form.Item label="减">
          {getFieldDecorator('store_reduction')(<Input placeholder="不填默认0" />)}
        </Form.Item>

        <Commodity commoditys={commoditys} addCom={addCom} deleteCom={deleteCom} form={form} />

        <br />
        <br />
        <Button type="primary" htmlType="submit" className={styles.button} onClick={calcPrice}>计算</Button>
      </Form>
      <div className={styles.formWrap}>
        <ShowTable ret={ret} />
      </div>
    </div>
  );
}

ProceCalc.propTypes = {
  form: PropTypes.object.isRequired,
};

const WrappedProceCalc = Form.create({ name: 'register' })(ProceCalc);

export default WrappedProceCalc;
