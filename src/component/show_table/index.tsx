import React from 'react';
import PropTypes from 'prop-types';

import { Table } from 'antd';

// todos: move to utils
function toFix2(num:number): number {
  return Math.round(num * 100) / 100;
}

const ShowTable: React.SFC<ShowTableProps> = (props) => {
  const { ret } = props;

  const columns = [{
    title: '商品名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '总价',
    dataIndex: 'commoditySum',
    key: 'commoditySum',
  }, {
    title: '津贴折扣',
    dataIndex: 'allowacneDiscount',
    key: 'allowacneDiscount',
  }, {
    title: '店铺折扣',
    dataIndex: 'storeDiscount',
    key: 'storeDiscount',
  }, {
    title: '实际付款',
    dataIndex: 'pay',
    key: 'pay',
  }, {
    title: '还需凑单',
    dataIndex: 'need',
    key: 'need',
  }];

  const data = ret.map((item, index) => ({ key: index, ...item }));
  const total = data.reduce((sum, {
    commoditySum, allowacneDiscount, storeDiscount, pay,
  }) => ({
    ...sum,
    commoditySum: toFix2(sum.commoditySum + commoditySum),
    allowacneDiscount: toFix2(sum.allowacneDiscount + allowacneDiscount),
    storeDiscount: toFix2(sum.storeDiscount + storeDiscount),
    pay: toFix2(sum.pay + pay),
  }), {
    key: -1,
    name: '总计',
    commoditySum: 0,
    allowacneDiscount: 0,
    storeDiscount: 0,
    pay: 0,
  });
  data.push(total);

  return <Table columns={columns} dataSource={data} />;
};


ShowTable.propTypes = {
  ret: PropTypes.array.isRequired,
};

export default ShowTable;
