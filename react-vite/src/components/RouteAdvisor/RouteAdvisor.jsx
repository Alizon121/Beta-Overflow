import { useState, useEffect } from "react"
import { GRADES_BOULDER, GRADES_SPORT_TRAD, STYLES, US_STATES } from "../../variables/route_vars"
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
  const [country, setCountry] = useState("USA")
  const [state, setState] = useState("")
  const [region, setRegion] = useState("")
  const [areas, setAreas] = useState([])
  const [areasLoading, setAreasLoading] = useState(false)
  const [areasError, setAreasError] = useState("")
  const [cragLocation, setCragLocation] = useState("")
  const [style, setStyle] = useState("Sport")
  const [grade, setGrade] = useState("5.10a")
  const [ratingPreference, setRatingPreference] = useState("any")
  const [mostClimbed, setMostClimbed] = useState(false)
  const [routes, setRoutes] = useState([])
  const [message, setMessage] = useState("")
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const gradeOptions = style === "Boulder" ? GRADES_BOULDER : GRADES_SPORT_TRAD

  // Fetch OpenBeta areas whenever the lookup location changes
  useEffect(() => {
    const lookupLocation = country === "USA" ? state : region
    if (!lookupLocation) {
      setAreas([])
      setCragLocation("")
      return
    }

    const controller = new AbortController()
    setAreasLoading(true)
    setAreasError("")
    setAreas([])
    setCragLocation("")

    fetch(`/api/ai/areas?location=${encodeURIComponent(lookupLocation)}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setAreasError("Could not load areas from OpenBeta.")
        } else {
          setAreas(data.areas || [])
          if (data.areas?.length > 0) setCragLocation(data.areas[0].name)
        }
      })
      .catch((err) => {
        if (err.name !== "AbortError") setAreasError("Could not load areas from OpenBeta.")
      })
      .finally(() => setAreasLoading(false))

    return () => controller.abort()
  }, [country, state, region])

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
    setSource(null)

    try {
      const res = await fetch("/api/ai/suggest-routes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          crag_location: cragLocation,
          country,
          state: country === "USA" ? state : null,
          region: country !== "USA" ? region : null,
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
        setSource(data.source || null)
      }
    } catch {
      setError("Failed to reach the server. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const locationReady = country === "USA" ? !!state : !!region

  return (
    <div className="route_advisor_container">
      <h2 className="route_advisor_title">Route Advisor</h2>
      <p className="route_advisor_subtitle">
        Select a location and criteria to get up to 5 route suggestions.
      </p>

      <form className="route_advisor_form" onSubmit={handleSubmit}>

        {/* Country */}
        <label className="route_advisor_label">
          Country
          <select
            className="route_advisor_select"
            value={country}
            onChange={(e) => {
              setCountry(e.target.value)
              setState("")
              setRegion("")
            }}
          >
            <option value="USA">USA</option>
            <option value="France">France</option>
            <option value="Spain">Spain</option>
            <option value="Italy">Italy</option>
            <option value="Germany">Germany</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Australia">Australia</option>
            <option value="Canada">Canada</option>
            <option value="Switzerland">Switzerland</option>
            <option value="Greece">Greece</option>
          </select>
        </label>

        {/* State (USA) or Region (non-USA) */}
        {country === "USA" ? (
          <label className="route_advisor_label">
            State
            <select
              className="route_advisor_select"
              value={state}
              onChange={(e) => setState(e.target.value)}
            >
              <option value="">— select a state —</option>
              {US_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </label>
        ) : (
          <label className="route_advisor_label">
            Region
            <input
              className="route_advisor_input"
              type="text"
              placeholder="e.g. Provence, Andalusia, Lombardy"
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              onBlur={(e) => setRegion(e.target.value.trim())}
            />
          </label>
        )}

        {/* Area / Crag — populated from OpenBeta */}
        <label className="route_advisor_label">
          Area / Crag
          {areasLoading && (
            <span className="route_areas_loading">Loading areas…</span>
          )}
          {areasError && !areasLoading && (
            <span className="route_areas_error">{areasError}</span>
          )}
          {!locationReady && !areasLoading && (
            <select className="route_advisor_select" disabled>
              <option>— select a {country === "USA" ? "state" : "region"} first —</option>
            </select>
          )}
          {locationReady && !areasLoading && areas.length > 0 && (
            <select
              className="route_advisor_select"
              value={cragLocation}
              onChange={(e) => setCragLocation(e.target.value)}
              required
            >
              {areas.map((a) => (
                <option key={a.name} value={a.name}>
                  {a.name}{a.totalClimbs ? ` (${a.totalClimbs} routes)` : ""}
                </option>
              ))}
            </select>
          )}
          {locationReady && !areasLoading && areas.length === 0 && !areasError && (
            <input
              className="route_advisor_input"
              type="text"
              placeholder="No OpenBeta areas found — enter a crag name manually"
              value={cragLocation}
              onChange={(e) => setCragLocation(e.target.value)}
              required
            />
          )}
        </label>

        {/* Style */}
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

        {/* Grade */}
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

        {/* Rating preference */}
        <label className="route_advisor_label">
          Rating Preference
          <select
            className="route_advisor_select"
            value={ratingPreference}
            onChange={(e) => setRatingPreference(e.target.value)}
          >
            <option value="any">Any rating</option>
            <option value="highly_rated">Highly rated (3+ / 4)</option>
            <option value="top_rated">Top rated (3.5+ / 4)</option>
          </select>
        </label>

        {/* Most climbed */}
        <label className="route_advisor_checkbox_label">
          <input
            type="checkbox"
            checked={mostClimbed}
            onChange={(e) => setMostClimbed(e.target.checked)}
          />
          Prioritize most-climbed / classic routes
        </label>

        <button
          className="route_advisor_submit"
          type="submit"
          disabled={loading || !cragLocation}
        >
          {loading ? "Finding routes…" : "Find Routes"}
        </button>
      </form>

      {error && <p className="route_advisor_error">{error}</p>}
      {message && routes.length === 0 && (
        <p className="route_advisor_message">{message}</p>
      )}

      {routes.length > 0 && (
        <div className="route_results">
          <div className="route_results_header">
            <h3 className="route_results_title">Suggested Routes</h3>
            {source === "OpenBeta" && (
              <span className="route_source_badge route_source_openbeta">OpenBeta</span>
            )}
            {source === "AI" && (
              <span className="route_source_badge route_source_ai">AI suggestion</span>
            )}
          </div>
          {source === "AI" && (
            <p className="route_ai_disclaimer">
              OpenBeta had no routes matching these criteria. These suggestions are AI-generated — verify before heading out.
            </p>
          )}
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
