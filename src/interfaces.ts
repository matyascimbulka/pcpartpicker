export interface State {
    productsScraped: number;
    maxProducts?: number;
}

export interface SearchUserData extends ProductUserData {
    searchPhrase: string;
    category: string;
}

export interface ProductCountState {
    numberOfProductsScraped: number;
}

export interface ProductUserData {
    maxReviews?: number;
}

export interface ReviewsUserData extends ProductUserData {
    product: Product;
}

export interface Product {
    id: string;
    name: string;
    category: string;
    url: string;
    prices?: PriceBlock;
    ratings?: Ratings;
    specifications: Record<string, string | string[]>;
    reviews?: Review[];
}

export interface PriceBlock {
    lowestPrice?: number;
    prices: ProductPrice[];
}

export interface ProductPrice {
    merchant: string;
    availability: string;
    price: number;
    currency: string;
    buyLink: string;
}

export interface Ratings {
    averageRating: number;
    numberOfRatings: number;
    percentages: Record<string, string>
}

export interface Review {
    author: string;
    age: string;
    rating: number;
    text: string;
}
