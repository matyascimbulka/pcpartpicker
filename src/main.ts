import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

import { ACTOR_STATE, LABELS } from './consts.js';
import { router } from './router.js';
import { State } from './interfaces.js';

interface Input {
    searchPhrase: string;
    category: string;
    maxProducts?: number;
    maxReviews?: number
}

await Actor.init();

const input = await Actor.getInput<Input>() ?? {} as Input;

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'US',
});

await Actor.useState<State>(ACTOR_STATE, { productsScraped: 0, maxProducts: input.maxProducts });

const crawler = new PlaywrightCrawler({
    proxyConfiguration,
    requestHandler: router,
    launchContext: {
        launchOptions: {
            slowMo: 15,
            args: [
                '--disable-gpu', // Mitigates the "crashing GPU process" issue in Docker containers
            ],
        },
    },
    browserPoolOptions: {
        maxOpenPagesPerBrowser: 5,
        retireBrowserAfterPageCount: 10,
    },
    autoscaledPoolOptions: {
        desiredConcurrency: 15,
    },
});

await crawler.run([{
    url: `https://pcpartpicker.com/products/${input.category}`,
    label: LABELS.SEARCH_RESULTS,
    userData: input,
}]);
await Actor.exit();
