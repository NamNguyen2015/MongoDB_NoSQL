/// books.json
// data structures
db.books.find()

//1. Count how many books in the list
    //399
db.books.find().count()
//2. Count how namy books were written by only one author and how many were written by multi-authors
    // total: 399
    // one author: 211 
db.books.find({$where: "this.authors.length ==1"}).count()

    // multi-authors 188
db.books.find({$where: "this.authors.length >1"}).count()

//3. Insert a new book

var newbook= { "title": "Gone with the wind", "publishedDate": 1936, "authors": "Margaret Mitchell", "categories": ["Novel", "fiction"] }
db.books.insert(newbook)
db.books.find({"title":"Gone with the wind"})

//4. Delete the book has been inserted
var newbook={"title": "Gone with the wind"}
db.books.deleteMany(newbook)

///5. Count all the books which have no pageCount updated and the ones have no pageCount update like "Undefined". 
    //161
db.books.find({'pageCount': 0}).count()
    //238
db.books.find({'pageCount': {$gt:0}}).count()



var cast_vacio={'pageCount': 0}
var actualiza={$push:{'pageCount': '###'}}
db.movies.updateMany(cast_vacio,actualiza)
db.movies.find(cast_vacio).count()




//6. Show 3 books have the most page numubers

var fasegroup={ $group: { "_id":{ "title": "$title", "author":"$authors"}, "page": { $max: "$pageCount" } }}
var fasesort={ $sort: { "page": -1 } }
var faselimit={$limit: 3}
var etapas=[  fasegroup,  fasesort, faselimit ]
db.books.aggregate(etapas)

//7. Show the last book was published

    //"publishedDate" : ISODate("2014-06-24T09:00:00.000+02:00"),
    //	"title" : "The Well-Grounded Rubyist, Second Edition"

db.books.find({}, {'publishedDate':1,"title": "$title",'_id':0}).sort({'publishedDate':-1})


//8. Show 3 authors with the most published books

var fasegroup = { $group: { "_id": "$authors", "total": { $sum: 1 } } }
var faseordmax = { $sort: { total: -1 } }
var faselimit = { $limit: 3 }
var etapas=[fasegroup, faseordmax,faselimit]
db.books.aggregate(etapas)

//9. Update all books dont have catergory as "Undefined" 
var cat_empty={'categories': [0]}
var actualiza={$push:{'catergoies': ["Undefined"]}}
db.books.updateMany(cat_empty,actualiza)
db.books.find({'catergoies': ["Undefined"]}).count()

//10. Save a new collection name "newcategories" then count how many documents exist in the new collection
var faseunwind={ $unwind: "$categories" }
var faseremoveduplicate={ $project: { "_id": 0 } }
var faseout={ $out: "newcategories" }
var etapas=[ faseunwind, faseremoveduplicate, faseout ]
db.books.aggregate(etapas)
db.newcategories.find().count()







