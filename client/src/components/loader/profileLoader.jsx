import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
  <ContentLoader 
    speed={2}
    //width={500}
   // height={460}
    style={{maxWidth:"100%", maxHeight:"100%"}}
    viewBox="0 0 400 460"
    backgroundColor="#d9d9d9"
    foregroundColor="#ecebeb"
    {...props}
  >
    <circle cx="31" cy="31" r="15" /> 
    <rect x="58" y="18" rx="2" ry="2" width="140" height="10" /> 
    <rect x="58" y="34" rx="2" ry="2" width="140" height="10" /> 
    <rect x="0" y="60" rx="2" ry="2" width="400" height="400" />
  </ContentLoader>
)

export default MyLoader