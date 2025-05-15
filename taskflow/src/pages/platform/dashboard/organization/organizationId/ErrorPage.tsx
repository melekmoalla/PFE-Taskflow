import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import '/public/fonts/fonts.css';

export default function ErrorPage() {
    return (
        <main className="flex flex-col items-center justify-center min-h-screen space-y-10 px-6 text-center" aria-label="Error Page">


            <Link to="/" className="hidden md:flex items-center gap-x-3 hover:opacity-80 transition">
                <img
                    src="/tf-logo.svg"
                    alt="TaskFlow logo"
                    width={70}
                    height={70}
                />
                <p className="text-3xl font-bold tracking-wide" style={{ fontFamily: 'MyFont, sans-serif' }}>
                    TaskFlow
                </p>
            </Link>


            <div className="text-6xl md:text-8xl font-extrabold bg-gradient-to-tr from-sky-400 to-blue-800 text-white px-8 py-6 rounded-xl shadow-lg">
                404
            </div>

      
            <h2 className="text-3xl md:text-5xl font-semibold">
                Page not found.
            </h2>

            <p className="text-neutral-500 text-lg md:text-2xl max-w-lg md:max-w-2xl">
                Sorry, we couldn’t find the page you’re looking for.
            </p>

            <Button className="mt-6 px-10 py-6 text-lg md:text-xl" size="lg" asChild>
                <Link to="/sign-up">Go back home</Link>
            </Button>
        </main>
    );
}
