// routes/shipping.js
const express = require('express');
const axios   = require('axios');
const router  = express.Router();

// GET /api/shipping/rates?bookWidth=…&bookHeight=…&bookThickness=…
router.get('/rates', async (req, res) => {
  try {
    // 1) Destructure your three values out of the query
    let { bookWidth, bookHeight, bookThickness } = req.query;

    // 2) Parse them into numbers (fallback to 0 if missing/invalid)
    const width     = parseFloat(bookWidth)     || 0;
    const length    = parseFloat(bookHeight)    || 0;
    const height    = parseFloat(bookThickness) || 0;

    console.log('Dimensions:', { length, width, height });

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
              // 3) Inject your dynamic dims here:
              dimensions: { length, width, height },
              hs_code: '49019900'
            }
          ]
        }
      ]
    };

    const { data } = await axios.post(
      'https://public-api.easyship.com/2024-09/rates',
      payload,
      {
        headers: {
          Accept:        'application/json',
          'Content-Type':'application/json',
          Authorization: `Bearer ${process.env.EASYSHIP_TOKEN}`
        }
      }
    );
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error('Easyship error:', err.response?.data || err.message);
    res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

module.exports = router;
