const supabase = require("../../database/dbconfig");



class Authenticate {
    constructor () {

    }

    async AuthenticateDevice (device_id,serial_number,api_key) {

        
        const {data, error} = await supabase
        .from('connection_ownership')
        .select('connection_id')
        .eq('device_id', device_id)
        .eq('serial_number', serial_number)
        .eq('api_key', api_key)

        if(error) {
            console.error("Error in database, ", error.message)
        }
        console.log(data[0])

        if(data[0].length == 0) {
            return {auth:false}
        }

        const connection_id = data[0].connection_id;

        return {auth:true, connection_id};
    }
}

module.exports = Authenticate