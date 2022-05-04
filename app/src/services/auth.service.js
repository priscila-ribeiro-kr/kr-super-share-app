import axios from "axios";
import HttpStatus from "http-status";
import { API } from "../constants/api.constants";
import { AuthStore } from "../store/auth.store";
import { Objects } from "../utils/object.utils";
import { Length } from "../utils/length.utils";

class AuthService {
  static async login(phone, password) {
    try {
      const response = await axios.post(API.User.Login, {
        phone: phone,
        password: password,
      });
      AuthStore.add(response.data);
      return true;
    } catch (_) {
      return false;
    }
  }

  static getUserPhone() {
    const auth = AuthStore.get();
    if (Objects.isNotEmpty(auth)) {
      return auth.phone;
    }
  }

  static getUser() {
    const auth = AuthStore.get();
    if (Objects.isNotEmpty(auth)) {
      return {
        name: auth.name,
        phone: auth.phone,
      };
    }
  }

  static getToken() {
    const auth = AuthStore.get();
    if (Objects.isNotEmpty(auth)) {
      return auth.token;
    }
  }

  static isLoggedIn() {
    return Objects.isNotEmpty(AuthStore.get());
  }

  static logout() {
    AuthStore.remove();
  }

  static async register(name, phone, password) {
    try {
      await axios.post(API.User.Register, {
        name: name,
        phone: phone,
        password: password,
      });
    } catch (e) {
      const status = Objects.safeGet(e.response, (response) => response.status);
      if (status === HttpStatus.CONFLICT) {
        return "User already exits";
      } else if (status === HttpStatus.BAD_GATEWAY) {
        return "Erro na validação da entrada";
      } else {
        return "Um erro desconhecido aconteceu, tente novamente";
      }
    }
  }

  static isValidUser(name, phone, password, confirmPassword) {
    const errors = {};
    if (Objects.isEmpty(name)) {
      errors.name = "Field name can't be empty.";
    }
    if (Objects.isEmpty(phone) || Length.isNotEqual(phone, 11)) {
      errors.phone = "Phone number must have 11 characters.";
    }
    if (Objects.isEmpty(password) || Length.isSmaller(password, 8)) {
      errors.password = "Password must have minimum 8 characters.";
    }
    if (Objects.isNotEqual(password, confirmPassword)) {
      errors.confirmPassword = "Password and its confirmation don't match.";
    }

    return errors;
  }
}

export { AuthService };
