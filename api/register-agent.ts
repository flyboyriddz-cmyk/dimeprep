import { createClient } from '@supabase/supabase-js';

// 1. Initialize Supabase (The Vault) with SECRET keys
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // NEVER expose this on the frontend
);

export default async function handler(req, res) {
  // Only allow POST requests (Sending data)
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Access Denied.' });
  }

  const { email, firstName, agentType } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Missing credentials.' });
  }

  try {
    // --- STEP 1: SAVE TO SUPABASE (The Database) ---
    // We explicitly verify if the user already exists to avoid duplicates
    const { data, error: dbError } = await supabase
      .from('agents')
      .upsert([
        { 
          email: email, 
          first_name: firstName, 
          status: 'PENDING', 
          tier: agentType === 'Hoodie' ? 'TIER_1' : 'TIER_3',
          joined_at: new Date().toISOString()
        }
      ])
      .select();

    if (dbError) throw dbError;

    // --- STEP 2: SEND TO KLAVIYO (The Comms) ---
    // This adds them to your "Sector 01 Waitlist" automatically
    const klaviyoResponse = await fetch(
      `https://a.klaviyo.com/api/v2/list/${process.env.KLAVIYO_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': process.env.KLAVIYO_PRIVATE_KEY!
        },
        body: JSON.stringify({
          profiles: [{ email: email, first_name: firstName }]
        })
      }
    );

    if (!klaviyoResponse.ok) {
      console.error('Klaviyo Error:', await klaviyoResponse.text());
      // We don't fail the whole request if Klaviyo fails, just log it.
    }

    // --- STEP 3: SUCCESS ---
    return res.status(200).json({ 
      success: true, 
      message: 'Agent registered. Clearance granted.' 
    });

  } catch (error) {
    console.error('Registration Error:', error);
    return res.status(500).json({ error: 'System Failure. Try again.' });
  }
}