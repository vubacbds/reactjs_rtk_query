import { useEffect } from 'react'
import { useLocation } from 'react-router'

const ScrollToTop = (props: any) => {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
    //window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location])

  return <>{props.children}</>
}

export default ScrollToTop
