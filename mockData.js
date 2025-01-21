export const tableColumns = [
  { key: "name", title: "Name", icon: "dashbord" },
  { key: "email", title: "Email", icon: "email" },
  { key: "phone", title: "Phone", icon: "phone" },
  { key: "address", title: "Address", icon: "address" },
  { key: "company", title: "Company", icon: "company" },
];

export const tableData = Array.from({ length: 40 }, (_, index) => ({
  id: index + 1,
  name: `User ${index + 1}`,
  email: `user${index + 1}@example.com`,
  phone: `123-456-789${index % 10}`,
  address: `1234 Street ${index + 1}, City, Country`,
  company: `Company ${index + 1}`,
}));
