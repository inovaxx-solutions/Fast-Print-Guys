import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import './BodyContent.css';
import { getData } from 'country-list';

import perfectBoundImg from '../../../../assets/perfectbound.png';
import coilBoundImg from '../../../../assets/coilbound.png';
import saddleStitchImg from '../../../../assets/saddlestich.png';
import caseWrapImg from '../../../../assets/casewrap.png';
import linenWrapImg from '../../../../assets/linenwrap.png';
import leatherWrapImg from '../../../../assets/leatherwrap.png';
import wireOImg from '../../../../assets/wire-o.png';
import standardBwImg from '../../../../assets/standardbw.png';
import premiumBwImg from '../../../../assets/premiumbw.png';
import standardColorImg from '../../../../assets/standardcolor.png';
import premiumColorImg from '../../../../assets/premiumcolor.png';
import glossyImg from '../../../../assets/glossy.png';
import matteImg from '../../../../assets/matte.png';
import sixtyCreamImg from '../../../../assets/60cream.png';
import sixtyWhiteImg from '../../../../assets/60white.png';
import eightyWhiteImg from '../../../../assets/80white.png';
import bookPreviewImg from '../../../../assets/leftcol_img.png';
import placeholder1Img from '../../../../assets/placeholder1.png';
import placeholder2Img from '../../../../assets/placeholder2.png';
import placeholder3Img from '../../../../assets/placeholder3.png';

// import spineRoundImage from '../../../../assets/spine-round.png';
// import spineFlatImage from '../../../../assets/spine-flat.png';

// import exteriorBlackImage from '../../../../assets/exterior-black.png';
// import exteriorBrownImage from '../../../../assets/exterior-brown.png';
// import exteriorMaroonImage from '../../../../assets/exterior-maroon.png';
// import exteriorDarkBlueImage from '../../../../assets/exterior-dark-blue.png';

// import foilGoldenImage from '../../../../assets/foil-golden.png';
// import foilSilverImage from '../../../../assets/foil-silver.png';

// import screenGoldenImage from '../../../../assets/screen-golden.png';
// import screenSilverImage from '../../../../assets/screen-silver.png';

// import cornerGoldSharpImage from '../../../../assets/corner-gold-sharp.png';
// import cornerGoldRoundImage from '../../../../assets/corner-gold-round.png';
// import cornerVintageImage from '../../../../assets/corner-vintage.png';

// --- IMPORT THE PRICING FUNCTION ---
import { calculateBookPrice } from '../../../../services/pricing'; // Adjust path if necessary

const bookSizeMap = {
  "pocketbook": "Pocket Book (4.25 x 6.875 in / 108 x 175 mm)",
  "novella": "Novella (5 x 8 in / 127 x 203 mm)",
  "digest": "Digest (5.5 x 8.5 in / 140 x 216 mm)",
  "a5": "A5 (5.83 x 8.27 in / 148 x 210 mm)",
  "us_trade": "US Trade (6 x 9 in / 152 x 229 mm)",
  "royal": "Royal (6.14 x 9.21 in / 156 x 234 mm)",
  "executive": "Executive (7 x 10 in / 178 x 254 mm)",
  "crown_quarto": "Crown Quarto (7.44 x 9.68 in / 189 x 246 mm)",
  "small_square": "Small Square (7.5 x 7.5 in / 190 x 190 mm)",
  "a4": "A4 (8.27 x 11.69 in / 210 x 297 mm)",
  "square": "Square (8.5 x 8.5 in / 216 x 216 mm)",
  "us_letter": "US Letter (8.5 x 11 in / 216 x 279 mm)",
  "small_landscape": "Small Landscape (9 x 7 in / 229 x 178 mm)",
  "us_letter_landscape": "US Letter Landscape (11 x 8.5 in / 279 x 216 mm)",
  "a4_landscape": "A4 Landscape (11.69 x 8.27 in / 297 x 210 mm)",
  "comic": "Comic Book (6.625 x 10.25 in / 168 x 260 mm)",
  "larger-deluxe": "Larger Deluxe (7 x 10.875 in / 177.8 mm x 276.23 mm)",
  "manga": "Manga (Japanese Style Comics) (5 x 7.5 in / 127 mm x 190.5 mm)"
};

const bindingMap = {
  'perfect': 'Perfect Bound',
  'coil': 'Coil Bound',
  'saddle': 'Saddle Stitch',
  'case': 'Case Wrap',
  'linen': 'Linen Wrap',
  'wire-o': 'Wire-O',
  'leather': 'Leather Case Wrap',
  'faux-leather': 'Faux Leather Case Wrap',
  'polythin': 'Polythin Rexine Case Wrap'
};

// const thesisSpineMap = {
//   'round': spineRoundImage,
//   'flat': spineFlatImage,
// };

// const thesisExteriorColorMap = {
//   'black': exteriorBlackImage,
//   'brown': exteriorBrownImage,
//   'maroon': exteriorMaroonImage,
//   'dark-blue': exteriorDarkBlueImage,
// };

// const thesisFoilStampingMap = {
//   'golden': foilGoldenImage,
//   'silver': foilSilverImage,
// };

// const thesisScreenStampingMap = {
//   'golden': screenGoldenImage,
//   'silver': screenSilverImage,
// };

// const thesisCornerProtectorMap = {
//   'gold-sharp': cornerGoldSharpImage,
//   'gold-round': cornerGoldRoundImage,
//   'vintage': cornerVintageImage,
// };

const interiorColorMap = {
  'standard-bw': 'Standard Black & White',
  'premium-bw': 'Premium Black & White',
  'standard-color': 'Standard Color',
  'premium-color': 'Premium Color',
};

const paperTypeMap = {
  '60-cream': '60# Cream — Uncoated',
  '60-white': '60# White — Uncoated',
  '80-white': '80# White — Coated',
  '100-white': '100# White — Coated' // Added for calendar, ensure it's in pricing.js if used elsewhere
};

const coverFinishMap = {
  'glossy': 'Glossy',
  'matte': 'Matte',
};


