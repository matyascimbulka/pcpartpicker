import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS } from '../consts.js';
import { parsePrices, parseProduct, parseRatings, parseSpecs, saveProduct } from '../utils/product.js';
import { parseReviews } from '../utils/reviews.js';
import type { ProductUserData } from '../interfaces.js';

export const handleProductPage = async ({ page, request, log, crawler, parseWithCheerio, addRequests }: PlaywrightCrawlingContext<ProductUserData>) => {
    await page.waitForLoadState('load');
    const $ = await parseWithCheerio();

    const product = parseProduct($, request.url);
    product.prices = parsePrices($);
    product.ratings = parseRatings($);
    product.specifications = parseSpecs($);

    const { maxReviews } = request.userData;

    if (maxReviews && maxReviews > 0) {
        product.reviews = parseReviews($, maxReviews);

        if (product.reviews.length < maxReviews) {
            await addRequests([{
                url: `https://pcpartpicker.com/product/${product.id}/reviews/?page=2`,
                label: LABELS.PRODUCT_REVIEWS,
                userData: {
                    ...request.userData,
                    product,
                },
            }], { forefront: true });

            log.info(`Scraped product information and ${product.reviews.length} reviews `
                + `for ${product.name}, enqueueing next review page`, {
                url: product.url,
            });
            return;
        }
    }

    log.info(`Scraped product information for ${product.name}, pushing to dataset`, { url: product.url });
    const shouldExit = await saveProduct(product);

    if (shouldExit) await crawler.stop();
};
