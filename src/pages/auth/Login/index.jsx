import { Button, Input, Col, Row, Box } from "@components/ui";
import Logo from "@components/Logo";
import styles from "./login.module.scss";
import { useForm } from "react-hook-form";
import { loginSchema } from "@utils/validationSchemas";
import { yupResolver } from "@hookform/resolvers/yup";
import * as r from "ramda";
import useAuth from "@hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Typography } from "@components/ui";

export default function Login() {
  const { isAuthenticated, setIsAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isLoginValid, setIsLoginValid] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(loginSchema),
  });
  const onSubmit = (data) => {
    setIsLoading(true);
    setTimeout(() => {
      if (r.isEmpty(errors)) {
        if (data.username === "admin" && data.password === "admin") {
          console.log(data, "data");
          setIsAuthenticated(true);
          navigate("/");
          console.log("Login successful");
          setIsLoginValid(true);
        } else {
          console.log("Invalid credentials");
          setIsLoginValid(false);
        }

        setIsLoading(false);
      }
    }, 2000);
  };
  console.log(errors, "errors");

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className={styles.login}>
      <div className={styles["login-wrapper"]}>
        <Box dir="column" gap={3} align="center">
          <Logo isTouchable={false} />
          {isLoginValid === false && (
            <Typography className={styles["error-desc"]} element="span">
              Invalid username or password !
            </Typography>
          )}
        </Box>
        <form
          className={styles.form}
          autoComplete="off"
          onSubmit={handleSubmit(onSubmit)}>
          <Row gutter={4}>
            <Col>
              <Input
                type="text"
                name="username"
                id="username"
                placeholder="Username (test user: admin)"
                variant="filled"
                icon="avatar"
                error={errors.username?.message}
                className={styles.input}
                {...register("username")}
              />
            </Col>
            <Col>
              <Input
                type="password"
                name="password"
                id="password"
                placeholder="Password (test password: admin)"
                variant="filled"
                icon="lock"
                className={styles.input}
                error={errors.password?.message}
                {...register("password")}
              />
            </Col>
            <Col fullWidth>
              <Button
                fullWidth
                isLoading={isLoading}
                type="submit"
                className={styles.button}
                disabled={r.isEmpty(errors) ? false : true}>
                Login
              </Button>
            </Col>
          </Row>
        </form>
      </div>
    </div>
  );
}
