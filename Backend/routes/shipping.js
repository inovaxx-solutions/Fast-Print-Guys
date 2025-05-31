// routes/shipping.js

const express = require('express');
const axios = require('axios');
const router = express.Router();

// GET /api/shipping/rates?length=...&width=...&height=...&country=...&state=...&city=...&postal_code=...
router.get('/rates', async (req, res) => {
  try {
    console.log("Reached")
    // 1) Grab the raw strings out of the query params:
    const {
      length: rawLength,
      width: rawWidth,
      height: rawHeight,
      country: destCountry,
      state: destState,
      city: destCity,
      postal_code: destPostalCode,
    } = req.query;
    console.log(req.query.length, req.query.width, req.query.height, req.query.country, req.query.state, req.query.city, req.query.postal_code)
    // 2) Parse them into numbers (use 0 if parsing fails)
    const length = parseFloat(rawLength) || 0;
    const width = parseFloat(rawWidth) || 0;
    const height = parseFloat(rawHeight) || 0;

    console.log('Dimensions (curried):', { length, width, height });
    console.log('Destination address:', {
      country: destCountry,
      state: destState,
      city: destCity,
      postal_code: destPostalCode,
    });

    // 3) Build payload exactly as Easyship expects:
    //    We use a static origin_address (you can also make it dynamic if needed).
    const payload = {
      origin_address: {
        country_alpha2: 'US', // change if needed
        state: 'CA',
        city: 'Los Angeles',
        postal_code: '90001',
      },
      destination_address: {
        country_alpha2: destCountry || 'CA', // fallback to CA if missing
        state: destState || '-',
        city: destCity || '-',
        postal_code: destPostalCode || '-',
      },
      incoterms: 'DDU',
      insurance: { is_insured: false },
      courier_settings: {
        show_courier_logo_url: false,
        apply_shipping_rules: true,
      },
      shipping_settings: {
        units: { weight: 'kg', dimensions: 'cm' },
      },
      parcels: [
        {
          items: [
            {
              origin_country_alpha2: 'US',
              quantity: 1,
              declared_currency: 'USD',
              declared_customs_value: 10,
              actual_weight: 0.5,
              dimensions: { length, width, height },
              hs_code: '49019900',
            },
          ],
        },
      ],
    };

    // 4) Fire off the POST to Easyship
    const { data } = await axios.post('https://public-api.easyship.com/2024-09/rates', payload, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EASYSHIP_TOKEN}`,
      },
    });

    console.log('Easyship Rates Response:', data);

    // 5) Return the full Easyship payload back to the frontend:
    return res.json(data);
  } catch (err) {
    console.error('Easyship error details:', err.response?.data || err.message);
    return res
      .status(err.response?.status || 500)
      .json(err.response?.data || { error: err.message });
  }
});

module.exports = router;
