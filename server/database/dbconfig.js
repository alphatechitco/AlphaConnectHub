const {createClient} = require('@supabase/supabase-js')

const projectURL = process.env.SUPABASE_PROJECT_URL
const projectAPI = process.env.SUPABASE_PROJECT_API

const supabase = createClient(projectURL, projectAPI);

module.exports=supabase