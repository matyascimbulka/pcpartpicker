## PCPartPicker Scraper
Scrape and collect detailed PC component information from the PCPartPicker website.

This scraper is ideal for:

- Price monitoring and comparison across different merchants
- Gathering technical specifications for PC components
- Collecting user reviews and ratings

The scraper provides structured data that can be easily integrated into price comparison tools, automated purchasing systems, or market analysis applications.

## Input Paramenters
The input of the scraper is JSON containing these parameters:

- `searchPhrase` - Search phrase used in filtering the results. This parameter is **optional**, and when it is missing the entire category is used with default sorting.
- `category` - Select which category to scrape. **Required** parameter.
- `maxProducts` - How many products should be scraped. This is **optional** paremeter and when it is not present the actor will scrape all products with search phrase and category combination.
- `scrapeReviews` - How many reviews of each product should be returned. **Optional** parameter, when it is not present the actor will scrape all reviews for each product.

### Example input
```json
{
    "searchPhrase": "ryzen 5",
    "category": "cpu",
    "maxProducts": 100,
    "maxReviews": 20
}
```


## Output schema
The output schema of each product contains these properties:

- `id` - ID of the product as shown in the URL
- `name` - Name of the product
- `category` - Category of the product
- `url` - Link to the product page on PCPartPicker
- `prices` - An object containing `lowestPrice` fieald and an array of listed prices. Each object in the array contains merchant name, availability information, buy link for the merchant, price and currency.
- `ratings` - Product rating information. It contains total number of ratings, average rating and the percentage split between each star rating.
- `specification` - Technical specification of the product.
- `reviews` - An array containing user written reviews of the product. Each review contains author, age of the review, rating, and text of the review.

### Example output
```json
{
    "id": "66B47d",
    "name": "AMD Ryzen 7",
    "category": "CPU",
    "url": "https://pcpartpicker.com/product/**",

    "prices": {
        "lowestPrice": 250,
        "prices": [
            {
                "merchant": "bestbuy",
                "availability": "Out of stock",
                "price": 250,
                "currency": "$",
                "buyLink": "https://api.bestbuy.com/**"
            }
        ]
    },
    "ratings": {
        "averageRating": 4.9,
        "numberOfRatings": 51,
        "percentages": {
            "5*": "94%",
            "4*": "6%",
            "3*": "0%",
            "2*": "0%",
            "1*": "0%"
        }
    },
    "specifications": {
        "Manufacturer": "AMD",
    },
    "reviews:" [
        {
            "author": "username",
            "age": "5 days ago",
            "rating": 5,
            "text": "The text of the review."
        }
    ]
}
```

## Performance
Since the scraper uses a Playwright crawler, it requires significant memory. While it performs optimally with 8 GB of memory, it can function adequately with as little as 2 GB.
