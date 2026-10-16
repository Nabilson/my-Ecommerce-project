// check-categories.js
require('dotenv').config();
const mongoose = require('mongoose');
const categoryModel = require('./models/categoryModel');
const productModel = require('./models/productModel');

async function main() {
    await mongoose.connect(process.env.DB_URL);
    const cats = await categoryModel.find({}, 'name');
    console.log('Categories in DB:');
    cats.forEach(c => console.log('  -', JSON.stringify(c.name)));
    const prodCats = await productModel.distinct('category');
    console.log('Category values on products:');
    prodCats.forEach(c => console.log('  -', JSON.stringify(c)));
	
	const counts = await productModel.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { _id: 1 } }
]);
console.log('Dishes per category value:');
console.log(JSON.stringify(counts, null, 2));
	
    await mongoose.disconnect();
}
main().catch(e => { console.error(e); process.exit(1); });



