import { Actor, log } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

import { ACTOR_STATE, LABELS } from './consts.js';
import { router } from './router.js';
import type { State } from './interfaces.js';

interface Input {
    searchPhrase: string;
    category: string;
    maxProducts?: number;
    maxReviews?: number
}

await Actor.init();

const input = await Actor.getInput<Input>() ?? {
    searchPhrase: 'AMD',
    category: 'all',
    maxProducts: 50,
    maxReviews: 0,
} as Input;

if (input.category === 'all' && !input.searchPhrase) {
    log.error('Search phrase can not be empty when searching all categories');
    await Actor.exit();
}

const proxyConfiguration = await Actor.createProxyConfiguration();

await Actor.useState<State>(ACTOR_STATE, { productsScraped: 0, maxProducts: input.maxProducts });

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestRetries: 15,
    launchContext: {
        launchOptions: {
            args: [
                '--disable-gpu', // Mitigates the "crashing GPU process" issue in Docker containers
            ],
        },
    },
    browserPoolOptions: {
        maxOpenPagesPerBrowser: 5,
        retireBrowserAfterPageCount: 10,
    },
});

const url = input.category === 'all'
    ? `https://pcpartpicker.com/search/?q=${input.searchPhrase.replace(' ', '+')}`
    : `https://pcpartpicker.com/products/${input.category}`;

await crawler.run([{
    url,
    label: input.category === 'all' ? LABELS.GLOBAL_SEARCH : LABELS.CATEGORY_SEARCH,
    userData: {
        searchPhrase: input.searchPhrase,
        category: input.category,
        maxReviews: input.maxReviews,
    },
}]);
await Actor.exit();
