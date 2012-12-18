var mongoose = require('mongoose')
  , conn
  , db
  , albumsSchema
  , imagesSchema
  , albums
  , images;

// mongoose.set('debug', true);
conn = mongoose.connect('localhost', 'images', {safe: true});
db = conn.connection;

albumsSchema = new mongoose.Schema({
  "_id": Number, 
  "images": [Number]}
  );
// albumsSchema.index({images: 1});
albums = db.model('albums', albumsSchema);

imagesSchema = new mongoose.Schema({
  _id: Number,
  height: Number,
  width: Number
  }, 
  {safe: true}
  );
// imagesSchema.index({_id: 1});
images = db.model('images', imagesSchema);

// albums.find().limit(5).exec(function(err, data) {
//   console.log(data);
// });

images.find().exec(function(err, image) {

  for(var i=0, len = image.length; i < len; i++) {
    // console.log('id', image[i]._id);
    chkAlbums(image[i]._id);
  }
});

function chkAlbums(image) {
  var img = image;
  albums.find({images: {$in: [img]}}).exec(function(err, al) {
      // console.log("inside", img);
      // console.log("album", al);
      if (err) return console.log(err);
      if (!al.length) {
        console.log("removing image:", img);
        images.find({_id: img}).remove();
      }
    });
}

/*
  For the aggregation:
  db.images.aggregate({$group: {_id: 0, sumIt: {$sum: "$_id"}}})
*/
