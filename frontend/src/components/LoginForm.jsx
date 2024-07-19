import React from "react";
import styled from "styled-components";
import authStore from "../stores/authStore";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const store = authStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    await store.login();

    //navigate
    navigate("/")
  }

  return (
    <Container>
      <Title>Login</Title>
      <Form onSubmit={handleLogin}>
        <Input
          onChange={store.updateLoginForm}
          value={store.loginForm.email}
          type="email"
          name="email"
          placeholder="Email"
        />
        <Input
          onChange={store.updateLoginForm}
          value={store.loginForm.password}
          type="password"
          name="password"
          placeholder="Password"
        />
        <Button type="submit">Login</Button>
      </Form>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Title = styled.h2`
  font-size: 24px;
  margin-bottom: 16px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Input = styled.input`
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 200px;
`;

const Button = styled.button`
  padding: 8px 16px;
  background-color: #007bff;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

export default LoginForm;
