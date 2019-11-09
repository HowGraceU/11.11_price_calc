import React, { useState, useCallback, useRef } from 'react';
import {
  Form,
  Input,
  Button,
} from 'antd';
import PropTypes from 'prop-types';

import { commodity, calcRet, History } from '../commodity/commodity';

import * as styles from './index.css';
import Commodity from '../commodity';
import ShowTable from '../show_table';
import StorageList from '../storage_list';

function toFix2(num:number): number {
  return Math.round(num * 100) / 100;
}

function ProceCalc(props) {
  const { form } = props;
  const { getFieldDecorator, getFieldValue, setFieldsValue } = form;

  const history = useRef<History>({
    current: -1,
    historyState: [],
    goForward: () => {
      const { historyState, current } = history.current;

      const formData = historyState[current - 1];
      history.current.current = current - 1;

      setFieldsValue(formData);

      calcPrice(false);
    },
    goNext: () => {
      const { historyState, current } = history.current;

      const formData = historyState[current + 1];
      history.current.current = current + 1;

      setFieldsValue(formData);

      calcPrice(false);
    },
  });

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

  const calcPrice = useCallback((save = true) => {
    const formData = form.getFieldsValue();
    const {
      allowance_full: allowanceFull = 400, allowance_reduction: allowanceReduction = 50, allowance_num: allowanceNum = 1, store_full: storeFull = 0, store_reduction: storeReduction = 0, commoditys: nowCommoditys,
    } = formData;
    const priceSum = nowCommoditys.reduce((sum, { id }) => {
      const price = getFieldValue(`${id}Price`) || 0;
      const count = getFieldValue(`${id}Count`) || 1;
      return sum + price * count;
    }, 0);
    const allowacnet = allowanceNum ? (priceSum / (allowanceFull * allowanceNum) * allowanceReduction) : 0;
    const commodityPay = (nowCommoditys as commodity[]).map<calcRet>(({ id, name }) => {
      const price = getFieldValue(`${id}Price`) || 0;
      const count = getFieldValue(`${id}Count`) || 1;
      const goodDiscount = getFieldValue(`${id}Discount`) || 0;
      const commoditySum = price * count;
      const allowacneDiscount = toFix2(allowacnet * commoditySum / priceSum);
      const storeDiscount = toFix2(storeReduction * commoditySum / priceSum);

      const pay = toFix2(commoditySum - allowacneDiscount - storeDiscount - goodDiscount);

      let need: number;
      if (pay < 0) {
        need = toFix2(commoditySum * ((storeDiscount / (commoditySum - goodDiscount - commoditySum * (allowanceNum ? (allowanceReduction / (allowanceFull * allowanceNum)) : 0))) - 1));
      }

      return {
        name, commoditySum, allowacneDiscount, storeDiscount, pay, need,
      };
    });

    setRet(commodityPay);

    if (save) {
      history.current.current = history.current.historyState.push(formData) - 1;
    }
  }, []);

  const [formDatas, setFormDatas] = useState<[]>(JSON.parse(localStorage.getItem('formData') || '[]'));

  const saveProject = useCallback(() => {
    const formData = form.getFieldsValue();
    const storage = JSON.parse(localStorage.getItem('formData') || '[]');

    storage.push(formData);
    localStorage.setItem('formData', JSON.stringify(storage));
    setFormDatas(storage);
  }, [formDatas]);

  const showData = (formData) => {
    const defData = {
      allowance_full: undefined,
      allowance_num: undefined,
      allowance_reduction: undefined,
      commoditys: [],
      project: '未命名',
      store_full: undefined,
      store_reduction: undefined,
    };

    const data = Object.assign(defData, formData);
    setFieldsValue(data);

    calcPrice();
  };

  const delData = (key) => {
    const storage = JSON.parse(localStorage.getItem('formData') || '[]');
    const newStorage = storage.filter((formData, index) => index !== key);

    localStorage.setItem('formData', JSON.stringify(newStorage));
    setFormDatas(newStorage);
  };

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
    <div className={`${styles.betweenFlex} ${styles.calcWarp}`}>
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

        <br />
        <br />
        <Form.Item label="项目名">
          {getFieldDecorator('project')(<Input placeholder="项目名" />)}
        </Form.Item>
        <Button type="primary" htmlType="submit" className={styles.button} onClick={saveProject}>保存</Button>

        <br />
        <br />
        <StorageList formDatas={formDatas} showData={showData} delData={delData} />
      </Form>
      <div className={styles.formWrap}>
        <Button type="primary" htmlType="submit" className={styles.mr} disabled={history.current.current <= 0} onClick={history.current.goForward}>上一单</Button>
        <Button type="primary" htmlType="submit" className={styles.mr} disabled={history.current.current + 1 >= history.current.historyState.length} onClick={history.current.goNext}>下一单</Button>

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
