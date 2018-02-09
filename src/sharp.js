import sharp from 'sharp'

const options = { all: [] }

export default async function sharpify (input, { all } = options, sizes, height, toBuffer = false) {
  if (!input) throw new TypeError('sharpify() expects first parameter to be a valid image input.')

  const image = sharp(input)

  /* preOperations are performed on the input image and shared across all the outputs */
  // Specifically we only perform a rotate here, but we keep the option of adding more
  // commands just by chasing the config file.
  all.forEach(([func, ...parameters]) => image[func](...parameters))


  /* each output will produce a separate file */
  return Promise.all(
    sizes.map(async (size, index) => {
      const clone = await image.clone()
      clone.resize(size, height[index])
        .jpeg({
          quality: 80,
          progressive: true,
          force: true,
        })
      // operations.forEach(([func, ...parameters]) => clone[func](...parameters))
      return toBuffer ? clone.toBuffer() : clone
    })
  )
}
