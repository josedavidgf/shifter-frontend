// src/utils/chatUtils.js

export function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function buildChatContext(swap, workerId) {

  const iAmRequester = swap.requester_id === workerId;
  console.log(swap.shift.worker);
  console.log(swap.requester);
  const otherPersonName = iAmRequester
    ? capitalize(swap.shift.worker?.name)
    : capitalize(swap.requester?.name);

  const otherPersonSurname = iAmRequester
    ? capitalize(swap.shift.worker?.surname)
    : capitalize(swap.requester?.surname);

  const otherPersonMobileCountryCode = iAmRequester
    ? swap.shift.worker?.mobile_country_code
    : swap.requester?.mobile_country_code;

  const otherPersonMobilePhone = iAmRequester
    ? swap.shift.worker?.mobile_phone
    : swap.requester?.mobile_phone;

  const myDate = iAmRequester
    ? swap.offered_date
    : swap.shift.date;

  const myDateType = iAmRequester
    ? swap.offered_type
    : swap.shift.shift_type;

  const otherDate = iAmRequester
    ? swap.shift.date
    : swap.offered_date;

  const otherDateType = iAmRequester
    ? swap.shift.shift_type
    : swap.offered_type;

  const otherWorkerId = iAmRequester
    ? swap.shift.worker_id
    : swap.requester_id;

  return {
    iAmRequester,
    otherPersonName,
    otherPersonSurname,
    otherPersonMobileCountryCode,
    otherPersonMobilePhone,
    myDate,
    myDateType,
    otherDate,
    otherDateType,
    otherWorkerId,
  };
}
