import Link from "next/link";
import './globals.css'

export default function NotFound() {
    return (
        <main className="text-center">
            <h1 className="text-3xl">There was a problem.</h1>
            <p className="p404p">We could not find the page you were looking for.
            Please go back to the &nbsp; <Link href={"./"}> homepage</Link></p>
        </main>
    )
}