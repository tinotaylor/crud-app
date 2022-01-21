export default function Header() {
  return (
    <div className="relative z-[2] bg-white">
      <div className="max-w-7xl mx-auto py-16 px-4 sm:pt-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Knowledge is power and Freedom
          </p>
          <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
            Start listening for free, then upgrade your plan to listen to more titles. Account
            plans unlock additional features.
          </p>
        </div>
        <div className="hidden md:flex items-center justify-center w-full">
          <a
            href="#"
            className="mt-8 whitespace-nowrap inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Start your subscription today
          </a>
        </div>
      </div>
    </div>
  );
}
