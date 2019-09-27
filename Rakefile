task :default do
  sh "node index.js"
  sh "tile-join --force --output-to-directory=zxy\
    tiles.mbtiles --no-tile-compression --no-tile-size-limit"
end

task :stream do
  sh "node stream.js | tippecanoe --force --minimum-zoom=2 \
    --maximum-zoom=8 --base-zoom=8 --hilbert --output=tiles.mbtiles"
  sh "tile-join --force --output-to-directory=zxy\
    tiles.mbtiles --no-tile-compression --no-tile-size-limit"
end

