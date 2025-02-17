const supabase = require("../../database/dbconfig");

class Profile{
    constructor(){

    }

    async getProfiles(user_id){
        try {
            const {data, error} = await supabase.from('profiles').select('*').eq('user_id', user_id);

            if(error) {
                console.error("Error While Fetching, ",error);
                return {fetch:false, profile:""}
            }

            if(data.length>0) {
                return {fetch:true, profile:data}
            } else {
                return {fetch:false, profile:""}
            }

        } catch (error) {
            console.error("Error While Fetching Profiles, ", error)
        }
    }

    async addProfile(profileData){
        try {
            const {user_id, profile_name, description} = profileData;
            const {data, error} = await supabase.from('profiles').insert([{user_id,profile_name, description}]).select('profile_id');

            if(error) {
                console.error("Error While Making Profile, ",error);
                return {make:false, profile:""}
            }

            if(data.length>0) {
                return {make:true, profile:data}
            } else {
                return {make:false, profile:""}
            }

        } catch (error) {
            console.error("Error While Fetching Profiles, ", error)
        }
    }
    async deleteProfile(profile_id){
        try {
            const {data, error} = await supabase.from('profiles').delete().eq('profile_id', profile_id);

            if(error) {
                console.error("Error While Deleting Profile, ",error);
                return {delete:false}
            }

            console.log("Delete Prof Success!")
            return {delete:true}
        } catch (error) {
            console.error("Error While Deleting Profile, ", error)
        }
    }
};


module.exports = Profile;