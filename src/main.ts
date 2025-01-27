import { Actor } from 'apify';
import { PlaywrightCrawler } from 'crawlee';

import { LABELS } from './consts.js';
import { router } from './router.js';
import actorState from './actor-state.js';

interface Input {
    searchPhrase: string;
    category: string;
    maxProducts?: number;
    scrapeReviews: boolean;
    maxReviews?: number
}

await Actor.init();

const input = await Actor.getInput<Input>() ?? {} as Input;

const proxyConfiguration = await Actor.createProxyConfiguration({
    groups: ['RESIDENTIAL'],
    countryCode: 'US',
});

await actorState.init(input.maxProducts);

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
