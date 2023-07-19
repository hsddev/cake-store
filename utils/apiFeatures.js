class ApiFeatures {
    constructor(mongooseQuery, queryString) {
        this.mongooseQuery = mongooseQuery;
        this.queryString = queryString;
    }

    // Filtration product
    filter() {
        const queryStringObject = { ...this.queryString };
        const excludeQueryStringObject = [
            "page",
            "limit",
            "sort",
            "fields",
            "keyword",
        ];
        excludeQueryStringObject.forEach(
            (field) => delete queryStringObject[field]
        );

        // Apply filtering using [gte,gt,lte,lt]
        let queryString = JSON.stringify(queryStringObject);
        queryString = queryString.replace(
            /\b(gte|gt|lte|lt)\b/g,
            (match) => `$${match}`
        );
        this.mongooseQuery = this.mongooseQuery.find(JSON.parse(queryString));

        return this;
    }

    // Sorting
    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.sort(sortBy);
        } else {
            this.mongooseQuery = this.mongooseQuery.sort("-createdAt");
        }
        return this;
    }

    // Searching
    search(modelName) {
        if (this.queryString.keyword) {
            let query = {};
            if (modelName === "Products") {
                query.$or = [
                    {
                        title: {
                            $regex: this.queryString.keyword,
                            $options: "i",
                        },
                    },
                    {
                        description: {
                            $regex: this.queryString.keyword,
                            $options: "i",
                        },
                    },
                ];
            } else {
                query = {
                    name: { $regex: this.queryString.keyword, $options: "i" },
                };
            }

            this.mongooseQuery = this.mongooseQuery.find(query);
        }
        return this;
    }

    // Fields limiting
    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(",").join(" ");
            this.mongooseQuery = this.mongooseQuery.select(fields);
        } else {
            this.mongooseQuery = this.mongooseQuery.select("-__v");
        }
        return this;
    }

    // Pagination
    paginate(countDocuments) {
        const page = this.queryString.page || 1;
        const limit = this.queryString.page || 50;
        const skip = limit * (page - 1);
        const endIndex = page * limit;

        // Pagination results
        const pagination = {};
        pagination.currentPage = page;
        pagination.limit = limit;
        pagination.numberOfPages = Math.ceil(countDocuments / limit);

        // next page
        if (endIndex < countDocuments) {
            pagination.nextPage = page + 1;
        }

        if (skip > 0) {
            pagination.prevPage = page - 1;
        }

        this.mongooseQuery = this.mongooseQuery.limit(limit).skip(skip);

        this.paginationResults = pagination;
        return this;
    }
}

module.exports = ApiFeatures;
