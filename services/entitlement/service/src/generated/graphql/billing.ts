import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import { print } from 'graphql'
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BigFloat: any;
  Cursor: any;
  Datetime: any;
  JSON: any;
  UUID: any;
};

/** A filter to be used against BigFloat fields. All fields are combined with a logical ‘and.’ */
export type BigFloatFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['BigFloat']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['BigFloat']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['BigFloat']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['BigFloat']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['BigFloat']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['BigFloat']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['BigFloat']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['BigFloat']>>;
};

/** A filter to be used against Boolean fields. All fields are combined with a logical ‘and.’ */
export type BooleanFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Boolean']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Boolean']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Boolean']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Boolean']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Boolean']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Boolean']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type ClaimSet = {
  __typename?: 'ClaimSet';
  claims: Array<Maybe<Scalars['String']>>;
  description?: Maybe<Scalars['String']>;
  key: Scalars['String'];
  /** Reads and enables pagination through a set of `SubscriptionPlanClaimSet`. */
  subscriptionPlans: SubscriptionPlanClaimSetsConnection;
  title: Scalars['String'];
};


export type ClaimSetSubscriptionPlansArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionPlanClaimSetCondition>;
  filter?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionPlanClaimSetsOrderBy>>;
};

/** A filter to be used against `ClaimSet` object types. All fields are combined with a logical ‘and.’ */
export type ClaimSetFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<ClaimSetFilter>>;
  /** Filter by the object’s `claims` field. */
  claims?: InputMaybe<StringListFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<ClaimSetFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<ClaimSetFilter>>;
  /** Filter by the object’s `subscriptionPlans` relation. */
  subscriptionPlans?: InputMaybe<ClaimSetToManySubscriptionPlanClaimSetFilter>;
  /** Some related `subscriptionPlans` exist. */
  subscriptionPlansExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** A filter to be used against many `SubscriptionPlanClaimSet` object types. All fields are combined with a logical ‘and.’ */
export type ClaimSetToManySubscriptionPlanClaimSetFilter = {
  /** Every related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  /** No related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  /** Some related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionPlanClaimSetFilter>;
};

/** A filter to be used against Datetime fields. All fields are combined with a logical ‘and.’ */
export type DatetimeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Datetime']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Datetime']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Datetime']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Datetime']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Datetime']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Datetime']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Datetime']>>;
};

/** A filter to be used against Int fields. All fields are combined with a logical ‘and.’ */
export type IntFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['Int']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['Int']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['Int']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['Int']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['Int']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['Int']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['Int']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['Int']>>;
};

