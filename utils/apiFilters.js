class APIFilters {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;     // queryString = {jobType: "internship"}
    }

    filter() {
        const queryCopy = {...this.queryString};
        // api/v1/jobs?jobType=Internship  ||  api/v1/jobs?salary=50000  || api/v1/jobs?location.city=Renton
        
        // Advanced filters using le, lte, gt, gte
        // api/v1/jobs?salary[gt]=50000  =>  { salary: { gt: '50000' } } => '{"salary":{"$gt":"50000"}}'
        // Need to add the $ => $gt
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}` );


        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }
}


module.exports = APIFilters;