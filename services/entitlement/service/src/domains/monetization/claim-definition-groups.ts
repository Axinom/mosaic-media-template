import { ClaimDefinitionGroup } from '@axinom/mosaic-messages';

/**
 * A claim that is responsible for enabling download option for video.
 */
export const ENABLE_VIDEOS_DOWNLOAD = 'ENABLE_VIDEOS_DOWNLOAD';
/**
 * A claim that is responsible for allowing playback of all Movie videos.
 */
export const ENTITY_TYPE_MOVIES = 'ENTITY_TYPE_MOVIES';
/**
 * A claim that is responsible for allowing playback of all Episode videos.
 */
export const ENTITY_TYPE_EPISODES = 'ENTITY_TYPE_EPISODES';
/**
 * A claim that is responsible for allowing playback of all Channel streams.
 */
export const ENTITY_TYPE_CHANNELS = 'ENTITY_TYPE_CHANNELS';
/**
 * A prefix to easily find country-specific claims, after which a 2-letter country code is added.
 */
export const COUNTRY_CLAIM_PREFIX = 'COUNTRY_';
/**
 * A claim that is responsible for allowing playback of 8K videos.
 */
export const QUALITY_UHD2 = 'QUALITY_UHD2';
/**
 * A claim that is responsible for allowing playback of 4K videos.
 */
export const QUALITY_UHD1 = 'QUALITY_UHD1';
/**
 * A claim that is responsible for allowing playback of Full HD videos.
 */
export const QUALITY_HD = 'QUALITY_HD';
/**
 * A claim that is responsible for allowing playback of SD videos.
 */
export const QUALITY_SD = 'QUALITY_SD';

/**
 * An array of all Claim Definition Groups that is synced to monetization service.
 */