const photoBookBindingDisplayConfig = {
  pocketbook: [
    { id: 'binding-coil', value: 'coil', imageSrc: coilBoundImg, labelText: 'Coil Bound' },
    { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
    { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
  ],
  novella: [
    { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
    { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
  ],
  // Default for other photo book sizes
  other: [
    { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
    { id: 'binding-coil', value: 'coil', imageSrc: coilBoundImg, labelText: 'Coil Bound' },
    { id: 'binding-linen', value: 'linen', imageSrc: linenWrapImg, labelText: 'Linen Wrap' },
  ]
};



const RadioOption = ({ id, name, value, checked, onChange, imageSrc, labelText, disabled, tooltip }) => (
  <div className={`option-item ${disabled ? 'disabled' : ''}`}>
    <label htmlFor={id} className="option-label">
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={() => !disabled && onChange(value)}
        disabled={disabled}
      />
      <div className="option-image" style={{ backgroundImage: `url(${imageSrc})` }}></div>
      <span className="option-text">{labelText}</span>
      {disabled && (
        <div className="option-tooltip">
          <span className="tooltip-text">{tooltip}</span>
        </div>
      )}
    </label>
  </div>
);

const SelectInput = ({ id, value, onChange, options, placeholder, label }) => (
  <div className="select-wrapper">
    {label && <label htmlFor={id} className="select-label">{label}</label>}
    <select
      id={id}
      value={value}
      onChange={onChange}
      className="select-input"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
    <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
      <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/>
    </svg>
  </div>
);

const formatOptionLabel = (optionId) => {
  if (!optionId) return 'Loading...';
  if (optionId === 'thesis-binding') return 'Thesis Binding';
  return optionId
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
///


const bookSizeMeta = {
  pocketbook: { height: 10.79, width: 17.46, thickness: 0.01, weight: 0.002261 },
  novella: { height: 12.7, width: 20.32, thickness: 0.01, weight: 0.003097 },
  digest: { height: 13.97, width: 21.59, thickness: 0.01, weight: 0.003619 },
  a5: { height: 14.81, width: 21.01, thickness: 0.01, weight: 0.003734 },
  us_trade: { height: 15.24, width: 22.86, thickness: 0.01, weight: 0.004181 },
  royal: { height: 15.60, width: 23.39, thickness: 0.01, weight: 0.004379 },
  executive: { height: 17.78, width: 25.4, thickness: 0.01, weight: 0.005419 },
  crown_quarto: { height: 18.9, width: 24.59, thickness: 0.01, weight: 0.005577 },
  small_square: { height: 19.05, width: 19.05, thickness: 0.01, weight: 0.004355 },
  a4: { height: 21.01, width: 29.69, thickness: 0.01, weight: 0.007485 },
  square: { height: 21.59, width: 21.59, thickness: 0.01, weight: 0.005594 },
  us_letter: { height: 21.59, width: 27.94, thickness: 0.01, weight: 0.007239 },
  small_landscape: { height: 22.86, width: 17.78, thickness: 0.01, weight: 0.004877 },
  us_letter_landscape: { height: 27.94, width: 21.59, thickness: 0.01, weight: 0.007239 },
  a4_landscape: { height: 29.69, width: 21.01, thickness: 0.01, weight: 0.007485 },
  comic: { height: 16.83, width: 26.04, thickness: 0.01, weight: 0.005259 },
  'larger-deluxe': { height: 17.78, width: 27.62, thickness: 0.01, weight: 0.005893 },
  manga: { height: 12.7, width: 19.05, thickness: 0.01, weight: 0.002903 }
};


const bindingWeightMap = {
  pocketbook: {
    perfect: 0.027261,
    saddle: 0.012261,
    case: 0.152261,
    linen: 0.162261,
    coil: 0.032261,
    leather: 0.252261,
    'faux-leather': 0.202261,
    polythin: 0.182261
  },
  novella: {
    perfect: 0.028097,
    saddle: 0.013097,
    case: 0.153097,
    linen: 0.163097,
    coil: 0.033097,
    leather: 0.253097,
    'faux-leather': 0.203097,
    polythin: 0.183097
  },
  digest: {
    perfect: 0.028619,
    saddle: 0.013619,
    case: 0.153619,
    linen: 0.163619,
    coil: 0.033619,
    leather: 0.253619,
    'faux-leather': 0.203619,
    polythin: 0.183619
  },
  a5: {
    perfect: 0.028734,
    saddle: 0.013734,
    case: 0.153734,
    linen: 0.163734,
    coil: 0.033734,
    leather: 0.253734,
    'faux-leather': 0.203734,
    polythin: 0.183734
  },
  us_trade: {
    perfect: 0.029181,
    saddle: 0.014181,
    case: 0.154181,
    linen: 0.164181,
    coil: 0.034181,
    leather: 0.254181,
    'faux-leather': 0.204181,
    polythin: 0.184181
  },
  royal: {
    perfect: 0.029379,
    saddle: 0.014379,
    case: 0.154379,
    linen: 0.164379,
    coil: 0.034379,
    leather: 0.254379,
    'faux-leather': 0.204379,
    polythin: 0.184379
  },
  executive: {
    perfect: 0.030419,
    saddle: 0.015419,
    case: 0.155419,
    linen: 0.165419,
    coil: 0.035419,
    leather: 0.255419,
    'faux-leather': 0.205419,
    polythin: 0.185419
  },
  crown_quarto: {
    perfect: 0.030577,
    saddle: 0.015577,
    case: 0.155577,
    linen: 0.165577,
    coil: 0.035577,
    leather: 0.255577,
    'faux-leather': 0.205577,
    polythin: 0.185577
  },
  small_square: {
    perfect: 0.029355,
    saddle: 0.014355,
    case: 0.154355,
    linen: 0.164355,
    coil: 0.034355,
    leather: 0.254355,
    'faux-leather': 0.204355,
    polythin: 0.184355
  },
  a4: {
    perfect: 0.032485,
    saddle: 0.017485,
    case: 0.157485,
    linen: 0.167485,
    coil: 0.037485,
    leather: 0.257485,
    'faux-leather': 0.207485,
    polythin: 0.187485
  },
  square: {
    perfect: 0.030594,
    saddle: 0.015594,
    case: 0.155594,
    linen: 0.165594,
    coil: 0.035594,
    leather: 0.255594,
    'faux-leather': 0.205594,
    polythin: 0.185594
  },
  us_letter: {
    perfect: 0.032239,
    saddle: 0.017239,
    case: 0.157239,
    linen: 0.167239,
    coil: 0.037239,
    leather: 0.257239,
    'faux-leather': 0.207239,
    polythin: 0.187239
  },
  small_landscape: {
    perfect: 0.029877,
    saddle: 0.014877,
    case: 0.154877,
    linen: 0.164877,
    coil: 0.034877,
    leather: 0.254877,
    'faux-leather': 0.204877,
    polythin: 0.184877
  },
  us_letter_landscape: {
    perfect: 0.032239,
    saddle: 0.017239,
    case: 0.157239,
    linen: 0.167239,
    coil: 0.037239,
    leather: 0.257239,
    'faux-leather': 0.207239,
    polythin: 0.187239
  },
  a4_landscape: {
    perfect: 0.032485,
    saddle: 0.017485,
    case: 0.157485,
    linen: 0.167485,
    coil: 0.037485,
    leather: 0.257485,
    'faux-leather': 0.207485,
    polythin: 0.187485
  },
  comic: {
    perfect: 0.030259,
    saddle: 0.015259,
    case: 0.155259,
    linen: 0.165259,
    coil: 0.035259,
    leather: 0.255259,
    'faux-leather': 0.205259,
    polythin: 0.185259
  },
  'larger-deluxe': {
    perfect: 0.030893,
    saddle: 0.015893,
    case: 0.155893,
    linen: 0.165893,
    coil: 0.035893,
    leather: 0.255893,
    'faux-leather': 0.205893,
    polythin: 0.185893
  },
  manga: {
    perfect: 0.027903,
    saddle: 0.012903,
    case: 0.152903,
    linen: 0.162903,
    coil: 0.032903,
    leather: 0.252903,
    'faux-leather': 0.202903,
    polythin: 0.182903
  }
};

const bufferSpineMap = {
  pocketbook: {
    perfect: { bufferKg: 0.2268, spineCm: 1.01 },
    case:    { bufferKg: 0.5443, spineCm: 1.01 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  novella: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 0.72 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  digest: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  a5: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  us_trade: {
    perfect: { bufferKg: 0.2268, spineCm: 1.98 },
    case:    { bufferKg: 0.5443, spineCm: 1.87 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  royal: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  executive: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  crown_quarto: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  small_square: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  a4: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  square: {
    perfect: { bufferKg: 0.2268, spineCm: 0.32 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  us_letter: {
    perfect: { bufferKg: 0.2268, spineCm: 3.01 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  small_landscape: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  us_letter_landscape: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  },
  a4_landscape: {
    perfect: { bufferKg: 0.2268, spineCm: 1.3 },
    case:    { bufferKg: 0.5443, spineCm: 1.3 },
    coil:    { bufferKg: 0.2268, spineCm: 1.3 },
    leather: { bufferKg: 0.8165, spineCm: 1.3 }
  }
};

const boxOptions = [
  {
    name: "Small Box",
    dimensionsCm: { length: 25.4, width: 35.56, height: 7.62 } // 10x14x3 in
  },
  {
    name: "Medium Box",
    dimensionsCm: { length: 30.48, width: 30.48, height: 30.48 } // 12x12x12 in
  },
  {
    name: "Large Box",
    dimensionsCm: { length: 35.56, width: 35.56, height: 35.56 } // 14x14x14 in
  }
];



const BodyContent = ({ activeOption = 'print-book' }) => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [selectedBookSize, setSelectedBookSize] = useState('pocketbook');
  const [pageCount, setPageCount] = useState('100'); // Keep as string for input field, parse for calculation
  const [bindingType, setBindingType] = useState('case');
  const [interiorColor, setInteriorColor] = useState('standard-bw');
  const [paperType, setPaperType] = useState('60-white');
  const [coverFinish, setCoverFinish] = useState('matte');
  
  const [calculatedPrice, setCalculatedPrice] = useState('0.00');
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [priceError, setPriceError] = useState(null);
  
  const [availableBindings, setAvailableBindings] = useState(['case', 'linen', 'perfect', 'coil', 'saddle']);
  const [showShippingEstimates, setShowShippingEstimates] = useState(false);
  const [showRevenueEstimates, setShowRevenueEstimates] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [shippingEstimate, setShippingEstimate] = useState(null);
  const [estimatedSales, setEstimatedSales] = useState(100);
  const [estimatedRevenue, setEstimatedRevenue] = useState(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [addToCartError, setAddToCartError] = useState(null);

  // Add new state variables for pricing details
  const [subtotal, setSubtotal] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [shippingCost, setShippingCost] = useState(10); // Hardcoded shipping
  const [finalTotalPrice, setFinalTotalPrice] = useState(0);
  
  const handleCreateClick = async () => {
    setIsAddingToCart(true);
    setAddToCartError(null);
  
    try {
      // pull the box dims out of state
      const { estLength, estWidth, estHeight } = selectedBoxDetails;
  
      const response = await axios.get('http://127.0.0.1:5000/api/shipping/rates', {
        params: {
          length: estLength,
          width:  estWidth,
          height: estHeight,
          country: selectedCountry,
        }
      });
  
      console.log('✅ shipping/rates response', response.data);
      navigate('/checkout/shipping');
    } catch (err) {
      console.error('failed to fetch shipping rates', err);
      setAddToCartError('Could not reach shipping API.');
    } finally {
      setIsAddingToCart(false);
    }
  };
  
  

// … and in your JSX …
<button
   className="btn btn-primary"
   onClick={handleCreateClick}
   disabled={
     isAddingToCart ||
     isPriceLoading ||
     !!priceError ||
     calculatedPrice === 'N/A' ||
     calculatedPrice === '0.00'
   }
 >
   {isAddingToCart
     ? 'Fetching Shipping…'
     : `Create Your ${formatOptionLabel(activeOption)}`}
 </button>




  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    } else if (e.target.value === '') {
      setQuantity(''); // Allow clearing the input
    } else {
      setQuantity(1); // Or set to a minimum valid quantity like 1
    }
  };

  // Thesis Binding's Options
  const [thesisBindingType, setThesisBindingType] = useState('leather'); // Default to a valid thesis binding type
  const [thesisSpine, setThesisSpine] = useState('round');
  const [thesisExteriorColor, setThesisExteriorColor] = useState('black');
  const [thesisFoilStamping, setThesisFoilStamping] = useState('golden');
  const [thesisScreenStamping, setThesisScreenStamping] = useState('golden');
  const [thesisCornerProtector, setThesisCornerProtector] = useState('gold-sharp');
  const [thesisInteriorColor, setThesisInteriorColor] = useState('premium-bw');
  const [thesisPaperType, setThesisPaperType] = useState('70-white');

  // --- EFFECT: Calculate discount and total price when quantity or price changes ---
  // --- EFFECT: Calculate discount and total price when quantity or price changes ---
  useEffect(() => {
    const basePrice = parseFloat(calculatedPrice) || 0;
    const currentQuantity = parseInt(quantity) || 0;
    const calculatedSubtotal = basePrice * currentQuantity;
    const calculatedDiscount = currentQuantity > 100 ? calculatedSubtotal * 0.1 : 0;
    const priceAfterDiscount = calculatedSubtotal - calculatedDiscount;
    const calculatedFinalTotal = priceAfterDiscount + shippingCost; // Add shipping cost

    setSubtotal(calculatedSubtotal);
    setDiscountAmount(calculatedDiscount);
    // shippingCost is already set in state
    setFinalTotalPrice(calculatedFinalTotal);
    localStorage.setItem('subtotal', calculatedSubtotal); // Store subtotal in local storage
    console.log('Subtotal stored in localStorage:', calculatedSubtotal); // Debug log
  }, [quantity, calculatedPrice, shippingCost]);

//setting book dimensions
const [bookHeight, setBookHeight] = useState(0);
const [bookWidth, setBookWidth] = useState(0);
const [bookThickness, setBookThickness] = useState(0);
const [pageWeight, setPageWeight] = useState(0);
const [bindingWeight, setBindingWeight] = useState(0);

const [spineCm, setSpineCm] = useState(0);
const [bindingBufferKg, setBindingBufferKg] = useState(0);

const [selectedBoxDetails, setSelectedBoxDetails] = useState(null);


useEffect(() => {
  const meta = bookSizeMeta[selectedBookSize];
  if (meta) {
    setBookHeight(meta.height);
    setBookWidth(meta.width);
    setBookThickness(meta.thickness);
    setPageWeight(meta.weight);
  }

  const bindingMap = bindingWeightMap[selectedBookSize];
  if (bindingMap) {
    const bindingVal = activeOption === 'thesis-binding' ? thesisBindingType : bindingType;
    setBindingWeight(bindingMap[bindingVal] || 0);
  }

  const spineBuffer = bufferSpineMap[selectedBookSize]?.[bindingType];
  if (spineBuffer) {
    setSpineCm(spineBuffer.spineCm);
    setBindingBufferKg(spineBuffer.bufferKg);
  } else {
    setSpineCm(0);
    setBindingBufferKg(0);
  }
  setCountries(getData());
}, [selectedBookSize, bindingType, thesisBindingType, activeOption]);


  const bindingRules = {
    'print-book': {
      'pocketbook': { minPages: { 'coil': 3 }, maxPages: { 'coil': Infinity }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'novella': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'digest': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'a5': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'us_trade': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'royal': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'executive': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'crown_quarto': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'a4': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'square': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'us_letter': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'small_landscape': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
      'us_letter_landscape': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470, 'perfect': 250 }, conditional: (pages) => { const b = ['coil']; if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1); return b; } },
      'a4_landscape': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470, 'perfect': 250 }, conditional: (pages) => { const b = ['coil']; if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1); return b; } },
      'small_square': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 48 && b.includes('saddle')) b.splice(b.indexOf('saddle'), 1); if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); return b; } },
    },
    'photo-book': {
      'pocketbook': { // Show 'coil', 'case', 'perfect'
        minPages: { 'coil': 3, 'case': 24, 'perfect': 32 },
        maxPages: { 'coil': Infinity, 'case': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('case');
          if (pages >= 32) b.push('perfect');
          return b;
        }
      },
      'novella': { // Show ONLY 'perfect' and 'case'
        minPages: { 'case': 24, 'perfect': 32 },
        maxPages: { 'case': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 24) b.push('case');
          if (pages >= 32) b.push('perfect');
          return b;
        }
      },
      // For all other photo book sizes, show ONLY 'perfect', 'coil', 'linen'
      'digest': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity }, // Example max for coil
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1); // Example from original logic
          return b;
        }
      },
      'a5': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'us_trade': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'royal': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'executive': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          // Assuming executive might not always get linen in original photo-book if it was case only. Add linen as per new rule.
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'crown_quarto': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'a4': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'square': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'us_letter': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'small_landscape': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity }, // Note: original small_landscape for photobook only had coil and case/perfect. Now gets linen too.
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen'); // Added linen
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'us_letter_landscape': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': 250 }, // Perfect max from original rule
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1);
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'a4_landscape': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': 250 }, // Perfect max from original rule
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen');
          if (pages >= 32) b.push('perfect');
          if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1);
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
      'small_square': {
        minPages: { 'coil': 3, 'linen': 24, 'perfect': 32 },
        maxPages: { 'coil': 470, 'linen': Infinity, 'perfect': Infinity },
        conditional: (pages) => {
          const b = [];
          if (pages >= 3) b.push('coil');
          if (pages >= 24) b.push('linen'); // Added linen
          if (pages >= 32) b.push('perfect');
          if (pages > 470 && b.includes('coil')) b.splice(b.indexOf('coil'), 1);
          return b;
        }
      },
    },
    'comic-book': {
      'comic': { minPages: { 'coil': 3 }, maxPages: { 'coil': Infinity }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'larger-deluxe': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'manga': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
    },
    'magazine': {
      'a4': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'us_letter': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
    },
    'yearbook': {
      'a4': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'us_letter': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470 }, conditional: (pages) => { const b = ['coil']; if (pages >= 4) b.push('saddle'); if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); return b; } },
      'us_letter_landscape': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470, 'perfect': 250 }, conditional: (pages) => { const b = ['coil']; if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1); return b; } },
      'a4_landscape': { minPages: { 'coil': 3 }, maxPages: { 'coil': 470, 'perfect': 250 }, conditional: (pages) => { const b = ['coil']; if (pages >= 24) b.push('case'); if (pages >= 32) b.push('perfect', 'linen'); if (pages > 250 && b.includes('perfect')) b.splice(b.indexOf('perfect'), 1); return b; } },
    },
    'calendar': {
      'us_letter_landscape': { minPages: { 'wire-o': 26 }, maxPages: { 'wire-o': 26 }, conditional: (pages) => { return pages === 26 ? ['wire-o'] : []; } },
    },
    'thesis-binding': {
      'a4': { minPages: { 'leather': 24, 'faux-leather': 24, 'polythin': 24 }, maxPages: { 'leather': 800, 'faux-leather': 800, 'polythin': 800 }, conditional: (pages) => { const b = []; if (pages >= 24 && pages <=800) { b.push('leather', 'faux-leather', 'polythin');} return b; } },
      'us_letter': { minPages: { 'leather': 24, 'faux-leather': 24, 'polythin': 24 }, maxPages: { 'leather': 800, 'faux-leather': 800, 'polythin': 800 }, conditional: (pages) => { const b = []; if (pages >= 24 && pages <=800) { b.push('leather', 'faux-leather', 'polythin');} return b; } },
    },
  };

  useEffect(() => {
    const rulesForActiveOption = bindingRules[activeOption];
    const rulesForBookSize = rulesForActiveOption ? rulesForActiveOption[selectedBookSize] : null;
    const pageNum = parseInt(pageCount) || 0;
    let available = [];

    if (activeOption === 'calendar') {
      available = (rulesForBookSize && rulesForBookSize.conditional) ? rulesForBookSize.conditional(pageNum) : [];
    } else if (activeOption === 'thesis-binding') {
      if (rulesForBookSize && rulesForBookSize.conditional) {
        available = rulesForBookSize.conditional(pageNum);
      }
    } else if (pageNum >= 3 && rulesForBookSize && rulesForBookSize.conditional) {
      available = rulesForBookSize.conditional(pageNum);
    }
    
    setAvailableBindings(available);

    if (!available.includes(bindingType)) {
      if (available.length > 0) {
        setBindingType(available[0]);
      } else {
        setBindingType('');
      }
    }
  }, [activeOption, pageCount, selectedBookSize]); // Removed bindingType from dependencies to avoid potential infinite loop, it's reset if not available.

  
  const handlePageCountChange = (e) => {
    let value = e.target.value;

    if (value === '') {
      setPageCount('');
      return;
    }

    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      let minPages = 1;
      let maxPages = 1000; // General high max

      if (activeOption === 'thesis-binding') {
        minPages = 24; // From thesis bindingRules
        maxPages = 800; // From thesis bindingRules
      } else if (activeOption === 'calendar') {
        minPages = 26; // For wire-o
        maxPages = 26; // For wire-o
      } else {
        // Try to get min/max from current binding if possible, otherwise general defaults
        const currentBindingRule = bindingRules[activeOption]?.[selectedBookSize]?.minPages?.[bindingType];
        if (currentBindingRule) minPages = Math.max(minPages, currentBindingRule);

        // Max page could also be dynamic based on binding, but for input validation a general cap is simpler here
        // The bindingRules useEffect will handle disabling specific bindings if page count exceeds their specific max.
      }
      
      const constrainedValue = Math.min(Math.max(numValue, minPages), maxPages);
      setPageCount(constrainedValue.toString());
    }
  };

  const isBindingDisabled = (bindingValue) => {
    // This is now primarily driven by availableBindings
    return !availableBindings.includes(bindingValue);
  };

  const getBindingTooltip = (bindingValue) => {
    const rulesForActiveOption = bindingRules[activeOption];
    const rulesForBookSize = rulesForActiveOption ? rulesForActiveOption[selectedBookSize] : null;
    const rules = rulesForBookSize || {};
    const pageNum = parseInt(pageCount) || 0;

    if (!availableBindings.includes(bindingValue)) {
      if (rules.minPages && rules.minPages[bindingValue] && pageNum < rules.minPages[bindingValue]) {
        return `Minimum ${rules.minPages[bindingValue]} pages required`;
      }
      if (rules.maxPages && rules.maxPages[bindingValue] !== Infinity && pageNum > rules.maxPages[bindingValue]) {
        return `Maximum ${rules.maxPages[bindingValue]} pages allowed`;
      }
      if (activeOption === 'calendar' && bindingValue === 'wire-o' && pageNum !== 26) {
        return `Requires exactly 26 pages`;
      }
      return 'Not available for current selection';
    }
    return '';
  };
  
  // --- USEEFFECT FOR PRICE CALCULATION ---
  useEffect(() => {
    const fetchPrice = async () => {
      setIsPriceLoading(true);
      setPriceError(null);

      const itemConfig = {
        activeOption,
        selectedBookSize,
        pageCount: parseInt(pageCount) || 0,
        bindingType,
        // These are for non-thesis options
        interiorColor: activeOption !== 'thesis-binding' ? interiorColor : undefined,
        paperType: activeOption !== 'thesis-binding' ? paperType : undefined,
        coverFinish: activeOption !== 'thesis-binding' ? coverFinish : undefined,
        // Thesis-specific options
        ...(activeOption === 'thesis-binding' && {
          thesisBindingType,
          thesisSpine,
          thesisExteriorColor,
          thesisFoilStamping,
          thesisScreenStamping,
          thesisCornerProtector,
          thesisInteriorColor, // This will be 'premium-bw' or 'premium-color'
          thesisPaperType,
        }),
      };

      try {
        // console.log("BodyContent: Sending itemConfig to calculateBookPrice:", JSON.stringify(itemConfig, null, 2));
        const response = await calculateBookPrice(itemConfig);
        // console.log("BodyContent: Received response from calculateBookPrice:", response);
        
        if (response && typeof response.price === 'number') {
          setCalculatedPrice(response.price.toFixed(2));
        } else {
          // console.warn('Price not found or invalid format for config:', itemConfig, response);
          setCalculatedPrice('N/A');
          // setPriceError('Price not available for this configuration.'); // Optional
        }
      } catch (error) {
        console.error('BodyContent: Error fetching price:', error);
        setPriceError('Could not calculate price.');
        setCalculatedPrice('N/A');
      } finally {
        setIsPriceLoading(false);
      }
    };

    const parsedPageCount = parseInt(pageCount) || 0;

    if (parsedPageCount <= 0 && activeOption !== 'calendar') {
        setCalculatedPrice('0.00');
        setIsPriceLoading(false);
        return;
    }
    if (activeOption === 'calendar' && parsedPageCount !== 26) {
        setCalculatedPrice('N/A'); // Calendars might only have a price at 26 pages
        setIsPriceLoading(false);
        return;
    }
    // Ensure a binding type is selected, especially after availableBindings might change it.
    if (!bindingType && availableBindings.length > 0) {
        // If bindingType is reset, wait for the state update then this effect will run again.
        // Or, if it was reset to '', don't calculate price.
        setCalculatedPrice('0.00');
        setIsPriceLoading(false);
        return;
    }
    if (!bindingType && activeOption !== 'thesis-binding' && activeOption !== 'calendar' /* these might have default or single bindings */) {
        setCalculatedPrice('0.00');
        setIsPriceLoading(false);
        return;
    }


    fetchPrice();

  }, [
    activeOption, selectedBookSize, pageCount, bindingType, interiorColor, paperType, coverFinish,
    thesisBindingType, thesisSpine, thesisExteriorColor, thesisFoilStamping, thesisScreenStamping,
    thesisCornerProtector, thesisInteriorColor, thesisPaperType, availableBindings // Added availableBindings as it can influence bindingType
  ]);


  const renderBindingOption = (opt) => (
    <RadioOption
      key={opt.id}
      {...opt}
      name={activeOption === 'thesis-binding' ? "thesisBindingType" : "bindingType"}
      checked={activeOption === 'thesis-binding' ? thesisBindingType === opt.value : bindingType === opt.value}
      onChange={activeOption === 'thesis-binding' ? setThesisBindingType : setBindingType}
      disabled={isBindingDisabled(opt.value)}
      tooltip={getBindingTooltip(opt.value)}
    />
  );

  const renderBindingSections = () => {
    let bindingOptionsConfig = [];

    if (['print-book', 'comic-book','yearbook', 'magazine'].includes(activeOption)) {
      bindingOptionsConfig = [
        { title: 'Paperback Options', options: [
            { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
            { id: 'binding-coil', value: 'coil', imageSrc: coilBoundImg, labelText: 'Coil Bound' },
            { id: 'binding-saddle', value: 'saddle', imageSrc: saddleStitchImg, labelText: 'Saddle Stitch' },
        ]},
        { title: 'Hardcover Options', options: [
            { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
            { id: 'binding-linen', value: 'linen', imageSrc: linenWrapImg, labelText: 'Linen Wrap' },
        ]}
      ];
    } else if (activeOption === 'photo-book') {
      let specificPhotoBookOptions;
      if (selectedBookSize === 'pocketbook') {
        specificPhotoBookOptions = photoBookBindingDisplayConfig.pocketbook;
      } else if (selectedBookSize === 'novella') {
        specificPhotoBookOptions = photoBookBindingDisplayConfig.novella;
      } else {
        specificPhotoBookOptions = photoBookBindingDisplayConfig.other;
      }
      bindingOptionsConfig = [{
        // title: 'Binding Options', // You can add a title if you want
        options: specificPhotoBookOptions
      }];
    } else if (activeOption === 'calendar') {
      bindingOptionsConfig = [{ options: [
        { id: 'binding-wire-o', value: 'wire-o', imageSrc: wireOImg, labelText: 'Wire-O Binding' },
      ]}];
    } else if (activeOption === 'thesis-binding') {
      bindingOptionsConfig = [{ title: 'Binding Type', options: [
        { id: 'binding-leather', value: 'leather', imageSrc: leatherWrapImg, labelText: 'Leather Case Wrap' },
        { id: 'binding-faux-leather', value: 'faux-leather', imageSrc: coilBoundImg, labelText: 'Faux Leather Case Wrap' },
        { id: 'binding-polythin', value: 'polythin', imageSrc: saddleStitchImg, labelText: 'Polythin Rexine Case Wrap' },
      ]}];
    }
const getShippingBoxDetails = ({
  pageWeight,
  pageCount,
  bindingWeight,
  bindingBufferKg,
  spineCm,
  bookHeight,
  bookWidth,
  quantity
}) => {
  const bufferCm = 1.2;
  const boxWeightKg = 0.2;

  const totalPageWeight = pageWeight * pageCount;
  const singleBookWeight = totalPageWeight + bindingWeight;
  const totalWeightKg = singleBookWeight * quantity + boxWeightKg;

const paperThickness = bookSizeMeta[selectedBookSize]?.thickness || 0.01;


  const estLength = bookWidth + bufferCm;
  const estWidth = bookHeight + bufferCm;
  const estHeight = (spineCm + (pageCount * paperThickness)) * quantity;

  const selectedBox = boxOptions.find(box => {
    const { length, width, height } = box.dimensionsCm;
    return estLength <= length && estWidth <= width && estHeight <= height;
  }) || boxOptions[boxOptions.length - 1];

  return {
    boxName: selectedBox.name,
    boxDimensions: selectedBox.dimensionsCm,
    totalWeightKg: parseFloat(totalWeightKg.toFixed(3)),
    estLength: parseFloat(estLength.toFixed(2)),
    estWidth: parseFloat(estWidth.toFixed(2)),
    estHeight: parseFloat(estHeight.toFixed(2)),
    perBookWeight: parseFloat(singleBookWeight.toFixed(3)),
  };
};


useEffect(() => {
  const boxData = getShippingBoxDetails({
    pageWeight,
    pageCount: parseInt(pageCount) || 0, // ⚠️ ensure it's a number
    bindingWeight,
    bindingBufferKg,
    spineCm,
    bookHeight,
    bookWidth,
    quantity
  });
  setSelectedBoxDetails(boxData);
}, [
  pageWeight,
  pageCount,
  bindingWeight,
  bindingBufferKg,
  spineCm,
  bookHeight,
  bookWidth,
  quantity
]);

useEffect(() => {
    if (!selectedBoxDetails) return;
  
    localStorage.setItem('boxLength', selectedBoxDetails.estLength);
    localStorage.setItem('boxWidth', selectedBoxDetails.estWidth);
    localStorage.setItem('boxHeight', selectedBoxDetails.estHeight);
    localStorage.setItem('calculatedPrice', calculatedPrice)
  }, [selectedBoxDetails]);

//change^
    return (
      <div className="config-section">
        <h3 className="config-title">Binding Type</h3>
        {bindingOptionsConfig.map((section, index) => (
          <div key={index} className="binding-section">
            {section.title && <h4 className="binding-title">{section.title}</h4>}
            <div className="options-grid">
              {section.options.map(renderBindingOption)}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderContent = () => {
    let bookSizeOptions;
    // Effect to reset selections when activeOption changes
    useEffect(() => {
        // Reset to defaults for the new activeOption
        if (activeOption === 'comic-book') {
            setSelectedBookSize('comic');
            setInteriorColor('premium-bw'); // Default for comic
            setPaperType('70-white'); // Default for comic
        } else if (activeOption === 'magazine') {
            setSelectedBookSize('a4');
            setInteriorColor('premium-color');
            setPaperType('80-white');
        } else if (activeOption === 'yearbook') {
            setSelectedBookSize('a4');
            setInteriorColor('premium-color');
            setPaperType('80-white');
        } else if (activeOption === 'thesis-binding') {
            setSelectedBookSize('a4');
            setThesisBindingType('leather'); // Ensure this is a valid option
            setPageCount('100'); // Default page count
             // Other thesis defaults are set in useState initial values
        } else if (activeOption === 'calendar') {
            setSelectedBookSize('us_letter_landscape');
            setPageCount('26'); // Calendar specific
            setInteriorColor('premium-color'); // Typically full color
            setPaperType('100-white'); // Typically thicker paper
        } else if (activeOption === 'photo-book') {
            setSelectedBookSize('digest'); // A common photo book size
            setInteriorColor('premium-color');
            setPaperType('80-white'); // Coated paper for photos
        }
         else { // Default to print-book settings
            setSelectedBookSize('pocketbook');
            setInteriorColor('standard-bw');
            setPaperType('60-white');
            setPageCount('100');
        }
    }, [activeOption]);


    if (activeOption === 'comic-book') {
      bookSizeOptions = [
        { value: 'comic', label: 'Comic Book (6.625 x 10.25 in)' },
        { value: 'larger-deluxe', label: 'Larger Deluxe (7 x 10.875 in)' },
        { value: 'manga', label: 'Manga (Japanese Style Comics) (5 x 7.5 in)' },
      ];
    } else if (activeOption === 'magazine') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
      ];
    } else if (activeOption === 'yearbook') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
        { value: 'a4_landscape', label: 'A4 Landscape (11.69 x 8.27 in)' },
        { value: 'us_letter_landscape', label: 'US Letter Landscape (11 x 8.5 in)' }
      ];
    } else if (activeOption === 'thesis-binding') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
      ];
    } else if (activeOption === 'calendar') {
      bookSizeOptions = [
        { value: 'us_letter_landscape', label: 'US Letter Landscape (11 x 8.5 in)' }
      ];
    } else { // Default for print-book and photo-book (photo-book might have a more curated list)
      bookSizeOptions = [
        { value: 'pocketbook', label: 'Pocket Book (4.25 x 6.875 in)' },
        { value: 'novella', label: 'Novella (5 x 8 in)' },
        { value: 'digest', label: 'Digest (5.5 x 8.5 in)' },
        { value: 'a5', label: 'A5 (5.83 x 8.27 in)' },
        { value: 'us_trade', label: 'US Trade (6 x 9 in)' },
        { value: 'royal', label: 'Royal (6.14 x 9.21 in)' },
        { value: 'executive', label: 'Executive (7 x 10 in)' },
        { value: 'crown_quarto', label: 'Crown Quarto (7.44 x 9.68 in)' },
        { value: 'small_square', label: 'Small Square (7.5 x 7.5 in)' },
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'square', label: 'Square (8.5 x 8.5 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
        { value: 'small_landscape', label: 'Small Landscape (9 x 7 in)' },
        { value: 'us_letter_landscape', label: 'US Letter Landscape (11 x 8.5 in)' },
        { value: 'a4_landscape', label: 'A4 Landscape (11.69 x 8.27 in)' }
      ];
    }

    return (
      <div className="print-book-content fade-in">
        <div className="print-book-container">
          <div className="left-column">
            <div className="print-book-config">
              <h2 className="section-title">{formatOptionLabel(activeOption)}</h2>

              <div className="config-section config-section-gradient">
                <h3 className="config-title config-title-light">Book Size & Page Count</h3>
                <div className="input-group">
                  <div className="select-wrapper">
                    <SelectInput
                      id="book-size"
                      value={selectedBookSize}
                      onChange={(e) => setSelectedBookSize(e.target.value)}
                      options={bookSizeOptions}
                      placeholder="Select Your Book Size"
                    />
                  </div>
                  <div className="select-wrapper">
                    <input
                      type="number"
                      id="page-count"
                      className="select-input"
                      value={pageCount}
                      onChange={handlePageCountChange}
                      min={activeOption === 'calendar' ? "26" : activeOption === 'thesis-binding' ? "24" : "1"} // Basic min
                      max={activeOption === 'calendar' ? "26" : activeOption === 'thesis-binding' ? "800" : "1200"} // Basic max
                      step="1"
                      placeholder={activeOption === 'calendar' ? "26 pages" : activeOption === 'thesis-binding' ? "24-800 pages" : "e.g., 100"}
                      required
                    />
                  </div>
                </div>
              </div>

              {renderBindingSections()}

              {activeOption === 'thesis-binding' && (
                <>
                  <div className="config-section"> <h3 className="config-title">Spine</h3> <div className="options-grid options-grid-2"> <RadioOption id="spine-round" name="thesisSpine" value="round" checked={thesisSpine === 'round'} onChange={setThesisSpine} labelText="Round" imageSrc={caseWrapImg}/> <RadioOption id="spine-flat" name="thesisSpine" value="flat" checked={thesisSpine === 'flat'} onChange={setThesisSpine} labelText="Flat" imageSrc={linenWrapImg} /> </div> </div>
                  <div className="config-section"> <h3 className="config-title">Exterior Color</h3> <div className="options-grid options-grid-4"> <RadioOption id="color-black" name="thesisExteriorColor" value="black" checked={thesisExteriorColor === 'black'} onChange={setThesisExteriorColor} labelText="Black" imageSrc={placeholder1Img}/> <RadioOption id="color-brown" name="thesisExteriorColor" value="brown" checked={thesisExteriorColor === 'brown'} onChange={setThesisExteriorColor} labelText="Brown" imageSrc={placeholder2Img}/> <RadioOption id="color-maroon" name="thesisExteriorColor" value="maroon" checked={thesisExteriorColor === 'maroon'} onChange={setThesisExteriorColor} labelText="Maroon" imageSrc={placeholder3Img}/> <RadioOption id="color-dark-blue" name="thesisExteriorColor" value="dark-blue" checked={thesisExteriorColor === 'dark-blue'} onChange={setThesisExteriorColor} labelText="Dark Blue" imageSrc={placeholder3Img}/> </div> </div>
                  <div className="config-section"> <h3 className="config-title">Foil Stamping</h3> <div className="options-grid options-grid-2"> <RadioOption id="foil-golden" name="thesisFoilStamping" value="golden" checked={thesisFoilStamping === 'golden'} onChange={setThesisFoilStamping} labelText="Golden" imageSrc={placeholder1Img}/> <RadioOption id="foil-silver" name="thesisFoilStamping" value="silver" checked={thesisFoilStamping === 'silver'} onChange={setThesisFoilStamping} labelText="Silver" imageSrc={placeholder2Img}/> </div> </div>
                  <div className="config-section"> <h3 className="config-title">Screen Stamping</h3> <div className="options-grid options-grid-2"> <RadioOption id="screen-golden" name="thesisScreenStamping" value="golden" checked={thesisScreenStamping === 'golden'} onChange={setThesisScreenStamping} labelText="Golden" imageSrc={placeholder1Img}/> <RadioOption id="screen-silver" name="thesisScreenStamping" value="silver" checked={thesisScreenStamping === 'silver'} onChange={setThesisScreenStamping} labelText="Silver" imageSrc={placeholder2Img}/> </div> </div>
                  <div className="config-section"> <h3 className="config-title">4 Book Corner Protector</h3> <div className="options-grid"> <RadioOption id="corner-gold-sharp" name="thesisCornerProtector" value="gold-sharp" checked={thesisCornerProtector === 'gold-sharp'} onChange={setThesisCornerProtector} labelText="Gold Sharp Corner" imageSrc={placeholder1Img}/> <RadioOption id="corner-gold-round" name="thesisCornerProtector" value="gold-round" checked={thesisCornerProtector === 'gold-round'} onChange={setThesisCornerProtector} labelText="Gold Round Corner" imageSrc={placeholder2Img}/> <RadioOption id="corner-vintage" name="thesisCornerProtector" value="vintage" checked={thesisCornerProtector === 'vintage'} onChange={setThesisCornerProtector} labelText="Vintage Designs Corner" imageSrc={placeholder2Img}/> </div> </div>
                  <div className="config-section last-section-config"> <h3 className="config-title">Paper Type</h3> <div className="options-grid options-grid-4"> <RadioOption id="paper-70-white" name="thesisPaperType" value="70-white" checked={thesisPaperType === '70-white'} onChange={setThesisPaperType} labelText="70# White-Uncoated" imageSrc={sixtyWhiteImg} /> <RadioOption id="paper-60-cream" name="thesisPaperType" value="60-cream" checked={thesisPaperType === '60-cream'} onChange={setThesisPaperType} labelText="60# Cream-Uncoated" imageSrc={sixtyCreamImg} /> <RadioOption id="paper-60-white-uncoated" name="thesisPaperType" value="60-white-uncoated" checked={thesisPaperType === '60-white-uncoated'} onChange={setThesisPaperType} labelText="60# White-uncoated" imageSrc={sixtyWhiteImg} /> <RadioOption id="paper-80-white" name="thesisPaperType" value="80-white" checked={thesisPaperType === '80-white'} onChange={setThesisPaperType} labelText="80# White-Coated" imageSrc={eightyWhiteImg} /> </div> </div>
                </>
              )}

              {activeOption !== 'thesis-binding' && (
                <>
                  <div className="config-section">
      <h3 className="config-title">Interior Color</h3>
      <div className="options-grid options-grid-4">
        {activeOption === 'photo-book' || activeOption === 'comic-book' || activeOption === 'magazine' || activeOption === 'yearbook' ? (
          [
            { id: 'color-premium-bw', value: 'premium-bw', imageSrc: premiumBwImg, labelText: 'Premium B&W' },
            { id: 'color-premium-color', value: 'premium-color', imageSrc: premiumColorImg, labelText: 'Premium Color' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="interiorColor" checked={interiorColor === opt.value} onChange={setInteriorColor} />
          ))
        ) : (activeOption === 'calendar' ? (
          [
            { id: 'color-premium-color', value: 'premium-color', imageSrc: premiumColorImg, labelText: 'Premium Color' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="interiorColor" checked={interiorColor === opt.value} onChange={setInteriorColor} />
          ))
        ) : ( // Default for Print Book, Comic Book, Magazine, Yearbook
          [
            { id: 'color-standard-bw', value: 'standard-bw', imageSrc: standardBwImg, labelText: 'Standard B&W' },
            { id: 'color-premium-bw', value: 'premium-bw', imageSrc: premiumBwImg, labelText: 'Premium B&W' },
            { id: 'color-standard-color', value: 'standard-color', imageSrc: standardColorImg, labelText: 'Standard Color' },
            { id: 'color-premium-color', value: 'premium-color', imageSrc: premiumColorImg, labelText: 'Premium Color' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="interiorColor" checked={interiorColor === opt.value} onChange={setInteriorColor} />
          ))
        ))}
      </div>
    </div>
    
    <div className="config-section">
      <h3 className="config-title">Paper Type</h3>
      <div className="options-grid">
        {activeOption === 'photo-book' ? (
          [
            { id: 'paper-80-white', value: '80-white', imageSrc: eightyWhiteImg, labelText: '80# White — Coated' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="paperType" checked={paperType === opt.value} onChange={setPaperType} />
          ))
        ) : (activeOption === 'comic-book' || activeOption === 'magazine' || activeOption === 'yearbook' ? (
          [
            { id: 'paper-70-white', value: '70-white-uncoated', labelText: '70# White-Uncoated', imageSrc: sixtyWhiteImg },
            { id: 'paper-60-cream', value: '60-cream', imageSrc: sixtyCreamImg, labelText: '60# Cream — Uncoated' },
            { id: 'paper-60-white-uncoated', value: '60-white-uncoated', imageSrc: sixtyWhiteImg, labelText: '60# White-uncoated' },
            { id: 'paper-80-white', value: '80-white', imageSrc: eightyWhiteImg, labelText: '80# White — Coated' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="paperType" checked={paperType === opt.value} onChange={setPaperType} />
          ))
        ) : (activeOption === 'calendar' ? (
          [
            { id: 'paper-100-white', value: '100-white', imageSrc: eightyWhiteImg, labelText: '100# White — Coated' }
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="paperType" checked={paperType === opt.value} onChange={setPaperType} />
          ))
        ) : ( // Default for Print Book
          [
            { id: 'paper-60-cream', value: '60-cream', imageSrc: sixtyCreamImg, labelText: '60# Cream — Uncoated' },
            { id: 'paper-60-white', value: '60-white', imageSrc: sixtyWhiteImg, labelText: '60# White — Uncoated' },
            { id: 'paper-80-white', value: '80-white', imageSrc: eightyWhiteImg, labelText: '80# White — Coated' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="paperType" checked={paperType === opt.value} onChange={setPaperType} />
          ))
        )))}
      </div>
    </div>
    
    <div className="config-section last-section-config">
      <h3 className="config-title">Cover Finish</h3>
      <div className="options-grid options-grid-2">
        {(activeOption === 'calendar') ? ( // Calendar specific cover finishes if any
          [
            { id: 'finish-glossy', value: 'glossy', imageSrc: glossyImg, labelText: 'Glossy' },
            { id: 'finish-matte', value: 'matte', imageSrc: matteImg, labelText: 'Matte' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="coverFinish" checked={coverFinish === opt.value} onChange={setCoverFinish} />
          ))
        ) : ( // Default for other book types
          [
            { id: 'finish-glossy', value: 'glossy', imageSrc: glossyImg, labelText: 'Glossy' },
            { id: 'finish-matte', value: 'matte', imageSrc: matteImg, labelText: 'Matte' },
          ].map(opt => (
            <RadioOption key={opt.id} {...opt} name="coverFinish" checked={coverFinish === opt.value} onChange={setCoverFinish} />
          ))
        )}
      </div>
    </div>
                </>
              )}
            </div>

            <div className={`collapsible-section ${showShippingEstimates ? 'is-open' : ''}`}> <div className="collapsible-header" onClick={() => setShowShippingEstimates(!showShippingEstimates)}> <h3 className="collapsible-title">Quantity & Shipping Estimates</h3> <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg> </div> {showShippingEstimates && (
              <div className="collapsible-content">
                 <div className="input-group">
  <input
    type="number"
    placeholder="Quantity"
    className="select-input"
    value={quantity}
    onChange={handleQuantityChange}
    min="1"
  />
  <div className="select-wrapper">
    <select
      id="country"
      value={selectedCountry}
      onChange={e => setSelectedCountry(e.target.value)}
      className="select-input"
    >
      <option value="" disabled>Select Country</option>
      {countries.map(({ name, code }) => (
        <option key={code} value={code}>
          {name}
        </option>
      ))}
    </select>
    <svg className="select-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
  </div>
</div>

                <div className="pricing-summary" style={{ marginTop: '1rem' }}>
                  <p>Unit Price: ${parseFloat(calculatedPrice).toFixed(2)}</p>
                  <p>Quantity: {quantity}</p>
                  <p>Subtotal: ${subtotal.toFixed(2)}</p>
                  {discountAmount > 0 && (
                    <p style={{ color: 'green' }}>Discount (10%): -${discountAmount.toFixed(2)}</p>
                  )}
                  <p>Shipping: ${shippingCost.toFixed(2)}</p>
                  <p style={{ fontWeight: 'bold', marginTop: '0.5rem' }}>Total Price: ${finalTotalPrice.toFixed(2)} USD</p>
                </div>
                {quantity >= 100 && discountAmount === 0 && (
                  <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    A 10% bulk discount will be applied for 100+ items.
                  </p>
                )}
                 {quantity >= 100 && discountAmount > 0 && (
                  <p style={{ color: 'green', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                    10% bulk discount applied!
                  </p>
                )}
              </div>
            )} </div>
            <div className={`collapsible-section ${showRevenueEstimates ? 'is-open' : ''}`}> <div className="collapsible-header" onClick={() => setShowRevenueEstimates(!showRevenueEstimates)}> <h3 className="collapsible-title">Revenue Estimates</h3> <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg> </div> {showRevenueEstimates && ( <div className="collapsible-content"> <p>Calculate potential revenue based on price and estimated sales.</p> <div className="input-group"> <input type="number" placeholder="Estimated Sales Quantity" className="select-input" value={estimatedSales} onChange={(e) => setEstimatedSales(Math.max(0, parseInt(e.target.value || 0)))} /> </div> <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}> Estimated Revenue: {estimatedRevenue !== null ? `$${estimatedRevenue} USD` : 'Calculate Above'} </p> </div> )} </div>
          </div>

          <div className="print-book-summary">
            <div className="summary-preview"> <img src={bookPreviewImg} alt={`${formatOptionLabel(activeOption)} Preview`} className="book-preview-image" /> <div className="pages-indicator"> <div className="pages-badge">{pageCount || 'N/A'} Pages</div> </div> <div className="distribution-badge">Distribution Eligible</div> </div>
            <div className="summary-details">
              {activeOption === 'thesis-binding' ? (
                <>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Book Size</div> <div className="detail-value">{bookSizeMap[selectedBookSize] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Page Count</div> <div className="detail-value">{pageCount ? `${pageCount} Pages` : 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Binding Type</div> <div className="detail-value">{bindingMap[thesisBindingType] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Spine</div> <div className="detail-value">{formatOptionLabel(thesisSpine) || 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Exterior Color</div> <div className="detail-value">{formatOptionLabel(thesisExteriorColor) || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Foil Stamping</div> <div className="detail-value">{formatOptionLabel(thesisFoilStamping) || 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Screen Stamping</div> <div className="detail-value">{formatOptionLabel(thesisScreenStamping) || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Corner Protector</div> <div className="detail-value">{formatOptionLabel(thesisCornerProtector) || 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Interior Color</div> <div className="detail-value">{interiorColorMap[thesisInteriorColor] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Paper Type</div> <div className="detail-value">{paperTypeMap[thesisPaperType] || (thesisPaperType ? formatOptionLabel(thesisPaperType) : 'N/A')}</div> </div> </div>
                </>
              ) : (
                <>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Book Size</div> <div className="detail-value">{bookSizeMap[selectedBookSize] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Page Count</div> <div className="detail-value">{pageCount ? `${pageCount} Pages` : 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Binding Type</div> <div className="detail-value">{bindingMap[bindingType] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Interior Color</div> <div className="detail-value">{interiorColorMap[interiorColor] || 'N/A'}</div> </div> </div>
                  <div className="summary-detail-row"> <div className="summary-detail"> <div className="detail-label">Paper Type</div> <div className="detail-value">{paperTypeMap[paperType] || 'N/A'}</div> </div> <div className="summary-detail"> <div className="detail-label">Cover Finish</div> <div className="detail-value">{coverFinishMap[coverFinish] || 'N/A'}</div> </div> </div>
                </>
              )}
            </div>
            <div className="summary-price">
              {isPriceLoading ? (
                <div className="price-value">Loading...</div>
              ) : priceError ? (
                <div className="price-error" style={{color: 'red'}}>{priceError}</div>
              ) : (
                <div className="price-value">{calculatedPrice} USD</div>
              )}
              <div className="price-label">Per {formatOptionLabel(activeOption)}</div>
            </div>
            <div className="summary-actions">
              <button className="btn btn-gradient">Book Templates <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button className="btn btn-gradient">Custom Cover Template <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button
       className="btn btn-primary"
       onClick={handleCreateClick}
       disabled={
         isAddingToCart ||
         isPriceLoading ||
         !!priceError ||
         calculatedPrice === 'N/A' ||
         calculatedPrice === '0.00'
       }
     >
       {isAddingToCart
         ? 'Fetching Shipping…'
         : `Create Your ${formatOptionLabel(activeOption)}`}
     </button>
            </div>
            {addToCartError && ( <div className="add-to-cart-error-message" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}> {addToCartError} </div> )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="body-content">
      <div className="container">
        <div className="content-wrapper">
          {renderContent()}
        </div>
      

<div style={{
  marginTop: "20px",
  padding: "15px",
  border: "1px solid #ccc",
  borderRadius: "8px",
  backgroundColor: "#f8f8f8",
  fontFamily: "monospace"
}}>
  <h4>📦 Debug Info</h4>
  <p><strong>Book Size:</strong> {selectedBookSize}</p>
  <p><strong>Binding Type:</strong> {bindingType}</p>
  <p><strong>Height:</strong> {bookHeight} cm</p>
  <p><strong>Width:</strong> {bookWidth} cm</p>
  <p><strong>Thickness:</strong> {bookThickness} cm</p>
  <p><strong>Spine:</strong> {spineCm} cm</p>
  <p><strong>Page Weight:</strong> {pageWeight} kg</p>
  <p><strong>Binding Weight:</strong> {bindingWeight} kg</p>
  <p><strong>Buffer Weight:</strong> {bindingBufferKg} kg</p>
  <p><strong>Quantity:</strong> {quantity}</p>
  <p><strong>Total Weight:</strong> {((pageWeight + bindingWeight + bindingBufferKg) * quantity).toFixed(3)} kg</p>

{selectedBoxDetails && (
  <div style={{ marginTop: "20px", padding: "10px", border: "1px dashed #aaa" }}>
    <h4>📦 Box Calculation</h4>
    <p><strong>Box Selected:</strong> {selectedBoxDetails.boxName}</p>
    <p><strong>Box Dimensions:</strong> {selectedBoxDetails.boxDimensions.length} × {selectedBoxDetails.boxDimensions.width} × {selectedBoxDetails.boxDimensions.height} cm</p>
    <p><strong>Estimated Used Dimensions:</strong> {selectedBoxDetails.estLength} × {selectedBoxDetails.estWidth} × {selectedBoxDetails.estHeight} cm</p>
    <p><strong>Per Book Weight:</strong> {selectedBoxDetails.perBookWeight} kg</p>
    <p><strong>Total Weight (incl. box):</strong> {selectedBoxDetails.totalWeightKg} kg</p>
  </div>
)}





</div>




      </div>
    </section>
  );
};

export default BodyContent;