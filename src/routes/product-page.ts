import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS, MAX_REVIEWS_PER_PAGE } from '../consts.js';
import { ProductUserData } from '../interfaces.js';
import { parsePrices, parseProduct, parseRatings, parseSpecs, saveProduct } from '../utils/product.js';
import { parseReviews } from '../utils/reviews.js';

const handleProductPage = async ({ page, request, log, parseWithCheerio, addRequests }: PlaywrightCrawlingContext<ProductUserData>) => {
    await page.waitForLoadState('load');
    const $ = await parseWithCheerio();

    const { url } = request;

    const product = parseProduct($, url);
    product.prices = parsePrices($);
    product.ratings = parseRatings($);
    product.specifications = parseSpecs($);

    const { maxReviews } = request.userData;

    if (maxReviews && maxReviews > 0) {
        product.reviews = parseReviews($, maxReviews);

        if (product.reviews.length < maxReviews && product.reviews.length === MAX_REVIEWS_PER_PAGE) {
            await addRequests([{
                url: `https://pcpartpicker.com/product/${product.id}/reviews/?page=2`,
                label: LABELS.PRODUCT_REVIEWS,
                userData: {
                    ...request.userData,
                    product,
                },
            }], { forefront: true });

            log.info(`Scraped product page for ${product.name}`, { url: product.url });
            return;
        }
    }

    log.info(`Scraped product page for ${product.name}`, { url: product.url });
    await saveProduct(product);
};

export default handleProductPage;
