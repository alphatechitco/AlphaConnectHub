const supabase = require('../../database/dbconfig')

class Devices {
    constructor (){

    }


    async getDevices(device_id,profile_id){
       try {
        let query
        if (profile_id!=null){
        query = supabase.from('devices').select('*').eq('profile_id', profile_id);
        }
        if(device_id != null){
            query = supabase.from('devices').select('*').eq('device_id', device_id);
        }

        const {data, error} = await query;

        if(error) {
            console.error("Error While Fetching Devices", error)
            return;
        }
        if(data.length>0) {
            console.log("Mod Data",data)
            return {fetch:true, result:data}
        } else {
            return {fetch:false, result:data}
        }
       } catch (error){
        console.log("Error!", error)
       }

    }

    async deleteDevice(device_id) {
        try {
            const {data, error} =  await supabase.from('devices').delete().eq('device_id', device_id);

            if(error) {
                console.error("Error deleting device:", error);
                return { success: false, message: "Failed to delete device" };
            }
                console.log("Device deleted successfully!");
                return { success: true, message: "Device deleted" };
    
        } catch (error) {
            console.error("Unexpected error:", error);
            return { success: false, message: "Unexpected error" };
        }
    }

    async regDevice(user_id, profile_id, device_name, device_type, description, mqtt_topic){

        const mqtt_control_topic = mqtt_topic+'/controls';

        const {data, error} = await supabase.from('devices').insert([{user_id,profile_id,device_name,device_type,description,mqtt_topic, mqtt_control_topic}]).select('device_id')

        if(error) {
            console.error("Error While Registering Device", error)
            return {reg:false, device:data}
        }
        if(data.length>0) {
            return {reg:true, device:data}
        }

    }


    async getDeviceCode (device_type) {
        try {
            const {data, error} = await supabase.from('device_code').select('code_template').eq('device_type', device_type);

            if(error) {
                console.error("Error While Fetching Code Template, ", error);
                return [];
            } 
            if (data.length>0) {
                return data;
            }
        } catch (error) {
            console.error("Unexpected error getDevice Function, ", device_type);
            return [];
        }
    }


    async getControls(device_type) {
        try {
            const {data, error} = await supabase.from('controls').select('control_name').eq('device_type', device_type);

            if(error) {
                console.error("Error While Fetching Controls Info, ", error);
                return [];
            } 
            if(data.length>0) {
                return data;
            }
        } catch (error) {
            console.error("Error In Getting Controls Function, ", error);
        }
    }
}

module.exports = Devices;
