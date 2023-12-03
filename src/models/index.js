const Cart = require("./Cart");
const Category = require("./Category");
const Product = require("./Product");
const User = require("./User");
const Image = require("./Image");
const Purchase = require("./Purchase");

Category.hasMany(Product);
Product.belongsTo(Category);

Product.hasMany(Image);
Image.belongsTo(Product);

Product.hasMany(Cart); // Un producto va a estar en muchos carritos.
Cart.belongsTo(Product); // en Cart -> productId.

User.hasMany(Cart); // Un usuario va a tener MUCHOS productos en el carrito.
Cart.belongsTo(User); // en Cart -> userId.

Product.hasMany(Image);
Image.belongsTo(Product);

User.hasMany(Purchase);
Purchase.belongsTo(User);

Product.hasMany(Purchase);
Purchase.belongsTo(Product);
