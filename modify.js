module.exports = (f) => {
  let layer = 'default'
  if (f.properties.f_code) {
    layer = f.properties.f_code.toLowerCase()
  } else {
    layer = f.properties.nuts_code.toLowerCase()
  }
  let minzoom = 8
  switch (layer) {
    case 'ba010':
      minzoom = 4
      break
    case 'fa000':
      switch (f.properties.use) {
        case 23:
          minzoom = 6
          break
        case 26:
          minzoom = 7
          break
        default:
          minzoom = 8
      }
      break
    case 'an010':
      minzoom = 6
      break
    case 'ap030':
      switch (f.properties.rtt) {
        case 14:
          minzoom = 6 
          break
        case 15:
          minzoom = 7
          break
        default:
          minzoom = 8
      }
      break
  }
  f.tippecanoe = {
    layer: layer,
    minzoom: minzoom,
    maxzoom: 8
  }
  return f
}