export enum Iso31661Alpha2 {
  /** Andorra */
  Ad = 'AD',
  /** United Arab Emirates */
  Ae = 'AE',
  /** Afghanistan */
  Af = 'AF',
  /** Antigua and Barbuda */
  Ag = 'AG',
  /** Anguilla */
  Ai = 'AI',
  /** Albania */
  Al = 'AL',
  /** Armenia */
  Am = 'AM',
  /** Angola */
  Ao = 'AO',
  /** Antarctica */
  Aq = 'AQ',
  /** Argentina */
  Ar = 'AR',
  /** American Samoa */
  As = 'AS',
  /** Austria */
  At = 'AT',
  /** Australia */
  Au = 'AU',
  /** Aruba */
  Aw = 'AW',
  /** Åland Islands */
  Ax = 'AX',
  /** Azerbaijan */
  Az = 'AZ',
  /** Bosnia and Herzegovina */
  Ba = 'BA',
  /** Barbados */
  Bb = 'BB',
  /** Bangladesh */
  Bd = 'BD',
  /** Belgium */
  Be = 'BE',
  /** Burkina Faso */
  Bf = 'BF',
  /** Bulgaria */
  Bg = 'BG',
  /** Bahrain */
  Bh = 'BH',
  /** Burundi */
  Bi = 'BI',
  /** Benin */
  Bj = 'BJ',
  /** Saint Barthélemy */
  Bl = 'BL',
  /** Bermuda */
  Bm = 'BM',
  /** Brunei Darussalam */
  Bn = 'BN',
  /** Bolivia (Plurinational State of) */
  Bo = 'BO',
  /** Bonaire, Sint Eustatius and Saba */
  Bq = 'BQ',
  /** Brazil */
  Br = 'BR',
  /** Bahamas */
  Bs = 'BS',
  /** Bhutan */
  Bt = 'BT',
  /** Bouvet Island */
  Bv = 'BV',
  /** Botswana */
  Bw = 'BW',
  /** Belarus */
  By = 'BY',
  /** Belize */
  Bz = 'BZ',
  /** Canada */
  Ca = 'CA',
  /** Cocos (Keeling) Islands */
  Cc = 'CC',
  /** Congo, Democratic Republic of the */
  Cd = 'CD',
  /** Central African Republic */
  Cf = 'CF',
  /** Congo */
  Cg = 'CG',
  /** Switzerland */
  Ch = 'CH',
  /** Côte d'Ivoire */
  Ci = 'CI',
  /** Cook Islands */
  Ck = 'CK',
  /** Chile */
  Cl = 'CL',
  /** Cameroon */
  Cm = 'CM',
  /** China */
  Cn = 'CN',
  /** Colombia */
  Co = 'CO',
  /** Costa Rica */
  Cr = 'CR',
  /** Cuba */
  Cu = 'CU',
  /** Cabo Verde */
  Cv = 'CV',
  /** Curaçao */
  Cw = 'CW',
  /** Christmas Island */
  Cx = 'CX',
  /** Cyprus */
  Cy = 'CY',
  /** Czechia */
  Cz = 'CZ',
  /** Germany */
  De = 'DE',
  /** Djibouti */
  Dj = 'DJ',
  /** Denmark */
  Dk = 'DK',
  /** Dominica */
  Dm = 'DM',
  /** Dominican Republic */
  Do = 'DO',
  /** Algeria */
  Dz = 'DZ',
  /** Ecuador */
  Ec = 'EC',
  /** Estonia */
  Ee = 'EE',
  /** Egypt */
  Eg = 'EG',
  /** Western Sahara */
  Eh = 'EH',
  /** Eritrea */
  Er = 'ER',
  /** Spain */
  Es = 'ES',
  /** Ethiopia */
  Et = 'ET',
  /** Finland */
  Fi = 'FI',
  /** Fiji */
  Fj = 'FJ',
  /** Falkland Islands (Malvinas) */
  Fk = 'FK',
  /** Micronesia (Federated States of) */
  Fm = 'FM',
  /** Faroe Islands */
  Fo = 'FO',
  /** France */
  Fr = 'FR',
  /** Gabon */
  Ga = 'GA',
  /** United Kingdom of Great Britain and Northern Ireland */
  Gb = 'GB',
  /** Grenada */
  Gd = 'GD',
  /** Georgia */
  Ge = 'GE',
  /** French Guiana */
  Gf = 'GF',
  /** Guernsey */
  Gg = 'GG',
  /** Ghana */
  Gh = 'GH',
  /** Gibraltar */
  Gi = 'GI',
  /** Greenland */
  Gl = 'GL',
  /** Gambia */
  Gm = 'GM',
  /** Guinea */
  Gn = 'GN',
  /** Guadeloupe */
  Gp = 'GP',
  /** Equatorial Guinea */
  Gq = 'GQ',
  /** Greece */
  Gr = 'GR',
  /** South Georgia and the South Sandwich Islands */
  Gs = 'GS',
  /** Guatemala */
  Gt = 'GT',
  /** Guam */
  Gu = 'GU',
  /** Guinea-Bissau */
  Gw = 'GW',
  /** Guyana */
  Gy = 'GY',
  /** Hong Kong */
  Hk = 'HK',
  /** Heard Island and McDonald Islands */
  Hm = 'HM',
  /** Honduras */
  Hn = 'HN',
  /** Croatia */
  Hr = 'HR',
  /** Haiti */
  Ht = 'HT',
  /** Hungary */
  Hu = 'HU',
  /** Indonesia */
  Id = 'ID',
  /** Ireland */
  Ie = 'IE',
  /** Israel */
  Il = 'IL',
  /** Isle of Man */
  Im = 'IM',
  /** India */
  In = 'IN',
  /** British Indian Ocean Territory */
  Io = 'IO',
  /** Iraq */
  Iq = 'IQ',
  /** Iran (Islamic Republic of) */
  Ir = 'IR',
  /** Iceland */
  Is = 'IS',
  /** Italy */
  It = 'IT',
  /** Jersey */
  Je = 'JE',
  /** Jamaica */
  Jm = 'JM',
  /** Jordan */
  Jo = 'JO',
  /** Japan */
  Jp = 'JP',
  /** Kenya */
  Ke = 'KE',
  /** Kyrgyzstan */
  Kg = 'KG',
  /** Cambodia */
  Kh = 'KH',
  /** Kiribati */
  Ki = 'KI',
  /** Comoros */
  Km = 'KM',
  /** Saint Kitts and Nevis */
  Kn = 'KN',
  /** Korea (Democratic People's Republic of) */
  Kp = 'KP',
  /** Korea, Republic of */
  Kr = 'KR',
  /** Kuwait */
  Kw = 'KW',
  /** Cayman Islands */
  Ky = 'KY',
  /** Kazakhstan */
  Kz = 'KZ',
  /** Lao People's Democratic Republic */
  La = 'LA',
  /** Lebanon */
  Lb = 'LB',
  /** Saint Lucia */
  Lc = 'LC',
  /** Liechtenstein */
  Li = 'LI',
  /** Sri Lanka */
  Lk = 'LK',
  /** Liberia */
  Lr = 'LR',
  /** Lesotho */
  Ls = 'LS',
  /** Lithuania */
  Lt = 'LT',
  /** Luxembourg */
  Lu = 'LU',
  /** Latvia */
  Lv = 'LV',
  /** Libya */
  Ly = 'LY',
  /** Morocco */
  Ma = 'MA',
  /** Monaco */
  Mc = 'MC',
  /** Moldova, Republic of */
  Md = 'MD',
  /** Montenegro */
  Me = 'ME',
  /** Saint Martin (French part) */
  Mf = 'MF',
  /** Madagascar */
  Mg = 'MG',
  /** Marshall Islands */
  Mh = 'MH',
  /** North Macedonia */
  Mk = 'MK',
  /** Mali */
  Ml = 'ML',
  /** Myanmar */
  Mm = 'MM',
  /** Mongolia */
  Mn = 'MN',
  /** Macao */
  Mo = 'MO',
  /** Northern Mariana Islands */
  Mp = 'MP',
  /** Martinique */
  Mq = 'MQ',
  /** Mauritania */
  Mr = 'MR',
  /** Montserrat */
  Ms = 'MS',
  /** Malta */
  Mt = 'MT',
  /** Mauritius */
  Mu = 'MU',
  /** Maldives */
  Mv = 'MV',
  /** Malawi */
  Mw = 'MW',
  /** Mexico */
  Mx = 'MX',
  /** Malaysia */
  My = 'MY',
  /** Mozambique */
  Mz = 'MZ',
  /** Namibia */
  Na = 'NA',
  /** New Caledonia */
  Nc = 'NC',
  /** Niger */
  Ne = 'NE',
  /** Norfolk Island */
  Nf = 'NF',
  /** Nigeria */
  Ng = 'NG',
  /** Nicaragua */
  Ni = 'NI',
  /** Netherlands */
  Nl = 'NL',
  /** Norway */
  No = 'NO',
  /** Nepal */
  Np = 'NP',
  /** Nauru */
  Nr = 'NR',
  /** Niue */
  Nu = 'NU',
  /** New Zealand */
  Nz = 'NZ',
  /** Oman */
  Om = 'OM',
  /** Panama */
  Pa = 'PA',
  /** Peru */
  Pe = 'PE',
  /** French Polynesia */
  Pf = 'PF',
  /** Papua New Guinea */
  Pg = 'PG',
  /** Philippines */
  Ph = 'PH',
  /** Pakistan */
  Pk = 'PK',
  /** Poland */
  Pl = 'PL',
  /** Saint Pierre and Miquelon */
  Pm = 'PM',
  /** Pitcairn */
  Pn = 'PN',
  /** Puerto Rico */
  Pr = 'PR',
  /** Palestine, State of */
  Ps = 'PS',
  /** Portugal */
  Pt = 'PT',
  /** Palau */
  Pw = 'PW',
  /** Paraguay */
  Py = 'PY',
  /** Qatar */
  Qa = 'QA',
  /** Réunion */
  Re = 'RE',
  /** Romania */
  Ro = 'RO',
  /** Serbia */
  Rs = 'RS',
  /** Russian Federation */
  Ru = 'RU',
  /** Rwanda */
  Rw = 'RW',
  /** Saudi Arabia */
  Sa = 'SA',
  /** Solomon Islands */
  Sb = 'SB',
  /** Seychelles */
  Sc = 'SC',
  /** Sudan */
  Sd = 'SD',
  /** Sweden */
  Se = 'SE',
  /** Singapore */
  Sg = 'SG',
  /** Saint Helena, Ascension and Tristan da Cunha */
  Sh = 'SH',
  /** Slovenia */
  Si = 'SI',
  /** Svalbard and Jan Mayen */
  Sj = 'SJ',
  /** Slovakia */
  Sk = 'SK',
  /** Sierra Leone */
  Sl = 'SL',
  /** San Marino */
  Sm = 'SM',
  /** Senegal */
  Sn = 'SN',
  /** Somalia */
  So = 'SO',
  /** Suriname */
  Sr = 'SR',
  /** South Sudan */
  Ss = 'SS',
  /** Sao Tome and Principe */
  St = 'ST',
  /** El Salvador */
  Sv = 'SV',
  /** Sint Maarten (Dutch part) */
  Sx = 'SX',
  /** Syrian Arab Republic */
  Sy = 'SY',
  /** Eswatini */
  Sz = 'SZ',
  /** Turks and Caicos Islands */
  Tc = 'TC',
  /** Chad */
  Td = 'TD',
  /** French Southern Territories */
  Tf = 'TF',
  /** Togo */
  Tg = 'TG',
  /** Thailand */
  Th = 'TH',
  /** Tajikistan */
  Tj = 'TJ',
  /** Tokelau */
  Tk = 'TK',
  /** Timor-Leste */
  Tl = 'TL',
  /** Turkmenistan */
  Tm = 'TM',
  /** Tunisia */
  Tn = 'TN',
  /** Tonga */
  To = 'TO',
  /** Turkey */
  Tr = 'TR',
  /** Trinidad and Tobago */
  Tt = 'TT',
  /** Tuvalu */
  Tv = 'TV',
  /** Taiwan, Province of China */
  Tw = 'TW',
  /** Tanzania, United Republic of */
  Tz = 'TZ',
  /** Ukraine */
  Ua = 'UA',
  /** Uganda */
  Ug = 'UG',
  /** United States Minor Outlying Islands */
  Um = 'UM',
  /** United States of America */
  Us = 'US',
  /** Uruguay */
  Uy = 'UY',
  /** Uzbekistan */
  Uz = 'UZ',
  /** Holy See */
  Va = 'VA',
  /** Saint Vincent and the Grenadines */
  Vc = 'VC',
  /** Venezuela (Bolivarian Republic of) */
  Ve = 'VE',
  /** Virgin Islands (British) */
  Vg = 'VG',
  /** Virgin Islands (U.S.) */
  Vi = 'VI',
  /** Viet Nam */
  Vn = 'VN',
  /** Vanuatu */
  Vu = 'VU',
  /** Wallis and Futuna */
  Wf = 'WF',
  /** Samoa */
  Ws = 'WS',
  /** Unknown Country */
  Xx = 'XX',
  /** Yemen */
  Ye = 'YE',
  /** Mayotte */
  Yt = 'YT',
  /** South Africa */
  Za = 'ZA',
  /** Zambia */
  Zm = 'ZM',
  /** Zimbabwe */
  Zw = 'ZW'
}

/** A filter to be used against Iso31661Alpha2 fields. All fields are combined with a logical ‘and.’ */
export type Iso31661Alpha2Filter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Iso31661Alpha2>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Iso31661Alpha2>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Iso31661Alpha2>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Iso31661Alpha2>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Iso31661Alpha2>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Iso31661Alpha2>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Iso31661Alpha2>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Iso31661Alpha2>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Iso31661Alpha2>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Iso31661Alpha2>>;
};

/** The root mutation type which contains root level fields which mutate data. */
export type Mutation = {
  __typename?: 'Mutation';
  debugInfo: Scalars['JSON'];
  /** Activate a PayPal based subscription */
  paypalActivateSubscription: PaypalActivateSubscriptionPayload;
  /** Cancel a PayPal based subscription */
  paypalCancelSubscription: PaypalCancelSubscriptionPayload;
  /** Subscribe through PayPal to a subscription plan via one of its payment plans. */
  paypalSubscribe: PaypalSubscribePayload;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPaypalActivateSubscriptionArgs = {
  input: PaypalActivateSubscriptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPaypalCancelSubscriptionArgs = {
  input: PaypalCancelSubscriptionInput;
};


/** The root mutation type which contains root level fields which mutate data. */
export type MutationPaypalSubscribeArgs = {
  input: PaypalSubscribeInput;
};

/** Information about pagination in a connection. */
export type PageInfo = {
  __typename?: 'PageInfo';
  /** When paginating forwards, the cursor to continue. */
  endCursor?: Maybe<Scalars['Cursor']>;
  /** When paginating forwards, are there more items? */
  hasNextPage: Scalars['Boolean'];
  /** When paginating backwards, are there more items? */
  hasPreviousPage: Scalars['Boolean'];
  /** When paginating backwards, the cursor to continue. */
  startCursor?: Maybe<Scalars['Cursor']>;
};

export type PaymentPlan = {
  __typename?: 'PaymentPlan';
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isActive?: Maybe<Scalars['Boolean']>;
  periodQuantity?: Maybe<Scalars['Int']>;
  periodUnit: PeriodUnit;
  /** Reads and enables pagination through a set of `PaymentPlanPrice`. */
  prices: PaymentPlanPricesConnection;
  /** Reads and enables pagination through a set of `PaymentPlanProviderConfig`. */
  providerConfigs: PaymentPlanProviderConfigsConnection;
  /** Reads a single `SubscriptionPlan` that is related to this `PaymentPlan`. */
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  subscriptionPlanId: Scalars['UUID'];
  /** Reads and enables pagination through a set of `SubscriptionType`. */
  subscriptions: SubscriptionTypesConnection;
  title: Scalars['String'];
};


export type PaymentPlanPricesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentPlanPriceCondition>;
  filter?: InputMaybe<PaymentPlanPriceFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentPlanPricesOrderBy>>;
};


export type PaymentPlanProviderConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentPlanProviderConfigCondition>;
  filter?: InputMaybe<PaymentPlanProviderConfigFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentPlanProviderConfigsOrderBy>>;
};


export type PaymentPlanSubscriptionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTypeCondition>;
  filter?: InputMaybe<SubscriptionTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTypesOrderBy>>;
};

/**
 * A condition to be used against `PaymentPlan` object types. All fields are tested
 * for equality and combined with a logical ‘and.’
 */
export type PaymentPlanCondition = {
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `periodQuantity` field. */
  periodQuantity?: InputMaybe<Scalars['Int']>;
  /** Checks for equality with the object’s `periodUnit` field. */
  periodUnit?: InputMaybe<PeriodUnit>;
  /** Checks for equality with the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `PaymentPlan` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PaymentPlanFilter>>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isActive` field. */
  isActive?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PaymentPlanFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PaymentPlanFilter>>;
  /** Filter by the object’s `periodQuantity` field. */
  periodQuantity?: InputMaybe<IntFilter>;
  /** Filter by the object’s `periodUnit` field. */
  periodUnit?: InputMaybe<PeriodUnitFilter>;
  /** Filter by the object’s `prices` relation. */
  prices?: InputMaybe<PaymentPlanToManyPaymentPlanPriceFilter>;
  /** Some related `prices` exist. */
  pricesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `providerConfigs` relation. */
  providerConfigs?: InputMaybe<PaymentPlanToManyPaymentPlanProviderConfigFilter>;
  /** Some related `providerConfigs` exist. */
  providerConfigsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptionPlan` relation. */
  subscriptionPlan?: InputMaybe<SubscriptionPlanFilter>;
  /** Filter by the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `subscriptions` relation. */
  subscriptions?: InputMaybe<PaymentPlanToManySubscriptionTypeFilter>;
  /** Some related `subscriptions` exist. */
  subscriptionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

export type PaymentPlanPrice = {
  __typename?: 'PaymentPlanPrice';
  country: Iso31661Alpha2;
  currency: Scalars['String'];
  /** Reads a single `PaymentPlan` that is related to this `PaymentPlanPrice`. */
  paymentPlan?: Maybe<PaymentPlan>;
  paymentPlanId: Scalars['UUID'];
  price: Scalars['BigFloat'];
};

/**
 * A condition to be used against `PaymentPlanPrice` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PaymentPlanPriceCondition = {
  /** Checks for equality with the object’s `country` field. */
  country?: InputMaybe<Iso31661Alpha2>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `price` field. */
  price?: InputMaybe<Scalars['BigFloat']>;
};

/** A filter to be used against `PaymentPlanPrice` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanPriceFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PaymentPlanPriceFilter>>;
  /** Filter by the object’s `country` field. */
  country?: InputMaybe<Iso31661Alpha2Filter>;
  /** Filter by the object’s `currency` field. */
  currency?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PaymentPlanPriceFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PaymentPlanPriceFilter>>;
  /** Filter by the object’s `paymentPlan` relation. */
  paymentPlan?: InputMaybe<PaymentPlanFilter>;
  /** Filter by the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `price` field. */
  price?: InputMaybe<BigFloatFilter>;
};

/** A connection to a list of `PaymentPlanPrice` values. */
export type PaymentPlanPricesConnection = {
  __typename?: 'PaymentPlanPricesConnection';
  /** A list of edges which contains the `PaymentPlanPrice` and cursor to aid in pagination. */
  edges: Array<PaymentPlanPricesEdge>;
  /** A list of `PaymentPlanPrice` objects. */
  nodes: Array<PaymentPlanPrice>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PaymentPlanPrice` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PaymentPlanPrice` edge in the connection. */
export type PaymentPlanPricesEdge = {
  __typename?: 'PaymentPlanPricesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PaymentPlanPrice` at the end of the edge. */
  node: PaymentPlanPrice;
};

/** Methods to use when ordering `PaymentPlanPrice`. */
export enum PaymentPlanPricesOrderBy {
  CountryAsc = 'COUNTRY_ASC',
  CountryDesc = 'COUNTRY_DESC',
  CurrencyAsc = 'CURRENCY_ASC',
  CurrencyDesc = 'CURRENCY_DESC',
  Natural = 'NATURAL',
  PaymentPlanIdAsc = 'PAYMENT_PLAN_ID_ASC',
  PaymentPlanIdDesc = 'PAYMENT_PLAN_ID_DESC',
  PriceAsc = 'PRICE_ASC',
  PriceDesc = 'PRICE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

export type PaymentPlanProviderConfig = {
  __typename?: 'PaymentPlanProviderConfig';
  externalId?: Maybe<Scalars['String']>;
  /** Reads a single `PaymentPlan` that is related to this `PaymentPlanProviderConfig`. */
  paymentPlan?: Maybe<PaymentPlan>;
  paymentPlanId: Scalars['UUID'];
  /** Reads a single `PaymentProvider` that is related to this `PaymentPlanProviderConfig`. */
  paymentProvider?: Maybe<PaymentProvider>;
  paymentProviderKey: Scalars['String'];
};

/**
 * A condition to be used against `PaymentPlanProviderConfig` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type PaymentPlanProviderConfigCondition = {
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `PaymentPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanProviderConfigFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PaymentPlanProviderConfigFilter>>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PaymentPlanProviderConfigFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PaymentPlanProviderConfigFilter>>;
  /** Filter by the object’s `paymentPlan` relation. */
  paymentPlan?: InputMaybe<PaymentPlanFilter>;
  /** Filter by the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `paymentProvider` relation. */
  paymentProvider?: InputMaybe<PaymentProviderFilter>;
  /** Filter by the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<StringFilter>;
};

/** A connection to a list of `PaymentPlanProviderConfig` values. */
export type PaymentPlanProviderConfigsConnection = {
  __typename?: 'PaymentPlanProviderConfigsConnection';
  /** A list of edges which contains the `PaymentPlanProviderConfig` and cursor to aid in pagination. */
  edges: Array<PaymentPlanProviderConfigsEdge>;
  /** A list of `PaymentPlanProviderConfig` objects. */
  nodes: Array<PaymentPlanProviderConfig>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PaymentPlanProviderConfig` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PaymentPlanProviderConfig` edge in the connection. */
export type PaymentPlanProviderConfigsEdge = {
  __typename?: 'PaymentPlanProviderConfigsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PaymentPlanProviderConfig` at the end of the edge. */
  node: PaymentPlanProviderConfig;
};

/** Methods to use when ordering `PaymentPlanProviderConfig`. */
export enum PaymentPlanProviderConfigsOrderBy {
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  Natural = 'NATURAL',
  PaymentPlanIdAsc = 'PAYMENT_PLAN_ID_ASC',
  PaymentPlanIdDesc = 'PAYMENT_PLAN_ID_DESC',
  PaymentProviderKeyAsc = 'PAYMENT_PROVIDER_KEY_ASC',
  PaymentProviderKeyDesc = 'PAYMENT_PROVIDER_KEY_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC'
}

/** A filter to be used against many `PaymentPlanPrice` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanToManyPaymentPlanPriceFilter = {
  /** Every related `PaymentPlanPrice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PaymentPlanPriceFilter>;
  /** No related `PaymentPlanPrice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PaymentPlanPriceFilter>;
  /** Some related `PaymentPlanPrice` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PaymentPlanPriceFilter>;
};

/** A filter to be used against many `PaymentPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanToManyPaymentPlanProviderConfigFilter = {
  /** Every related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PaymentPlanProviderConfigFilter>;
  /** No related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PaymentPlanProviderConfigFilter>;
  /** Some related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PaymentPlanProviderConfigFilter>;
};

/** A filter to be used against many `SubscriptionType` object types. All fields are combined with a logical ‘and.’ */
export type PaymentPlanToManySubscriptionTypeFilter = {
  /** Every related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionTypeFilter>;
  /** No related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionTypeFilter>;
  /** Some related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionTypeFilter>;
};

/** A connection to a list of `PaymentPlan` values. */
export type PaymentPlansConnection = {
  __typename?: 'PaymentPlansConnection';
  /** A list of edges which contains the `PaymentPlan` and cursor to aid in pagination. */
  edges: Array<PaymentPlansEdge>;
  /** A list of `PaymentPlan` objects. */
  nodes: Array<PaymentPlan>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PaymentPlan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PaymentPlan` edge in the connection. */
export type PaymentPlansEdge = {
  __typename?: 'PaymentPlansEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PaymentPlan` at the end of the edge. */
  node: PaymentPlan;
};

/** Methods to use when ordering `PaymentPlan`. */
export enum PaymentPlansOrderBy {
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  Natural = 'NATURAL',
  PeriodQuantityAsc = 'PERIOD_QUANTITY_ASC',
  PeriodQuantityDesc = 'PERIOD_QUANTITY_DESC',
  PeriodUnitAsc = 'PERIOD_UNIT_ASC',
  PeriodUnitDesc = 'PERIOD_UNIT_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionPlanIdAsc = 'SUBSCRIPTION_PLAN_ID_ASC',
  SubscriptionPlanIdDesc = 'SUBSCRIPTION_PLAN_ID_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

export type PaymentProvider = {
  __typename?: 'PaymentProvider';
  key: Scalars['String'];
  /** Reads and enables pagination through a set of `PaymentPlanProviderConfig`. */
  paymentPlanProviderConfigs: PaymentPlanProviderConfigsConnection;
  /** Reads and enables pagination through a set of `SubscriptionPlanProviderConfig`. */
  subscriptionPlanProviderConfigs: SubscriptionPlanProviderConfigsConnection;
  /** Reads and enables pagination through a set of `SubscriptionTransaction`. */
  subscriptionTransactions: SubscriptionTransactionsConnection;
  /** Reads and enables pagination through a set of `SubscriptionType`. */
  subscriptions: SubscriptionTypesConnection;
  title: Scalars['String'];
};


export type PaymentProviderPaymentPlanProviderConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentPlanProviderConfigCondition>;
  filter?: InputMaybe<PaymentPlanProviderConfigFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentPlanProviderConfigsOrderBy>>;
};


export type PaymentProviderSubscriptionPlanProviderConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionPlanProviderConfigCondition>;
  filter?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionPlanProviderConfigsOrderBy>>;
};


export type PaymentProviderSubscriptionTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTransactionCondition>;
  filter?: InputMaybe<SubscriptionTransactionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTransactionsOrderBy>>;
};


export type PaymentProviderSubscriptionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTypeCondition>;
  filter?: InputMaybe<SubscriptionTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTypesOrderBy>>;
};

