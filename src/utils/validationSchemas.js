import * as Yup from "yup";

export const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be at most 50 characters"),
    
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Không thể để trống")
    .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format"),

  password: Yup.string()
    .required("Không thể để trống")
    .min(8, "Mật khẩu phải tối thiểu 8 ký tự")
    .max(100, "Mật khẩu không dài quá 10 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ cái thường")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất một số")
    .matches(/[@$!%*?&]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt (@$!%*?&)"),

  passwordConfirmation: Yup.string()
    .required("Vui lòng xác nhận mật khẩu của bạn")
    .oneOf([Yup.ref("password")], "Mật khẩu phải trùng khớp"),
});

export const PasswordOnlySchema = Yup.object().shape({
  password: Yup.string()
    .required("Không thể để trống")
    .min(8, "Mật khẩu phải tối thiểu 8 ký tự")
    .max(100, "Mật khẩu không dài quá 100 ký tự")
    .matches(/[A-Z]/, "Mật khẩu phải có ít nhất một chữ cái viết hoa")
    .matches(/[a-z]/, "Mật khẩu phải có ít nhất một chữ cái thường")
    .matches(/[0-9]/, "Mật khẩu phải có ít nhất một số")
    .matches(/[@$!%*?&]/, "Mật khẩu phải có ít nhất một ký tự đặc biệt (@$!%*?&)"),

  confirmPassword: Yup.string()
    .required("Vui lòng xác nhận mật khẩu của bạn")
    .oneOf([Yup.ref("password")], "Mật khẩu phải trùng khớp"),
});
