export const ACTOR_STATE = 'ACTOR_STATE';

export const LABELS = {
    CATEGORY_SEARCH: 'SEARCH_RESULTS',
    GLOBAL_SEARCH: 'GLOBAL_SEARCH',
    PRODUCT_PAGE: 'PRODUCT_PAGE',
    PRODUCT_REVIEWS: 'PRODUCT_REVIEWS',
} as const;
export type Label = (typeof LABELS)[keyof typeof LABELS]
