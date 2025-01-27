export const MAX_REVIEWS_PER_PAGE = 10;
export const ACTOR_STATE = 'ACTOR_STATE';

export const LABELS = {
    SEARCH_RESULTS: 'SEARCH_RESULTS',
    PRODUCT_PAGE: 'PRODUCT_PAGE',
    PRODUCT_REVIEWS: 'PRODUCT_REVIEWS',
} as const;
export type Label = (typeof LABELS)[keyof typeof LABELS]
