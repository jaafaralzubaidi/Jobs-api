class APIFilters {
    constructor(query, queryString){
        this.query = query;                 // Job.find()
        this.queryString = queryString;     // queryString = {jobType: "internship"}
    }

    filter() {
        const queryCopy = {...this.queryString};
        


        //removing the sort fields from the query
        const removeFields = ['sort', 'fields', 'q', 'limit', 'page'];
        removeFields.forEach(el => delete queryCopy[el])

    
        // api/v1/jobs?jobType=Internship  ||  api/v1/jobs?salary=50000  || api/v1/jobs?location.city=Renton
        
        // Advanced filters using le, lte, gt, gte
        // api/v1/jobs?salary[gt]=50000  =>  { salary: { gt: '50000' } } => '{"salary":{"$gt":"50000"}}'
        // Need to add the $ => $gt
        let queryString = JSON.stringify(queryCopy);
        queryString = queryString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}` );


        this.query = this.query.find(JSON.parse(queryString));
        return this;
    }


    sort () {
        // so if sort is present in the URL
        // => // api/v1/jobs?sort=salary    ascending
        // => // api/v1/jobs?sort=-salary   descending
        if(this.queryString.sort){
            // split by comma => // api/v1/jobs?sort=salary, jobType
            const sortBy = this.queryString.sort.split(',').join(' ');
            //sort() from mongoose salary jobType
            this.query = this.query.sort(sortBy);
        }else {
            // By default it will sort it by postingDate descending
            this.query = this.query.sort('-postingDate');
        }
        
        return this;
    }
    
    limitFields(){
        // api/v1/jobs?fields=title,salary
        if(this.queryString.fields){
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');     //means don't want to show the __v field
        }

        return this;
    }

    searchByQuery(){
        // api/v1/jobs?q=java-developer  (can't write (space) java developer in URL)
        if(this.queryString.q){
            const qu = this.queryString.q.split('-').join(' '); // to replace the - with space
            this.query = this.query.find({ $text: {$search: "\"" + qu + "\""} })
        }
        return this;
    }

    pagination(){
        //api/v1/jobs?limit=20&page=5
        const page = parseInt(this.queryString.page, 10) || 1;    //base10
        const limit = parseInt(this.queryString.limit, 10) || 10;
        // 1 - 100
        // 5 - 1 = 4 * 20 = 80 so we skip 80 results then display 81 - 100
        const skipResults = (page - 1) * limit;
        this.query = this.query.skip(skipResults).limit(limit);

        return this;
    }
}


module.exports = APIFilters;