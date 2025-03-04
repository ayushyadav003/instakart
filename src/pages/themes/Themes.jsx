import './theme.scss'
const themes = [
  {
    storeId: 'store1',
    image: 'https://via.placeholder.com/200',
    themeId: 'theme1',
  },
  {
    storeId: 'store2',
    image: 'https://via.placeholder.com/200',
    themeId: 'theme2',
  },
  {
    storeId: 'store3',
    image: 'https://via.placeholder.com/200',
    themeId: 'theme3',
  },
]

const ThemeListing = () => {
  return (
    <div className="theme-listing">
      {themes.map((theme) => (
        <div key={theme.themeId} className="theme-card">
          <img src={theme.image} alt={theme.themeId} className="theme-image" />
          <h3 className="theme-title">{theme.themeId}</h3>
          <p className="theme-store">Store ID: {theme.storeId}</p>
        </div>
      ))}
    </div>
  )
}

export default ThemeListing
