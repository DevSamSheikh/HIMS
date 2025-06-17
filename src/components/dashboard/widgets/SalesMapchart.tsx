import React, { Suspense } from "react";

// Dynamically import the map components to prevent build errors and ensure they load correctly.
// This is a robust way to handle external libraries in some React environments.
import type {
  ComposableMapProps,
  GeographiesProps,
  GeographyProps,
} from "react-simple-maps";

const ComposableMap = React.lazy(
  () =>
    import("react-simple-maps").then((module) => ({
      default: module.ComposableMap,
    }))
) as React.LazyExoticComponent<React.ComponentType<ComposableMapProps>>;

const Geographies = React.lazy(
  () =>
    import("react-simple-maps").then((module) => ({
      default: module.Geographies,
    }))
) as React.LazyExoticComponent<React.ComponentType<GeographiesProps>>;

const Geography = React.lazy(
  () =>
    import("react-simple-maps").then((module) => ({
      default: module.Geography,
    }))
) as React.LazyExoticComponent<React.ComponentType<GeographyProps>>;

// URL for the world map shape data
const geoUrl =
  "https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json";

// Defines the specific colors for the highlighted countries from your design
const countryColors = {
  USA: "#FFB300", // Orange
  BRA: "#FF6F61", // Red
  CHN: "#8E6EF7", // Purple
  SAU: "#00BFAE", // Teal
  IDN: "#00C853", // Green
};

/**
 * A fully responsive world map chart component that highlights sales by country.
 */
const SalesMapchart = () => {
  return (
    // The container makes the chart responsive.
    // 'width: 100%' makes it fill its parent.
    // 'aspectRatio' maintains the map's shape as it resizes.
    <div style={{ width: "100%", height: "auto", aspectRatio: "1.7 / 1" }}>
      {/* Suspense provides a fallback while the map components are loading dynamically */}
      <Suspense fallback={<div style={{textAlign: 'center'}}>Loading map...</div>}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{
            rotate: [-10, 0, 0], // Center the map visually
            scale: 125, // Adjust the zoom level of the map
          }}
          style={{ width: "100%", height: "100%" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const countryCode = geo.properties.ISO_A3;
                const fillColor = countryColors[countryCode] || "#F3F4F6"; // Use specific color or default gray

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={fillColor}
                    stroke="#FFFFFF" // White borders between countries
                    strokeWidth={0.7}
                    style={{
                      default: { outline: "none" },
                      hover: { outline: "none", opacity: 0.8, cursor: "pointer" },
                      pressed: { outline: "none" },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </Suspense>
    </div>
  );
};

export default SalesMapchart;