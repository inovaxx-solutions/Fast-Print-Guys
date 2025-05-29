// rate-quote.js
require('dotenv').config();       // ← MUST come first, loads EASYSHIP_TOKEN
const axios = require('axios');

// DEBUG: Make sure your token actually loaded
console.log('🔑 EASYSHIP_TOKEN:', process.env.EASYSHIP_TOKEN);

(async () => {
  try {
    const payload = {
      origin_address: {
        country_alpha2: 'US',
        state:          'CA',
        city:           'Los Angeles',
        postal_code:    '90001'
      },
      destination_address: {
        country_alpha2: 'AD',
        state:          '07',
        city:           'Andorra la Vella',
        postal_code:    'AD500'
      },
      incoterms: 'DDU',
      insurance: { is_insured: false },
      courier_settings: {
        show_courier_logo_url: false,
        apply_shipping_rules:  true
      },
      shipping_settings: {
        units: { weight: 'kg', dimensions: 'cm' }
      },
      parcels: [
        {
          items: [
            {
              origin_country_alpha2:  'US',
              quantity:               1,
              declared_currency:      'USD',
              declared_customs_value: 10,
              actual_weight:          0.5,
              dimensions: {
                length: 10,
                width:  15,
                height: 2
              },
              hs_code: '49019900'     // ← MUST use hs_code here
            }
          ]
        }
      ]
    };

    // DEBUG: log out your exact JSON
    console.log('📦 Payload:', JSON.stringify(payload));

    const { data } = await axios.post(
      'https://public-api.easyship.com/2024-09/rates',
      payload,
      {
        headers: {
          'Accept':         'application/json',
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${process.env.EASYSHIP_TOKEN}`
        }
      }
    );

    console.log('✅ Rates response:', JSON.stringify(data, null, 2));
  } catch (err) {
    // print the actual response from Easyship
    console.error('❌ Easyship error:', err.response?.data || err.message);
  }
})();
