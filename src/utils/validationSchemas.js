import * as Yup from "yup";

// Đăng ký
export const buildRegisterSchema = (t) =>
  Yup.object().shape({
    name: Yup.string()
      .required(t("register.nameRequired"))
      .min(2, t("register.nameMin"))
      .max(50, t("register.nameMax")),

    email: Yup.string()
      .email(t("register.invalidEmail"))
      .required(t("register.emailRequired"))
      .matches(
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        t("register.invalidEmailFormat")
      ),

    password: Yup.string()
      .required(t("register.passwordRequired"))
      .min(8, t("register.passwordMin"))
      .max(100, t("register.passwordMax"))
      .matches(/[A-Z]/, t("register.passwordUppercase"))
      .matches(/[a-z]/, t("register.passwordLowercase"))
      .matches(/[0-9]/, t("register.passwordDigit"))
      .matches(/[@$!%*?&]/, t("register.passwordSpecial")),

    passwordConfirmation: Yup.string()
      .required(t("register.confirmPasswordRequired"))
      .oneOf([Yup.ref("password")], t("register.passwordMismatch")),
  });

// Đổi mật khẩu
export const buildChangePasswordSchema = (t) =>
  Yup.object().shape({
    currentPassword: Yup.string().required(t("profileUpdate.currentPasswordRequired")),

    newPassword: Yup.string()
      .required(t("profileUpdate.passwordRequired"))
      .min(8, t("profileUpdate.passwordMin"))
      .matches(/[A-Z]/, t("profileUpdate.passwordUppercase"))
      .matches(/[a-z]/, t("profileUpdate.passwordLowercase"))
      .matches(/[0-9]/, t("profileUpdate.passwordDigit"))
      .matches(/[@$!%*?&]/, t("profileUpdate.passwordSpecial"))
      .test(
        "not-same-as-current",
        t("profileUpdate.passwordMustBeDifferent"),
        function (value) {
          const { currentPassword } = this.parent;
          if (!value || !currentPassword) return true;
          return value !== currentPassword;
        }
      ),

    confirmNewPassword: Yup.string()
      .required(t("profileUpdate.confirmPasswordRequired"))
      .oneOf([Yup.ref("newPassword")], t("profileUpdate.passwordMismatch")),
  });

// Cập nhật thông tin
export const buildUpdateProfileSchema = (t) =>
  Yup.object().shape({
    name: Yup.string().required(t("profileUpdate.required")),

    birthday: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test("is-valid-birthday", t("profileUpdate.invalidBirthday"), (value) => {
        if (!value) return true;
        return new Date(value) <= new Date();
      }),

    phone: Yup.string()
      .nullable()
      .transform((v) => (v === "" ? null : v))
      .test("is-valid-phone", t("profileUpdate.invalidPhone"), (value) => {
        if (!value) return true;
        return /^[0-9]{9,11}$/.test(value);
      }),

    password: Yup.mixed().notRequired(),
  });
