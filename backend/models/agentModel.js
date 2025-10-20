// import supabase from '../db/supabaseClient.js';

// export const createAgent = async (agentData) => {
//   const { data, error } = await supabase
//     .from('agents')
//     .insert([agentData])
//     .select();

//   if (error) throw error;
//   return data[0];
// };

// export const getAllAgents = async () => {
//   const { data, error } = await supabase
//     .from('agents')
//     .select('*');

//   if (error) throw error;
//   return data;
// };

// export const getAgentById = async (agentID) => {
//   const { data, error } = await supabase
//     .from('agents')
//     .select('*')
//     .eq('agentID', agentID)
//     .single();

//   if (error) throw error;
//   return data;
// };
