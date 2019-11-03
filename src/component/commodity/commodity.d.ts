type commodity = {
  id: number,
  name: string,
  price?: number,
  count?: number,
  discount?: number
}

type commodityProps = {
  commoditys: commodity[],
  addCom: Function,
  deleteCom: Function,
  form: WrappedFormUtils
}

type calcRet = {
  name: string,
  commoditySum: number,
  allowacneDiscount: number,
  storeDiscount: number,
  pay: number,
  need?: number,
}
