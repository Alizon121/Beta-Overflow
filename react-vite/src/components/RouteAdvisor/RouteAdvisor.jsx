import { useState } from "react"
import { GRADES_BOULDER, GRADES_SPORT_TRAD, STYLES } from "../../variables/route_vars"
import "./RouteAdvisor.css"

function StarRating({ rating }) {
  const full = Math.floor(rating)
  const half = rating - full >= 0.5
  const stars = []
  for (let i = 0; i < 5; i++) {
    if (i < full) stars.push("★")
    else if (i === full && half) stars.push("½")
    else stars.push("☆")
  }
  return <span className="route_stars">{stars.join("")} {rating.toFixed(1)}</span>
}

function RouteCard({ route }) {
  return (
    <div className="route_card">
      <div className="route_card_header">
        <span className="route_name">{route.name}</span>
        <span className="route_grade_badge">{route.grade}</span>
      </div>
      <div className="route_meta">
        <span className="route_style">{route.style}</span>
        <span className="route_crag">{route.crag}</span>
        {route.rating != null && <StarRating rating={route.rating} />}
      </div>
      <p className="route_description">{route.description}</p>
    </div>
  )
}

function RouteAdvisor() {
  const [cragLocation, setCragLocation] = useState("")
  const [country, setCountry] = useState("")
  const [state, setState] = useState("")
  const [region, setRegion] = useState("")
  const [style, setStyle] = useState("Sport")
  const [grade, setGrade] = useState("5.10a")
  const [ratingPreference, setRatingPreference] = useState("any")
  const [mostClimbed, setMostClimbed] = useState(false)
  const [routes, setRoutes] = useState([])
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const gradeOptions = style === "Boulder" ? GRADES_BOULDER : GRADES_SPORT_TRAD

  const handleStyleChange = (e) => {
    const newStyle = e.target.value
    setStyle(newStyle)
    setGrade(newStyle === "Boulder" ? "V0" : "5.10a")
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setRoutes([])
    setMessage("")

    try {
      const res = await fetch("/api/ai/suggest-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crag_location: cragLocation,
          country: country,
          state: state ? state : null,
          region: region ? region : null,
          grade,
          style,
          rating_preference: ratingPreference,
          most_climbed: mostClimbed,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || "Something went wrong.")
      } else {
        setRoutes(data.routes || [])
        setMessage(data.message || "")
      }
    } catch {
      setError("Failed to reach the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="route_advisor_container">
      <h2 className="route_advisor_title">Route Advisor</h2>
      <p className="route_advisor_subtitle">
        Describe what you're looking for and get up to 5 route suggestions.
      </p>

      <form className="route_advisor_form" onSubmit={handleSubmit}>
        <label className="route_advisor_label">
          Crag / Location
          <input
            className="route_advisor_input"
            type="text"
            placeholder="e.g. Red River Gorge, Smith Rock, Yosemite"
            value={cragLocation}
            onChange={(e) => setCragLocation(e.target.value)}
            required
          />
        </label>
        <label className="route_advisor_label">
          Country
          <input
            className="route_advisor_input"
            type="text"
            placeholder="e.g. USA, France, Spain"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
        </label>
        {country == "USA" && 
        <label className="route_advisor_label">
          State
          <input
            className="route_advisor_input"
            type="text"
            placeholder="State (e.g. Colorado, California)"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        }

        {country != "USA" &&
        <label className="route_advisor_label">
          Region
          <input
            className="route_advisor_input"
            type="text"
            placeholder="Region (e.g. Andalusia, Provence)"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </label>
        }
        

        <label className="route_advisor_label">
          Style
          <select
            className="route_advisor_select"
            value={style}
            onChange={handleStyleChange}
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </label>

        <label className="route_advisor_label">
          Grade
          <select
            className="route_advisor_select"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          >
            {gradeOptions.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </label>

        <label className="route_advisor_label">
          Rating Preference
          <select
            className="route_advisor_select"
            value={ratingPreference}
            onChange={(e) => setRatingPreference(e.target.value)}
          >
            <option value="any">Any rating</option>
            <option value="highly_rated">Highly rated (4+ stars)</option>
            <option value="top_rated">Top rated (4.5+ stars)</option>
          </select>
        </label>

        <label className="route_advisor_checkbox_label">
          <input
            type="checkbox"
            checked={mostClimbed}
            onChange={(e) => setMostClimbed(e.target.checked)}
          />
          Prioritize most-climbed / classic routes
        </label>

        <button className="route_advisor_submit" type="submit" disabled={loading}>
          {loading ? "Finding routes..." : "Find Routes"}
        </button>
      </form>

      {error && <p className="route_advisor_error">{error}</p>}

      {message && routes.length === 0 && (
        <p className="route_advisor_message">{message}</p>
      )}

      {routes.length > 0 && (
        <div className="route_results">
          <h3 className="route_results_title">Suggested Routes</h3>
          {routes.map((route, i) => (
            <RouteCard key={i} route={route} />
          ))}
          {message && <p className="route_advisor_message">{message}</p>}
        </div>
      )}
    </div>
  )
}

export default RouteAdvisor
