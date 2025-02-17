const supabase = require('../../database/dbconfig')

class Devices {
    constructor (){

    }


    async getDevices(profile_id){
       try {
        console.log("Profile Id", profile_id)
        let query = supabase.from('devices').select('*').eq('profile_id', profile_id)


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

        const {data, error} = await supabase.from('devices').insert([{user_id,profile_id,device_name,device_type,description,mqtt_topic}]).select('device_id')

        if(error) {
            console.error("Error While Registering Device", error)
            return {reg:false, device:data}
        }
        if(data.length>0) {
            console.log("Mod Data",data)
            return {reg:true, device:data}
        }

    }
}

module.exports = Devices;
