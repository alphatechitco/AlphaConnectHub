const supabase = require('../../database/dbconfig')
const bcryptjs = require('bcryptjs')


class SignFunctionality {
    constructor () {

    }

    async signUp (regData) {

        console.log(regData)

        const {name, email, recovery_email, password, package_id} = regData

        const hashed_password = await bcryptjs.hash(password, 10);


        const {data, error} = await supabase.from('users').insert([
            {
                name,
                email,
                recovery_email,
                hashed_password,
                package_id
            }
        ])
        .select('user_id')

        if (error) {
            console.error("Error While Registering!", error.message)
            return {success:false, message:"Error Registering"};
        }
        const user_id = data[0];
        return {success:true, message:"Registered Successfuly", user_id}
    }


    async loginIn (loginData) {
        const {email, password} = loginData;

        const {data, error} = await supabase.from('users').select('hashed_password , user_id').eq('email', email)

        if (error) {
            console.log("Error While Registering", error)
        }

        if(data.length == 0) {
            console.log("Account Not Registered")
            return {success:false, account:false, message:"Account Not Registered"}
        }

        const hashed_password = data[0].hashed_password
        const user_id = data[0].user_id

        const isAuthenticated = await bcryptjs.compare(password,hashed_password)

        if (!isAuthenticated) {
            console.log("Invalid Password")
            return {success:false, account:true, message:"Account Not Registered"}
        }
        return {success:true, account:true, user_id, message:"Login Successful"}

    }

    

    async googleLogin(id_token){
        if (!id_token) {
            throw new Error("Token missing");
        }
    
        // Verify token with Supabase
        const { data, error } = await supabase.auth.signInWithIdToken({
            provider:'google',
            token:id_token
        })
    
        if (error || !data.user) {
            console.error("Auth Error:", error);
            throw new Error("Google authentication failed");
        }
    
        // Extract user data
        const { id, email, user_metadata } = data.user;
    
        // Check if user exists in your database
        const { data: existingUser } = await supabase
            .from("users")
            .select("*")
            .eq("email", email)
            .single();
    
        if (!existingUser) {
            // Register new user in your database
            const {error:insertError} = await supabase.from("users").insert([
                {email, name: user_metadata.full_name, recovery_email:email}
            ]);
            if (insertError) {
                console.error("User Insert Error:", insertError);
                throw new Error("User registration failed");
            }
        }
    
    
    
        return {id,email, message: "Login successful" };
    };
}



module.exports = SignFunctionality;


