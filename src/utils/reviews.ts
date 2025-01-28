import { CheerioAPI } from 'cheerio';
import { CheerioRoot } from 'crawlee';

import type { Review } from '../interfaces.js';

export const parseReviews = (cheerioRoot: CheerioRoot | CheerioAPI, limit: number | null = null): Review[] => {
    if (limit === 0) return [];

    const reviews: Review[] = [];
    const $ = cheerioRoot as CheerioRoot;

    const reviewBlocks = $('div.block div[class*="review"]');

    for (const block of reviewBlocks) {
        const author = $(block).find('div[class*="userName"] a').text();
        const age = $(block).find('ul[class*="userData"] li').last().text();
        const rating = $(block).find('ul.product--rating .shape-star-full').length;
        const text = $(block).find('.markdown').text().trim();

        reviews.push({
            author,
            age,
            rating,
            text,
        });

        if (reviews.length === limit) break;
    }

    return reviews;
};
