import full from '../../assets/logos/scenespect-logo-full.svg'
import symbol from '../../assets/logos/scenespect-logo-symbol.svg'
import wordmark from '../../assets/logos/scenespect-logo-wordmark.svg'

const logos = {
  full: { src: full, width: 211, height: 66 },
  symbol: { src: symbol, width: 47, height: 59 },
  wordmark: { src: wordmark, width: 206, height: 53 },
}

export type BrandLogoProps = {
  variant?: keyof typeof logos
  width?: number
  decorative?: boolean
  className?: string
}

export default function BrandLogo({
  variant = 'full',
  width,
  decorative = false,
  className = '',
}: BrandLogoProps) {
  const logo = logos[variant]
  const renderedWidth = width ?? logo.width
  return (
    <img
      src={logo.src}
      alt={decorative ? '' : 'SceneSpect'}
      width={renderedWidth}
      height={(renderedWidth * logo.height) / logo.width}
      className={`block shrink-0 object-contain ${className}`}
    />
  )
}
