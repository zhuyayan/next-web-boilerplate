import React, {useState} from "react";
import {debounceTime, Subject, switchMap} from "rxjs";

export function useThirdPartyLogin() {
    const loginSubject = new Subject();
    loginSubject.pipe(
        debounceTime(800),
        switchMap(async () => {
            // 这里执行异步登录请求
            // try {
            //     const response = await fetch('/api/login', {
            //         method: 'POST',
            //         body: JSON.stringify({ email, password }),
            //     });
            //     console.log('{ email, password }', { email, password });
            //     return await response.json();
            // } catch (error) {
            //     return { error };
            // }
        }),
    ).subscribe((result) => {
        // 根据响应处理
        // if (result.error) {
        //     setError(result.error);
        // } else {
        //     console.log('登录成功', result);
        // }
    });

    // 登录逻辑
    const onGoogleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        // 这里添加登录验证逻辑
        // setError(...) 如果有错误
        loginSubject.next(e);
    };

    return {
        onGoogleLogin,
    };
}