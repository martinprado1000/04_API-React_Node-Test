const { Schema, model } = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      require: true,
    },
    lastname: {
      type: String,
      trim: true,
      require: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      require: true,
    },
    username: {
      type: String,
      trim: true,
    },
    age: {
      type: Number,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
      require: true,
    },
    rol: {
      type: String,
      default: "user",
      enum: ["superAdmin","admin","userPremium","user"],
      require: true,
    },
  },
  { timestamps: true }
);

/** 
// Asi seria el tipo de objeto que le tengo que pasar a este Model.
{
  name: 'martin',
  lastname: 'prado',
  age: '22',
  email: 'asd@gmail.com',
  password: '12345',
  passwordRepeat: "123",
  rol: "user"  
}
**/

userSchema.plugin(mongoosePaginate); // Asi inyectamos el plugin de mongoose-paginate en nuestro esquema

module.exports = model("users", userSchema);
