import { Actor, log } from 'apify';
import { CheerioRoot } from 'crawlee';
import { CheerioAPI } from 'cheerio';

import actorState from '../actor-state.js';
import { Product, PriceBlock, ProductPrice, Ratings } from '../interfaces.js';

export const saveProduct = async (product: Product) => {
    const { state } = actorState;

    try {
        await Actor.pushData({
            id: product.id,
            name: product.name,
            category: product.category,
            url: product.url,
            prices: product.prices,
            ratings: product.ratings,
            specifications: product.specifications,
            reviews: product.reviews,
        });

        state.productsScraped += 1;

        if (state.maxProducts && state.maxProducts === state.productsScraped) {
            await Actor.exit('Reached maximum number of products');
        }
    } catch (error) {
        log.warning('Unable to push data into dataset', { error });
    }
};

export const parseProduct = (cheerioRoot: CheerioRoot | CheerioAPI, url: string): Product => {
    const $ = cheerioRoot as CheerioRoot;

    const id = url.split('/')[4];
    const name = $('h1.pageTitle').text().trim();
    const category = $('.breadcrumb a[href*="/products"]').text().trim();

    return {
        id,
        name,
        category,
        url,
        specifications: {},
    };
};

export const parsePrices = (cheerioRoot: CheerioRoot | CheerioAPI): PriceBlock | undefined => {
    const $ = cheerioRoot as CheerioRoot;
    const rows = $('#prices tbody tr:not([class*="noBorder"])');

    if (rows.length === 0) return undefined;

    const prices: ProductPrice[] = [];
    let lowestPrice: number = Number.MAX_VALUE;

    for (const row of rows) {
        const logoAnchor = $(row).find('td[class*="logo"] a');
        const merchant = logoAnchor.attr('data-merchant-tag') ?? '';
        const buyLink = logoAnchor.attr('href') ?? '';

        const availability = $(row).find('td[class*="availability"]').text().trim();
        const priceString = $(row).find('td[class*="finalPrice"]').text().trim();

        const price = Number(priceString.match(/\d+\.?\d?/)?.[0]);
        const currency = priceString.charAt(0);

        if (!lowestPrice || (price && lowestPrice > price)) {
            lowestPrice = price;
        }

        prices.push({
            merchant,
            availability,
            price,
            currency,
            buyLink,
        });
    }

    return {
        lowestPrice,
        prices,
    };
};

export const parseRatings = (cheerioRoot: CheerioRoot | CheerioAPI): Ratings | undefined => {
    const $ = cheerioRoot as CheerioRoot;
    const ratingsBox = $('div[class*="ratings"]');

    if (ratingsBox.length === 0) return undefined;

    const label = $(ratingsBox).find('li').last().text();
    const matches = label.matchAll(/\d+\.?\d?/g);
    const numberOfRatings = Number(matches.next().value?.[0]);
    const averageRating = Number(matches.next().value?.[0]);

    const starRows = $(ratingsBox).find('table tr');

    const percentages: Record<string, string> = {};

    for (const row of starRows) {
        const starLabel = `${$(row).find('.ratingStars').text().charAt(0)}*`;
        const percentage = $(row).find('.ratingPercentage').text();

        percentages[starLabel] = percentage;
    }

    return {
        averageRating,
        numberOfRatings,
        percentages,
    };
};

export const parseSpecs = (cheerioRoot: CheerioRoot | CheerioAPI): Record<string, string | string[]> => {
    const $ = cheerioRoot as CheerioRoot;
    const result: Record<string, string | string[]> = {};

    const specGroups = $('div.specs:not(.md-hide) div[class*="spec"]');

    for (const group of specGroups) {
        const title = $(group).children('h3').text().trim();
        const content = $(group).children('div');

        const contentList = $(content).children('ul');

        // The content is single string
        if (contentList.length === 0) {
            result[title] = content.text().trim();
            continue;
        }

        const stringArray = contentList.children('li').toArray().map((el) => $(el).text().trim());
        result[title] = stringArray;
    }

    return result;
};
