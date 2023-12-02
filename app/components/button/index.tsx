import React from "react";
import { Form } from "@remix-run/react";

export const ButtonLink = ({
  cta,
  ...props
}: { cta: string } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a
    {...props}
    role="button"
    className={`hover:bg-purple-dark inline-block rounded bg-indigo-500 px-4 py-2 font-bold text-white shadow shadow-indigo-500 transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-indigo-500 ${props.className}`}
  >
    {cta}
  </a>
);

export const LogoutButton = ({ cta }: { cta: string }) => (
  <Form action="/logout" method="post">
    <button className="hover:bg-purple-dark rounded bg-indigo-500 px-4 py-2 font-bold text-white">
      {cta}
    </button>
  </Form>
);

export const Button = ({
  cta,
  onClick,
  children,
  ...props
}: {
  cta?: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button
    {...props}
    onClick={() => onClick && onClick()}
    className={`hover:bg-purple-dark inline-block rounded bg-indigo-500 px-4 py-2 font-bold text-white shadow shadow-indigo-500 transition-shadow duration-300 ease-in-out hover:shadow-md hover:shadow-indigo-500 ${props.className}`}
  >
    {children || cta}
  </button>
);
