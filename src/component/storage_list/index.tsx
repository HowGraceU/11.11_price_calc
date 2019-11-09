import React from 'react';
import PropTypes from 'prop-types';

import { List, Button } from 'antd';
import { StorageListProps } from './StorageList';

import * as styles from './index.css';

const StorageList: React.SFC<StorageListProps> = (props) => {
  const { formDatas, showData, delData } = props;
  const data = formDatas.map((formData) => formData.project || '未命名');

  return (
    <List
      bordered
      dataSource={data}
      renderItem={(item, key) => (
        <List.Item onClick={() => { showData(formDatas[key]); }} style={{ cursor: 'pointer' }}>
          {item}
          <Button type="primary" htmlType="submit" className={styles.ml10} onClick={() => { delData(key); }}>删除</Button>
        </List.Item>
      )}
    />
  );
};


StorageList.propTypes = {
  formDatas: PropTypes.array.isRequired,
  showData: PropTypes.func.isRequired,
  delData: PropTypes.func.isRequired,
};

export default StorageList;
