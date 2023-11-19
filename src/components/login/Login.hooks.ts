"use client"
import React, {useState} from "react";
import {debounceTime, Subject, switchMap} from "rxjs";


interface LoginData {
    email: string;
    password: string;
}

export function useLoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [passwordShown, setPasswordShown] = useState(false)

    const loginSubject = new Subject<LoginData>();
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

    const togglePasswordVisibility = () => {
        setPasswordShown(!passwordShown)
    }

    loginSubject.pipe(
        debounceTime(800),
        switchMap(async ({ email, password }) => {
            // 这里执行异步登录请求
            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ email, password }),
                });
                console.log('{ email, password }', { email, password });
                return await response.json();
            } catch (error) {
                return { error };
            }
        }),
    ).subscribe((result) => {
        // 根据响应处理
        if (result.error) {
            setError(result.error);
        } else {
            console.log('登录成功', result);
        }
    });

    // 登录逻辑
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // 这里添加登录验证逻辑
        // setError(...) 如果有错误
        loginSubject.next({ email, password });
    };

    return {
        email,
        password,
        error,
        passwordShown,
        handleEmailChange,
        handlePasswordChange,
        handleLogin,
        togglePasswordVisibility
    };
}