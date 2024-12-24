const supabase = require('../database/dbconfig')

class Devices {
    constructor (){

    }



    async getDevices(){

        const {data, error} = await supabase.from('devices').select('*')

        if(error) {
            console.error("Error While Fetching Devices")
            return;
        }
        if(data.length>0) {
            console.log("Mod Data",data)
            return data;
        }


    }


}

module.exports = Devices;
