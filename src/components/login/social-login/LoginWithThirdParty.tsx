import {useThirdPartyLogin} from "@/components/login/social-login/LoginWithThreadParty.hooks";
import React from "react";

interface RenderProps {
    onGoogleLogin: (e: React.FormEvent) => void;
}

interface LoginWithThirdPartyProps {
    render: (props: RenderProps) => React.ReactNode;
}


const LoginWithThirdParty: React.FC<LoginWithThirdPartyProps> = ({render}) => {
    const {
        onGoogleLogin,
    } = useThirdPartyLogin();

    return render({ onGoogleLogin });
}

export default LoginWithThirdParty;

