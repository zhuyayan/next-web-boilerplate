import React, {Suspense} from "react";
import Loading from "@/app/login/loading";

const AppLogin = React.lazy(() => import("@/components/login/social-login/SocialLogin"));

export default function LoginPage() {
  return (
      <>
          <Suspense fallback={<Loading />}>
              <AppLogin />
          </Suspense>
      </>
  )
}