export const claimDefinitionGroups: ClaimDefinitionGroup[] = [
  {
    title: 'Downloadability',
    selection_mode: 'SINGLE',
    claim_definitions: [
      {
        claim: ENABLE_VIDEOS_DOWNLOAD,
        title: 'Enable videos download',
      },
    ],
  },
  {
    title: 'Entity Types',
    selection_mode: 'MULTIPLE',
    claim_definitions: [
      {
        claim: ENTITY_TYPE_MOVIES,
        title: 'All Movies',
      },
      {
        claim: ENTITY_TYPE_EPISODES,
        title: 'All Episodes',
      },
      {
        claim: ENTITY_TYPE_CHANNELS,
        title: 'All Channels',
      },
    ],
  },
  {
    title: 'Maximum Quality',
    selection_mode: 'SINGLE',
    claim_definitions: [
      {
        claim: QUALITY_UHD2,
        title: 'UHD2 Quality (<= 4320p - "8K")',
      },
      {
        claim: QUALITY_UHD1,
        title: 'UHD1 Quality (<= 2160p - "4K")',
      },
      {
        claim: QUALITY_HD,
        title: 'HD Quality (<= 1080p)',
      },
      {
        claim: QUALITY_SD,
        title: 'SD Quality (< 720p)',
      },
    ],
  },
  {
    title: 'Countries',
    selection_mode: 'MULTIPLE',
    claim_definitions: [
      { claim: `${COUNTRY_CLAIM_PREFIX}AF`, title: 'Afghanistan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AL`, title: 'Albania' },
      { claim: `${COUNTRY_CLAIM_PREFIX}DZ`, title: 'Algeria' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AS`, title: 'American Samoa' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AD`, title: 'Andorra' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AO`, title: 'Angola' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AI`, title: 'Anguilla' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AQ`, title: 'Antarctica' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AG`, title: 'Antigua and Barbuda' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AR`, title: 'Argentina' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AM`, title: 'Armenia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AW`, title: 'Aruba' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AU`, title: 'Australia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AT`, title: 'Austria' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AZ`, title: 'Azerbaijan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BS`, title: 'Bahamas' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BH`, title: 'Bahrain' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BD`, title: 'Bangladesh' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BB`, title: 'Barbados' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BY`, title: 'Belarus' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BE`, title: 'Belgium' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BZ`, title: 'Belize' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BJ`, title: 'Benin' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BM`, title: 'Bermuda' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BT`, title: 'Bhutan' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}BO`,
        title: 'Bolivia (Plurinational State of)',
      },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}BQ`,
        title: 'Bonaire, Sint Eustatius and Saba',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}BA`, title: 'Bosnia and Herzegovina' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BW`, title: 'Botswana' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BV`, title: 'Bouvet Island' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BR`, title: 'Brazil' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}IO`,
        title: 'British Indian Ocean Territory',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}BN`, title: 'Brunei Darussalam' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BG`, title: 'Bulgaria' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BF`, title: 'Burkina Faso' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BI`, title: 'Burundi' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CV`, title: 'Cabo Verde' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KH`, title: 'Cambodia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CM`, title: 'Cameroon' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CA`, title: 'Canada' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KY`, title: 'Cayman Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CF`, title: 'Central African Republic' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TD`, title: 'Chad' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CL`, title: 'Chile' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CN`, title: 'China' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CX`, title: 'Christmas Island' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CC`, title: 'Cocos (Keeling) Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CO`, title: 'Colombia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KM`, title: 'Comoros' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CG`, title: 'Congo' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}CD`,
        title: 'Congo, Democratic Republic of the',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}CK`, title: 'Cook Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CR`, title: 'Costa Rica' },
      { claim: `${COUNTRY_CLAIM_PREFIX}HR`, title: 'Croatia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CU`, title: 'Cuba' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CW`, title: 'Curaçao' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CY`, title: 'Cyprus' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CZ`, title: 'Czechia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CI`, title: "Côte d'Ivoire" },
      { claim: `${COUNTRY_CLAIM_PREFIX}DK`, title: 'Denmark' },
      { claim: `${COUNTRY_CLAIM_PREFIX}DJ`, title: 'Djibouti' },
      { claim: `${COUNTRY_CLAIM_PREFIX}DM`, title: 'Dominica' },
      { claim: `${COUNTRY_CLAIM_PREFIX}DO`, title: 'Dominican Republic' },
      { claim: `${COUNTRY_CLAIM_PREFIX}EC`, title: 'Ecuador' },
      { claim: `${COUNTRY_CLAIM_PREFIX}EG`, title: 'Egypt' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SV`, title: 'El Salvador' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GQ`, title: 'Equatorial Guinea' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ER`, title: 'Eritrea' },
      { claim: `${COUNTRY_CLAIM_PREFIX}EE`, title: 'Estonia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SZ`, title: 'Eswatini' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ET`, title: 'Ethiopia' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}FK`,
        title: 'Falkland Islands (Malvinas)',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}FO`, title: 'Faroe Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}FJ`, title: 'Fiji' },
      { claim: `${COUNTRY_CLAIM_PREFIX}FI`, title: 'Finland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}FR`, title: 'France' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GF`, title: 'French Guiana' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PF`, title: 'French Polynesia' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}TF`,
        title: 'French Southern Territories',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}GA`, title: 'Gabon' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GM`, title: 'Gambia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GE`, title: 'Georgia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}DE`, title: 'Germany' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GH`, title: 'Ghana' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GI`, title: 'Gibraltar' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GR`, title: 'Greece' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GL`, title: 'Greenland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GD`, title: 'Grenada' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GP`, title: 'Guadeloupe' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GU`, title: 'Guam' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GT`, title: 'Guatemala' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GG`, title: 'Guernsey' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GN`, title: 'Guinea' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GW`, title: 'Guinea-Bissau' },
      { claim: `${COUNTRY_CLAIM_PREFIX}GY`, title: 'Guyana' },
      { claim: `${COUNTRY_CLAIM_PREFIX}HT`, title: 'Haiti' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}HM`,
        title: 'Heard Island and McDonald Islands',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}VA`, title: 'Holy See' },
      { claim: `${COUNTRY_CLAIM_PREFIX}HN`, title: 'Honduras' },
      { claim: `${COUNTRY_CLAIM_PREFIX}HK`, title: 'Hong Kong' },
      { claim: `${COUNTRY_CLAIM_PREFIX}HU`, title: 'Hungary' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IS`, title: 'Iceland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IN`, title: 'India' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ID`, title: 'Indonesia' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}IR`,
        title: 'Iran (Islamic Republic of)',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}IQ`, title: 'Iraq' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IE`, title: 'Ireland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IM`, title: 'Isle of Man' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IL`, title: 'Israel' },
      { claim: `${COUNTRY_CLAIM_PREFIX}IT`, title: 'Italy' },
      { claim: `${COUNTRY_CLAIM_PREFIX}JM`, title: 'Jamaica' },
      { claim: `${COUNTRY_CLAIM_PREFIX}JP`, title: 'Japan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}JE`, title: 'Jersey' },
      { claim: `${COUNTRY_CLAIM_PREFIX}JO`, title: 'Jordan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KZ`, title: 'Kazakhstan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KE`, title: 'Kenya' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KI`, title: 'Kiribati' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}KP`,
        title: "Korea (Democratic People's Republic of)",
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}KR`, title: 'Korea, Republic of' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KW`, title: 'Kuwait' },
      { claim: `${COUNTRY_CLAIM_PREFIX}KG`, title: 'Kyrgyzstan' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}LA`,
        title: "Lao People's Democratic Republic",
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}LV`, title: 'Latvia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LB`, title: 'Lebanon' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LS`, title: 'Lesotho' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LR`, title: 'Liberia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LY`, title: 'Libya' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LI`, title: 'Liechtenstein' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LT`, title: 'Lithuania' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LU`, title: 'Luxembourg' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MO`, title: 'Macao' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MG`, title: 'Madagascar' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MW`, title: 'Malawi' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MY`, title: 'Malaysia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MV`, title: 'Maldives' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ML`, title: 'Mali' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MT`, title: 'Malta' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MH`, title: 'Marshall Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MQ`, title: 'Martinique' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MR`, title: 'Mauritania' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MU`, title: 'Mauritius' },
      { claim: `${COUNTRY_CLAIM_PREFIX}YT`, title: 'Mayotte' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MX`, title: 'Mexico' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}FM`,
        title: 'Micronesia (Federated States of)',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}MD`, title: 'Moldova, Republic of' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MC`, title: 'Monaco' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MN`, title: 'Mongolia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ME`, title: 'Montenegro' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MS`, title: 'Montserrat' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MA`, title: 'Morocco' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MZ`, title: 'Mozambique' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MM`, title: 'Myanmar' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NA`, title: 'Namibia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NR`, title: 'Nauru' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NP`, title: 'Nepal' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NL`, title: 'Netherlands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NC`, title: 'New Caledonia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NZ`, title: 'New Zealand' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NI`, title: 'Nicaragua' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NE`, title: 'Niger' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NG`, title: 'Nigeria' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NU`, title: 'Niue' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NF`, title: 'Norfolk Island' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MK`, title: 'North Macedonia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}MP`, title: 'Northern Mariana Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}NO`, title: 'Norway' },
      { claim: `${COUNTRY_CLAIM_PREFIX}OM`, title: 'Oman' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PK`, title: 'Pakistan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PW`, title: 'Palau' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PS`, title: 'Palestine, State of' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PA`, title: 'Panama' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PG`, title: 'Papua New Guinea' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PY`, title: 'Paraguay' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PE`, title: 'Peru' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PH`, title: 'Philippines' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PN`, title: 'Pitcairn' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PL`, title: 'Poland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PT`, title: 'Portugal' },
      { claim: `${COUNTRY_CLAIM_PREFIX}PR`, title: 'Puerto Rico' },
      { claim: `${COUNTRY_CLAIM_PREFIX}QA`, title: 'Qatar' },
      { claim: `${COUNTRY_CLAIM_PREFIX}RO`, title: 'Romania' },
      { claim: `${COUNTRY_CLAIM_PREFIX}RU`, title: 'Russian Federation' },
      { claim: `${COUNTRY_CLAIM_PREFIX}RW`, title: 'Rwanda' },
      { claim: `${COUNTRY_CLAIM_PREFIX}RE`, title: 'Réunion' },
      { claim: `${COUNTRY_CLAIM_PREFIX}BL`, title: 'Saint Barthélemy' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}SH`,
        title: 'Saint Helena, Ascension and Tristan da Cunha',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}KN`, title: 'Saint Kitts and Nevis' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LC`, title: 'Saint Lucia' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}MF`,
        title: 'Saint Martin (French part)',
      },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}PM`,
        title: 'Saint Pierre and Miquelon',
      },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}VC`,
        title: 'Saint Vincent and the Grenadines',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}WS`, title: 'Samoa' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SM`, title: 'San Marino' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ST`, title: 'Sao Tome and Principe' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SA`, title: 'Saudi Arabia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SN`, title: 'Senegal' },
      { claim: `${COUNTRY_CLAIM_PREFIX}RS`, title: 'Serbia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SC`, title: 'Seychelles' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SL`, title: 'Sierra Leone' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SG`, title: 'Singapore' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}SX`,
        title: 'Sint Maarten (Dutch part)',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}SK`, title: 'Slovakia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SI`, title: 'Slovenia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SB`, title: 'Solomon Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SO`, title: 'Somalia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ZA`, title: 'South Africa' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}GS`,
        title: 'South Georgia and the South Sandwich Islands',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}SS`, title: 'South Sudan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ES`, title: 'Spain' },
      { claim: `${COUNTRY_CLAIM_PREFIX}LK`, title: 'Sri Lanka' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SD`, title: 'Sudan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SR`, title: 'Suriname' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SJ`, title: 'Svalbard and Jan Mayen' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SE`, title: 'Sweden' },
      { claim: `${COUNTRY_CLAIM_PREFIX}CH`, title: 'Switzerland' },
      { claim: `${COUNTRY_CLAIM_PREFIX}SY`, title: 'Syrian Arab Republic' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}TW`,
        title: 'Taiwan, Province of China',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}TJ`, title: 'Tajikistan' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}TZ`,
        title: 'Tanzania, United Republic of',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}TH`, title: 'Thailand' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TL`, title: 'Timor-Leste' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TG`, title: 'Togo' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TK`, title: 'Tokelau' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TO`, title: 'Tonga' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TT`, title: 'Trinidad and Tobago' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TN`, title: 'Tunisia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TR`, title: 'Turkey' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TM`, title: 'Turkmenistan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TC`, title: 'Turks and Caicos Islands' },
      { claim: `${COUNTRY_CLAIM_PREFIX}TV`, title: 'Tuvalu' },
      { claim: `${COUNTRY_CLAIM_PREFIX}UG`, title: 'Uganda' },
      { claim: `${COUNTRY_CLAIM_PREFIX}UA`, title: 'Ukraine' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AE`, title: 'United Arab Emirates' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}GB`,
        title: 'United Kingdom of Great Britain and Northern Ireland',
      },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}UM`,
        title: 'United States Minor Outlying Islands',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}US`, title: 'United States of America' },
      { claim: `${COUNTRY_CLAIM_PREFIX}XX`, title: 'Unknown Country' },
      { claim: `${COUNTRY_CLAIM_PREFIX}UY`, title: 'Uruguay' },
      { claim: `${COUNTRY_CLAIM_PREFIX}UZ`, title: 'Uzbekistan' },
      { claim: `${COUNTRY_CLAIM_PREFIX}VU`, title: 'Vanuatu' },
      {
        claim: `${COUNTRY_CLAIM_PREFIX}VE`,
        title: 'Venezuela (Bolivarian Republic of)',
      },
      { claim: `${COUNTRY_CLAIM_PREFIX}VN`, title: 'Viet Nam' },
      { claim: `${COUNTRY_CLAIM_PREFIX}VG`, title: 'Virgin Islands (British)' },
      { claim: `${COUNTRY_CLAIM_PREFIX}VI`, title: 'Virgin Islands (U.S.)' },
      { claim: `${COUNTRY_CLAIM_PREFIX}WF`, title: 'Wallis and Futuna' },
      { claim: `${COUNTRY_CLAIM_PREFIX}EH`, title: 'Western Sahara' },
      { claim: `${COUNTRY_CLAIM_PREFIX}YE`, title: 'Yemen' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ZM`, title: 'Zambia' },
      { claim: `${COUNTRY_CLAIM_PREFIX}ZW`, title: 'Zimbabwe' },
      { claim: `${COUNTRY_CLAIM_PREFIX}AX`, title: 'Åland Islands' },
    ],
  },
];

/**
 * Array of all possible claim values based on `claimDefinitionGroups` array
 */
export const validClaims: string[] = claimDefinitionGroups.reduce<string[]>(
  (result, currentElement) => [
    ...result,
    ...currentElement.claim_definitions.map((def) => def.claim),
  ],
  [],
);
