import { Link } from "react-router-dom"
import '/public/fonts/fonts.css'

export const Logo = () => {
    return (
        <Link to='/'>
            <div className="items-center hover:opacity-75 transition gap-x-2 hidden md:flex">
                <img
                    src="/tf-logo.svg"
                    alt="logo"
                    width={40}
                    height={40}
                />
                <p style={{ fontFamily: 'MyFont' }} >TaskFlow</p>
            </div>
        </Link>
    )
}