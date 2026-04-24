import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    age: 20,
    position: "Midfielder",
    height: 175,
    weight: 70,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (!form.age || form.age < 10 || form.age > 100) {
      newErrors.age = "Age must be between 10 and 100";
    }
    if (!form.height || form.height < 100 || form.height > 250) {
      newErrors.height = "Height must be between 100 and 250 cm";
    }
    if (!form.weight || form.weight < 30 || form.weight > 200) {
      newErrors.weight = "Weight must be between 30 and 200 kg";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage("");
    if (!validateForm()) return;
    setLoading(true);

    try {
      const result = await register(form);
      if (result.success) {
        navigate("/dashboard");
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      setMessage("Unable to register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2>Create account</h2>
        <p>Register and start tracking football fitness.</p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Name</label>
            <input name="name" value={form.name} onChange={handleChange} required />
            {errors.name && <p className="input-error">{errors.name}</p>}
          </div>
          <div>
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
            {errors.email && <p className="input-error">{errors.email}</p>}
          </div>
          <div>
            <label>Password</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} required />
            {errors.password && <p className="input-error">{errors.password}</p>}
          </div>
          <div>
            <label>Age</label>
            <input name="age" type="number" value={form.age} onChange={handleChange} required />
            {errors.age && <p className="input-error">{errors.age}</p>}
          </div>
          <div>
            <label>Position</label>
            <select name="position" value={form.position} onChange={handleChange}>
              <option>Striker</option>
              <option>Midfielder</option>
              <option>Defender</option>
            </select>
          </div>
          <div>
            <label>Height (cm)</label>
            <input name="height" type="number" value={form.height} onChange={handleChange} required />
            {errors.height && <p className="input-error">{errors.height}</p>}
          </div>
          <div>
            <label>Weight (kg)</label>
            <input name="weight" type="number" value={form.weight} onChange={handleChange} required />
            {errors.weight && <p className="input-error">{errors.weight}</p>}
          </div>
          {message && <p className="error-message">{message}</p>}
          <button className="btn btn-primary" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Register"}
          </button>
        </form>
        <p>
          Already have account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
}
