import { Actor, log } from 'apify';
import { PlaywrightCrawler } from 'crawlee';
import { firefox } from 'playwright';
import { launchOptions as camoufoxLaunchOptions } from 'camoufox-js';

import { ACTOR_STATE, AVAILABLE_COUNTRY_CODES, LABELS } from './consts.js';
import { router } from './router.js';
import type { State } from './interfaces.js';

interface Input {
    searchPhrase: string;
    category: string;
    maxProducts?: number;
    maxReviews?: number;
    countryCode: string;
}

await Actor.init();

const input = await Actor.getInput<Input>() ?? {
    searchPhrase: 'AMD',
    category: 'all',
    maxProducts: 50,
    maxReviews: 0,
    countryCode: 'us',
} as Input;

if (input.category === 'all' && !input.searchPhrase) {
    log.error('Search phrase can not be empty when searching all categories');
    await Actor.exit();
}

if (!AVAILABLE_COUNTRY_CODES.includes(input.countryCode)) {
    log.warning(`Country code "${input.countryCode}" is not supported! Using default value.`);
    input.countryCode = 'us';
}

const proxyConfiguration = await Actor.createProxyConfiguration();

await Actor.useState<State>(ACTOR_STATE, { productsScraped: 0, maxProducts: input.maxProducts });

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    requestHandler: router,
    maxRequestRetries: 15,
    launchContext: {
        launcher: firefox,
        launchOptions: await camoufoxLaunchOptions({
            headless: true,
        }),
    },
    browserPoolOptions: {
        maxOpenPagesPerBrowser: 5,
        retireBrowserAfterPageCount: 10,
    },
});

const urlBase = `https://${input.countryCode !== 'us' ? `${input.countryCode}.` : ''}pcpartpicker.com`;
const url = input.category === 'all'
    ? `${urlBase}/search/?q=${input.searchPhrase.replace(' ', '+')}`
    : `${urlBase}/products/${input.category}`;

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
