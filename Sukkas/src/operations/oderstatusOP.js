import { callApi } from "../services/apiServices";
import { showErrorAlertMessage } from "../services/ShowAlertMessages";

const _getPendendingOrders = async (param) => {

    const response = await callApi('pending_orders/', param)
   // console.log(response);
    if (response.status == 'Success') {

        if (response.data.length > 0) {

            let list = []
            let defaultValue = 0

            response.data.map((v, i) => {
                if (v.order_id != null) {
                    if (defaultValue == 0) {
                        defaultValue = parseInt(v.order_id)
                    }
                    list.push({
                        value: parseInt(v.order_id),
                        label: v.order_number
                    })
                }
            })
            return {list: list, defaultValue: parseInt(defaultValue)}           
        } else {
           return false
        }
    } else if (response.status == 'Failed') {
        showErrorAlertMessage('Error', response.status_message)
        return false
    }
}

const _completeOrder = async (param) => {

    const response = await callApi('complete_order_new/', param)

    if (response.status == 'Success') {
        showErrorAlertMessage('Success', response.status_message)
        return true
    } else if (response.status == 'Failure') {
        showErrorAlertMessage('Error', response.status_message)
        return false
    } else {
        showErrorAlertMessage('Error', 'Internal error. Try later.')
        return false
    }
}



export { _completeOrder, _getPendendingOrders }