import { CheerioAPI } from 'cheerio';
import { CheerioRoot } from 'crawlee';

export const parsePageNumbers = (cheerioRoot: CheerioRoot | CheerioAPI): [number, number] => {
    const $ = cheerioRoot as CheerioRoot;
    const pagination = $('.pagination');

    if (pagination.length === 0) return [Number.NaN, Number.NaN];

    const currentPageAnchor = $(pagination).find('a[class*="current"]');
    const lastPageAnchor = $(pagination).find('li:last-child a');

    return [Number(currentPageAnchor.text()), Number(lastPageAnchor.text())];
};
