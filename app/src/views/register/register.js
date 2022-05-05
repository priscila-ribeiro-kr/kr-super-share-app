import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/button/button";
import { Input } from "../../components/input/input";
import { HSpacer } from "../../components/spacer/spacer";
import { AppRoutes } from "../../constants/routes.constants";
import { AuthService } from "../../services/auth.service";
import { Objects } from "../../utils/object.utils";
import { LoaderContext } from "../../context/loader/loader.context";
import { Error } from "../../components/text/error/error";
import { Strings } from "../../utils/string.utils";
import "./register.css";

function Register() {
  const navigate = useNavigate();
  const { executeWithLoading } = useContext(LoaderContext);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [registerError, setRegisterError] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    const numericPhone = Strings.removeNonNumericCharacters(phone);
    const errors = AuthService.isValidUser(
      name,
      numericPhone,
      password,
      confirmPassword
    );
    if (Objects.isNotEmpty(errors)) {
      setErrors(errors);
    } else {
      const error = await executeWithLoading(
        AuthService.register(name, numericPhone, password)
      );
      if (Objects.isEmpty(error)) {
        navigate(AppRoutes.Login);
      } else {
        setRegisterError(error);
      }
    }
  }

  function updateErrors() {
    setErrors({ ...errors });
    setRegisterError("");
  }

  function handleNameChange(e) {
    errors.name = "";
    updateErrors();
    setName(e.target.value);
  }

  function handlePhoneChange(e) {
    errors.phone = "";
    updateErrors();
    setPhone(e.target.value);
  }

  function handlePasswordChange(e) {
    errors.password = "";
    updateErrors();
    setPassword(e.target.value);
  }

  function handleConfirmPasswordChange(e) {
    errors.confirmPassword = "";
    updateErrors();
    setConfirmPassword(e.target.value);
  }

  return (
    <div className="Register">
      <HSpacer height="16px" />
      <header class="column-heading-container text-center mb-16" aria-label="Create Your Account"><svg class="kds-Icon kds-Icon--display" focusable="false" fill="currentColor" width="1em" height="1em" viewBox="0 0 16 16" data-name="Icon"><path d="M13.327 13.15a5.524 5.524 0 00-10.654-.001.688.688 0 00.67.855h9.314a.688.688 0 00.67-.855zm-9.91.124a4.775 4.775 0 019.16-.02zM8.047 8.354a3.18 3.18 0 10-3.18-3.179 3.18 3.18 0 003.18 3.18zm0-5.608a2.43 2.43 0 11-2.43 2.429 2.432 2.432 0 012.43-2.43z"></path></svg><h1 data-qa="createAccount-heading" class="kds-Heading kds-Heading--l kds-Text--bold m-auto my-4 py-1">Create Your Account</h1><span class="kds-Text--m text-default-800">Start saving right away when you create your digital account</span><span class="block h-4 w-1/3 min-w-ll-wide my-8 mx-auto bg-brand-800"></span></header>
      <form>
        <Input
          value={name}
          onChange={handleNameChange}
          label="Name"
          id="name"
          type="text"
          error={errors.name}
          required
        />
        <HSpacer height="8px" />
        <Input
          value={phone}
          onChange={handlePhoneChange}
          label="Phone"
          id="username"
          type="text"
          error={errors.phone}
          required
        />
        <HSpacer height="8px" />
        <Input
          value={password}
          onChange={handlePasswordChange}
          label="Password (min. 8 characters)"
          id="password"
          type="password"
          error={errors.password}
          required
        />
        <HSpacer height="8px" />
        <Input
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          label="Repeat password"
          id="confirm-password"
          type="password"
          error={errors.confirmPassword}
          required
        />
        <HSpacer height="16px" />
        <Button onClick={handleRegister}>Register</Button>
        <Error center>{registerError}</Error>
        <HSpacer height="16px" />
      </form>
    </div>
  );
}

export { Register };
