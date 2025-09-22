import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  login: yup.string().required('Login kiritish majburiy'),
  password: yup.string().required('Parol kiritish majburiy'),
});

export const clientPageFormSchema = yup.object().shape({
  name: yup.string().required('Ism majburiy'),
  photo: yup.string().required('Rasm majburiy'),
  telephone: yup.string().required('Telefon raqami majburiy'),
  code: yup.string().required('Kod majburiy'),
  debtClient: yup.string().required('Qarzdorlik majburiy'),
  product: yup.string().required('Mahsulot majburiy'),
  deadline: yup.string().datetime().required('Muddat majburiy'),
  imei: yup.string().required('IMEI majburiy'),
});

export const messengerSchema = yup
  .object()
  .shape({
    msgText: yup.string().optional(),
    msgPhoto: yup.mixed().optional(),
    msgAudio: yup.mixed().optional(),
  })
  .test(
    'at-least-one',
    "Iltimos xabar kiriting yoki fayl qo'shing",
    function (values) {
      return !!(
        values.msgText?.trim() ||
        values.msgPhoto?.length > 0 ||
        values.msgAudio
      );
    }
  );

export const filterClientFormSchema = yup.object().shape({
  // startDate: yup.string().required("Start date is required !"),
  // endDate: yup
  //   .string()
  //   .test("is-greater", "End date cannot be werwerwe re rwerwe !", function (value) {
  //     const { startDate } = this.parent;
  //     return moment(value, "DD.MM.YYYY").isSameOrAfter(startDate, "DD.MM.YYYY");
  //   }),
});
