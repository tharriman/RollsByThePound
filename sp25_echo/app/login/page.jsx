import { Suspense } from "react";
import LoginComponent from "@/app/components/LoginComponent";

export default function LoginPage() {
    return (
        <Suspense fallback={<p>Loading....</p>}>
            <LoginComponent />
        </Suspense>
    )
}
