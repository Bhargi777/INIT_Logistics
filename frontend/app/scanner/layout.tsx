// Force dynamic rendering to prevent prerender errors with Supabase
export const dynamic = "force-dynamic";

export default function ScannerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
