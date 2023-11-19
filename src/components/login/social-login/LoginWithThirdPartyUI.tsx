import React from 'react';

interface LoginWithThirdPartyUIProps {
    onGoogleLogin: (e: React.FormEvent) => Promise<void>;
}

const LoginWithThirdPartyUI: React.FC<LoginWithThirdPartyUIProps> = (
    {
        onGoogleLogin,
    }) => {
    return (
        <>
            <button onClick={onGoogleLogin}>
                Sign in with Google
            </button>
        </>
    );
};

export default LoginWithThirdPartyUI;