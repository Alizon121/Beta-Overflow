import "./RouteAdvisor.css"

function RouteCard({ route }) {
  const mpQuery = encodeURIComponent(`${route.name}`.trim())
  const nuQuery = encodeURIComponent(route.name)

  return (
    <div className="route_card">
      <div className="route_card_header">
        <span className="route_name">{route.name}</span>
        <span className="route_grade_badge">{route.grade}</span>
      </div>
      <div className="route_meta">
        <span className="route_style">{route.style}</span>
        <span className="route_crag">{route.crag}</span>
      </div>
      {route.description != "No description available." ? (
        <p className="route_description">{route.description}</p>
      ) : (
        <p className="route_no_description">
          No description available.{" "}
          <div>
            <a
              href={`https://www.mountainproject.com/search?q=${mpQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="route_external_link"
            >
              Search MountainProject
            </a>
            {" or "}
            <a
              href={`https://www.8a.nu/search/zlaggables?query=${nuQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="route_external_link"
            >
              Search 8a.nu
            </a>
          </div>
        </p>
      )}
    </div>
  )
}

export default RouteCard