/**
 * A condition to be used against `PaymentProvider` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type PaymentProviderCondition = {
  /**
   * Checks for equality with the object’s `key` field.
   * @isIdentifierKey()
   */
  key?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `PaymentProvider` object types. All fields are combined with a logical ‘and.’ */
export type PaymentProviderFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<PaymentProviderFilter>>;
  /** Filter by the object’s `key` field. */
  key?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<PaymentProviderFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<PaymentProviderFilter>>;
  /** Filter by the object’s `paymentPlanProviderConfigs` relation. */
  paymentPlanProviderConfigs?: InputMaybe<PaymentProviderToManyPaymentPlanProviderConfigFilter>;
  /** Some related `paymentPlanProviderConfigs` exist. */
  paymentPlanProviderConfigsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptionPlanProviderConfigs` relation. */
  subscriptionPlanProviderConfigs?: InputMaybe<PaymentProviderToManySubscriptionPlanProviderConfigFilter>;
  /** Some related `subscriptionPlanProviderConfigs` exist. */
  subscriptionPlanProviderConfigsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptionTransactions` relation. */
  subscriptionTransactions?: InputMaybe<PaymentProviderToManySubscriptionTransactionFilter>;
  /** Some related `subscriptionTransactions` exist. */
  subscriptionTransactionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptions` relation. */
  subscriptions?: InputMaybe<PaymentProviderToManySubscriptionTypeFilter>;
  /** Some related `subscriptions` exist. */
  subscriptionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

/** A filter to be used against many `PaymentPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type PaymentProviderToManyPaymentPlanProviderConfigFilter = {
  /** Every related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PaymentPlanProviderConfigFilter>;
  /** No related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PaymentPlanProviderConfigFilter>;
  /** Some related `PaymentPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PaymentPlanProviderConfigFilter>;
};

/** A filter to be used against many `SubscriptionPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type PaymentProviderToManySubscriptionPlanProviderConfigFilter = {
  /** Every related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  /** No related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  /** Some related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
};

/** A filter to be used against many `SubscriptionTransaction` object types. All fields are combined with a logical ‘and.’ */
export type PaymentProviderToManySubscriptionTransactionFilter = {
  /** Every related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionTransactionFilter>;
  /** No related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionTransactionFilter>;
  /** Some related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionTransactionFilter>;
};

/** A filter to be used against many `SubscriptionType` object types. All fields are combined with a logical ‘and.’ */
export type PaymentProviderToManySubscriptionTypeFilter = {
  /** Every related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionTypeFilter>;
  /** No related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionTypeFilter>;
  /** Some related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionTypeFilter>;
};

/** A connection to a list of `PaymentProvider` values. */
export type PaymentProvidersConnection = {
  __typename?: 'PaymentProvidersConnection';
  /** A list of edges which contains the `PaymentProvider` and cursor to aid in pagination. */
  edges: Array<PaymentProvidersEdge>;
  /** A list of `PaymentProvider` objects. */
  nodes: Array<PaymentProvider>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `PaymentProvider` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `PaymentProvider` edge in the connection. */
export type PaymentProvidersEdge = {
  __typename?: 'PaymentProvidersEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `PaymentProvider` at the end of the edge. */
  node: PaymentProvider;
};

/** Methods to use when ordering `PaymentProvider`. */
export enum PaymentProvidersOrderBy {
  KeyAsc = 'KEY_ASC',
  KeyDesc = 'KEY_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

export type PaypalActivateSubscriptionInput = {
  paypalSubscriptionId: Scalars['String'];
};

export type PaypalActivateSubscriptionPayload = {
  __typename?: 'PaypalActivateSubscriptionPayload';
  subscription: SubscriptionType;
};

export type PaypalCancelSubscriptionInput = {
  subscriptionId: Scalars['UUID'];
};

export type PaypalCancelSubscriptionPayload = {
  __typename?: 'PaypalCancelSubscriptionPayload';
  subscription: SubscriptionType;
};

export enum PaypalPurchaseFlow {
  /** Use the popup based purchase flow */
  Popup = 'POPUP',
  /** Use the redirect based purchase flow */
  Redirect = 'REDIRECT'
}

/** The input details for subscribing via PayPal. */
export type PaypalSubscribeInput = {
  /**
   * Optionally: the country for which the subscription should be created.
   * It will be stored on the subscription and used to verify that the selected
   * payment plan defines a price for this country.
   */
  country?: InputMaybe<Iso31661Alpha2>;
  /** The ID of the payment plan that should be purchased. */
  paymentPlanId: Scalars['UUID'];
  /** The type of the PayPal workflow that should be used to purchase the subscription. */
  purchaseFlow: PaypalPurchaseFlow;
};

/** The PayPal subscribe response payload. */
export type PaypalSubscribePayload = {
  __typename?: 'PaypalSubscribePayload';
  /**
   * Redirect the user to this URL to purchase and approve the subscription
   * purchase on the PayPal website. This field is used for the redirect
   * based flow.
   */
  approveUrl?: Maybe<Scalars['String']>;
  /**
   * The custom ID that you should provide as part of the PayPal button flow
   * for the field "custom_id".
   */
  customId?: Maybe<Scalars['String']>;
  /** The ID of the plan in the PayPal system. */
  paypalPlanId: Scalars['String'];
  /** The Billing Service subscription ID. */
  subscriptionId: Scalars['UUID'];
};

export enum PeriodUnit {
  /** day */
  Day = 'DAY',
  /** month */
  Month = 'MONTH',
  /** week */
  Week = 'WEEK',
  /** year */
  Year = 'YEAR'
}

/** A filter to be used against PeriodUnit fields. All fields are combined with a logical ‘and.’ */
export type PeriodUnitFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<PeriodUnit>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<PeriodUnit>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<PeriodUnit>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<PeriodUnit>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<PeriodUnit>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<PeriodUnit>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<PeriodUnit>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<PeriodUnit>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<PeriodUnit>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<PeriodUnit>>;
};

/** The root query type which gives access points into the data universe. */
export type Query = {
  __typename?: 'Query';
  debugInfo: Scalars['JSON'];
  paymentPlan?: Maybe<PaymentPlan>;
  /** Reads and enables pagination through a set of `PaymentPlan`. */
  paymentPlans?: Maybe<PaymentPlansConnection>;
  paymentProvider?: Maybe<PaymentProvider>;
  /** Reads and enables pagination through a set of `PaymentProvider`. */
  paymentProviders?: Maybe<PaymentProvidersConnection>;
  /**
   * Exposes the root query type nested one level down. This is helpful for Relay 1
   * which can only query top level fields if they are in a particular form.
   */
  query: Query;
  subscription?: Maybe<SubscriptionType>;
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  /** Reads and enables pagination through a set of `SubscriptionPlan`. */
  subscriptionPlans?: Maybe<SubscriptionPlansConnection>;
  subscriptionTransaction?: Maybe<SubscriptionTransaction>;
  /** Reads and enables pagination through a set of `SubscriptionTransaction`. */
  subscriptionTransactions?: Maybe<SubscriptionTransactionsConnection>;
  /** Reads and enables pagination through a set of `SubscriptionType`. */
  subscriptions?: Maybe<SubscriptionTypesConnection>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPaymentPlanArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPaymentPlansArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentPlanCondition>;
  filter?: InputMaybe<PaymentPlanFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentPlansOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QueryPaymentProviderArgs = {
  key: Scalars['String'];
};


/** The root query type which gives access points into the data universe. */
export type QueryPaymentProvidersArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentProviderCondition>;
  filter?: InputMaybe<PaymentProviderFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentProvidersOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionPlanArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionPlansArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionPlanCondition>;
  filter?: InputMaybe<SubscriptionPlanFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionPlansOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionTransactionArgs = {
  id: Scalars['UUID'];
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTransactionCondition>;
  filter?: InputMaybe<SubscriptionTransactionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTransactionsOrderBy>>;
};


/** The root query type which gives access points into the data universe. */
export type QuerySubscriptionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTypeCondition>;
  filter?: InputMaybe<SubscriptionTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTypesOrderBy>>;
};

/** A filter to be used against String fields. All fields are combined with a logical ‘and.’ */
export type StringFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value, treating null like an ordinary value (case-insensitive). */
  distinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-sensitive). */
  endsWith?: InputMaybe<Scalars['String']>;
  /** Ends with the specified string (case-insensitive). */
  endsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value (case-insensitive). */
  equalToInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['String']>;
  /** Greater than the specified value (case-insensitive). */
  greaterThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Greater than or equal to the specified value (case-insensitive). */
  greaterThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['String']>>;
  /** Included in the specified list (case-insensitive). */
  inInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Contains the specified string (case-sensitive). */
  includes?: InputMaybe<Scalars['String']>;
  /** Contains the specified string (case-insensitive). */
  includesInsensitive?: InputMaybe<Scalars['String']>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['String']>;
  /** Less than the specified value (case-insensitive). */
  lessThanInsensitive?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Less than or equal to the specified value (case-insensitive). */
  lessThanOrEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  like?: InputMaybe<Scalars['String']>;
  /** Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  likeInsensitive?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['String']>;
  /** Equal to the specified value, treating null like an ordinary value (case-insensitive). */
  notDistinctFromInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-sensitive). */
  notEndsWith?: InputMaybe<Scalars['String']>;
  /** Does not end with the specified string (case-insensitive). */
  notEndsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['String']>;
  /** Not equal to the specified value (case-insensitive). */
  notEqualToInsensitive?: InputMaybe<Scalars['String']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['String']>>;
  /** Not included in the specified list (case-insensitive). */
  notInInsensitive?: InputMaybe<Array<Scalars['String']>>;
  /** Does not contain the specified string (case-sensitive). */
  notIncludes?: InputMaybe<Scalars['String']>;
  /** Does not contain the specified string (case-insensitive). */
  notIncludesInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLike?: InputMaybe<Scalars['String']>;
  /** Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters. */
  notLikeInsensitive?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-sensitive). */
  notStartsWith?: InputMaybe<Scalars['String']>;
  /** Does not start with the specified string (case-insensitive). */
  notStartsWithInsensitive?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-sensitive). */
  startsWith?: InputMaybe<Scalars['String']>;
  /** Starts with the specified string (case-insensitive). */
  startsWithInsensitive?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against String List fields. All fields are combined with a logical ‘and.’ */
