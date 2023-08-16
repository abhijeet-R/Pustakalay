class ApiFeature{
    constructor(query,queryStr){
        this.query=query;
        this.queryStr=queryStr;
    }
    search(){
        const keyword=this.queryStr.keyword?{
            name:{
                $regex:this.queryStr.keyword,
                $options:"i"
            },
        }:{}
        this.query=this.query.find({...keyword});
        return this
    }

    filter(){
        const querycopy={...this.queryStr}

        const removeFields=["keyword","page","limit"]
        
        removeFields.forEach((key)=>delete querycopy[key])
        let querystr=JSON.stringify(querycopy)
        querystr=querystr.replace(/\b(gt|gte|lt|lte)\b/g,(key)=>`$${key}`)
        this.query=this.query.find(JSON.parse(querystr))
        return this;
    }

    pagination(resultPerPage){
       const currentPage=Number(this.queryStr.page)||1;
       const skip=resultPerPage*(currentPage-1);
       this.query=this.query.limit(resultPerPage).skip(skip)
       return this
    }
}
module.exports= ApiFeature