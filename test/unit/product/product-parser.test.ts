import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parseProduct, parseSpecs } from '../../../src/utils/product.js';

const BASE_PATH = '../../../sample-data/product';

describe('productParser', () => {
    test('should return full product', async () => {
        const filePath = new URL(`${BASE_PATH}/product-full.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const product = parseProduct($, 'https://partpicker.com/product/66C48d/amd-ryzen-5-7600x-47-ghz-6-core-processor-100-100000593wof');

        expect(product.id).toEqual('66C48d');
        expect(product.name).toEqual('AMD Ryzen 5 7600X 4.7 GHz 6-Core Processor');
        expect(product.category).toEqual('CPU');
    });
});

describe('specsParser', () => {
    test('should return object with 21 fields', async () => {
        const filePath = new URL(`${BASE_PATH}/product-full.html`, import.meta.url);
        const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
        const $ = cheerio.load(htmlBuffer);

        const specs = parseSpecs($);

        expect(Object.keys(specs).length).toEqual(21);
    });
});