export type StringListFilter = {
  /** Any array item is equal to the specified value. */
  anyEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than the specified value. */
  anyGreaterThan?: InputMaybe<Scalars['String']>;
  /** Any array item is greater than or equal to the specified value. */
  anyGreaterThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is less than the specified value. */
  anyLessThan?: InputMaybe<Scalars['String']>;
  /** Any array item is less than or equal to the specified value. */
  anyLessThanOrEqualTo?: InputMaybe<Scalars['String']>;
  /** Any array item is not equal to the specified value. */
  anyNotEqualTo?: InputMaybe<Scalars['String']>;
  /** Contained by the specified list of values. */
  containedBy?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Contains the specified list of values. */
  contains?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  /** Overlaps the specified list of values. */
  overlaps?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
};

/** The root subscription type: contains realtime events you can subscribe to with the `subscription` operation. */
export type Subscription = {
  __typename?: 'Subscription';
  /** Triggered when the lifecycle_status of a subscription changes */
  subscriptionLifecycleStatusMutated?: Maybe<SubscriptionLifecycleStatusPayload>;
};

export enum SubscriptionLifecycleStatus {
  /** Active */
  Active = 'ACTIVE',
  /** Cancelled */
  Cancelled = 'CANCELLED',
  /** Ended */
  Ended = 'ENDED',
  /** On Hold */
  OnHold = 'ON_HOLD',
  /** Pending Activation */
  PendingActivation = 'PENDING_ACTIVATION',
  /** Pending Completion */
  PendingCompletion = 'PENDING_COMPLETION'
}

/** A filter to be used against SubscriptionLifecycleStatus fields. All fields are combined with a logical ‘and.’ */
export type SubscriptionLifecycleStatusFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<SubscriptionLifecycleStatus>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<SubscriptionLifecycleStatus>>;
};

export type SubscriptionLifecycleStatusPayload = {
  __typename?: 'SubscriptionLifecycleStatusPayload';
  id: Scalars['UUID'];
  new_lifecycle_status?: Maybe<Scalars['String']>;
  old_lifecycle_status?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['String']>;
};

export type SubscriptionPlan = {
  __typename?: 'SubscriptionPlan';
  /** Reads and enables pagination through a set of `SubscriptionPlanClaimSet`. */
  claimSets: SubscriptionPlanClaimSetsConnection;
  coverImagePath?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  isActive: Scalars['Boolean'];
  /** Reads and enables pagination through a set of `PaymentPlan`. */
  paymentPlans: PaymentPlansConnection;
  /** Reads and enables pagination through a set of `SubscriptionPlanProviderConfig`. */
  providerConfigs: SubscriptionPlanProviderConfigsConnection;
  /** Reads and enables pagination through a set of `SubscriptionType`. */
  subscriptions: SubscriptionTypesConnection;
  title: Scalars['String'];
};


export type SubscriptionPlanClaimSetsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionPlanClaimSetCondition>;
  filter?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionPlanClaimSetsOrderBy>>;
};


export type SubscriptionPlanPaymentPlansArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<PaymentPlanCondition>;
  filter?: InputMaybe<PaymentPlanFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<PaymentPlansOrderBy>>;
};


export type SubscriptionPlanProviderConfigsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionPlanProviderConfigCondition>;
  filter?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionPlanProviderConfigsOrderBy>>;
};


export type SubscriptionPlanSubscriptionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTypeCondition>;
  filter?: InputMaybe<SubscriptionTypeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTypesOrderBy>>;
};

export type SubscriptionPlanClaimSet = {
  __typename?: 'SubscriptionPlanClaimSet';
  /** Reads a single `ClaimSet` that is related to this `SubscriptionPlanClaimSet`. */
  claimSet?: Maybe<ClaimSet>;
  claimSetKey: Scalars['String'];
  /** Reads a single `SubscriptionPlan` that is related to this `SubscriptionPlanClaimSet`. */
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  subscriptionPlanId: Scalars['UUID'];
};

/**
 * A condition to be used against `SubscriptionPlanClaimSet` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionPlanClaimSetCondition = {
  /** Checks for equality with the object’s `claimSetKey` field. */
  claimSetKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SubscriptionPlanClaimSet` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanClaimSetFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionPlanClaimSetFilter>>;
  /** Filter by the object’s `claimSet` relation. */
  claimSet?: InputMaybe<ClaimSetFilter>;
  /** Filter by the object’s `claimSetKey` field. */
  claimSetKey?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionPlanClaimSetFilter>>;
  /** Filter by the object’s `subscriptionPlan` relation. */
  subscriptionPlan?: InputMaybe<SubscriptionPlanFilter>;
  /** Filter by the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `SubscriptionPlanClaimSet` values. */
export type SubscriptionPlanClaimSetsConnection = {
  __typename?: 'SubscriptionPlanClaimSetsConnection';
  /** A list of edges which contains the `SubscriptionPlanClaimSet` and cursor to aid in pagination. */
  edges: Array<SubscriptionPlanClaimSetsEdge>;
  /** A list of `SubscriptionPlanClaimSet` objects. */
  nodes: Array<SubscriptionPlanClaimSet>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionPlanClaimSet` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionPlanClaimSet` edge in the connection. */
export type SubscriptionPlanClaimSetsEdge = {
  __typename?: 'SubscriptionPlanClaimSetsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionPlanClaimSet` at the end of the edge. */
  node: SubscriptionPlanClaimSet;
};

