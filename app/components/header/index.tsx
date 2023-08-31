import { ButtonLink, LogoutButton } from "~/components/button";

type Props = {
  isLoggedIn: boolean,
  loginHref: string
}

export const Header = ({ isLoggedIn, loginHref }: Props) => {
  return <header className="flex bg-indigo-500 py-6 justify-between items-center px-4 text-white">
    <a className="md:invisible transition-colors hover:bg-purple-500 py-2 px-2 rounded break-after-auto">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
      </svg>
    </a>
    <h1 className="text-xl font-bold tracking-widest">
      CuCo
    </h1>
    <div>
      {isLoggedIn
        ? <LogoutButton cta="Log out"/>
        : <ButtonLink cta="Log In" href={loginHref} />
      }
    </div>
  </header>;
};