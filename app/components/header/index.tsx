import { Button, ButtonLink, LogoutButton } from "~/components/button";

type Props = {
  isLoggedIn: boolean;
  loginHref: string;
  onMenuClick: () => void;
};

export const Header = ({ isLoggedIn, loginHref, onMenuClick }: Props) => {
  return (
    <header className="flex items-center justify-between bg-indigo-500 px-4 py-6 text-white">
      <Button
        className="break-after-auto rounded px-2 py-2 transition-colors hover:bg-purple-500 md:hidden"
        onClick={() => onMenuClick()}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
          />
        </svg>
      </Button>
      <h1 className="text-xl font-bold tracking-widest">CuCo</h1>
      <div>
        {isLoggedIn ? (
          <LogoutButton cta="Log out" />
        ) : (
          <ButtonLink cta="Log In" href={loginHref} />
        )}
      </div>
    </header>
  );
};