/** Methods to use when ordering `SubscriptionPlanClaimSet`. */
export enum SubscriptionPlanClaimSetsOrderBy {
  ClaimSetKeyAsc = 'CLAIM_SET_KEY_ASC',
  ClaimSetKeyDesc = 'CLAIM_SET_KEY_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionPlanIdAsc = 'SUBSCRIPTION_PLAN_ID_ASC',
  SubscriptionPlanIdDesc = 'SUBSCRIPTION_PLAN_ID_DESC'
}

/**
 * A condition to be used against `SubscriptionPlan` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionPlanCondition = {
  /** Checks for equality with the object’s `coverImagePath` field. */
  coverImagePath?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `isActive` field. */
  isActive?: InputMaybe<Scalars['Boolean']>;
  /** Checks for equality with the object’s `title` field. */
  title?: InputMaybe<Scalars['String']>;
};

/** A filter to be used against `SubscriptionPlan` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionPlanFilter>>;
  /** Filter by the object’s `claimSets` relation. */
  claimSets?: InputMaybe<SubscriptionPlanToManySubscriptionPlanClaimSetFilter>;
  /** Some related `claimSets` exist. */
  claimSetsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `coverImagePath` field. */
  coverImagePath?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `isActive` field. */
  isActive?: InputMaybe<BooleanFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionPlanFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionPlanFilter>>;
  /** Filter by the object’s `paymentPlans` relation. */
  paymentPlans?: InputMaybe<SubscriptionPlanToManyPaymentPlanFilter>;
  /** Some related `paymentPlans` exist. */
  paymentPlansExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `providerConfigs` relation. */
  providerConfigs?: InputMaybe<SubscriptionPlanToManySubscriptionPlanProviderConfigFilter>;
  /** Some related `providerConfigs` exist. */
  providerConfigsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptions` relation. */
  subscriptions?: InputMaybe<SubscriptionPlanToManySubscriptionTypeFilter>;
  /** Some related `subscriptions` exist. */
  subscriptionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `title` field. */
  title?: InputMaybe<StringFilter>;
};

export type SubscriptionPlanProviderConfig = {
  __typename?: 'SubscriptionPlanProviderConfig';
  externalId?: Maybe<Scalars['String']>;
  /** Reads a single `PaymentProvider` that is related to this `SubscriptionPlanProviderConfig`. */
  paymentProvider?: Maybe<PaymentProvider>;
  paymentProviderKey: Scalars['String'];
  /** Reads a single `SubscriptionPlan` that is related to this `SubscriptionPlanProviderConfig`. */
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  subscriptionPlanId: Scalars['UUID'];
};

/**
 * A condition to be used against `SubscriptionPlanProviderConfig` object types.
 * All fields are tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionPlanProviderConfigCondition = {
  /** Checks for equality with the object’s `externalId` field. */
  externalId?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SubscriptionPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanProviderConfigFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionPlanProviderConfigFilter>>;
  /** Filter by the object’s `externalId` field. */
  externalId?: InputMaybe<StringFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionPlanProviderConfigFilter>>;
  /** Filter by the object’s `paymentProvider` relation. */
  paymentProvider?: InputMaybe<PaymentProviderFilter>;
  /** Filter by the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `subscriptionPlan` relation. */
  subscriptionPlan?: InputMaybe<SubscriptionPlanFilter>;
  /** Filter by the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `SubscriptionPlanProviderConfig` values. */
export type SubscriptionPlanProviderConfigsConnection = {
  __typename?: 'SubscriptionPlanProviderConfigsConnection';
  /** A list of edges which contains the `SubscriptionPlanProviderConfig` and cursor to aid in pagination. */
  edges: Array<SubscriptionPlanProviderConfigsEdge>;
  /** A list of `SubscriptionPlanProviderConfig` objects. */
  nodes: Array<SubscriptionPlanProviderConfig>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionPlanProviderConfig` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionPlanProviderConfig` edge in the connection. */
export type SubscriptionPlanProviderConfigsEdge = {
  __typename?: 'SubscriptionPlanProviderConfigsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionPlanProviderConfig` at the end of the edge. */
  node: SubscriptionPlanProviderConfig;
};

/** Methods to use when ordering `SubscriptionPlanProviderConfig`. */
export enum SubscriptionPlanProviderConfigsOrderBy {
  ExternalIdAsc = 'EXTERNAL_ID_ASC',
  ExternalIdDesc = 'EXTERNAL_ID_DESC',
  Natural = 'NATURAL',
  PaymentProviderKeyAsc = 'PAYMENT_PROVIDER_KEY_ASC',
  PaymentProviderKeyDesc = 'PAYMENT_PROVIDER_KEY_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionPlanIdAsc = 'SUBSCRIPTION_PLAN_ID_ASC',
  SubscriptionPlanIdDesc = 'SUBSCRIPTION_PLAN_ID_DESC'
}

/** A filter to be used against many `PaymentPlan` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanToManyPaymentPlanFilter = {
  /** Every related `PaymentPlan` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<PaymentPlanFilter>;
  /** No related `PaymentPlan` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<PaymentPlanFilter>;
  /** Some related `PaymentPlan` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<PaymentPlanFilter>;
};

/** A filter to be used against many `SubscriptionPlanClaimSet` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanToManySubscriptionPlanClaimSetFilter = {
  /** Every related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  /** No related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionPlanClaimSetFilter>;
  /** Some related `SubscriptionPlanClaimSet` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionPlanClaimSetFilter>;
};

/** A filter to be used against many `SubscriptionPlanProviderConfig` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanToManySubscriptionPlanProviderConfigFilter = {
  /** Every related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  /** No related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
  /** Some related `SubscriptionPlanProviderConfig` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionPlanProviderConfigFilter>;
};

/** A filter to be used against many `SubscriptionType` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionPlanToManySubscriptionTypeFilter = {
  /** Every related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionTypeFilter>;
  /** No related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionTypeFilter>;
  /** Some related `SubscriptionType` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionTypeFilter>;
};

/** A connection to a list of `SubscriptionPlan` values. */
export type SubscriptionPlansConnection = {
  __typename?: 'SubscriptionPlansConnection';
  /** A list of edges which contains the `SubscriptionPlan` and cursor to aid in pagination. */
  edges: Array<SubscriptionPlansEdge>;
  /** A list of `SubscriptionPlan` objects. */
  nodes: Array<SubscriptionPlan>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionPlan` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionPlan` edge in the connection. */
export type SubscriptionPlansEdge = {
  __typename?: 'SubscriptionPlansEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionPlan` at the end of the edge. */
  node: SubscriptionPlan;
};

/** Methods to use when ordering `SubscriptionPlan`. */
export enum SubscriptionPlansOrderBy {
  CoverImagePathAsc = 'COVER_IMAGE_PATH_ASC',
  CoverImagePathDesc = 'COVER_IMAGE_PATH_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  IsActiveAsc = 'IS_ACTIVE_ASC',
  IsActiveDesc = 'IS_ACTIVE_DESC',
  Natural = 'NATURAL',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  TitleAsc = 'TITLE_ASC',
  TitleDesc = 'TITLE_DESC'
}

export type SubscriptionStatusChange = {
  __typename?: 'SubscriptionStatusChange';
  createdDate: Scalars['Datetime'];
  id: Scalars['UUID'];
  newLifecycleStatus: SubscriptionLifecycleStatus;
  /** Reads a single `SubscriptionType` that is related to this `SubscriptionStatusChange`. */
  subscription?: Maybe<SubscriptionType>;
  subscriptionId: Scalars['UUID'];
  updatedDate: Scalars['Datetime'];
  userId: Scalars['UUID'];
};

/**
 * A condition to be used against `SubscriptionStatusChange` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionStatusChangeCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `newLifecycleStatus` field. */
  newLifecycleStatus?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SubscriptionStatusChange` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionStatusChangeFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionStatusChangeFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `newLifecycleStatus` field. */
  newLifecycleStatus?: InputMaybe<SubscriptionLifecycleStatusFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionStatusChangeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionStatusChangeFilter>>;
  /** Filter by the object’s `subscription` relation. */
  subscription?: InputMaybe<SubscriptionTypeFilter>;
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `SubscriptionStatusChange` values. */
export type SubscriptionStatusChangesConnection = {
  __typename?: 'SubscriptionStatusChangesConnection';
  /** A list of edges which contains the `SubscriptionStatusChange` and cursor to aid in pagination. */
  edges: Array<SubscriptionStatusChangesEdge>;
  /** A list of `SubscriptionStatusChange` objects. */
  nodes: Array<SubscriptionStatusChange>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionStatusChange` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionStatusChange` edge in the connection. */
export type SubscriptionStatusChangesEdge = {
  __typename?: 'SubscriptionStatusChangesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionStatusChange` at the end of the edge. */
  node: SubscriptionStatusChange;
};

