"use client"
import React from "react";
import BaseLoginUI from "@/components/login/BaseLoginUI";
import {useLoginForm} from "@/components/login/Login.hooks";

// 样式管理
// 操作管理
// 数据管理
// 业务逻辑管理
// 事件管理
// 事件处理
// 事件监听
// 属性管理

export default function Login() : React.JSX.Element {
  const {
    email,
    password,
    error,
    passwordShown,
    handleEmailChange,
    handlePasswordChange,
    handleLogin,
    togglePasswordVisibility,
  } = useLoginForm();

  return (
      <BaseLoginUI
          email={email}
          password={password}
          error={error}
          passwordShown={passwordShown}
          onEmailChange={handleEmailChange}
          onPasswordChange={handlePasswordChange}
          onLogin={handleLogin}
          togglePasswordVisibility={togglePasswordVisibility}
      />
  )
}
