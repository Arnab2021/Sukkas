import { PermissionsAndroid } from "react-native"

class CameraServices{
    static async CheckCameraPermission(){
        try {
            const granted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
            if (granted) {
                return true
            }
            else {
                console.log("Camera permission denied!")
                const reqPer = CameraServices.RequestCameraPermission()
                if (reqPer == true){
                    return true
                }else{
                    return false
                }
            }
        } catch (err) {
            return false
        }
    }

    static async RequestCameraPermission() {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    'title'   :   'Location Permission',
                    'message' :  'This App needs access to your location ' +
                                'so we can know where you are.'
                }
            )
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use camera ")
                return true
            } else {
                console.log("camera permission denied")
                CameraServices.RequestCameraPermission()
            }
        } catch (err) {
            console.log(err)
            return false
        }
    }

}

export default CameraServices