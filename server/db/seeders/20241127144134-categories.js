'use strict';

module.exports = {
  up: (models, mongoose) => {
   
      return models.categories.insertMany([
        {
          _id : "6747391e0667ff4f30be9dbb",
          category : "clothing"
        },
        {
          _id : "674739360667ff4f30be9dbc",
          category : "shoes"
        },
        {
          _id : "6747394f0667ff4f30be9dbd",
          category : "watches"
        },
        {
          _id : "",
          category : "6747396b0667ff4f30be9dbe"
        },
        {
          _id : "6747397f0667ff4f30be9dbf",
          category : "eyewear"
        },
        {
          _id : "",
          category : "wallets"
        },

      ]).then(res => {
      // Prints "1"
      console.log(res.insertedCount);
    });
  },

  down: (models, mongoose) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return models.Test.bulkWrite([
        {
          deleteOne: {
            filter: {
              name: 'first test'
            }
          }
        }
      ]).then(res => {
      // Prints "1"
      console.log(res.deletedCount);
      });
    */
  }
};
