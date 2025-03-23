import { PlaywrightCrawlingContext } from 'crawlee';

import { LABELS } from '../consts.js';
import { parsePageNumbers } from '../utils/pagination.js';
import type { SearchUserData } from '../interfaces.js';

export const handleCategorySearch = async ({
    request,
    page,
    log,
    parseWithCheerio,
    enqueueLinks,
    addRequests,
}: PlaywrightCrawlingContext<SearchUserData>) => {
    const { searchPhrase, category, maxReviews } = request.userData;

    await page.waitForSelector('tr[data-pb-id]');

    if (searchPhrase) {
        const responsePromise = page.waitForResponse((responseRequest) => responseRequest.url().includes('/qapi/product/category'));

        const locator = page.locator('form[class*="search--products"] input');
        await locator.fill(searchPhrase);
        await locator.press('Enter');

        await responsePromise;
    }

    const $ = await parseWithCheerio();

    if ($('div.main-content').length === 0) {
        throw new Error('No longer on the search page');
    }

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
            label: LABELS.CATEGORY_SEARCH,
            userData: request.userData,
        }]);
    }

    log.info(`Searching category ${category} `
        + `${searchPhrase ? `for ${searchPhrase} ` : ''} `
        + `Current page: ${currentPageNumber}, `
        + `Total pages: ${lastPageNumber}`, {
        url: request.url,
    });
};
