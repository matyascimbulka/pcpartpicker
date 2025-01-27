import { createPlaywrightRouter } from 'crawlee';

import { LABELS } from './consts.js';
import { handleProductPage } from './routes/product-page.js';
import { handleSearchResults } from './routes/search-result.js';
import { handleProductReviews } from './routes/product-reviews.js';
import type { ProductUserData, ReviewsUserData, SearchUserData } from './interfaces.js';

export const router = createPlaywrightRouter();

router.addHandler<SearchUserData>(LABELS.SEARCH_RESULTS, handleSearchResults);
router.addHandler<ProductUserData>(LABELS.PRODUCT_PAGE, handleProductPage);
router.addHandler<ReviewsUserData>(LABELS.PRODUCT_REVIEWS, handleProductReviews);
