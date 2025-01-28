import { PlaywrightCrawlingContext } from 'crawlee';

import type { SearchUserData } from '../interfaces.js';
import { LABELS } from '../consts.js';
import { parsePageNumbers } from '../utils/pagination.js';

export const handleGlobalSearch = async ({ page, request, log, parseWithCheerio, enqueueLinks, addRequests }: PlaywrightCrawlingContext<SearchUserData>) => {
    const { searchPhrase, maxReviews } = request.userData;

    await page.waitForLoadState('load');
    const $ = await parseWithCheerio();

    await enqueueLinks({
        selector: 'li p[class*="link"] a',
        label: LABELS.PRODUCT_PAGE,
        userData: {
            maxReviews,
        },
    });

    const [currentPageNumber, lastPageNumber] = parsePageNumbers($);

    if (lastPageNumber > currentPageNumber) {
        const nextPageUrl = `https://pcpartpicker.com/search/?q=${searchPhrase.replace(' ', '+')}&page=${currentPageNumber + 1}`;

        await addRequests([{
            url: nextPageUrl,
            label: LABELS.GLOBAL_SEARCH,
            userData: request.userData,
        }]);
    }

    log.info(`Searching all categories for ${searchPhrase}`
        + `Current page: ${currentPageNumber}, `
        + `Total pages: ${lastPageNumber}`, {
        url: request.url,
    });
};
