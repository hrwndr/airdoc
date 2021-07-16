import React from "react"
import Logo from '../logo.png'

const About = () => {
    return (
        <div className="container">
            <div className="text-center my-4">
                <span className="h1">AirDoc</span>
                <img src={Logo} alt="airdoc" height="40px" /><br />
                <span className="text-small">Create & Share docs on the fly!</span>
            </div>
            <p className="mt-4">AirDoc is developed by <a href="https://bit.ly/iamhrwndr" target="__blank">Harwinder Singh</a>. Using AirDoc, you can create and share your rich text documents right in your browser. You can add Heading, Images, Tables, Code, Quotes, Markers etc to make your document interactive.</p>
            <p>You can also drag & drop images/files to directly add them to the document.</p>
            <p>If you have any questions, reach me at <a href="mailto:hrwndr97@gmail.com">hrwndr97@gmail.com</a> or Visit my <a href="https://bit.ly/iamhrwndr" target="__blank">website</a>.</p>
        </div>
    )
}

export default About