import { useState, useEffect } from "react"
import { GRADES_BOULDER, GRADES_SPORT_TRAD, STYLES, US_STATES } from "../../variables/route_vars"
import RouteCard from "./RouteCard"
import "./RouteAdvisor.css"

const MAX_DEPTH = 5
const LEVEL_LABELS = ["Area", "Sub-Area", "Crag", "Zone", "Wall"]

// Defined outside the component so it can recurse without stale-closure issues.
// setLevels from useState is guaranteed stable by React so it's safe to pass around.
// parentName: the area whose children we want; ancestorName: the grandparent used to scope the search.
async function fetchLevel(parentName, levelIndex, setLevels, ancestorName = "") {
  if (levelIndex >= MAX_DEPTH) return

  // Insert a loading placeholder at this depth, removing anything deeper
  setLevels(prev => {
    const next = prev.slice(0, levelIndex)
    next.push({ options: [], selected: "", loading: true, error: "" })
    return next
  })

  try {
    const url = ancestorName
      ? `/api/ai/areas?location=${encodeURIComponent(parentName)}&parent=${encodeURIComponent(ancestorName)}`
      : `/api/ai/areas?location=${encodeURIComponent(parentName)}`
    const res = await fetch(url)
    const data = await res.json()

    if (data.error || !data.areas?.length) {
      // No children — remove this level; the parent is the leaf
      setLevels(prev => prev.slice(0, levelIndex))
      return
    }

    const areas = data.areas
    const firstSelected = areas[0].name

    setLevels(prev => {
      // Guard against a stale result if the user changed a parent while this was in-flight
      if (prev[levelIndex]?.loading !== true) return prev
      const next = [...prev]
      next[levelIndex] = { options: areas, selected: firstSelected, loading: false, error: "" }
      return next
    })

    // Automatically drill one more level to detect whether a Crag dropdown is needed.
    // Pass the current parentName as the ancestor so the next query is scoped geographically.
    fetchLevel(firstSelected, levelIndex + 1, setLevels, parentName)
  } catch {
    setLevels(prev => prev.slice(0, levelIndex))
  }
}


function RouteAdvisor() {
  const [country, setCountry] = useState("USA")
  const [state, setState] = useState("")
  const [region, setRegion] = useState("")

  // Dynamic hierarchy: levels[i] = { options, selected, loading, error }
  const [levels, setLevels] = useState([])

  const [style, setStyle] = useState("Sport")
  const [grade, setGrade] = useState("5.10a")
  // const [ratingPreference, setRatingPreference] = useState("any")
  // const [mostClimbed, setMostClimbed] = useState(false)

  const [routes, setRoutes] = useState([])
  const [message, setMessage] = useState("")
  const [source, setSource] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const gradeOptions = style === "Bouldering" ? GRADES_BOULDER : GRADES_SPORT_TRAD
  const locationLookup = country === "USA" ? state : region

  // Reset and re-fetch the entire hierarchy when state/region changes
  useEffect(() => {
    setLevels([])
    if (locationLookup) fetchLevel(locationLookup, 0, setLevels)
  }, [locationLookup])

  // When the user picks a different option at level N, clear everything below
  // and fetch children of the new selection, scoped by the parent at level N-1.
  const handleLevelChange = (levelIndex, newValue) => {
    setLevels(prev => {
      const next = prev.slice(0, levelIndex + 1)
      next[levelIndex] = { ...next[levelIndex], selected: newValue }
      return next
    })
    const ancestor = levelIndex > 0 ? levels[levelIndex - 1]?.selected : locationLookup
    fetchLevel(newValue, levelIndex + 1, setLevels, ancestor)
  }

  // Build an ordered list of settled (non-loading) selections, deepest last.
  const readyLevels = levels.filter(l => l.selected && !l.loading)
  // The search location is the deepest settled selection.
  const searchLocation = readyLevels[readyLevels.length - 1]?.selected || ""
  // The parent is the level just above it (falls back to state/region when at level 0).
  const searchParent = readyLevels[readyLevels.length - 2]?.selected || locationLookup

  const handleStyleChange = (e) => {
    const newStyle = e.target.value
    setStyle(newStyle)
    setGrade(newStyle === "Bouldering" ? "V0" : "5.10a")
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
          crag: searchLocation,
          crag_parent: searchParent || null,
          country,
          state: country === "USA" ? state : null,
          region: country !== "USA" ? region : null,
          grade,
          style,
          // rating_preference: ratingPreference,
          // most_climbed: mostClimbed,
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

  const locationReady = !!locationLookup

  return (
    <div className="route_advisor_container">
      <h2 className="route_advisor_title">Route Finder</h2>
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

        {/* Placeholder shown before a state/region is chosen */}
        {!locationReady && (
          <label className="route_advisor_label">
            Area
            <select className="route_advisor_select" disabled>
              <option>— select a {country === "USA" ? "state" : "region"} first —</option>
            </select>
          </label>
        )}

        {/* Dynamic hierarchy levels */}
        {locationReady && levels.map((level, i) => (
          <label key={i} className="route_advisor_label">
            {LEVEL_LABELS[i] ?? `Level ${i + 1}`}
            {level.loading ? (
              <span className="route_areas_loading">Loading…</span>
            ) : level.error ? (
              <span className="route_areas_error">{level.error}</span>
            ) : level.options.length > 0 ? (
              <select
                className="route_advisor_select"
                value={level.selected}
                onChange={(e) => handleLevelChange(i, e.target.value)}
              >
                {level.options.map((a) => (
                  <option key={a.name} value={a.name}>{a.name}</option>
                ))}
              </select>
            ) : null}
          </label>
        ))}

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

        <button
          className="route_advisor_submit"
          type="submit"
          disabled={loading || !searchLocation}
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
