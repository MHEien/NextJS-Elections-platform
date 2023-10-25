import AuthForm from "./components/AuthForm";
import { AdminLogin } from "./components/AdminLogin";

export default function LoginPage() {
    return (
        <div className="min-h-screen flex flex-col justify-center items-center space-y-4 px-4 py-12">
            <AuthForm />
            <AdminLogin />
        </div>
    )
}