/** Methods to use when ordering `SubscriptionStatusChange`. */
export enum SubscriptionStatusChangesOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  NewLifecycleStatusAsc = 'NEW_LIFECYCLE_STATUS_ASC',
  NewLifecycleStatusDesc = 'NEW_LIFECYCLE_STATUS_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionIdAsc = 'SUBSCRIPTION_ID_ASC',
  SubscriptionIdDesc = 'SUBSCRIPTION_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type SubscriptionTransaction = {
  __typename?: 'SubscriptionTransaction';
  createdDate: Scalars['Datetime'];
  currency?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['UUID'];
  /** Reads a single `PaymentProvider` that is related to this `SubscriptionTransaction`. */
  paymentProvider?: Maybe<PaymentProvider>;
  paymentProviderKey: Scalars['String'];
  paymentProviderReference?: Maybe<Scalars['String']>;
  periodEndDate?: Maybe<Scalars['Datetime']>;
  /** Reads a single `SubscriptionType` that is related to this `SubscriptionTransaction`. */
  subscription?: Maybe<SubscriptionType>;
  subscriptionId: Scalars['UUID'];
  totalPrice?: Maybe<Scalars['BigFloat']>;
  transactionDate?: Maybe<Scalars['Datetime']>;
  transactionType: TransactionType;
  updatedDate: Scalars['Datetime'];
  userId: Scalars['UUID'];
};

/**
 * A condition to be used against `SubscriptionTransaction` object types. All
 * fields are tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionTransactionCondition = {
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `currency` field. */
  currency?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `description` field. */
  description?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `paymentProviderReference` field. */
  paymentProviderReference?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `periodEndDate` field. */
  periodEndDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `totalPrice` field. */
  totalPrice?: InputMaybe<Scalars['BigFloat']>;
  /** Checks for equality with the object’s `transactionDate` field. */
  transactionDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `transactionType` field. */
  transactionType?: InputMaybe<TransactionType>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SubscriptionTransaction` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionTransactionFilter = {
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionTransactionFilter>>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `currency` field. */
  currency?: InputMaybe<StringFilter>;
  /** Filter by the object’s `description` field. */
  description?: InputMaybe<StringFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionTransactionFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionTransactionFilter>>;
  /** Filter by the object’s `paymentProvider` relation. */
  paymentProvider?: InputMaybe<PaymentProviderFilter>;
  /** Filter by the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `paymentProviderReference` field. */
  paymentProviderReference?: InputMaybe<StringFilter>;
  /** Filter by the object’s `periodEndDate` field. */
  periodEndDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `subscription` relation. */
  subscription?: InputMaybe<SubscriptionTypeFilter>;
  /** Filter by the object’s `subscriptionId` field. */
  subscriptionId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `totalPrice` field. */
  totalPrice?: InputMaybe<BigFloatFilter>;
  /** Filter by the object’s `transactionDate` field. */
  transactionDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `transactionType` field. */
  transactionType?: InputMaybe<TransactionTypeFilter>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** A connection to a list of `SubscriptionTransaction` values. */
export type SubscriptionTransactionsConnection = {
  __typename?: 'SubscriptionTransactionsConnection';
  /** A list of edges which contains the `SubscriptionTransaction` and cursor to aid in pagination. */
  edges: Array<SubscriptionTransactionsEdge>;
  /** A list of `SubscriptionTransaction` objects. */
  nodes: Array<SubscriptionTransaction>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionTransaction` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionTransaction` edge in the connection. */
export type SubscriptionTransactionsEdge = {
  __typename?: 'SubscriptionTransactionsEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionTransaction` at the end of the edge. */
  node: SubscriptionTransaction;
};

/** Methods to use when ordering `SubscriptionTransaction`. */
export enum SubscriptionTransactionsOrderBy {
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  CurrencyAsc = 'CURRENCY_ASC',
  CurrencyDesc = 'CURRENCY_DESC',
  DescriptionAsc = 'DESCRIPTION_ASC',
  DescriptionDesc = 'DESCRIPTION_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  Natural = 'NATURAL',
  PaymentProviderKeyAsc = 'PAYMENT_PROVIDER_KEY_ASC',
  PaymentProviderKeyDesc = 'PAYMENT_PROVIDER_KEY_DESC',
  PaymentProviderReferenceAsc = 'PAYMENT_PROVIDER_REFERENCE_ASC',
  PaymentProviderReferenceDesc = 'PAYMENT_PROVIDER_REFERENCE_DESC',
  PeriodEndDateAsc = 'PERIOD_END_DATE_ASC',
  PeriodEndDateDesc = 'PERIOD_END_DATE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionIdAsc = 'SUBSCRIPTION_ID_ASC',
  SubscriptionIdDesc = 'SUBSCRIPTION_ID_DESC',
  TotalPriceAsc = 'TOTAL_PRICE_ASC',
  TotalPriceDesc = 'TOTAL_PRICE_DESC',
  TransactionDateAsc = 'TRANSACTION_DATE_ASC',
  TransactionDateDesc = 'TRANSACTION_DATE_DESC',
  TransactionTypeAsc = 'TRANSACTION_TYPE_ASC',
  TransactionTypeDesc = 'TRANSACTION_TYPE_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export type SubscriptionType = {
  __typename?: 'SubscriptionType';
  activationDate?: Maybe<Scalars['Datetime']>;
  country?: Maybe<Iso31661Alpha2>;
  createdDate: Scalars['Datetime'];
  id: Scalars['UUID'];
  lifecycleStatus: SubscriptionLifecycleStatus;
  /** Reads a single `PaymentPlan` that is related to this `SubscriptionType`. */
  paymentPlan?: Maybe<PaymentPlan>;
  paymentPlanId: Scalars['UUID'];
  /** Reads a single `PaymentProvider` that is related to this `SubscriptionType`. */
  paymentProvider?: Maybe<PaymentProvider>;
  paymentProviderKey: Scalars['String'];
  paymentProviderReference?: Maybe<Scalars['String']>;
  periodEndDate?: Maybe<Scalars['Datetime']>;
  /** Reads a single `SubscriptionPlan` that is related to this `SubscriptionType`. */
  subscriptionPlan?: Maybe<SubscriptionPlan>;
  subscriptionPlanId: Scalars['UUID'];
  /** Reads and enables pagination through a set of `SubscriptionStatusChange`. */
  subscriptionStatusChanges: SubscriptionStatusChangesConnection;
  /** Reads and enables pagination through a set of `SubscriptionTransaction`. */
  subscriptionTransactions: SubscriptionTransactionsConnection;
  updatedDate: Scalars['Datetime'];
  userId: Scalars['UUID'];
};


export type SubscriptionTypeSubscriptionStatusChangesArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionStatusChangeCondition>;
  filter?: InputMaybe<SubscriptionStatusChangeFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionStatusChangesOrderBy>>;
};


export type SubscriptionTypeSubscriptionTransactionsArgs = {
  after?: InputMaybe<Scalars['Cursor']>;
  before?: InputMaybe<Scalars['Cursor']>;
  condition?: InputMaybe<SubscriptionTransactionCondition>;
  filter?: InputMaybe<SubscriptionTransactionFilter>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  orderBy?: InputMaybe<Array<SubscriptionTransactionsOrderBy>>;
};

/**
 * A condition to be used against `SubscriptionType` object types. All fields are
 * tested for equality and combined with a logical ‘and.’
 */
export type SubscriptionTypeCondition = {
  /** Checks for equality with the object’s `activationDate` field. */
  activationDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `country` field. */
  country?: InputMaybe<Iso31661Alpha2>;
  /** Checks for equality with the object’s `createdDate` field. */
  createdDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `id` field. */
  id?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `lifecycleStatus` field. */
  lifecycleStatus?: InputMaybe<SubscriptionLifecycleStatus>;
  /** Checks for equality with the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `paymentProviderReference` field. */
  paymentProviderReference?: InputMaybe<Scalars['String']>;
  /** Checks for equality with the object’s `periodEndDate` field. */
  periodEndDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<Scalars['UUID']>;
  /** Checks for equality with the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<Scalars['Datetime']>;
  /** Checks for equality with the object’s `userId` field. */
  userId?: InputMaybe<Scalars['UUID']>;
};

