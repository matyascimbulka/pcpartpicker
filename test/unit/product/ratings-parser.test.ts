import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parseRatings } from '../../../src/utils/product.js';

const BASE_PATH = '../../../sample-data/product';

describe('ratingsParser', () => {
    test('should return full ratings object', async () => {
        const filePath = new URL(`${BASE_PATH}/product-full.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const ratings = parseRatings($);

        expect(ratings).toBeDefined();
        expect(ratings?.numberOfRatings).toEqual(228);
        expect(ratings?.averageRating).toEqual(4.9);
        expect(ratings?.percentages['5*']).toEqual('87%');
        expect(ratings?.percentages['4*']).toEqual('12%');
        expect(ratings?.percentages['3*']).toEqual('1%');
    });

    test('should return undefined', async () => {
        const filePath = new URL(`${BASE_PATH}/product-no-reviews.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const ratings = parseRatings($);

        expect(ratings).toBeUndefined();
    });
});
