const {createClient} = require('@supabase/supabase-js')


const projectURL = 'https://vhdcknwiwsrixkvbijqu.supabase.co'
const projectAPI = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoZGNrbndpd3NyaXhrdmJpanF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM3OTQwMjIsImV4cCI6MjA0OTM3MDAyMn0.tq0Mdt2rj6bmy_mFmqr7A3uPVFWPEagPjZW3aV_GZr4'

const supabase = createClient(projectURL, projectAPI);

module.exports=supabase