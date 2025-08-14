import * as React from 'react';
type Props = {
    roles?: Array<'ADMIN' | 'STAFF' | 'PENSIONER'>;
    children: React.ReactNode;
};
export default function Protected({ roles, children }: Props): import("react/jsx-runtime").JSX.Element;
export {};
