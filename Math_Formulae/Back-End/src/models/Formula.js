import mongoose from "mongoose";

const formulaItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    formula: { type: String, required: true },
    definition: { type: String, required: true },
    use: { type: String, required: true },
    example: { type: String, required: true },
  },
  { _id: false },
);

const formulaGroupSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    formulas: [formulaItemSchema],
  },
  { _id: false },
);

const formulaSchema = new mongoose.Schema(
  {
    groups: [formulaGroupSchema],
  },
  { timestamps: true },
);

const Formula = mongoose.model("Formula", formulaSchema);

export default Formula;
