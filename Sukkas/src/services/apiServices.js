
const BASE_URL = 'https://fif.cpl.mybluehost.me/api/'
const headers = {
  'Content-Type': 'application/x-www-form-urlencoded',
  'Authorization': 'Basic YWRtaW46MTIzNA==',
  'x-api-key': 'test@123',
  'apiPass': '1234'
}

const callApi = async (apiName, param ) => {

  const url = BASE_URL + apiName;

  let formBody = []
  for (let property in param) {
    let encodedKey = encodeURIComponent(property);
    let encodedValue = encodeURIComponent(param[property]);
    formBody.push(encodedKey + '=' + encodedValue);
  }
  formBody = formBody.join('&');

  const settings = {
    method: 'POST',
    headers: headers,
    body: formBody
  };
 
  try {
    const fetchResponse = await fetch(url, settings);
    const response = await fetchResponse.json();     
    return response
  } catch (err) {    
    return false
  }

}


export { callApi }