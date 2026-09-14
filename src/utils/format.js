// Data stores times as "8:40a"; the UI displays "8:40am".
export const formatTime = (time) => (/[ap]$/.test(time) ? `${time}m` : time)

// 1276.8 -> "1,276.80"
export const formatMoney = (amount) =>
  amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
