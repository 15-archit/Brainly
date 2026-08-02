import { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

const RegisterPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  async function sendRequest(endpoint, data) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(data),
    });

    const result = await res.json().catch(() => ({}));

    return {
      ok: res.ok,
      data: result,
    };
  }

  async function handleSignup(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const username = form.username.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (!username || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const { ok, data } = await sendRequest("/api/v1/signup", {
        username,
        email,
        password,
      });

      if (ok) {
        alert(data.message || "Account created successfully");
        form.reset();
      } else {
        alert(data.message || "Signup failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  async function handleLogin(e) {
    e.preventDefault();

    const form = e.currentTarget;

    const email = form.email.value.trim();
    const password = form.password.value;

    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      const { ok, data } = await sendRequest("/api/v1/signin", {
        email,
        password,
      });

      if (ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userID);

        alert(data.message || "Login successful");

        navigate("/HomePage");
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex">
      {/* Signup */}
      <div className="h-screen w-[30vw] bg-slate-300 ml-32 flex flex-col justify-center items-center">
        <div>
          <h1 className="text-3xl font-semibold">
            Welcome to{" "}
            <span className="text-blue-400">Second Brain</span>
          </h1>

          <p className="text-2xl font-semibold mt-2">
            Create your account
          </p>

          <form
            onSubmit={handleSignup}
            className="mt-7 flex flex-col gap-2"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              required
              className="outline-none h-12 w-[22vw] rounded-lg p-2 hover:bg-slate-100"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              className="outline-none h-12 w-[22vw] rounded-lg p-2 hover:bg-slate-100"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              className="outline-none h-12 w-[22vw] rounded-lg p-2 hover:bg-slate-100"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-400 px-4 py-2 rounded-2xl font-semibold hover:bg-blue-500 disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create my Account"}
            </button>
          </form>
        </div>
      </div>

      {/* OR */}
      <div className="h-screen w-[15vw] flex justify-center items-center">
        <span className="bg-blue-500 px-4 py-3 rounded-full text-white text-2xl">
          OR
        </span>
      </div>

      {/* Login */}
      <div className="flex flex-col h-screen justify-center">
        <h2 className="text-2xl font-semibold">
          Login to your account
        </h2>

        <form
          onSubmit={handleLogin}
          className="flex flex-col gap-3 mt-7"
        >
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="outline-none h-12 w-[22vw] rounded-lg p-2 bg-slate-100 hover:bg-slate-200 shadow-md"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="outline-none h-12 w-[22vw] rounded-lg p-2 bg-slate-100 hover:bg-slate-200 shadow-md"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-400 px-4 py-2 rounded-2xl font-semibold hover:bg-blue-500 disabled:bg-gray-400"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;