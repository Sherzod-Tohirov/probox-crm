import { Button, Input, Col, Row, Box } from "@components/ui";
import Logo from "@components/Logo";
import styles from "./login.module.scss";
import { useForm } from "react-hook-form";
import { loginSchema } from "@utils/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import * as r from "ramda";
import useAuth from "@hooks/useAuth";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

export default function Login() {
  const { isAuthenticated, handleLogin, loginState } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginSchema),
  });
  console.log(errors, "errors");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.login}>
      <motion.div className={styles["login-wrapper"]}>
        <Box dir="column" gap={3} align="center">
          <Logo isTouchable={false} />
          <AnimatePresence exitBeforeEnter>
            {loginState.isError && (
              <motion.span
                className={styles["error-desc"]}
                element="span"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                key="errorText">
                {loginState?.error?.response?.data?.message ||
                  "Login yoki parol xato !"}
              </motion.span>
            )}
          </AnimatePresence>
        </Box>
        <form
          className={styles.form}
          autoComplete="off"
          onSubmit={handleSubmit(handleLogin)}>
          <Row gutter={6}>
            <Col>
              <Input
                type="text"
                id="login"
                placeholder="Login (admin)"
                placeholderColor="secondary"
                variant="filled"
                icon="avatar"
                error={errors.login?.message}
                className={styles.input}
                {...register("login")}
              />
            </Col>
            <Col>
              <Input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Parol (1234)"
                placeholderColor="secondary"
                variant="filled"
                icon={showPassword ? "eyeClosed" : "eye"}
                onIconClick={() => setShowPassword((p) => !p)}
                className={styles.input}
                error={errors.password?.message}
                {...register("password")}
              />
            </Col>
            <Col fullWidth style={{ marginTop: "4px" }}>
              <Button
                fullWidth
                isLoading={loginState.isPending}
                type="submit"
                className={styles.button}
                disabled={r.isEmpty(errors) ? false : true}>
                Kirish
              </Button>
            </Col>
          </Row>
        </form>
      </motion.div>
    </div>
  );
}
