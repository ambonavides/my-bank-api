import mongoose from "mongoose";

const accountSchema = mongoose.Schema({
  agencia: {
    type: Number,
    required: true,
  },
  conta: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  balance: {
    type: Number,
    required: true,
    validate(value) {
      if (value < 0)
        throw new Error("Valor negativo para a nota não permitido.");
    },
  },
  lastModified: {
    type: String,
    default: Date.now,
  },
});

const accountModel = mongoose.model("accounts", accountSchema, "accounts");

export { accountModel };
