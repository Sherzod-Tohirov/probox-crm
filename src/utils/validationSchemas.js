import * as yup from "yup";

export const loginSchema = yup.object().shape({
  login: yup.string().required("Login is required"),
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

export const messengerSchema = yup.object().shape({
  msgText: yup.string().required("Text is required !"),
});

export const filterClientFormSchema = yup.object().shape({
  // startDate: yup.string().required("Start date is required !"),
  // endDate: yup
  //   .string()
  //   .test("is-greater", "End date cannot be werwerwe re rwerwe !", function (value) {
  //     const { startDate } = this.parent;
  //     return moment(value, "DD.MM.YYYY").isSameOrAfter(startDate, "DD.MM.YYYY");
  //   }),
});
