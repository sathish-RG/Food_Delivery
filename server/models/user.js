const mongoose= require('mongoose');
const bcrypt =require('bcryptjs')

const userSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true,
  },
  email:{
    type:String,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  address:{
    type:String,
    default:"",
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  cart: [
    {
      restaurant: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant" },
      items: [
        {
          menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "Restaurant.menu" },
          name: String,
          price: Number,
          quantity: { type: Number, default: 1 }
        }
      ],
      deliveryAddress: String
    }
  ],
})
// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
