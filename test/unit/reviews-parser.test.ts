import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parseReviews } from '../../src/utils/reviews.js';
import { MAX_REVIEWS_PER_PAGE } from '../../src/consts.js';

const BASE_PATH = '../../sample-data';

describe('reviewsParser', () => {
    describe('reviewsPage', () => {
        test('should return 10 reviews', async () => {
            const filePath = new URL(`${BASE_PATH}/reviews/reviews-full.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const reviews = parseReviews($);

            expect(reviews.length).toEqual(MAX_REVIEWS_PER_PAGE);
        });

        test('should return 8 reviews', async () => {
            const filePath = new URL(`${BASE_PATH}/reviews/reviews-partial-last-page-23.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const reviews = parseReviews($);

            expect(reviews.length).toEqual(8);
        });
    });

    describe('productPage', () => {
        test('should return 10 reviews', async () => {
            const filePath = new URL(`${BASE_PATH}/product/product-full.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const reviews = parseReviews($);

            expect(reviews.length).toEqual(MAX_REVIEWS_PER_PAGE);
        });

        test('should return 0 reviews', async () => {
            const filePath = new URL(`${BASE_PATH}/product/product-no-reviews.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const reviews = parseReviews($);

            expect(reviews.length).toEqual(0);
        });
    });
});
