import * as fs from 'fs/promises';
import * as cheerio from 'cheerio';
import { describe, expect, test } from 'vitest';

import { parsePageNumbers } from '../../src/utils/pagination.js';

const BASE_PATH = '../../sample-data';

describe('paginationParser', () => {
    describe('categorySearch', () => {
        test('should return currentPage = 1 and lastPage = 1', async () => {
            const filePath = new URL(`${BASE_PATH}/category-search/search-first-page-single.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(1);
        });

        test('should return currentPage = 1 and lastPage = 2', async () => {
            const filePath = new URL(`${BASE_PATH}/category-search/search-first-page-two-pages.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(2);
        });

        test('should return currentPage = 2 and lastPage = 2', async () => {
            const filePath = new URL(`${BASE_PATH}/category-search/search-second-page-two-pages.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);

            expect(currentPage).toEqual(2);
            expect(lastPage).toEqual(2);
        });
    });

    describe('globalSeach', () => {
        test('should return currentPage = 1 and lastPage = 120', async () => {
            const filePath = new URL(`${BASE_PATH}/global-search/full-page-1-120.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);
            expect(currentPage).toEqual(1);
            expect(lastPage).toEqual(120);
        });

        test('should return currentPage = 120 and lastPage = 120', async () => {
            const filePath = new URL(`${BASE_PATH}/global-search/10-results-page-120.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);
            expect(currentPage).toEqual(120);
            expect(lastPage).toEqual(120);
        });

        test('should return currentPage = 120 and lastPage = 120', async () => {
            const filePath = new URL(`${BASE_PATH}/global-search/empty.html`, import.meta.url);
            const htmlBuffer = await fs.readFile(filePath, { encoding: 'utf8' });
            const $ = cheerio.load(htmlBuffer);

            const [currentPage, lastPage] = parsePageNumbers($);
            expect(currentPage).toEqual(Number.NaN);
            expect(lastPage).toEqual(Number.NaN);
        });
    });

    describe('reviews', () => {
        test('should return currentPage = NaN and lastPage = NaN', async () => {
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
