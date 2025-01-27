import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS } from '../consts.js';
import { parsePageNumbers } from '../utils/pagination.js';
import type { SearchUserData } from '../interfaces.js';

export const handleSearchResults = async ({ request, page, log, parseWithCheerio, enqueueLinks, addRequests }: PlaywrightCrawlingContext<SearchUserData>) => {
    const { searchPhrase, category, maxReviews } = request.userData;

    await page.waitForSelector('tr[class*="product"]');

    if (searchPhrase) {
        const responsePromise = page.waitForResponse((responseRequest) => responseRequest.url().includes('/qapi/product/category'));

        const locator = page.locator('form[class*="search--products"] input');
        await locator.fill(searchPhrase);
        await locator.press('Enter');

        await responsePromise;
    }

    const $ = await parseWithCheerio();

    await enqueueLinks({
        selector: 'tbody[id*="content"] td[class*="name"] a',
        label: LABELS.PRODUCT_PAGE,
        userData: {
            maxReviews,
        },
    });

    const [currentPageNumber, lastPageNumber] = parsePageNumbers($);

    if (lastPageNumber > currentPageNumber) {
        const nextPageUrl = `https://pcpartpicker.com/products/${category}/#page=${currentPageNumber + 1}`;

        await addRequests([{
            url: nextPageUrl,
            uniqueKey: nextPageUrl,
            label: LABELS.SEARCH_RESULTS,
            userData: request.userData,
        }]);
    }

    log.info(`Search phrase: ${!searchPhrase ? '< N/A >' : searchPhrase}, `
        + `Category: ${category}, `
        + `Current page: ${currentPageNumber}, `
        + `Total pages: ${lastPageNumber}`, {
        url: request.url,
    });
};
