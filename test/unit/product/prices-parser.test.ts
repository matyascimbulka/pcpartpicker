import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parsePrices } from '../../../src/utils/product.js';

const BASE_PATH = '../../../sample-data/product';

describe('pricesParser', () => {
    test('should return 4 prices with lowest price of 197', async () => {
        const filePath = new URL(`${BASE_PATH}/product-full.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const prices = parsePrices($);

        expect(prices).toBeDefined();
        expect(prices?.lowestPrice).toEqual(198.9);
        expect(prices?.prices.length).toEqual(5);
    });

    test('should return undefined', async () => {
        const filePath = new URL(`${BASE_PATH}/product-no-prices.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const prices = parsePrices($);

        expect(prices).toBeUndefined();
    });
});
