import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../API";
import { getStoredToken, isAdminToken, setStoredToken } from "../auth";
import googleIcon from "../assets/icons/google-login.png";
import vocoIcon from "../assets/branding/voco-login-black.png";

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_WEB_CLIENT_ID || import.meta.env.VITE_GOOGLE_CLIENT_ID || "";

const Login = () => {
  const navigate = useNavigate();
  const [accountname, setAccountname] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleReady, setIsGoogleReady] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const completeAdminLogin = (token, fallbackError) => {
    if (!token) {
      setStoredToken(null);
      setErrorMessage(fallbackError);
      return false;
    }

    if (!isAdminToken(token)) {
      setStoredToken(null);
      setErrorMessage("Sellel kontol puuduvad admini õigused");
      return false;
    }

    setStoredToken(token);
    navigate("/", { replace: true });
    return true;
  };

  useEffect(() => {
    const token = getStoredToken();
    if (isAdminToken(token)) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: async (response) => {
          if (!response?.credential) {
            setIsGoogleLoading(false);
            setErrorMessage("Google sisselogimine ebaõnnestus");
            return;
          }

          try {
            const loginResponse = await fetch(`${API_BASE_URL}/api/user/google-login`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ idToken: response.credential }),
            });

            const data = await loginResponse.json();
            if (!loginResponse.ok || !data?.success) {
              setStoredToken(null);
              setErrorMessage(data?.error || data?.message || "Google sisselogimine ebaõnnestus");
              return;
            }

            completeAdminLogin(data?.token, "Google sisselogimine ebaõnnestus");
          } catch {
            setStoredToken(null);
            setErrorMessage("Serveriga ei saanud ühendust");
          } finally {
            setIsGoogleLoading(false);
          }
        },
      });

      setIsGoogleReady(true);
    };

    initializeGoogle();
    if (window.google?.accounts?.id) {
      return;
    }

    const existingScript = document.getElementById("google-identity-script");
    if (existingScript) {
      existingScript.addEventListener("load", initializeGoogle);
      return () => {
        existingScript.removeEventListener("load", initializeGoogle);
      };
    }

    const script = document.createElement("script");
    script.id = "google-identity-script";
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogle;
    document.head.appendChild(script);

    return () => {
      script.onload = null;
    };
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!accountname.trim() || !password.trim()) {
      setErrorMessage("Vale kasutajanimi või parool");
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await fetch(`${API_BASE_URL}/api/user/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          accountname: accountname.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data?.success || !data?.token) {
        setStoredToken(null);
        setErrorMessage(data?.error || data?.message || "Vale kasutajanimi või parool");
        return;
      }

      completeAdminLogin(data.token, "Vale kasutajanimi või parool");
    } catch {
      setStoredToken(null);
      setErrorMessage("Serveriga ei saanud ühendust");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    if (!GOOGLE_CLIENT_ID) {
      setErrorMessage("Google sisselogimine pole seadistatud");
      return;
    }

    if (!window.google?.accounts?.id || !isGoogleReady) {
      setErrorMessage("Google sisselogimine pole valmis");
      return;
    }

    setErrorMessage("");
    setIsGoogleLoading(true);
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        setIsGoogleLoading(false);
        setErrorMessage("Google sisselogimine ebaõnnestus");
      }
    });
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        <h1 className="admin-login-title">Jätkamiseks logige sisse</h1>

        <form className="admin-login-form" onSubmit={handleSubmit}>
          <input
            className="admin-login-input"
            value={accountname}
            onChange={(event) => setAccountname(event.target.value)}
            placeholder="Kasutajanimi"
            autoComplete="username"
          />

          <input
            className="admin-login-input"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            type="password"
            placeholder="Parool"
            autoComplete="current-password"
          />

          <p className="admin-login-error">{errorMessage || " "}</p>

          <button className="admin-login-button admin-login-button-primary" type="submit" disabled={isLoading}>
            {isLoading ? "Laen..." : "Logi sisse"}
          </button>

          <button
            className="admin-login-button admin-login-button-google"
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading || isGoogleLoading}
          >
            <img className="admin-login-button-icon" src={googleIcon} alt="Google" />
            <span>{isGoogleLoading ? "Laen..." : "Sisene Google'iga"}</span>
          </button>

          <button className="admin-login-button admin-login-button-intranet" type="button">
            <img className="admin-login-voco-icon" src={vocoIcon} alt="Voco" />
            <span>Sisene Siseveebiga</span>
          </button>

          <p className="admin-login-terms">Teenuse kasutamisel nõustute meie kasutustingimustega.</p>
        </form>
      </div>
    </div>
  );
};

export default Login;