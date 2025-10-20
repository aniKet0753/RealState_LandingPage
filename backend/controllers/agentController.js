// const supabase = require('../db/supabaseClient');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// require('dotenv').config();

// // Agent Signup
// exports.signupAgent = async (req, res) => {
//     const { first_name, last_name, email, phone_number, password, company_name, address, state, city } = req.body;
//     try {
//         // Check if an agent with the same email or phone number already exists
//         const { data: existingUsers, error: fetchError } = await supabase
//             .from('users')
//             .select('email, phone_number')
//             .or(`email.eq.${email},phone_number.eq.${phone_number}`);

//         if (fetchError && fetchError.code !== 'PGRST116') {
//             throw fetchError;
//         }

//         if (existingUsers && existingUsers.length > 0) {
//             const hasDuplicateEmail = existingUsers.some(user => user.email === email);
//             const hasDuplicatePhone = existingUsers.some(user => user.phone_number === phone_number);

//             if (hasDuplicateEmail) {
//                 return res.status(409).json({ error: 'Agent with this email already exists.' });
//             }
//             if (hasDuplicatePhone) {
//                 return res.status(409).json({ error: 'An account with this phone number already exists.' });
//             }
//         }

//         // Hash the password using bcrypt
//         const saltRounds = 10;
//         const hashedPassword = await bcrypt.hash(password, saltRounds);

//         // Insert new agent into the 'users' table with the hashed password
//         const { data, error } = await supabase
//             .from('users')
//             .insert([{
//                 first_name,
//                 last_name,
//                 email,
//                 phone_number,
//                 password: hashedPassword,
//                 company_name,
//                 address,
//                 state,
//                 city
//             }])
//             .select();

//         if (error) {
//             throw error;
//         }

//         res.status(201).json({ message: 'Agent created successfully.', agent: data[0] });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// // Agent Login
// exports.loginAgent = async (req, res) => {
//     const { emailOrPhone, password } = req.body;
//     try {
//         let agent;

//         // Find the user by either email or phone
//         if (emailOrPhone.includes('@')) {
//             const { data } = await supabase
//                 .from('users')
//                 .select('*')
//                 .eq('email', emailOrPhone)
//                 .single();
//             agent = data;
//         } else {
//             const { data } = await supabase
//                 .from('users')
//                 .select('*')
//                 .eq('phone_number', emailOrPhone)
//                 .single();
//             agent = data;
//         }

//         // Case 1: No user found with the given email or phone
//         if (!agent) {
//             if (emailOrPhone.includes('@')) {
//                 return res.status(401).json({ error: 'Email not found.' });
//             } else {
//                 return res.status(401).json({ error: 'Phone number not found.' });
//             }
//         }

//         // Case 2: User found, but password does not match
//         const passwordMatch = await bcrypt.compare(password, agent.password);
//         if (!passwordMatch) {
//             return res.status(401).json({ error: 'Incorrect password.' });
//         }

//         // Case 3: Login successful
//         const token = jwt.sign(
//             {
//                 userId: agent.id,
//                 email: agent.email
//             },
//             process.env.JWT_SECRET,
//             {
//                 expiresIn: '7d' // Token valid for 7 days
//             }
//         );

//         res.status(200).json({
//             message: 'Login successful.',
//             token,
//             agent: {
//                 id: agent.id,
//                 first_name: agent.first_name,
//                 last_name: agent.last_name,
//                 email: agent.email
//             }
//         });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };