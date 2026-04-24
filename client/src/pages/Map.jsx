import { useEffect, useState, useRef } from "react";
import Navbar from "../components/common/Navbar";
import Sidebar from "../components/common/Sidebar";
import { startWorkout, endWorkout, getActiveWorkout, saveWorkoutRoute } from "../services/workoutTrackingService";
import Loader from "../components/common/Loader";

export default function Map() {
  const [workoutActive, setWorkoutActive] = useState(false);
  const [workoutData, setWorkoutData] = useState({
    distance: 0,
    calories: 0,
    laps: 0,
    speed: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    duration: 0,
    steps: 0,
    route: [],
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [activeWorkoutId, setActiveWorkoutId] = useState(null);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);
  const positionCountRef = useRef(0);
  const routeRef = useRef([]);
  const speedHistoryRef = useRef([]);

  useEffect(() => {
    checkActiveWorkout();
  }, []);

  const checkActiveWorkout = async () => {
    try {
      const response = await getActiveWorkout();
      if (response.data) {
        setWorkoutActive(true);
        setActiveWorkoutId(response.data._id);
        startTimeRef.current = new Date(response.data.startTime);
        setWorkoutData({
          distance: response.data.distance || 0,
          calories: response.data.calories || 0,
          laps: response.data.laps || 0,
          speed: 0,
          maxSpeed: response.data.maxSpeed || 0,
          avgSpeed: response.data.avgSpeed || 0,
          duration: response.data.duration || 0,
          steps: response.data.steps || 0,
          route: response.data.route || [],
        });
        routeRef.current = response.data.route || [];
      }
    } catch (err) {
      // No active workout
    } finally {
      setLoading(false);
    }
  };

  const startWorkoutSession = async () => {
    setMessage("");
    try {
      const response = await startWorkout({
        type: "field_training",
        startTime: new Date(),
      });
      setActiveWorkoutId(response.data._id);
      startTimeRef.current = new Date();
      routeRef.current = [];
      speedHistoryRef.current = [];
      positionCountRef.current = 0;
      setWorkoutActive(true);
      setWorkoutData({
        distance: 0,
        calories: 0,
        laps: 0,
        speed: 0,
        maxSpeed: 0,
        avgSpeed: 0,
        duration: 0,
        steps: 0,
        route: [],
      });
      setMessage("Workout started!");
      startTracking();
    } catch (err) {
      setMessage("Failed to start workout");
    }
  };

  const startTracking = () => {
    if (timerRef.current) clearInterval(timerRef.current);

    timerRef.current = setInterval(() => {
      setWorkoutData((prev) => {
        const newDistance = prev.distance + 0.05; // Simulate 50m per second
        const newSteps = prev.steps + 1;
        const newCalories = prev.calories + 0.15; // Calories per second
        const newDuration = Math.floor((new Date() - startTimeRef.current) / 1000);
        const newSpeed = 0.05 * 3.6; // km/h (0.05 km * 3.6)
        const lapDistance = 0.4; // 400m lap

        speedHistoryRef.current.push(newSpeed);
        const avgSpeed = speedHistoryRef.current.length > 0
          ? (speedHistoryRef.current.reduce((a, b) => a + b, 0) / speedHistoryRef.current.length).toFixed(2)
          : 0;

        const newLaps = Math.floor(newDistance / lapDistance);
        const maxSpeed = Math.max(...speedHistoryRef.current, prev.maxSpeed);

        // Simulate GPS route
        positionCountRef.current++;
        const angle = (positionCountRef.current * 5) % 360;
        const rad = (angle * Math.PI) / 180;
        const x = 100 * Math.cos(rad);
        const y = 100 * Math.sin(rad);
        routeRef.current.push({ lat: x, lng: y, time: newDuration });

        return {
          distance: parseFloat(newDistance.toFixed(2)),
          calories: parseFloat(newCalories.toFixed(1)),
          laps: newLaps,
          speed: newSpeed.toFixed(1),
          maxSpeed: maxSpeed.toFixed(1),
          avgSpeed,
          duration: newDuration,
          steps: newSteps,
          route: routeRef.current,
        };
      });
    }, 1000);
  };

  const endWorkoutSession = async () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setMessage("");

    try {
      const finalData = {
        ...workoutData,
        endTime: new Date(),
        route: routeRef.current,
      };
      await endWorkout(activeWorkoutId, finalData);
      await saveWorkoutRoute(activeWorkoutId, routeRef.current);
      setWorkoutActive(false);
      setActiveWorkoutId(null);
      setMessage("Workout saved successfully!");

      // Reset after 2 seconds
      setTimeout(() => {
        setWorkoutData({
          distance: 0,
          calories: 0,
          laps: 0,
          speed: 0,
          maxSpeed: 0,
          avgSpeed: 0,
          duration: 0,
          steps: 0,
          route: [],
        });
        setMessage("");
      }, 2000);
    } catch (err) {
      setMessage("Failed to save workout");
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) return <Loader />;

  return (
    <div className="app-shell">
      <Sidebar />
      <div className="page-content">
        <Navbar />
        <section className="map-container">
          <div className="map-header">
            <h1>Ground Map & Workout Tracking</h1>
            <p>Real-time performance tracking while playing on the field</p>
          </div>

          <div className="map-layout">
            {/* Field Map */}
            <div className="field-map">
              <svg viewBox="0 0 300 200" className="field-svg">
                {/* Field background */}
                <rect width="300" height="200" fill="#2d5016" />
                {/* Field lines */}
                <line x1="0" y1="100" x2="300" y2="100" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
                <circle cx="150" cy="100" r="40" fill="none" stroke="white" strokeWidth="2" />
                <circle cx="150" cy="100" r="2" fill="white" />
                <rect x="10" y="70" width="30" height="60" fill="none" stroke="white" strokeWidth="2" />
                <rect x="260" y="70" width="30" height="60" fill="none" stroke="white" strokeWidth="2" />

                {/* Player position (moving along the route) */}
                {workoutData.route.length > 0 && (
                  <>
                    {/* Route trace */}
                    <polyline
                      points={workoutData.route
                        .map((p) => `${150 + p.lng},${100 + p.lat}`)
                        .join(" ")}
                      fill="none"
                      stroke="rgba(255, 255, 0, 0.6)"
                      strokeWidth="2"
                    />
                    {/* Current position */}
                    <circle
                      cx={150 + workoutData.route[workoutData.route.length - 1].lng}
                      cy={100 + workoutData.route[workoutData.route.length - 1].lat}
                      r="5"
                      fill="#00ff00"
                    />
                  </>
                )}
                {workoutActive && !workoutData.route.length && (
                  <circle cx="150" cy="100" r="5" fill="#00ff00" />
                )}
              </svg>
            </div>

            {/* Stats Panel */}
            <div className="stats-panel">
              <div className="stat-box">
                <h3>Duration</h3>
                <p className="stat-value">{formatTime(workoutData.duration)}</p>
              </div>

              <div className="stat-box">
                <h3>Distance</h3>
                <p className="stat-value">{workoutData.distance.toFixed(2)} km</p>
              </div>

              <div className="stat-box">
                <h3>Laps Completed</h3>
                <p className="stat-value">{workoutData.laps}</p>
              </div>

              <div className="stat-box">
                <h3>Current Speed</h3>
                <p className="stat-value">{workoutData.speed} km/h</p>
              </div>

              <div className="stat-box">
                <h3>Max Speed</h3>
                <p className="stat-value">{workoutData.maxSpeed} km/h</p>
              </div>

              <div className="stat-box">
                <h3>Avg Speed</h3>
                <p className="stat-value">{workoutData.avgSpeed} km/h</p>
              </div>

              <div className="stat-box">
                <h3>Calories Burned</h3>
                <p className="stat-value">{workoutData.calories.toFixed(1)} kcal</p>
              </div>

              <div className="stat-box">
                <h3>Steps</h3>
                <p className="stat-value">{workoutData.steps}</p>
              </div>

              {message && <p className="message">{message}</p>}

              <div className="workout-controls">
                {!workoutActive ? (
                  <button className="btn btn-primary btn-lg" onClick={startWorkoutSession}>
                    Start Workout
                  </button>
                ) : (
                  <button className="btn btn-danger btn-lg" onClick={endWorkoutSession}>
                    End Workout
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Performance Summary */}
          {workoutActive && (
            <div className="performance-summary">
              <h2>Performance Feedback</h2>
              <div className="feedback-content">
                <div className="feedback-item">
                  <span>🏃 Movement:</span>
                  <p>Great pace! Keep maintaining your current speed.</p>
                </div>
                <div className="feedback-item">
                  <span>⚡ Intensity:</span>
                  <p>Moderate intensity detected. Push harder for better results!</p>
                </div>
                <div className="feedback-item">
                  <span>📊 Efficiency:</span>
                  <p>Good coverage of the field. {workoutData.laps > 0 ? `${workoutData.laps} laps completed!` : "Keep going!"}</p>
                </div>
                <div className="feedback-item">
                  <span>🔥 Burn Rate:</span>
                  <p>{(workoutData.calories / Math.max(workoutData.duration / 60, 1)).toFixed(1)} kcal/min - {workoutData.calories / Math.max(workoutData.duration / 60, 1) > 10 ? "Excellent!" : "Good"}</p>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
