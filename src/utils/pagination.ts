import { CheerioAPI } from 'cheerio';
import { CheerioRoot } from 'crawlee';

export const parsePageNumbers = (cheerioRoot: CheerioRoot | CheerioAPI): [number, number] => {
    const $ = cheerioRoot as CheerioRoot;
    const currentPageAnchor = $('.pagination a[class*="current"]');
    const lastPageAnchor = $('.pagination li:last-child a');

    return [Number(currentPageAnchor.text()), Number(lastPageAnchor.text())];
};
