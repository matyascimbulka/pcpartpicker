import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS } from '../consts.js';
import { parseReviews } from '../utils/reviews.js';
import { parsePageNumbers } from '../utils/pagination.js';
import { saveProduct } from '../utils/product.js';
import type { ReviewsUserData } from '../interfaces.js';

export const handleProductReviews = async ({ request, page, log, crawler, parseWithCheerio, addRequests }: PlaywrightCrawlingContext<ReviewsUserData>) => {
    const { product, maxReviews } = request.userData;

    await page.waitForLoadState('load');
    const $ = await parseWithCheerio();

    if (!product.reviews) product.reviews = [];

    const limit = !maxReviews ? null : maxReviews - product.reviews.length;

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
        log.info(`Scraped ${scrapedReviews.length} reviews (${product.reviews.length} in total) `
            + `for ${product.name}, pushing to dataset`, { url: request.url });

        const shouldExit = await saveProduct(product);

        if (shouldExit) await crawler.stop();
    }

    log.info(`Scraped ${scrapedReviews.length} reviews (${product.reviews.length} in total) `
        + `for ${product.name}, enqueueing next review page`, { url: request.url });
};
