export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Luxe Studio. Built with Next.js & NestJS.
      </div>
    </footer>
  );
}