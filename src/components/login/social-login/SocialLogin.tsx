import LoginWithThirdParty from "@/components/login/social-login/LoginWithThirdParty";
import BaseLoginUI from "../BaseLoginUI";
import LoginWithThirdPartyUI from "@/components/login/social-login/LoginWithThirdPartyUI";
import {useLoginForm} from "@/components/login/Login.hooks";
import {useThirdPartyLogin} from "@/components/login/social-login/LoginWithThreadParty.hooks";
import React from "react";

export default function SocialLogin(): React.JSX.Element {
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

    const {
        onGoogleLogin,
    } = useThirdPartyLogin();
    return (
        <LoginWithThirdParty
            render={() => (
                <>
                    <BaseLoginUI
                        email={email}
                        password={password}
                        error={error}
                        passwordShown={passwordShown}
                        onEmailChange={handleEmailChange}
                        onPasswordChange={handlePasswordChange}
                        onLogin={handleLogin}
                        togglePasswordVisibility={togglePasswordVisibility} />
                    <LoginWithThirdPartyUI onGoogleLogin={onGoogleLogin} />
                </>
            )}
        />
    );
};