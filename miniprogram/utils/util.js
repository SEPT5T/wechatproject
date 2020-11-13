const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
const isNumber = (obj) => {
  if (isNull(obj)) {
    return false;
  }
  if (Object.prototype.toString.call(+obj) === '[object Number]'){
     if(isNaN(+obj)) {
       return false;
     } else {
       return true;
     }
  }else {
    return false;
  }
};
const isNull = (obj) => {
  return ['', null].includes(obj);
}
module.exports = {
  formatTime: formatTime,
  isNumber
}
