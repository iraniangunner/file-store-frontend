
export const metadata = {
  robots: { index: false, follow: false, nocache: true },
};

export default function MainPage() {
  return (
     <div>
      <h1 className="text-2xl font-semibold">Dashboard Content</h1>
      <p className="text-default-500 mt-2">
        This is where your main page content goes.
      </p>
    </div>
  );
}
