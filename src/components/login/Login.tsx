"use client"
import {useDispatch} from "react-redux";
import {fetchData, logIn} from "@/redux/features/login-slice";
import React from "react";
import {ThunkDispatch} from "redux-thunk";
import {AnyAction} from "redux";

export default function Login(){
    const dispatch = useDispatch()
  const thunkDispatch: ThunkDispatch<any, any, AnyAction> = useDispatch();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("fetch data....")
    // Dispatch an action or perform any other operations on form submission
    const username = (document.getElementById("username") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;
    // 执行登录验证逻辑

    thunkDispatch(fetchData())
  };

  return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-80">
            <h2 className="text-2xl font-semibold mb-6">用户登录</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-700 font-medium mb-2">用户名</label>
                <input type="username" id="username" name="username"
                       className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       placeholder="请输入你的用户名" required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">密码</label>
                <input type="password" id="password" name="password"
                       className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       placeholder="请输入你的密码" required />
              </div>
              <button type="submit"
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                登录
              </button>
            </form>
          </div>
        </div>
  )
}