import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parsePageNumbers } from '../../src/utils/pagination.js';

const BASE_PATH = '../../sample-data';

describe('paginationParser', () => {
    describe('searchResults', () => {
        test('should return currentPage = 1 and lastPage = 1', async () => {
            const filePath = new URL(`${BASE_PATH}/search-result/search-first-page-single.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(1);
        });

        test('should return currentPage = 1 and lastPage = 2', async () => {
            const filePath = new URL(`${BASE_PATH}/search-result/search-first-page-two-pages.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(2);
        });

        test('should return currentPage = 2 and lastPage = 2', async () => {
            const filePath = new URL(`${BASE_PATH}/search-result/search-second-page-two-pages.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(2);
            expect(lastPage).toEqual(2);
        });
    });

    describe('reviews', () => {
        test('should return currentPage = 1 and lastPage = 23', async () => {
            const filePath = new URL(`${BASE_PATH}/reviews/reviews-full.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(23);
        });

        test('should return currentPage = 23 and lastPage = 23', async () => {
            const filePath = new URL(`${BASE_PATH}/reviews/reviews-partial-last-page-23.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(23);
            expect(lastPage).toEqual(23);
        });
    });
});
