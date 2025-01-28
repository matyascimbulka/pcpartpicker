import { createPlaywrightRouter } from 'crawlee';

import { LABELS } from './consts.js';
import { handleProductPage } from './routes/product-page.js';
import { handleCategorySearch } from './routes/category-search.js';
import { handleProductReviews } from './routes/product-reviews.js';
import { handleGlobalSearch } from './routes/global-search.js';
import type { ProductUserData, ReviewsUserData, SearchUserData } from './interfaces.js';

export const router = createPlaywrightRouter();

router.addHandler<SearchUserData>(LABELS.CATEGORY_SEARCH, handleCategorySearch);
router.addHandler<SearchUserData>(LABELS.GLOBAL_SEARCH, handleGlobalSearch);
router.addHandler<ProductUserData>(LABELS.PRODUCT_PAGE, handleProductPage);
router.addHandler<ReviewsUserData>(LABELS.PRODUCT_REVIEWS, handleProductReviews);