/** A filter to be used against `SubscriptionType` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionTypeFilter = {
  /** Filter by the object’s `activationDate` field. */
  activationDate?: InputMaybe<DatetimeFilter>;
  /** Checks for all expressions in this list. */
  and?: InputMaybe<Array<SubscriptionTypeFilter>>;
  /** Filter by the object’s `country` field. */
  country?: InputMaybe<Iso31661Alpha2Filter>;
  /** Filter by the object’s `createdDate` field. */
  createdDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `id` field. */
  id?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `lifecycleStatus` field. */
  lifecycleStatus?: InputMaybe<SubscriptionLifecycleStatusFilter>;
  /** Negates the expression. */
  not?: InputMaybe<SubscriptionTypeFilter>;
  /** Checks for any expressions in this list. */
  or?: InputMaybe<Array<SubscriptionTypeFilter>>;
  /** Filter by the object’s `paymentPlan` relation. */
  paymentPlan?: InputMaybe<PaymentPlanFilter>;
  /** Filter by the object’s `paymentPlanId` field. */
  paymentPlanId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `paymentProvider` relation. */
  paymentProvider?: InputMaybe<PaymentProviderFilter>;
  /** Filter by the object’s `paymentProviderKey` field. */
  paymentProviderKey?: InputMaybe<StringFilter>;
  /** Filter by the object’s `paymentProviderReference` field. */
  paymentProviderReference?: InputMaybe<StringFilter>;
  /** Filter by the object’s `periodEndDate` field. */
  periodEndDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `subscriptionPlan` relation. */
  subscriptionPlan?: InputMaybe<SubscriptionPlanFilter>;
  /** Filter by the object’s `subscriptionPlanId` field. */
  subscriptionPlanId?: InputMaybe<UuidFilter>;
  /** Filter by the object’s `subscriptionStatusChanges` relation. */
  subscriptionStatusChanges?: InputMaybe<SubscriptionTypeToManySubscriptionStatusChangeFilter>;
  /** Some related `subscriptionStatusChanges` exist. */
  subscriptionStatusChangesExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `subscriptionTransactions` relation. */
  subscriptionTransactions?: InputMaybe<SubscriptionTypeToManySubscriptionTransactionFilter>;
  /** Some related `subscriptionTransactions` exist. */
  subscriptionTransactionsExist?: InputMaybe<Scalars['Boolean']>;
  /** Filter by the object’s `updatedDate` field. */
  updatedDate?: InputMaybe<DatetimeFilter>;
  /** Filter by the object’s `userId` field. */
  userId?: InputMaybe<UuidFilter>;
};

/** A filter to be used against many `SubscriptionStatusChange` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionTypeToManySubscriptionStatusChangeFilter = {
  /** Every related `SubscriptionStatusChange` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionStatusChangeFilter>;
  /** No related `SubscriptionStatusChange` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionStatusChangeFilter>;
  /** Some related `SubscriptionStatusChange` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionStatusChangeFilter>;
};

/** A filter to be used against many `SubscriptionTransaction` object types. All fields are combined with a logical ‘and.’ */
export type SubscriptionTypeToManySubscriptionTransactionFilter = {
  /** Every related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  every?: InputMaybe<SubscriptionTransactionFilter>;
  /** No related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  none?: InputMaybe<SubscriptionTransactionFilter>;
  /** Some related `SubscriptionTransaction` matches the filter criteria. All fields are combined with a logical ‘and.’ */
  some?: InputMaybe<SubscriptionTransactionFilter>;
};

/** A connection to a list of `SubscriptionType` values. */
export type SubscriptionTypesConnection = {
  __typename?: 'SubscriptionTypesConnection';
  /** A list of edges which contains the `SubscriptionType` and cursor to aid in pagination. */
  edges: Array<SubscriptionTypesEdge>;
  /** A list of `SubscriptionType` objects. */
  nodes: Array<SubscriptionType>;
  /** Information to aid in pagination. */
  pageInfo: PageInfo;
  /** The count of *all* `SubscriptionType` you could get from the connection. */
  totalCount: Scalars['Int'];
};

/** A `SubscriptionType` edge in the connection. */
export type SubscriptionTypesEdge = {
  __typename?: 'SubscriptionTypesEdge';
  /** A cursor for use in pagination. */
  cursor?: Maybe<Scalars['Cursor']>;
  /** The `SubscriptionType` at the end of the edge. */
  node: SubscriptionType;
};

/** Methods to use when ordering `SubscriptionType`. */
export enum SubscriptionTypesOrderBy {
  ActivationDateAsc = 'ACTIVATION_DATE_ASC',
  ActivationDateDesc = 'ACTIVATION_DATE_DESC',
  CountryAsc = 'COUNTRY_ASC',
  CountryDesc = 'COUNTRY_DESC',
  CreatedDateAsc = 'CREATED_DATE_ASC',
  CreatedDateDesc = 'CREATED_DATE_DESC',
  IdAsc = 'ID_ASC',
  IdDesc = 'ID_DESC',
  LifecycleStatusAsc = 'LIFECYCLE_STATUS_ASC',
  LifecycleStatusDesc = 'LIFECYCLE_STATUS_DESC',
  Natural = 'NATURAL',
  PaymentPlanIdAsc = 'PAYMENT_PLAN_ID_ASC',
  PaymentPlanIdDesc = 'PAYMENT_PLAN_ID_DESC',
  PaymentProviderKeyAsc = 'PAYMENT_PROVIDER_KEY_ASC',
  PaymentProviderKeyDesc = 'PAYMENT_PROVIDER_KEY_DESC',
  PaymentProviderReferenceAsc = 'PAYMENT_PROVIDER_REFERENCE_ASC',
  PaymentProviderReferenceDesc = 'PAYMENT_PROVIDER_REFERENCE_DESC',
  PeriodEndDateAsc = 'PERIOD_END_DATE_ASC',
  PeriodEndDateDesc = 'PERIOD_END_DATE_DESC',
  PrimaryKeyAsc = 'PRIMARY_KEY_ASC',
  PrimaryKeyDesc = 'PRIMARY_KEY_DESC',
  SubscriptionPlanIdAsc = 'SUBSCRIPTION_PLAN_ID_ASC',
  SubscriptionPlanIdDesc = 'SUBSCRIPTION_PLAN_ID_DESC',
  UpdatedDateAsc = 'UPDATED_DATE_ASC',
  UpdatedDateDesc = 'UPDATED_DATE_DESC',
  UserIdAsc = 'USER_ID_ASC',
  UserIdDesc = 'USER_ID_DESC'
}

export enum TransactionType {
  /** Payment */
  Payment = 'PAYMENT',
  /** Payment Failed */
  PaymentFailed = 'PAYMENT_FAILED',
  /** Refund */
  Refund = 'REFUND'
}

/** A filter to be used against TransactionType fields. All fields are combined with a logical ‘and.’ */
export type TransactionTypeFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<TransactionType>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<TransactionType>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<TransactionType>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<TransactionType>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<TransactionType>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<TransactionType>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<TransactionType>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<TransactionType>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<TransactionType>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<TransactionType>>;
};

/** A filter to be used against UUID fields. All fields are combined with a logical ‘and.’ */
export type UuidFilter = {
  /** Not equal to the specified value, treating null like an ordinary value. */
  distinctFrom?: InputMaybe<Scalars['UUID']>;
  /** Equal to the specified value. */
  equalTo?: InputMaybe<Scalars['UUID']>;
  /** Greater than the specified value. */
  greaterThan?: InputMaybe<Scalars['UUID']>;
  /** Greater than or equal to the specified value. */
  greaterThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Included in the specified list. */
  in?: InputMaybe<Array<Scalars['UUID']>>;
  /** Is null (if `true` is specified) or is not null (if `false` is specified). */
  isNull?: InputMaybe<Scalars['Boolean']>;
  /** Less than the specified value. */
  lessThan?: InputMaybe<Scalars['UUID']>;
  /** Less than or equal to the specified value. */
  lessThanOrEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Equal to the specified value, treating null like an ordinary value. */
  notDistinctFrom?: InputMaybe<Scalars['UUID']>;
  /** Not equal to the specified value. */
  notEqualTo?: InputMaybe<Scalars['UUID']>;
  /** Not included in the specified list. */
  notIn?: InputMaybe<Array<Scalars['UUID']>>;
};

export type GetActiveSubscriptionQueryVariables = Exact<{
  now: Scalars['Datetime'];
}>;


export type GetActiveSubscriptionQuery = { __typename?: 'Query', subscriptions?: { __typename?: 'SubscriptionTypesConnection', nodes: Array<{ __typename?: 'SubscriptionType', subscriptionPlanId: any }> } | null };


export const GetActiveSubscriptionDocument = gql`
    query GetActiveSubscription($now: Datetime!) {
  subscriptions(
    filter: {lifecycleStatus: {in: [ACTIVE, CANCELLED, ON_HOLD]}, periodEndDate: {greaterThan: $now}}
    orderBy: LIFECYCLE_STATUS_ASC
    first: 1
  ) {
    nodes {
      subscriptionPlanId
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();
const GetActiveSubscriptionDocumentString = print(GetActiveSubscriptionDocument);
export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetActiveSubscription(variables: GetActiveSubscriptionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<{ data: GetActiveSubscriptionQuery; extensions?: any; headers: Dom.Headers; status: number; }> {
        return withWrapper((wrappedRequestHeaders) => client.rawRequest<GetActiveSubscriptionQuery>(GetActiveSubscriptionDocumentString, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetActiveSubscription', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;