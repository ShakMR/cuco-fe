import { Form } from "@remix-run/react";

export const ButtonLink = ({ cta, ...props }: { cta: string } & React.HTMLProps<HTMLButtonElement>) =>
// @ts-ignore
  <a {...props} role="button" className={`bg-indigo-500 hover:bg-purple-dark text-white font-bold py-2 px-4 rounded inline-block shadow shadow-indigo-500 hover:shadow-md hover:shadow-indigo-500 transition-shadow ease-in-out duration-300 ${props.className}`}>{cta}</a>;


export const LogoutButton = ({ cta }: { cta: string }) =>
  <Form action="/logout" method="post">
    <button className="bg-indigo-500 hover:bg-purple-dark text-white font-bold py-2 px-4 rounded">{cta}</button>
  </Form>;
