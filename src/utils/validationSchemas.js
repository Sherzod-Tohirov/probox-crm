import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export const clientPageFormSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  photo: yup.string().required("Photo is required"),
  telephone: yup.string().required("Telephone is required"),
  code: yup.string().required("Code is required"),
  debtClient: yup.string().required("Debt client is required"),
  product: yup.string().required("Product is required"),
  deadline: yup.string().datetime().required("Deadline is required"),
  imei: yup.string().required("IMEI is required"),
});
