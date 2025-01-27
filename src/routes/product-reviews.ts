import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS, MAX_REVIEWS_PER_PAGE } from '../consts.js';
import { ReviewsUserData } from '../interfaces.js';
import { parseReviews } from '../utils/reviews.js';
import { parsePageNumbers } from '../utils/pagination.js';
import { saveProduct } from '../utils/product.js';

const handleProductReviews = async ({ request, page, log, parseWithCheerio, addRequests }: PlaywrightCrawlingContext<ReviewsUserData>) => {
    const { product, maxReviews } = request.userData;

    await page.waitForLoadState('load');
    const $ = await parseWithCheerio();

    if (!product.reviews) product.reviews = [];

    const limit = !maxReviews ? MAX_REVIEWS_PER_PAGE : maxReviews - product.reviews.length;

    const scrapedReviews = parseReviews($, limit);
    product.reviews = product.reviews.concat(scrapedReviews);

    const [currentPageNumber, lastPageNumber] = parsePageNumbers($);
    const canContinue = (!maxReviews || maxReviews > product.reviews.length) && (lastPageNumber > currentPageNumber);

    if (canContinue) {
        await addRequests([{
            url: `https://pcpartpicker.com/product/${product.id}/reviews/?page=${currentPageNumber + 1}`,
            label: LABELS.PRODUCT_REVIEWS,
            userData: request.userData,
        }], { forefront: true });
    } else {
        await saveProduct(product);
    }

    log.info(`Scraped ${scrapedReviews.length} reviews (${product.reviews.length} in total) for ${product.name}`, { url: request.url });
};

export default handleProductReviews;
