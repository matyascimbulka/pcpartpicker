export const ACTOR_STATE = 'ACTOR_STATE';

export const LABELS = {
    CATEGORY_SEARCH: 'SEARCH_RESULTS',
    GLOBAL_SEARCH: 'GLOBAL_SEARCH',
    PRODUCT_PAGE: 'PRODUCT_PAGE',
    PRODUCT_REVIEWS: 'PRODUCT_REVIEWS',
} as const;
export type Label = (typeof LABELS)[keyof typeof LABELS]

export const AVAILABLE_COUNTRY_CODES = [
    'au',
    'at',
    'be',
    'ca',
    'cz',
    'dk',
    'fi',
    'fr',
    'de',
    'hu',
    'ie',
    'it',
    'nl',
    'nz',
    'no',
    'pt',
    'ro',
    'sa',
    'sk',
    'es',
    'se',
    'uk',
    'us',
];
