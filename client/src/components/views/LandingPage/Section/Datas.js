const continents = [
  { _id: 1, name: "Africa" },
  { _id: 2, name: "Asia" },
  { _id: 3, name: "Europe" },
  { _id: 4, name: "North America" },
  { _id: 5, name: "South America" },
  { _id: 6, name: "Australia" },
  { _id: 7, name: "Antarctica" },
];

const price = [
  { _id: 0, name: "Any", array: [] },
  { _id: 1, name: "$0~$1999", array: [0, 1999] },
  { _id: 2, name: "$2000~$2499", array: [2000, 2499] },
  { _id: 3, name: "$2500~$2999", array: [2500, 2999] },
  { _id: 4, name: "$3000~$3499", array: [3000, 3499] },
  { _id: 5, name: "More than $3500", array: [3500, 150000] },
];

export { continents, price };
