export const tableColumns = [
  { key: "name", title: "Name", icon: "calendar", width: "10%" },
  { key: "email", title: "Email", icon: "clients" },
  { key: "phone", title: "Phone", icon: "income" },
  { key: "address", title: "Address", icon: "expense" },
  { key: "company", title: "Company", icon: "calendarFact" },
];

export const tableData = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `123-456-789${index % 10}`,
  address: `1234 Street ${index + 1}, City, Country`,
  company: `Company ${index + 1}`,
}));

export const mockDataClients = Array.from({ length: 100 }, (_, index) => ({
  clientCode: `PBS${2017 + index}`, // Increment client code
  clientName: "Maqsudov Nodir Xabibullayev",
  product: index % 2 === 0 ? "iPhone 12 Pro max 256 gb" : "iPhone 12",
  monthlyPayment: "$100",
  status: "paid",
  saleDate: "2024.11.01",
  executor: "You",
  term: "100 days",
}));
