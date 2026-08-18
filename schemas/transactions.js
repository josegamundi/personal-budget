export const transactionBody = [
  {
    name: "title",
    type: "string",
    required: true
  },
  {
    name: "type",
    type: "string",
    required: true
  },
  {
    name: "amount",
    type: "number",
    required: true
  },
  {
    name: "note",
    type: "string",
    required: false
  },
  {
    name: "categoryId",
    type: "number",
    required: false
  }
];