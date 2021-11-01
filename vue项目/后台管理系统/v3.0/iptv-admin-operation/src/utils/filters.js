import {$fixDecimalAuto, $fixDecimalsAsset, $getDateStr} from './index'
export default {
  capitalize: function (value) {
    if (!value) {
      return ''
    }
    value = value.toString()
    return value.charAt(0).toUpperCase() + value.slice(1)
  },
  $fixDecimalAuto: function (value, currency) {
    return $fixDecimalAuto(value, currency)
  },
  $fixDecimalsAsset: function (value) {
    return $fixDecimalsAsset(value)
  },
  $getDateStr: function (value) {
    return $getDateStr(value)
  }
}
