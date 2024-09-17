import { createContext, useMemo } from 'react'
import PropTypes from 'prop-types'


const GenresContext = createContext([])

function GenresContextProvider({ children, genres }) {
  const contextValue = useMemo(() => genres, [])
  return (
    <GenresContext.Provider value={contextValue}>
      {children}
    </GenresContext.Provider>
  )
}

// Define prop types for the provider
GenresContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
  genres: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
    }),
  ).isRequired,
}

// Export the context and the provider
export { GenresContext, GenresContextProvider }
