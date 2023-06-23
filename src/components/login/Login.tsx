export default function Login(){
  return (
      <>
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
          <div className="bg-white p-8 rounded shadow-md w-80">
            <h2 className="text-2xl font-semibold mb-6">Login</h2>
            <form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email</label>
                <input type="email" id="email" name="email"
                       className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       placeholder="Enter your email" required />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
                <input type="password" id="password" name="password"
                       className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                       placeholder="Enter your password" required />
              </div>
              <button type="submit"
                      className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors duration-300">
                Log In
              </button>
            </form>
          </div>
        </div>
      </>
  )
}