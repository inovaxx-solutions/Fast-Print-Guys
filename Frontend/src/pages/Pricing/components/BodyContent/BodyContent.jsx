import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import './BodyContent.css';

 import perfectBoundImg from '../../../../assets/perfectbound.png';
 import coilBoundImg from '../../../../assets/coilbound.png';
 import saddleStitchImg from '../../../../assets/saddlestich.png';
 import caseWrapImg from '../../../../assets/casewrap.png';
 import linenWrapImg from '../../../../assets/linenwrap.png';
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
  '100-white': '100# White — Coated'
 };

 const coverFinishMap = {
  'glossy': 'Glossy',
  'matte': 'Matte',
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

 const BodyContent = ({ activeOption = 'print-book' }) => {
  const navigate = useNavigate();
  const [selectedBookSize, setSelectedBookSize] = useState('pocketbook');
  const [pageCount, setPageCount] = useState('100');
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

  // Thesis Binding's Options
  const [thesisBindingType, setThesisBindingType] = useState('');
  const [thesisSpine, setThesisSpine] = useState('');
  const [thesisExteriorColor, setThesisExteriorColor] = useState('');
  const [thesisFoilStamping, setThesisFoilStamping] = useState('');
  const [thesisScreenStamping, setThesisScreenStamping] = useState('');
  const [thesisCornerProtector, setThesisCornerProtector] = useState('');
  const [thesisInteriorColor, setThesisInteriorColor] = useState('');
  const [thesisPaperType, setThesisPaperType] = useState('');

  const bindingRules = {
    'print-book': {
      'pocketbook': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': Infinity },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'novella': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'digest': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'a5': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'us_trade': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'royal': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'executive': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'crown_quarto': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'a4': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'square': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'us_letter': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'small_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
      'us_letter_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 250) bindings.splice(bindings.indexOf('perfect'), 1);
          return bindings;
        },
      },
      'a4_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 250) bindings.splice(bindings.indexOf('perfect'), 1);
          return bindings;
        },
      },
      'small_square': { 
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          if (pages > 48) bindings.splice(bindings.indexOf('saddle'), 1);
          if (pages > 470) bindings.splice(bindings.indexOf('coil'), 1);
          return bindings;
        },
      },
    },
    'photo-book': {
        'pocketbook': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': Infinity },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'novella': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'digest': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'a5': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'us_trade': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'royal': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'executive': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'crown_quarto': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'a4': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'square': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'us_letter': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'small_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'us_letter_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'a4_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case', 'linen');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
      'small_square': { 
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect');
          return bindings;
        },
      },
    },
    'comic-book': {
      'comic': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': Infinity },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'larger-deluxe': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'manga': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
    },
    'magazine': {
      'a4': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'us_letter': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
    },
    'yearbook': {
      'a4': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'us_letter': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 4) bindings.push('saddle');
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'us_letter_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
      'a4_landscape': {
        minPages: { 'coil': 3 },
        maxPages: { 'coil': 470, 'perfect': 250 },
        conditional: (pages) => {
          const bindings = ['coil'];
          if (pages >= 24) bindings.push('case');
          if (pages >= 32) bindings.push('perfect', 'linen');
          return bindings;
        },
      },
    },
    'calendar': {
      'us_letter_landscape': {
      minPages: { 'wire-o': 26 },
      maxPages: { 'wire-o': 26 },
      conditional: (pages) => {
        return ['wire-o'];
      },
    },
  },
    'thesis-binding': {
      'a4': { // You can add more sizes if needed
        minPages: { 'leather': 24, 'faux-leather': 24, 'polythin': 24 }, // Example minimum page count
        maxPages: { 'leather': 800, 'faux-leather': 800, 'polythin': 800 }, // Example maximum page count
        conditional: (pages) => {
          const bindings = [];
          if (pages >= 24) { // Adjust the minimum page count as needed
            bindings.push('leather', 'faux-leather', 'polythin');
          }
          return bindings;
        },
      },
      'us_letter': { // You can add more sizes if needed
        minPages: { 'leather': 24, 'faux-leather': 24, 'polythin': 24 }, // Example minimum page count
        maxPages: { 'leather': 800, 'faux-leather': 800, 'polythin': 800 }, // Example maximum page count
        conditional: (pages) => {
          const bindings = [];
          if (pages >= 24) { // Adjust the minimum page count as needed
            bindings.push('leather', 'faux-leather', 'polythin');
          }
          return bindings;
        },
      },
    },
  };

  useEffect(() => {
    const rulesForActiveOption = bindingRules[activeOption];
    const rulesForBookSize = rulesForActiveOption ? rulesForActiveOption[selectedBookSize] : null;
    const pageNum = parseInt(pageCount) || 0;
    let available = [];

    if (activeOption === 'calendar') {
      available = pageNum === 26 ? ['wire-o'] : [];
    } else if (activeOption === 'thesis-binding') {
      if (pageNum >= 24 && rulesForBookSize?.conditional) {
        available = rulesForBookSize.conditional(pageNum);
      }
    }
     else if (pageNum >= 3 && rulesForBookSize && rulesForBookSize.conditional) { // Check if pageNum is >= 3
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
  }, [activeOption, pageCount, bindingType, selectedBookSize]);

  const handlePageCountChange = (e) => {
    let value = e.target.value;

    if (value === '') {
      setPageCount('');
      return;
    }

    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      let maxPages = 600;

      if (activeOption === 'thesis-binding') {
        maxPages = 800;
      } else if (activeOption === 'calendar') {
        maxPages = 26;
      }

      const constrainedValue = Math.min(Math.max(numValue, 1), maxPages);
      setPageCount(constrainedValue.toString());
    }
  };

  const isBindingDisabled = (bindingValue) => {
    if (activeOption === 'calendar' && bindingValue === 'wire-o') {
      return pageCount !== '26';
    }
    if (activeOption === 'thesis-binding') {
      return !availableBindings.includes(bindingValue);
    }
    return !availableBindings.includes(bindingValue);
  };

  const getBindingTooltip = (bindingValue) => {
    const rulesForActiveOption = bindingRules[activeOption];
    const rulesForBookSize = rulesForActiveOption ? rulesForActiveOption[selectedBookSize] : null;
    const rules = rulesForBookSize || {};
    const pageNum = parseInt(pageCount) || 0;

    if (rules.minPages && rules.minPages[bindingValue] && pageNum < rules.minPages[bindingValue]) {
      return `Minimum ${rules.minPages[bindingValue]} pages required`;
    }
    if (rules.maxPages && rules.maxPages[bindingValue] !== Infinity && pageNum > rules.maxPages[bindingValue]) {
      return `Maximum ${rules.maxPages[bindingValue]} pages allowed`;
    }
    return '';
  };

  const renderBindingOption = (opt) => (
    <RadioOption
      key={opt.id}
      {...opt}
      name="bindingType"
      checked={bindingType === opt.value}
      onChange={setBindingType}
      disabled={isBindingDisabled(opt.value)}
      tooltip={getBindingTooltip(opt.value)}
    />
  );

  const renderBindingSections = () => {
    let bindingOptions = [];

    if (['print-book', 'comic-book','yearbook', 'magazine'].includes(activeOption)) {
      bindingOptions = [
        {
          title: 'Paperback Options',
          options: [
            { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
            { id: 'binding-coil', value: 'coil', imageSrc: coilBoundImg, labelText: 'Coil Bound' },
            { id: 'binding-saddle', value: 'saddle', imageSrc: saddleStitchImg, labelText: 'Saddle Stitch' },
          ]
        },
        {
          title: 'Hardcover Options',
          options: [
            { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
            { id: 'binding-linen', value: 'linen', imageSrc: linenWrapImg, labelText: 'Linen Wrap' },
          ]
        }
      ];
    } 
    else if (activeOption === 'photo-book') {
      bindingOptions = [
        {
          options: [
            { id: 'binding-case', value: 'case', imageSrc: caseWrapImg, labelText: 'Case Wrap' },
            { id: 'binding-linen', value: 'linen', imageSrc: linenWrapImg, labelText: 'Linen Wrap' },
            { id: 'binding-perfect', value: 'perfect', imageSrc: perfectBoundImg, labelText: 'Perfect Bound' },
          ]
        }
      ];
    } else if (activeOption === 'calendar') {
      bindingOptions = [
        {
          options: [
            { id: 'binding-wire-o', value: 'wire-o', imageSrc: wireOImg, labelText: 'Wire-O Binding' },
          ]
        }
      ];
    } else if (activeOption === 'thesis-binding') {
      bindingOptions = [
        {
          title: 'Binding Type', // Adjust title as needed
          options: [
            { id: 'binding-leather', value: 'leather', imageSrc: caseWrapImg, labelText: 'Leather Case Wrap' }, // Use appropriate imageSrc
            { id: 'binding-faux-leather', value: 'faux-leather', imageSrc: caseWrapImg, labelText: 'Faux Leather Case Wrap' }, // Use appropriate imageSrc
            { id: 'binding-polythin', value: 'polythin', imageSrc: caseWrapImg, labelText: 'Polythin Rexine Case Wrap' }, // Use appropriate imageSrc
          ],
        },
      ];
        }

    return (
      <div className="config-section">
        <h3 className="config-title">Binding Type</h3>

        {bindingOptions.map((section, index) => (
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

    if (activeOption === 'comic-book') {
      bookSizeOptions = [
        { value: 'comic', label: 'Comic Book (6.625 x 10.25 in)' },
        { value: 'larger-deluxe', label: 'Larger Deluxe (7 x 10.875 in)' },
        { value: 'manga', label: 'Manga (Japanese Style Comics) (5 x 7.5 in)' },
      ];
      if (selectedBookSize === 'pocketbook' || !['comic', 'larger-deluxe', 'manga'].includes(selectedBookSize)) {
        setSelectedBookSize('comic');
      }
    } 
    else if (activeOption === 'magazine') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
      ];
      if (selectedBookSize === 'pocketbook' || !['a4', 'us_letter'].includes(selectedBookSize)) {
        setSelectedBookSize('a4');
      }
    }
    else if (activeOption === 'yearbook') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
        { value: 'a4_landscape', label: 'A4 Landscape (11.69 x 8.27 in)' },
        { value: 'us_letter_landscape', label: 'US Letter Landscape (11 x 8.5 in)' }
      ];
      if (selectedBookSize === 'pocketbook' || !['a4', 'us_letter', 'a4_landscape', 'us_letter_landscape'].includes(selectedBookSize)) {
        setSelectedBookSize('a4');
      }
    }
    else if (activeOption === 'thesis-binding') {
      bookSizeOptions = [
        { value: 'a4', label: 'A4 (8.27 x 11.69 in)' },
        { value: 'us_letter', label: 'US Letter (8.5 x 11 in)' },
      ];
      if (selectedBookSize === 'pocketbook' || !['a4', 'us_letter'].includes(selectedBookSize)) {
        setSelectedBookSize('a4');
      }
    }
    else if (activeOption === 'calendar') {
      bookSizeOptions = [
        { value: 'us_letter_landscape', label: 'US Letter Landscape (11 x 8.5 in)' }
      ];
      if (selectedBookSize === 'pocketbook' || !['us_letter_landscape'].includes(selectedBookSize)) {
        setSelectedBookSize('us_letter_landscape');
      }
    }
    else {
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
      // Reset default book size if switching away from comic-book
      if (activeOption !== 'comic-book' && !['pocketbook', 'novella', 'digest', 'a5', 'us_trade', 'royal', 'executive', 'crown_quarto', 'small_square', 'a4', 'square', 'us_letter', 'small_landscape', 'us_letter_landscape', 'a4_landscape'].includes(selectedBookSize)) {
        setSelectedBookSize('pocketbook');
      }
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
                      min="24" // Minimum for thesis binding based on your rules
                      max="800" // Maximum for thesis binding
                      step="1"
                      placeholder="24-800 pages"
                      required
                    />
                  </div>
                </div>
              </div>

              {renderBindingSections()}
{/* Thesis New Options start here */}
{activeOption === 'thesis-binding' && (
                <>
                  <div className="config-section">
                    <h3 className="config-title">Spine</h3>
                    <div className="options-grid options-grid-2">
                      <RadioOption id="spine-round" name="thesisSpine" value="round" checked={thesisSpine === 'round'} onChange={setThesisSpine} labelText="Round" />
                      <RadioOption id="spine-flat" name="thesisSpine" value="flat" checked={thesisSpine === 'flat'} onChange={setThesisSpine} labelText="Flat" />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3 className="config-title">Exterior Color</h3>
                    <div className="options-grid options-grid-4">
                      <RadioOption id="color-black" name="thesisExteriorColor" value="black" checked={thesisExteriorColor === 'black'} onChange={setThesisExteriorColor} labelText="Black" />
                      <RadioOption id="color-brown" name="thesisExteriorColor" value="brown" checked={thesisExteriorColor === 'brown'} onChange={setThesisExteriorColor} labelText="Brown" />
                      <RadioOption id="color-maroon" name="thesisExteriorColor" value="maroon" checked={thesisExteriorColor === 'maroon'} onChange={setThesisExteriorColor} labelText="Maroon" />
                      <RadioOption id="color-dark-blue" name="thesisExteriorColor" value="dark-blue" checked={thesisExteriorColor === 'dark-blue'} onChange={setThesisExteriorColor} labelText="Dark Blue" />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3 className="config-title">Foil Stamping</h3>
                    <div className="options-grid options-grid-2">
                      <RadioOption id="foil-golden" name="thesisFoilStamping" value="golden" checked={thesisFoilStamping === 'golden'} onChange={setThesisFoilStamping} labelText="Golden" />
                      <RadioOption id="foil-silver" name="thesisFoilStamping" value="silver" checked={thesisFoilStamping === 'silver'} onChange={setThesisFoilStamping} labelText="Silver" />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3 className="config-title">Screen Stamping</h3>
                    <div className="options-grid options-grid-2">
                      <RadioOption id="screen-golden" name="thesisScreenStamping" value="golden" checked={thesisScreenStamping === 'golden'} onChange={setThesisScreenStamping} labelText="Golden" />
                      <RadioOption id="screen-silver" name="thesisScreenStamping" value="silver" checked={thesisScreenStamping === 'silver'} onChange={setThesisScreenStamping} labelText="Silver" />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3 className="config-title">4 Book Corner Protector</h3>
                    <div className="options-grid">
                      <RadioOption id="corner-gold-sharp" name="thesisCornerProtector" value="gold-sharp" checked={thesisCornerProtector === 'gold-sharp'} onChange={setThesisCornerProtector} labelText="Gold Sharp Corner" />
                      <RadioOption id="corner-gold-round" name="thesisCornerProtector" value="gold-round" checked={thesisCornerProtector === 'gold-round'} onChange={setThesisCornerProtector} labelText="Gold Round Corner" />
                      <RadioOption id="corner-vintage" name="thesisCornerProtector" value="vintage" checked={thesisCornerProtector === 'vintage'} onChange={setThesisCornerProtector} labelText="Vintage Designs Corner" />
                    </div>
                  </div>

                  <div className="config-section">
                    <h3 className="config-title">Interior Color</h3>
                    <div className="options-grid options-grid-2">
                      <RadioOption id="interior-premium-bw" name="thesisInteriorColor" value="premium-bw" checked={thesisInteriorColor === 'premium-bw'} onChange={setThesisInteriorColor} labelText="Premium Black & white" />
                      <RadioOption id="interior-premium-color" name="thesisInteriorColor" value="premium-color" checked={thesisInteriorColor === 'premium-color'} onChange={setThesisInteriorColor} labelText="Premium Color" />
                    </div>
                  </div>

                  <div className="config-section last-section-config">
                    <h3 className="config-title">Paper Type</h3>
                    <div className="options-grid options-grid-4">
                      <RadioOption id="paper-70-white" name="thesisPaperType" value="70-white" checked={thesisPaperType === '70-white'} onChange={setThesisPaperType} labelText="70# White-Uncoated" />
                      <RadioOption id="paper-60-cream" name="thesisPaperType" value="60-cream" checked={thesisPaperType === '60-cream'} onChange={setThesisPaperType} labelText="60# Cream-Uncoated" />
                      <RadioOption id="paper-60-white-uncoated" name="thesisPaperType" value="60-white-uncoated" checked={thesisPaperType === '60-white-uncoated'} onChange={setThesisPaperType} labelText="60# White-uncoated" />
                      <RadioOption id="paper-80-white" name="thesisPaperType" value="80-white" checked={thesisPaperType === '80-white'} onChange={setThesisPaperType} labelText="80# White-Coated" />
                    </div>
                  </div>
                </>
              )}

              {activeOption !== 'thesis-binding' && (
                <>
                  <div className="config-section">
                    <h3 className="config-title">Interior Color</h3>
                    <div className="options-grid options-grid-4">
                      {[
                        { id: 'color-standard-bw', value: 'standard-bw', imageSrc: standardBwImg, labelText: 'Standard Black & White' },
                        { id: 'color-premium-bw', value: 'premium-bw', imageSrc: premiumBwImg, labelText: 'Premium Black & White' },
                        { id: 'color-standard-color', value: 'standard-color', imageSrc: standardColorImg, labelText: 'Standard Color' },
                        { id: 'color-premium-color', value: 'premium-color', imageSrc: premiumColorImg, labelText: 'Premium Color' },
                      ].map(opt => (
                        <RadioOption
                          key={opt.id}
                          {...opt}
                          name="interiorColor"
                          checked={interiorColor === opt.value}
                          onChange={setInteriorColor}
                        />
                      ))}
                  </div>
                </div>

                <div className="config-section">
                  <h3 className="config-title">Paper Type</h3>
                    <div className="options-grid">
                      {[
                        { id: 'paper-60-cream', value: '60-cream', imageSrc: sixtyCreamImg, labelText: '60# Cream — Uncoated' },
                        { id: 'paper-60-white', value: '60-white', imageSrc: sixtyWhiteImg, labelText: '60# White — Uncoated' },
                        { id: 'paper-80-white', value: '80-white', imageSrc: eightyWhiteImg, labelText: '80# White — Coated' },
                        ...(activeOption === 'calendar' ? [
                          { id: 'paper-100-white', value: '100-white', imageSrc: eightyWhiteImg, labelText: '100# White — Coated' }
                        ] : [])
                      ].map(opt => (
                        <RadioOption
                          key={opt.id}
                          {...opt}
                          name="paperType"
                          checked={paperType === opt.value}
                          onChange={setPaperType}
                        />
                      ))}
                  </div>
                </div>

                <div className="config-section last-section-config">
                  <h3 className="config-title">Cover Finish</h3>
                    <div className="options-grid options-grid-2">
                      {[
                        { id: 'finish-glossy', value: 'glossy', imageSrc: glossyImg, labelText: 'Glossy' },
                        { id: 'finish-matte', value: 'matte', imageSrc: matteImg, labelText: 'Matte' },
                      ].map(opt => (
                        <RadioOption
                          key={opt.id}
                          {...opt}
                          name="coverFinish"
                          checked={coverFinish === opt.value}
                          onChange={setCoverFinish}
                        />
                      ))}
                  </div>
                </div>
              </>
              )}

            </div>
            <div className={`collapsible-section ${showShippingEstimates ? 'is-open' : ''}`}>
              <div className="collapsible-header" onClick={() => setShowShippingEstimates(!showShippingEstimates)}>
                <h3 className="collapsible-title">Quantity & Shipping Estimates</h3>
                <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"/></svg>
              </div>
              {showShippingEstimates && (
                <div className="collapsible-content">
                  <p>Enter quantity and destination to get shipping estimates.</p>
                  <div className="input-group">
                    <input type="number" placeholder="Quantity" className="select-input" value={quantity} onChange={(e) => setQuantity(parseInt(e.target.value || 0))} />
                    <SelectInput id="country" value={selectedCountry} onChange={(e) => setSelectedCountry(e.target.value)} options={[
                      { value: '', label: 'Select Country' },
                      { value: 'us', label: 'United States' },
                      { value: 'ca', label: 'Canada' },
                      { value: 'gb', label: 'United Kingdom' },
                    ]} placeholder="Select Country" />
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    Estimated Shipping: {shippingEstimate !== null ? `$${shippingEstimate} USD` : 'Calculate Above'}
                  </p>
                </div>
              )}
            </div>

            <div className={`collapsible-section ${showRevenueEstimates ? 'is-open' : ''}`}>
              <div className="collapsible-header" onClick={() => setShowRevenueEstimates(!showRevenueEstimates)}>
                <h3 className="collapsible-title">Revenue Estimates</h3>
                <svg className="collapsible-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5.0 0 1 0-.708z"/></svg>
              </div>
              {showRevenueEstimates && (
                <div className="collapsible-content">
                  <p>Calculate potential revenue based on price and estimated sales.</p>
                  <div className="input-group">
                    <input type="number" placeholder="Estimated Sales Quantity" className="select-input" value={estimatedSales} onChange={(e) => setEstimatedSales(parseInt(e.target.value || 0))} />
                  </div>
                  <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: 'var(--text-medium)' }}>
                    Estimated Revenue: {estimatedRevenue !== null ? `$${estimatedRevenue} USD` : 'Calculate Above'}
                  </p>
                </div>
              )}
            </div>
          </div>

              <div className="print-book-summary">
                <div className="summary-preview">
                  <img src={bookPreviewImg} alt={`${formatOptionLabel(activeOption)} Preview`} className="book-preview-image" />
                  <div className="pages-indicator">
                    <div className="pages-badge">{pageCount || 'N/A'} Pages</div>
                  </div>
                  <div className="distribution-badge">Distribution Eligible</div>
                </div>

                <div className="summary-details">
                  {activeOption === 'thesis-binding' ? (
                    <>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Book Size</div>
                          <div className="detail-value">{bookSizeMap[selectedBookSize] || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Page Count</div>
                          <div className="detail-value">{pageCount ? `${pageCount} Pages` : 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Binding Type</div>
                          <div className="detail-value">{bindingMap[bindingType] || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Spine</div>
                          <div className="detail-value">{thesisSpine || 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Exterior Color</div>
                          <div className="detail-value">{thesisExteriorColor || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Foil Stamping</div>
                          <div className="detail-value">{thesisFoilStamping || 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Screen Stamping</div>
                          <div className="detail-value">{thesisScreenStamping || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Corner Protector</div>
                          <div className="detail-value">{thesisCornerProtector || 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Interior Color</div>
                          <div className="detail-value">{thesisInteriorColor === 'premium-bw' ? 'Premium Black & white' : thesisInteriorColor === 'premium-color' ? 'Premium Color' : 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Paper Type</div>
                          <div className="detail-value">{thesisPaperType || 'Not Selected'}</div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Book Size</div>
                          <div className="detail-value">{bookSizeMap[selectedBookSize] || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Page Count</div>
                          <div className="detail-value">{pageCount ? `${pageCount} Pages` : 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Binding Type</div>
                          <div className="detail-value">{bindingMap[bindingType] || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Interior Color</div>
                          <div className="detail-value">{interiorColorMap[interiorColor] || 'Not Selected'}</div>
                        </div>
                      </div>
                      <div className="summary-detail-row">
                        <div className="summary-detail">
                          <div className="detail-label">Paper Type</div>
                          <div className="detail-value">{paperTypeMap[paperType] || 'Not Selected'}</div>
                        </div>
                        <div className="summary-detail">
                          <div className="detail-label">Cover Finish</div>
                          <div className="detail-value">{coverFinishMap[coverFinish] || 'Not Selected'}</div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

            <div className="summary-actions">
              <button className="btn btn-gradient"> Book Templates <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button className="btn btn-gradient"> Custom Cover Template <svg className="btn-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg> </button>
              <button className="btn btn-primary"
                onClick={() => {
                  setIsAddingToCart(true);
                  setAddToCartError(null);
                  setTimeout(() => {
                    navigate('/checkout/shipping');
                  }, 1000);
                }}
                disabled={isAddingToCart}>
                {isAddingToCart ? 'Adding to Cart...' : `Create Your ${formatOptionLabel(activeOption)}`}
              </button>
            </div>
            {addToCartError && (
              <div className="add-to-cart-error-message" style={{ color: 'red', fontSize: '0.9em', marginTop: '5px' }}>
                {addToCartError}
              </div>
            )}

            <div className="summary-price">
              {isPriceLoading ? (
                <div className="price-value">Loading...</div>
              ) : priceError ? (
                <div className="price-error">{priceError}</div>
              ) : (
                <div className="price-value">{calculatedPrice} USD</div>
              )}
              <div className="price-label">Per {formatOptionLabel(activeOption)}</div>
            </div>
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
      </div>
    </section>
  );
 };

 export default BodyContent;