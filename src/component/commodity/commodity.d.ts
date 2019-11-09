import { WrappedFormUtils } from 'antd/lib/form/Form';

export declare type commodity = {
  id: number,
  name: string,
  price?: number,
  count?: number,
  discount?: number
}

export declare type commodityProps = {
  commoditys: commodity[],
  addCom: Function,
  deleteCom: Function,
  form: WrappedFormUtils
}

export declare type calcRet = {
  name: string,
  commoditySum: number,
  allowacneDiscount: number,
  storeDiscount: number,
  pay: number,
  need?: number,
}

export declare type History = {
  current: number,
  historyState: object[],
  goForward: () => void,
  goNext: () => void
}
