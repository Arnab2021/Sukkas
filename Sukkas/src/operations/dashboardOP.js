import { callApi } from "../services/apiServices";
import { showErrorAlertMessage } from "../services/ShowAlertMessages";



const _getOrderList = async (param) => {
    //console.log(param);
    const response = await callApi('orders/', param)

    if (response.status == 'Success') {
        if (response.data.length > 0) {
            const data = populateData(response.data)
            return { data: data, total_count: response.total_count }
        }
    } else if (response.status == 'Failed') {
        if (response.status_message == 'No orders found for this user') {
            showErrorAlertMessage('No Data', 'No more order found.')
        }
        return false
    }
}

const populateData = (data) => {
    let list = []

    data.map((v, i) => {

        let product_details = []
        if (v.product_details != undefined)
            product_details = v.product_details.split(',')

        if (v.order_id != null) {
            let pocket = {
                id: v.order_id,
                order_number: v.order_number,
                productname1: v.product_name,
                productname2: 'Easy to build sukkah',
                phone: v.phone,
                mobile: v.mobile,
                isSkip: false,
                lat: parseFloat(v.lat),
                lng: parseFloat(v.lng),
                address: v.address,
                product_size: v.product_size,
                product_price: v.product_price,
                product_details: product_details,
                order_total: v.order_total
            }
            list.push(pocket)
        }
    })
   // console.log(list);
    return list
}



export { _getOrderList }